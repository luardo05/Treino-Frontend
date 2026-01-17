import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const StudentDashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [workouts, setWorkouts] = useState([]);
    const [professor, setProfessor] = useState(null);
    const [activeTab, setActiveTab] = useState('workouts'); // 'workouts' ou 'professor'
    const [expandedWorkout, setExpandedWorkout] = useState(null); // Qual treino está aberto

    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // 1. Busca treinos do aluno
            const response = await api.get(`/workouts/student/${user._id}`);
            setWorkouts(response.data);

            // 2. Se houver treinos, pega o ID do professor do primeiro treino para mostrar o perfil dele
            if (response.data.length > 0) {
                const professorId = response.data[0].professor;
                // Busca dados do professor
                const profResponse = await api.get(`/users/${professorId}`);
                setProfessor(profResponse.data);
            }
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Função para abrir/fechar o sanfona do treino
    const toggleWorkout = (id) => {
        if (expandedWorkout === id) {
            setExpandedWorkout(null); // Fecha se já estiver aberto
        } else {
            setExpandedWorkout(id); // Abre o novo
        }
    };

    return (
        <div className="student-container">
            {/* Cabeçalho */}
            <header className="student-header">
                <h2>Olá, <span>{user.name.split(' ')[0]}</span></h2>
                <button onClick={handleLogout} className="btn-logout-small">Sair</button>
            </header>

            {/* Abas */}
            <div className="tabs-container">
                <button
                    className={`tab-pill ${activeTab === 'workouts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('workouts')}
                >
                    Meus Treinos
                </button>
                <button
                    className={`tab-pill ${activeTab === 'professor' ? 'active' : ''}`}
                    onClick={() => setActiveTab('professor')}
                >
                    Meu Professor
                </button>
            </div>

            {/* CONTEÚDO: Meus Treinos */}
            {activeTab === 'workouts' && (
                <div className="animate-fade">
                    {workouts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888' }}>Nenhum treino disponível ainda.</p>
                    ) : (
                        workouts.map(workout => (
                            <div key={workout._id} className="workout-view-card">
                                <div className="workout-header" onClick={() => toggleWorkout(workout._id)}>
                                    <h3>{workout.name}</h3>
                                    <span className={`arrow-icon ${expandedWorkout === workout._id ? 'open' : ''}`}>
                                        ▼
                                    </span>
                                </div>

                                {expandedWorkout === workout._id && (
                                    <div className="workout-body">
                                        {workout.exercises.map((ex, idx) => (
                                            <div key={idx} className="student-exercise-item">
                                                <div>
                                                    <div className="ex-name">{ex.name}</div>
                                                    <div className="ex-details">Descanso: {ex.rest}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ color: 'white', fontWeight: 'bold' }}>{ex.sets}</div>
                                                    <div className="ex-details">{ex.reps} reps</div>
                                                </div>
                                            </div>
                                        ))}
                                        {workout.exercises.length === 0 && <p>Sem exercícios cadastrados.</p>}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* CONTEÚDO: Meu Professor */}
            {activeTab === 'professor' && (
                <div className="prof-profile animate-fade">
                    {professor ? (
                        <>
                            <div className="prof-avatar">
                                {professor.name.charAt(0).toUpperCase()}
                            </div>
                            <h2>{professor.name}</h2>
                            <p style={{ color: '#aaa', marginTop: '10px' }}>{professor.email}</p>

                            {/* --- ÁREA SOCIAL --- */}
                            <div className="social-links">
                                {professor.instagram && (
                                    <a
                                        href={`https://instagram.com/${professor.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-btn insta"
                                    >
                                        <FaInstagram size={24} />
                                        <span>Instagram</span>
                                    </a>
                                )}

                                {professor.whatsapp && (
                                    <a
                                        href={`https://wa.me/${professor.whatsapp.replace(/\D/g, '')}`} // Remove tudo que não for número
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-btn whats"
                                    >
                                        <FaWhatsapp size={24} />
                                        <span>WhatsApp</span>
                                    </a>
                                )}
                            </div>
                            {/* ------------------- */}

                            <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                <p style={{ marginBottom: '5px' }}><strong>Contato Profissional</strong></p>
                                <p style={{ fontSize: '0.9rem', color: '#888' }}>
                                    Clique nos botões acima para falar diretamente com o professor.
                                </p>
                            </div>
                        </>
                    ) : (
                        <p style={{ color: '#888' }}>
                            Você ainda não possui treinos vinculados.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;