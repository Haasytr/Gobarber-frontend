import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { useHistory, Link } from 'react-router-dom'
import { Form } from '@unform/web';
import * as Yup from 'yup'

import { useToast } from '../../hooks/Toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, ProfileInfo, AvatarInput  } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
  name: string,
  email: string,
  password: string,
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const history = useHistory()
  const { addToast } = useToast()
	const formRef = useRef<FormHandles>(null);

  const { user,  updateUser } = useAuth()

	const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.lenght,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string().notRequired(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.lenght,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string().notRequired(),
            })
            .oneOf([Yup.ref('password'), undefined, 'Confirmação incorreta']),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        addToast({
          type: 'success',
          title: 'Perfil atualizado',
          description:
            'Suas informações do perfil foram atualizadas com sucesso!',
        });

        updateUser(response.data);

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Ocorreu um erro ao atualizar perfil, tente novamente',
        });
      }
    },
    [addToast, history, updateUser],
  );



  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const data = new FormData()

      console.log(e.target.files[0])

      data.append('avatar', e.target.files[0])

      api.patch('/users/avatar', data).then(response => {
        updateUser(response.data)

        addToast({
          type: 'success',
          title: 'Avatar Atualizado'
        })
      })
    }
  }, [addToast, updateUser])

	return (
		<Container>

      <header>
        <div>
          <Link to='dashboard'>
            <FiArrowLeft />
          </Link>
        </div>
      </header>

			<Content>
				<Form ref={formRef} initialData={{ name: user.name, email: user.email }} onSubmit={handleSubmit}>

          <AvatarInput>
            <img src={user.avatar_url} alt={user.name}/>
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>


          </AvatarInput>

					<h1>Meu perfil</h1>


          <ProfileInfo>
            <Input icon={FiUser} name="name" placeholder="Nome" />
            <Input icon={FiMail} name="email" placeholder="Email" type="email" />
          </ProfileInfo>
					<Input icon={FiLock} name="old_password" placeholder="Senha atual" type="password" />

					<Input icon={FiLock} name="password" placeholder="Nova senha" type="password" />

					<Input icon={FiLock} name="password_confirmation" placeholder="Confirmar senha" type="password" />

					<Button type="submit">Confirmar mudanças</Button>
				</Form>
			</Content>
		</Container>
	);
};

export default Profile;
