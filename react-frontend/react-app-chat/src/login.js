import React, { useRef, useState,useEffect } from 'react';
import axiosInstance from './config/axiosConfig';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './css/login.css';

export default function Login() {
    const emailRef = useRef();
    const passRef = useRef();
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('jwtToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const user = {
            email: emailRef.current.value,
            password: passRef.current.value
        };

        console.log('User data submitted:', user);

        try {
            const response = await axiosInstance.post('/auth/signin', user);

            if (response.status === 200 && response.data) {
                console.log('login status:', response.status);
                console.log('User logged in:', response.data);
                
                const token = response.data.token;
                localStorage.setItem("jwtToken", token);
                navigate('/chat/v1/chat');
            } else {
                console.log("Either the response status or the response data is faulty");
                setErrorMessage("Giriş işlemi başarısız oldu. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            console.error('Error logging in user:', error);
            setErrorMessage('Giriş işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="main">
            <h3>Giriş Yapın</h3>
            <form id="signupForm" onSubmit={handleSubmit}>

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
                        Giriş
                    </button>
                </div>
            </form>

            <p>Hesabınız yok mu?
                <br />
                <Link to="/chat/v1/signUp" style={{ textDecoration: 'none' }}>
                    Kaydolun
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