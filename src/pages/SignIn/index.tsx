import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup'

import { FormHandles } from '@unform/core'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';

import Logo from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormData {
  email: string,
  password: string,
}

const SignIn: React.FC = () => {
  const history = useHistory()

  const formRef = useRef<FormHandles>(null)

  const { signIn  } = useAuth()
  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
		try {
      formRef.current?.setErrors({});
			const schema = Yup.object().shape({
				email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
				password: Yup.string().required('Senha obrigatória  ')
			});

			await schema.validate(data, {
				abortEarly: false
      });

      await signIn({
        email: data.email,
        password: data.password,
      });

      history.push('/dashboard')


		} catch (err) {
        if(err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors);

          return
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login cheque as credenciais'
        });
		  }
  }, [signIn, addToast, history]);



	return (
		<Container>
			<Content>
        <AnimationContainer>
        <img src={Logo} alt="GoBarber" />
				<Form ref={formRef} onSubmit={handleSubmit}>
					<h1>Faça seu logon</h1>

					<Input icon={FiMail} name="email" placeholder="email" type="email" />

					<Input icon={FiLock} name="password" placeholder="senha" type="password" />

					<Button type="submit">Entrar</Button>

					<Link to="/forgot-password">Esqueci minha senha</Link>
				</Form>

				<Link to="/cadastrar">
					<FiLogIn />
					Criar conta
				</Link>
        </AnimationContainer>
			</Content>
			<Background />
		</Container>
	);
};

export default SignIn;
