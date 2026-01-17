import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        weight: '',
        height: '',
        goal: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await api.post('/auth/register', formData);
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            navigate('/'); 
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erro ao cadastrar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} className="register-form animate-up">
                <h2>Crie sua conta</h2>
                <p className="subtitle">Comece sua jornada fitness agora</p>

                {error && <div className="error-msg">{error}</div>}

                <div className="input-group-vertical">
                    <label>Dados de Acesso</label>
                    <input type="text" name="name" placeholder="Nome Completo" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Seu melhor e-mail" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Crie uma senha segura" onChange={handleChange} required />
                </div>
                
                <div className="input-group-vertical">
                    <label>Perfil Físico (Opcional)</label>
                    <div className="form-row">
                        <input type="number" name="age" placeholder="Idade" onChange={handleChange} />
                        <input type="number" name="weight" placeholder="Peso (kg)" onChange={handleChange} />
                        <input type="number" name="height" placeholder="Alt (cm)" onChange={handleChange} />
                    </div>
                    <input type="text" name="goal" placeholder="Objetivo Principal (ex: Hipertrofia)" onChange={handleChange} />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Criando...' : 'Cadastrar'}
                </button>
                
                <div className="footer-link">
                    Já tem uma conta? <Link to="/">Fazer Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;