import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as Yup from 'yup'

import { FormHandles } from '@unform/core'
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';

import Logo from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/Toast';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string,
  password_confirmation: string,
}

const SignIn: React.FC = () => {
  const history = useHistory()
  const location = useLocation()

  console.log(location)

  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
		try {
      formRef.current?.setErrors({});
			const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória'),
        passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'As senhas não são iguais')
			})

			await schema.validate(data, {
				abortEarly: false
      });

      const {password, password_confirmation} = data
      const token = location.search.replace('?token=', '')

      if(!token){
       throw new  Error()
      }

      await api.post('/password/reset', {
        password,
        password_confirmation,
        token,
      })

      history.push('/')


		} catch (err) {
        if(err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors);

          return
        }

        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar senha, tente novamente'
        });
		  }
  }, [history,addToast, location.search]);



	return (
		<Container>
			<Content>
        <AnimationContainer>
        <img src={Logo} alt="GoBarber" />
				<Form ref={formRef} onSubmit={handleSubmit}>
					<h1>Resetar senha</h1>

					<Input icon={FiLock} name="password" placeholder="nova senha" type="password" />

					<Input icon={FiLock} name="password_confirmation" placeholder="confirmar senha" type="password" />

					<Button type="submit">Alterar senha</Button>

				</Form>
        </AnimationContainer>
			</Content>
			<Background />
		</Container>
	);
};

export default SignIn;
