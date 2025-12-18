
import React, { useState } from 'react';
import { AppState, ClassSession } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { Plus, MapPin, Clock, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleViewProps {
  state: AppState;
  onAddSession: (session: Omit<ClassSession, 'id'>) => void;
  onRemoveSession: (id: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ state, onAddSession, onRemoveSession }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [newSession, setNewSession] = useState({
    subjectId: state.subjects[0]?.id || '',
    dayOfWeek: selectedDay,
    startTime: '08:00',
    endTime: '09:30',
    room: ''
  });

  const currentSessions = state.sessions
    .filter(s => s.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Day Selector Tabs */}
      <div className="flex overflow-x-auto no-scrollbar space-x-2 py-2 -mx-2 px-2">
        {DAYS_OF_WEEK.map((day, idx) => (
          <button
            key={day}
            onClick={() => setSelectedDay(idx)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              selectedDay === idx 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-100' 
                : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{DAYS_OF_WEEK[selectedDay]}</h3>
        <button 
          onClick={() => setShowModal(true)}
          className="p-3 bg-purple-100 text-purple-600 rounded-2xl hover:bg-purple-200"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Daily List View */}
      <div className="space-y-4">
        {currentSessions.length > 0 ? currentSessions.map(session => {
          const subject = state.subjects.find(subj => subj.id === session.subjectId);
          return (
            <div key={session.id} className="bg-white/70 backdrop-blur-md p-5 rounded-[2rem] border border-white shadow-sm flex items-center">
              <div className="flex flex-col items-center justify-center pr-5 border-r border-slate-100 mr-5 min-w-[60px]">
                <span className="text-sm font-black text-slate-800">{session.startTime}</span>
                <span className="text-[10px] font-bold text-slate-400">{session.endTime}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${subject?.color || 'bg-slate-300'}`} />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{subject?.name}</span>
                </div>
                <h4 className="text-lg font-black text-slate-800 truncate mt-1">{subject?.name}</h4>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-[10px] font-bold text-slate-500">
                    <MapPin size={12} className="mr-1 text-purple-400" /> Sala {session.room}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onRemoveSession(session.id)}
                className="p-2 text-rose-300 hover:text-rose-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        }) : (
          <div className="py-16 text-center bg-white/40 rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold">Ten dzień jest wolny!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-end justify-center">
          <div className="bg-white rounded-t-[3rem] w-full max-w-md p-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h3 className="text-2xl font-black mb-8 text-slate-800">Nowy termin zajęć</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Przedmiot</label>
                <select 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold"
                  value={newSession.subjectId}
                  onChange={e => setNewSession({...newSession, subjectId: e.target.value})}
                >
                  {state.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Początek</label>
                  <input type="time" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" value={newSession.startTime} onChange={e => setNewSession({...newSession, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Koniec</label>
                  <input type="time" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" value={newSession.endTime} onChange={e => setNewSession({...newSession, endTime: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Sala</label>
                <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" placeholder="np. A1-12" value={newSession.room} onChange={e => setNewSession({...newSession, room: e.target.value})} />
              </div>
            </div>
            <div className="flex space-x-4 mt-10">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Anuluj</button>
              <button 
                onClick={() => { onAddSession(newSession); setShowModal(false); }}
                className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-lg"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
