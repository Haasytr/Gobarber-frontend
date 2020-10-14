import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom'
import { Form } from '@unform/web';
import * as Yup from 'yup'

import { useToast } from '../../hooks/Toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import Logo from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignUpFormData {
  name: string,
  email: string,
  password: string,
}

const SignUp: React.FC = () => {
  const history = useHistory()

  const { addToast } = useToast()
	const formRef = useRef<FormHandles>(null);

	const handleSubmit = useCallback(async (data: SignUpFormData) => {
		try {
      formRef.current?.setErrors({});
			const schema = Yup.object().shape({
				name: Yup.string().required('Nome obrigatório'),
				email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
				password: Yup.string().min(6, 'No minimo 6 digitos')
      });

      
			await schema.validate(data, {
        abortEarly: false
      });
      
      await api.post('/users', data)

      addToast({
        type: 'success',
        title: 'Cadastro realizado com sucesso',
        description: 'Vocẽ já pode fazer seu logon'
      })
      history.push('/')
		} catch (err) {
      const errors = getValidationErrors(err)

      formRef.current?.setErrors(errors);
    }

    addToast({
      type: 'error',
      title: 'Erro no cadastro',
      description: 'Ocorreu um erro ao fazer cadastro, tente novamente'
    })
	}, [addToast, history]);

	return (
		<Container>
			<Background />
			<Content>
        <AnimationContainer>
        <img src={Logo} alt="GoBarber" />
				<Form ref={formRef} initialData={{ name: 'Diego' }} onSubmit={handleSubmit}>
					<h1>Faça seu cadastro</h1>

					<Input icon={FiUser} name="name" placeholder="Nome" />

					<Input icon={FiMail} name="email" placeholder="Email" type="email" />

					<Input icon={FiLock} name="password" placeholder="senha" type="password" />

					<Button type="submit">Cadastrar</Button>
				</Form>

				<Link to="/">
					<FiArrowLeft />
					Voltar para logon
				</Link>
        </AnimationContainer>
			</Content>
		</Container>
	);
};

export default SignUp;
