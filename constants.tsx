
export const DAYS_OF_WEEK = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

export const APP_NAME = "SzopGrad";

export const SUBJECT_COLORS = [
  'bg-indigo-300', 'bg-purple-300', 'bg-pink-300', 'bg-rose-300', 
  'bg-violet-300', 'bg-fuchsia-300', 'bg-amber-300', 'bg-emerald-300', 'bg-sky-300'
];

export const TASK_GRADIENTS = {
  exam: 'bg-gradient-to-r from-rose-300 to-pink-300',
  assignment: 'bg-gradient-to-r from-indigo-300 to-purple-300',
  project: 'bg-gradient-to-r from-violet-400 to-fuchsia-300',
  other: 'bg-gradient-to-r from-slate-200 to-slate-400'
};

export const INITIAL_DATA = {
  professors: [
    { id: 'p1', name: 'Jan Kowalski', title: 'dr hab.', email: 'j.kowalski@uczelnia.pl', consultations: 'Wtorki 10:00-12:00', office: 'A1-203', notes: 'Lubi punktualność.' },
    { id: 'p2', name: 'Anna Nowak', title: 'prof. nadzw.', email: 'a.nowak@uczelnia.pl', consultations: 'Czwartki 14:00-15:00', office: 'L-10', notes: 'Wymaga starannie opisanych projektów.' }
  ],
  subjects: [
    { id: '1', name: 'Analiza Matematyczna', color: 'bg-indigo-300', professorId: 'p1' },
    { id: '2', name: 'Programowanie Obiektowe', color: 'bg-pink-300', professorId: 'p2' }
  ],
  tasks: [
    { id: 't1', title: 'Egzamin Semestralny', type: 'exam', dueDate: new Date().toISOString().split('T')[0], subjectId: '1', description: 'Cały zakres materiału', isCompleted: false },
    { id: 't2', title: 'Projekt końcowy Java', type: 'project', dueDate: '2024-06-15', subjectId: '2', description: 'Aplikacja w JavaFX', isCompleted: false },
    { id: 't3', title: 'Zadanie domowe: Pochodne', type: 'assignment', dueDate: '2024-05-20', subjectId: '1', description: 'Lista nr 4', isCompleted: true }
  ],
  sessions: [
    { id: 's1', subjectId: '1', dayOfWeek: 0, startTime: '08:00', endTime: '09:30', room: 'A1-12' },
    { id: 's2', subjectId: '2', dayOfWeek: 1, startTime: '10:00', endTime: '11:30', room: 'L-204' }
  ],
  topics: [
    { id: 'top1', subjectId: '1', title: 'Pochodne cząstkowe', keywords: ['Gradient', 'Hessian', 'Ekstrema'], notes: 'Ważne dla egzaminu końcowego.' }
  ]
};
