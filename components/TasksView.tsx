
import React, { useState } from 'react';
import { AppState, AcademicTask, TaskType } from '../types';
import { Plus, Calendar as CalIcon, BrainCircuit, CheckCircle, Trash2, Filter } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { TASK_GRADIENTS } from '../constants';

interface TasksViewProps {
  state: AppState;
  onAddTask: (task: Omit<AcademicTask, 'id' | 'isCompleted'>) => void;
  onToggleTask: (id: string) => void;
  onRemoveTask: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ state, onAddTask, onToggleTask, onRemoveTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiPlan, setAiPlan] = useState<{title: string, content: string} | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'assignment' as TaskType,
    dueDate: new Date().toISOString().split('T')[0],
    subjectId: state.subjects[0]?.id || '',
    description: ''
  });

  const handleGeneratePlan = async (task: AcademicTask) => {
    setAiLoading(task.id);
    const subject = state.subjects.find(s => s.id === task.subjectId)?.name || 'General';
    const plan = await geminiService.generateStudyPlan(task.title, subject, []);
    setAiPlan({ title: task.title, content: plan || '' });
    setAiLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters placeholder for mobile */}
      <div className="flex justify-between items-center bg-white/60 p-4 rounded-3xl border border-white">
        <div className="flex items-center space-x-3 text-slate-400">
          <Filter size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Sortuj: Najbliższe</span>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="p-2 bg-purple-600 text-white rounded-xl shadow-md"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-rose-50 p-4 rounded-3xl border border-rose-100">
          <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Egzaminy</span>
          <div className="text-2xl font-black text-rose-600">{state.tasks.filter(t => t.type === 'exam' && !t.isCompleted).length}</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-3xl border border-indigo-100">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Zadania</span>
          <div className="text-2xl font-black text-indigo-600">{state.tasks.filter(t => t.type === 'assignment' && !t.isCompleted).length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {state.tasks.map(task => {
          const subject = state.subjects.find(s => s.id === task.subjectId);
          const gradient = TASK_GRADIENTS[task.type] || TASK_GRADIENTS.other;
          
          return (
            <div 
              key={task.id} 
              className={`bg-white/80 backdrop-blur-md p-5 rounded-[2rem] border border-white shadow-sm transition-all duration-300 ${task.isCompleted ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="flex justify-between items-start mb-3">
                <button 
                  onClick={() => onToggleTask(task.id)}
                  className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                    task.isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white rotate-[360deg]' 
                      : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  {task.isCompleted && <CheckCircle size={20} />}
                </button>
                <div className="flex flex-col items-end">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md text-slate-700 ${gradient}`}>
                    {task.type}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest truncate max-w-[100px] text-right">
                    {subject?.name}
                  </span>
                </div>
              </div>

              <h4 className={`text-lg font-black text-slate-800 ${task.isCompleted ? 'line-through' : ''}`}>
                {task.title}
              </h4>
              <p className="text-xs font-medium text-slate-400 mt-1 mb-4">{task.description}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <div className="flex items-center space-x-2 text-slate-500 font-bold text-[10px] bg-slate-50 px-3 py-1.5 rounded-full">
                  <CalIcon size={12} />
                  <span>{task.dueDate}</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleGeneratePlan(task)}
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl active:bg-indigo-600 active:text-white transition-all"
                  >
                    <BrainCircuit size={18} className={aiLoading === task.id ? 'animate-spin' : ''} />
                  </button>
                  <button 
                    onClick={() => onRemoveTask(task.id)}
                    className="p-3 bg-rose-50 text-rose-300 rounded-2xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {aiPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[70] flex items-end justify-center">
            <div className="bg-white rounded-t-[3rem] w-full max-w-md h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
                <div className="p-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <BrainCircuit size={28} />
                        <h3 className="text-xl font-black">Plan nauki AI</h3>
                    </div>
                    <button onClick={() => setAiPlan(null)} className="font-bold text-xl">✕</button>
                </div>
                <div className="p-8 overflow-y-auto bg-slate-50/50 flex-1">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-sm">
                        {aiPlan.content}
                    </div>
                </div>
                <div className="p-8 bg-white border-t border-slate-100">
                    <button 
                        onClick={() => setAiPlan(null)}
                        className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black shadow-lg"
                    >
                        SUPER, DZIĘKI!
                    </button>
                </div>
            </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-end justify-center">
          <div className="bg-white rounded-t-[3rem] w-full max-w-md p-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h3 className="text-2xl font-black mb-8 text-slate-800">Nowy wpis</h3>
            <div className="space-y-6">
              <input 
                type="text" 
                className="w-full p-4 bg-slate-100/50 rounded-2xl border-none font-bold"
                placeholder="Tytuł zadania"
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full p-4 bg-slate-100/50 rounded-2xl border-none font-bold"
                  value={newTask.type}
                  onChange={e => setNewTask({...newTask, type: e.target.value as TaskType})}
                >
                  <option value="exam">🔥 Egzamin</option>
                  <option value="assignment">📝 Zadanie</option>
                  <option value="project">💻 Projekt</option>
                  <option value="other">✨ Inne</option>
                </select>
                <input type="date" className="w-full p-4 bg-slate-100/50 rounded-2xl border-none font-bold" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
              <select 
                className="w-full p-4 bg-slate-100/50 rounded-2xl border-none font-bold"
                value={newTask.subjectId}
                onChange={e => setNewTask({...newTask, subjectId: e.target.value})}
              >
                {state.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex space-x-4 mt-10">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px]">Anuluj</button>
              <button 
                onClick={() => { onAddTask(newTask); setShowModal(false); }}
                className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black"
              >
                DODAJ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
