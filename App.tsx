
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ScheduleView } from './components/ScheduleView';
import { TasksView } from './components/TasksView';
import { TopicsView } from './components/TopicsView';
import { ProfessorsView } from './components/ProfessorsView';
import { AppState, AcademicTask, ClassSession, StudyTopic, Professor } from './types';
import { INITIAL_DATA } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('szopgrad_state');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('szopgrad_state', JSON.stringify(state));
  }, [state]);

  const addTask = (task: Omit<AcademicTask, 'id' | 'isCompleted'>) => {
    const newTask: AcademicTask = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      isCompleted: false
    };
    setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)
    }));
  };

  const removeTask = (id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const addSession = (session: Omit<ClassSession, 'id'>) => {
    const newSession: ClassSession = {
      ...session,
      id: Math.random().toString(36).substr(2, 9)
    };
    setState(prev => ({ ...prev, sessions: [...prev.sessions, newSession] }));
  };

  const removeSession = (id: string) => {
    setState(prev => ({ ...prev, sessions: prev.sessions.filter(s => s.id !== id) }));
  };

  const addTopic = (topic: Omit<StudyTopic, 'id'>) => {
    const newTopic: StudyTopic = {
      ...topic,
      id: Math.random().toString(36).substr(2, 9)
    };
    setState(prev => ({ ...prev, topics: [newTopic, ...prev.topics] }));
  };

  const removeTopic = (id: string) => {
    setState(prev => ({ ...prev, topics: prev.topics.filter(t => t.id !== id) }));
  };

  const addProfessor = (prof: Omit<Professor, 'id'>) => {
    const newProf: Professor = {
      ...prof,
      id: Math.random().toString(36).substr(2, 9)
    };
    setState(prev => ({ ...prev, professors: [...prev.professors, newProf] }));
  };

  const removeProfessor = (id: string) => {
    setState(prev => ({ ...prev, professors: prev.professors.filter(p => p.id !== id) }));
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard state={state} />} />
          <Route path="/schedule" element={
            <ScheduleView 
              state={state} 
              onAddSession={addSession} 
              onRemoveSession={removeSession} 
            />
          } />
          <Route path="/tasks" element={
            <TasksView 
              state={state} 
              onAddTask={addTask} 
              onToggleTask={toggleTask} 
              onRemoveTask={removeTask} 
            />
          } />
          <Route path="/professors" element={
            <ProfessorsView 
              state={state} 
              onAddProfessor={addProfessor} 
              onRemoveProfessor={removeProfessor} 
            />
          } />
          <Route path="/topics" element={
            <TopicsView 
              state={state} 
              onAddTopic={addTopic} 
              onRemoveTopic={removeTopic} 
            />
          } />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
