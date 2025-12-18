
import React, { useState } from 'react';
import { AppState, Professor } from '../types';
import { Plus, Mail, Clock, MapPin, Trash2, UserPlus, Info } from 'lucide-react';

interface ProfessorsViewProps {
  state: AppState;
  onAddProfessor: (prof: Omit<Professor, 'id'>) => void;
  onRemoveProfessor: (id: string) => void;
}

export const ProfessorsView: React.FC<ProfessorsViewProps> = ({ state, onAddProfessor, onRemoveProfessor }) => {
  const [showModal, setShowModal] = useState(false);
  const [newProf, setNewProf] = useState({
    name: '',
    title: '',
    email: '',
    consultations: '',
    office: '',
    notes: ''
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Księga Mistrzów</h1>
          <p className="text-slate-500 font-medium mt-1">Informacje o Twoich wykładowcach i konsultacjach.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 hover:shadow-lg transition-all font-bold"
        >
          <UserPlus size={20} />
          <span>Dodaj Wykładowcę</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.professors.map(prof => (
          <div key={prof.id} className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Info size={80} />
            </div>
            
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest">{prof.title}</p>
              <h3 className="text-xl font-black text-slate-800">{prof.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm font-medium text-slate-600">
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl"><Mail size={16} /></div>
                <span className="truncate">{prof.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-medium text-slate-600">
                <div className="p-2 bg-purple-50 text-purple-500 rounded-xl"><Clock size={16} /></div>
                <span>{prof.consultations}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-medium text-slate-600">
                <div className="p-2 bg-pink-50 text-pink-500 rounded-xl"><MapPin size={16} /></div>
                <span>Sala: {prof.office}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-end">
              <div className="text-[11px] text-slate-400 italic">"{prof.notes}"</div>
              <button 
                onClick={() => onRemoveProfessor(prof.id)}
                className="p-2 text-rose-300 hover:text-rose-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl border border-white">
            <h3 className="text-2xl font-black mb-8 text-slate-800">Nowy Mistrz</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Tytuł</label>
                  <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" value={newProf.title} onChange={e => setNewProf({...newProf, title: e.target.value})} placeholder="np. dr hab." />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Imię i Nazwisko</label>
                  <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" value={newProf.name} onChange={e => setNewProf({...newProf, name: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Email</label>
                <input type="email" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" value={newProf.email} onChange={e => setNewProf({...newProf, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Konsultacje</label>
                <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" value={newProf.consultations} onChange={e => setNewProf({...newProf, consultations: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Gabinet</label>
                  <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" value={newProf.office} onChange={e => setNewProf({...newProf, office: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Notatki szopa</label>
                <textarea className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" rows={2} value={newProf.notes} onChange={e => setNewProf({...newProf, notes: e.target.value})} />
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase">Anuluj</button>
              <button 
                onClick={() => { onAddProfessor(newProf); setShowModal(false); }}
                className="flex-1 py-4 bg-gradient-to-r from-purple-400 to-indigo-400 text-white rounded-2xl font-black"
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
