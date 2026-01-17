import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });

            // Salva os dados do usuario no navegador
            localStorage.setItem('user', JSON.stringify(response.data));

            // Redireciona baseado no 'role' (papel)
            if (response.data.role === 'professor') {
                navigate('/professor');
            } else {
                navigate('/aluno');
            }
        } catch (err) {
            setError('Falha no login. Verifique e-mail e senha.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Acesso Personal</h2>
                {error && <p className="error">{error}</p>}

                <input
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Entrar</button>

                <p style={{ marginTop: '15px', textAlign: 'center' }}>
                    Não tem conta? <Link to="/register">Cadastre-se</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;