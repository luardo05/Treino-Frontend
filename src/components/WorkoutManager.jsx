import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './WorkoutManager.css';

const WorkoutManager = ({ studentId }) => {
    const [workouts, setWorkouts] = useState([]);
    const [newWorkoutName, setNewWorkoutName] = useState('');
    
    // Estados para adicionar exercício
    const [exerciseForm, setExerciseForm] = useState({ name: '', sets: '', reps: '', rest: '' });

    useEffect(() => {
        loadWorkouts();
    }, [studentId]);

    const loadWorkouts = async () => {
        try {
            const response = await api.get(`/workouts/student/${studentId}`);
            setWorkouts(response.data);
        } catch (error) {
            alert('Erro ao carregar treinos');
        }
    };

    const handleCreateWorkout = async () => {
        if (!newWorkoutName) return;
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            await api.post('/workouts', {
                name: newWorkoutName,
                studentId: studentId,
                professorId: user._id
            });
            setNewWorkoutName('');
            loadWorkouts();
        } catch (error) {
            alert('Erro ao criar treino');
        }
    };

    const handleDeleteWorkout = async (id) => {
        if (confirm('Tem certeza que deseja excluir este treino?')) {
            await api.delete(`/workouts/${id}`);
            loadWorkouts();
        }
    };

    const handleAddExercise = async (workout) => {
        const updatedExercises = [...workout.exercises, exerciseForm];
        try {
            await api.put(`/workouts/${workout._id}`, { exercises: updatedExercises });
            setExerciseForm({ name: '', sets: '', reps: '', rest: '' }); // Limpa form
            loadWorkouts();
        } catch (error) {
            alert('Erro ao adicionar exercício');
        }
    };

    const removeExercise = async (workout, exerciseIndex) => {
        const updatedExercises = workout.exercises.filter((_, index) => index !== exerciseIndex);
        try {
            await api.put(`/workouts/${workout._id}`, { exercises: updatedExercises });
            loadWorkouts();
        } catch (error) {
            alert('Erro ao remover exercício');
        }
    };

    return (
        <div>
            {/* Header: Criar Novo Treino */}
            <div className="wm-header">
                <input 
                    type="text" 
                    placeholder="Nome do Treino (ex: Treino A - Peito)" 
                    value={newWorkoutName}
                    onChange={(e) => setNewWorkoutName(e.target.value)}
                />
                <button onClick={handleCreateWorkout} className="btn-add">Criar Ficha</button>
            </div>

            {/* Lista de Treinos */}
            {workouts.map(workout => (
                <div key={workout._id} className="workout-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>{workout.name}</h3>
                        <button onClick={() => handleDeleteWorkout(workout._id)} className="btn-del">
                            Excluir Ficha
                        </button>
                    </div>

                    {/* Lista de Exercícios Existentes */}
                    <div className="exercise-list">
                        {workout.exercises.length === 0 && <p style={{color: '#666', fontStyle: 'italic'}}>Nenhum exercício adicionado.</p>}
                        
                        {workout.exercises.map((ex, idx) => (
                            <div key={idx} className="exercise-item">
                                {/* Info agrupada para ficar na esquerda */}
                                <div className="exercise-info">
                                    <strong>{ex.name}</strong>
                                    <span>| {ex.sets}</span>
                                    <span>| {ex.reps}</span>
                                    <span>| {ex.rest}</span>
                                </div>
                                {/* Botão sozinho para ficar na direita */}
                                <button onClick={() => removeExercise(workout, idx)} className="btn-del">
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Formulário Grid para Adicionar Novo Exercício */}
                    <div className="input-group">
                        <input 
                            placeholder="Exercício (ex: Supino)" 
                            onChange={e => setExerciseForm({...exerciseForm, name: e.target.value})} 
                        />
                        <input 
                            placeholder="Séries (3x)" 
                            onChange={e => setExerciseForm({...exerciseForm, sets: e.target.value})} 
                        />
                        <input 
                            placeholder="Reps (12)" 
                            onChange={e => setExerciseForm({...exerciseForm, reps: e.target.value})} 
                        />
                        <input 
                            placeholder="Descanso (1m)" 
                            onChange={e => setExerciseForm({...exerciseForm, rest: e.target.value})} 
                        />
                        <button onClick={() => handleAddExercise(workout)} className="btn-add">
                            Adicionar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WorkoutManager;