import React, { useState, useEffect } from 'react';
import api from '../services/api';
import WorkoutManager from '../components/WorkoutManager';
import { useNavigate } from 'react-router-dom';
import './ProfessorDashboard.css';

const ProfessorDashboard = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' ou 'workouts'
    const navigate = useNavigate();

    // Buscar lista de alunos ao iniciar
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/users/students');
                setStudents(response.data);
            } catch (error) {
                console.error("Erro ao buscar alunos", error);
            }
        };
        fetchStudents();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            {/* --- COLUNA 1: Lista de Alunos --- */}
            <div className="sidebar">
                <h2>Meus Alunos</h2>
                
                {/* Container que envolve a lista para centralizar e permitir rolagem */}
                <div className="student-list-container">
                    {students.map(student => (
                        <div 
                            key={student._id} 
                            className={`student-item ${selectedStudent?._id === student._id ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedStudent(student);
                                setActiveTab('profile'); // Reseta para perfil ao trocar aluno
                            }}
                        >
                            {student.name}
                        </div>
                    ))}
                </div>

                <button onClick={handleLogout} className="btn-logout">
                    Sair
                </button>
            </div>

            {/* --- COLUNA 2: Detalhes --- */}
            <div className="content-area">
                {!selectedStudent ? (
                    <div style={{ textAlign: 'center', marginTop: '100px', color: '#666' }}>
                        <h3>Selecione um aluno na lista ao lado</h3>
                    </div>
                ) : (
                    <>
                        <div className="header-tabs">
                            <button 
                                className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                Perfil do Aluno
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'workouts' ? 'active' : ''}`}
                                onClick={() => setActiveTab('workouts')}
                            >
                                Treinos
                            </button>
                        </div>

                        {/* Conteúdo da Aba Perfil */}
                        {activeTab === 'profile' && (
                            <div className="profile-card">
                                <h2 style={{color: 'var(--primary)', marginBottom:'20px'}}>{selectedStudent.name}</h2>
                                <p><strong>Email:</strong> {selectedStudent.email}</p>
                                <hr style={{margin: '20px 0', borderColor: 'var(--border-color)'}}/>
                                <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
                                    <div>
                                        <p style={{marginBottom: '10px'}}><strong>Idade:</strong> {selectedStudent.age || '-'} anos</p>
                                        <p><strong>Peso:</strong> {selectedStudent.weight || '-'} kg</p>
                                    </div>
                                    <div>
                                        <p style={{marginBottom: '10px'}}><strong>Altura:</strong> {selectedStudent.height || '-'} cm</p>
                                        <p><strong>Objetivo:</strong> {selectedStudent.goal || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Conteúdo da Aba Treinos */}
                        {activeTab === 'workouts' && (
                            <WorkoutManager studentId={selectedStudent._id} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfessorDashboard;