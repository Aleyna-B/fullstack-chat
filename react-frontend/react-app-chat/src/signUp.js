import React, { useRef, useState } from 'react';
import axiosInstance from './config/axiosConfig';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './css/login.css';
import Login from './login';

export default function SignUp() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passRef.current.value
    };

    console.log('User data submitted:', user);

    try {
      const response = await axiosInstance.post('/auth/signup', user);

      if (response.status === 200 && response.data) {
        console.log('register status:', response.status);
        console.log('User registered:', response.data);
        navigate('/chat/v1/login');
      } else {
        console.log("Either the response status or the response data is faulty");
        setErrorMessage("Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="main">
      <h3>Kaydolun</h3>
      <form id="signupForm" onSubmit={handleSubmit}>
        <label htmlFor="name">
          isim:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          ref={nameRef}
          placeholder="username"
          required
        />

        <label htmlFor="email">
          e-mail:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          ref={emailRef}
          placeholder="abc@email.com"
          required
        />

        <label htmlFor="password">
          şifre:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          ref={passRef}
          placeholder="*********"
          required
        />

        <div className="wrap">
          <button type="submit">
            Kayıt
          </button>
        </div>
      </form>

      <p>Hesabınız var mı?
        <br />
        <Link to='/chat/v1/login' style={{ textDecoration: 'none' }}>
          Giriş Yapın
        </Link>
      </p>

      {errorMessage && (
        <div id="errorMessage" style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}