'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7069/api', // Base URL da API
  headers: {
    'Content-Type': 'application/json', // Tipo de conteúdo
  },
});

const LoginPage = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const { layoutConfig } = useContext(LayoutContext);
  const router = useRouter();

  

  const handleLogin = async () => {
    try {
      // Enviar a solicitação de login para o endpoint correto
      const response = await api.post ('/auth/login', {
        username,
        password
      });
         
      // Salve o token JWT no localStorage
      localStorage.setItem('token', response.data.token);
      
      // Redirecione para a página principal após o login
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer login', error);
      alert('Senha incorreta.');
    }
  };

  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {
    'p-input-filled': layoutConfig.inputStyle === 'filled'
  });

  return (
    <div className={containerClassName}>
      <div className="flex flex-column align-items-center justify-content-center">
        <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
        <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
          <div>
            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
              Email
            </label>
            <InputText
              id="email1"
              type="text"
              placeholder="Digite seu email"
              className="w-full md:w-30rem mb-5"
              style={{ padding: '1rem' }}
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />

            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
              Senha
            </label>
            <Password
              inputId="password1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              toggleMask
              className="w-full mb-5"
              inputClassName="w-full p-3 md:w-30rem"
            />

            <div className="flex align-items-center justify-content-between mb-5 gap-5">
              <div className="flex align-items-center">
                <Checkbox
                  inputId="rememberme1"
                  checked={checked}
                  onChange={(e) => setChecked(e.checked ?? false)}
                  className="mr-2"
                />
                <label htmlFor="rememberme1">Remember me</label>
              </div>
              <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                Forgot password?
              </a>
            </div>
            <Button label="Sign In" className="w-full p-3 text-xl" onClick={handleLogin}></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
