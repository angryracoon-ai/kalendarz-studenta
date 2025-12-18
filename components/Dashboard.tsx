
import React, { useMemo } from 'react';
import { AppState } from '../types';
import { Clock, AlertCircle, ChevronRight, Flame, Star, Calendar, Users } from 'lucide-react';
import { TASK_GRADIENTS, APP_NAME } from '../constants';
import { RaccoonLogo } from './RaccoonLogo';

interface DashboardProps {
  state: AppState;
}

const SZOP_TIPS = [
  "Jeśli nie rozumiesz tematu, spróbuj go 'umyć' w kałuży. Może zniknie, a może po prostu będzie czystszy.",
  "Śmieci jednego studenta to skarb drugiego. Szczególnie jeśli to kserówki z zeszłego roku.",
  "Zawsze miej coś błyszczącego w kieszeni. Jak profesor Cię zapyta, wyciągnij to i uciekaj, gdy odwróci wzrok.",
  "Kofeina to Twoje paliwo, ale pamiętaj, że spanie w śmietniku przed sesją to nie jest oficjalna 'metoda nauki'.",
  "Nie ściągaj, po prostu 'pożycz' wiedzę bez pytania. Tak jak ja pożyczam Twoje kanapki z plecaka.",
  "Dyplom smakuje najlepiej, gdy jest wydrukowany na papierze z recyklingu. Serio, próbowałem go pogryźć.",
  "Jeśli profesor patrzy na Ciebie podejrzanie, zacznij nerwowo myć ręce w powietrzu. To zawsze działa na dystans.",
  "Najlepsze notatki to te, które ktoś wyrzucił. Recykling wiedzy to podstawa przetrwania!",
  "Pamiętaj: noc jest od buszowania w notatkach, a dzień od udawania, że nie jesteś zwierzakiem nocnym."
];

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const today = new Date();
  const todayDay = (today.getDay() + 6) % 7; 
  
  const upcomingTasks = [...state.tasks]
    .filter(t => !t.isCompleted)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const todayClasses = state.sessions
    .filter(s => s.dayOfWeek === todayDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const randomTip = useMemo(() => SZOP_TIPS[Math.floor(Math.random() * SZOP_TIPS.length)], []);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Section */}
      <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-[2.5rem] border border-white shadow-sm flex items-center space-x-4">
        <div className="bg-white p-2 rounded-3xl shadow-sm flex-shrink-0">
          <RaccoonLogo size={64} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 leading-tight">Hej, Szopie!</h2>
          <p className="text-xs font-medium text-slate-500 mt-1">Dziś masz {todayClasses.length} wykłady do zaliczenia. Powodzenia w buszowaniu!</p>
        </div>
      </div>

      {/* Quick Stats Grid - More Compact for Mobile */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/80 p-5 rounded-[2rem] border border-white shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Kursy</span>
          <div className="text-3xl font-black text-indigo-500 mt-1">{state.subjects.length}</div>
        </div>
        <div className="bg-white/80 p-5 rounded-[2rem] border border-white shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Wiedza</span>
          <div className="text-3xl font-black text-purple-500 mt-1">
            {state.tasks.length > 0 ? Math.round((state.tasks.filter(t => t.isCompleted).length / state.tasks.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Today's Agenda - List Style */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-slate-800">Plan na dziś</h3>
          <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">Wszystko</span>
        </div>
        
        <div className="space-y-3">
          {todayClasses.length > 0 ? todayClasses.map(session => {
            const subject = state.subjects.find(s => s.id === session.subjectId);
            return (
              <div key={session.id} className="flex items-center p-4 bg-white/60 rounded-3xl border border-white hover:bg-white transition-all">
                <div className={`w-3 h-10 rounded-full mr-4 ${subject?.color || 'bg-slate-300'}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{subject?.name}</h4>
                  <p className="text-[10px] font-medium text-slate-500">{session.startTime} - {session.endTime} • {session.room}</p>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            );
          }) : (
            <div className="py-8 text-center bg-white/40 rounded-3xl border border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-400">Dziś leniuchujemy i szukamy fantów!</p>
            </div>
          )}
        </div>
      </section>

      {/* Immediate Deadlines */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-slate-800">Pilne sprawy</h3>
          <AlertCircle size={18} className="text-rose-400" />
        </div>
        <div className="space-y-3">
          {upcomingTasks.map(task => {
            const subject = state.subjects.find(s => s.id === task.subjectId);
            const isExam = task.type === 'exam';
            return (
              <div key={task.id} className="p-4 bg-white/60 rounded-3xl border border-white flex justify-between items-center group active:scale-95 transition-transform">
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded-md text-slate-700 ${isExam ? TASK_GRADIENTS.exam : TASK_GRADIENTS.assignment}`}>
                      {isExam ? 'Egzamin' : 'Zadanie'}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase truncate max-w-[80px]">{subject?.name}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-1 truncate">{task.title}</h4>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-rose-500">{task.dueDate.split('-').slice(1).reverse().join('.')}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Buszuj szybko!</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Funny Raccoon Fact / Advice */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-[2.5rem] text-white shadow-lg relative overflow-hidden active:scale-[0.98] transition-transform">
        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 scale-150">
          <RaccoonLogo size={100} />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Mądrość Śmietnikowa</p>
          <p className="text-sm font-bold leading-relaxed italic">"{randomTip}"</p>
        </div>
      </div>
    </div>
  );
};
