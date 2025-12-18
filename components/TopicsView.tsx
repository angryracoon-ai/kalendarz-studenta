
import React, { useState } from 'react';
import { AppState, StudyTopic } from '../types';
import { BookOpen, Sparkles, Plus, Trash2, Key, Info } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface TopicsViewProps {
  state: AppState;
  onAddTopic: (topic: Omit<StudyTopic, 'id'>) => void;
  onRemoveTopic: (id: string) => void;
}

export const TopicsView: React.FC<TopicsViewProps> = ({ state, onAddTopic, onRemoveTopic }) => {
  const [showModal, setShowModal] = useState(false);
  const [explainingTerm, setExplainingTerm] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  
  const [newTopic, setNewTopic] = useState({
    subjectId: state.subjects[0]?.id || '',
    title: '',
    keywords: [] as string[],
    notes: ''
  });

  const handleSuggestKeywords = async () => {
    if (!newTopic.title) return;
    setLoadingKeywords(true);
    const suggested = await geminiService.suggestKeywords(newTopic.title);
    setNewTopic(prev => ({ ...prev, keywords: suggested }));
    setLoadingKeywords(false);
  };

  const handleExplain = async (term: string) => {
    setExplainingTerm(term);
    const text = await geminiService.explainTerm(term);
    setExplanation(text || 'Brak informacji.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Materiały i Pojęcia</h1>
          <p className="text-slate-500">Przechowuj najważniejsze hasła i tematy do nauki.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          <span>Dodaj Temat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {state.topics.map(topic => {
          const subject = state.subjects.find(s => s.id === topic.subjectId);
          return (
            <div key={topic.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-md ${subject?.color || 'bg-slate-400'}`}>
                    {subject?.name}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-2">{topic.title}</h3>
                </div>
                <button onClick={() => onRemoveTopic(topic.id)} className="p-2 text-slate-300 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {topic.keywords.map((kw, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleExplain(kw)}
                    className="flex items-center space-x-1 px-3 py-1 bg-slate-50 rounded-lg text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-100"
                  >
                    <Key size={10} />
                    <span>{kw}</span>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <p className="text-xs text-slate-400 italic">"{topic.notes || 'Brak dodatkowych notatek'}"</p>
                <BookOpen size={16} className="text-slate-200" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Modal */}
      {explainingTerm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center space-x-2 text-indigo-600 mb-4">
                <Sparkles size={24} />
                <h3 className="text-xl font-bold">Wyjaśnienie AI: {explainingTerm}</h3>
            </div>
            <div className="text-slate-700 leading-relaxed mb-8 max-h-[400px] overflow-y-auto pr-2">
                {explanation ? (
                    <div className="whitespace-pre-wrap">{explanation}</div>
                ) : (
                    <div className="flex flex-col items-center py-8">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-400">Analizuję pojęcie...</p>
                    </div>
                )}
            </div>
            <button 
                onClick={() => { setExplainingTerm(null); setExplanation(null); }}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold"
            >
                Zamknij
            </button>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-bold mb-6">Dodaj Nowy Materiał</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Przedmiot</label>
                <select 
                  className="w-full p-3 bg-slate-50 rounded-xl border-none"
                  value={newTopic.subjectId}
                  onChange={e => setNewTopic({...newTopic, subjectId: e.target.value})}
                >
                  {state.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tytuł Tematu</label>
                <div className="flex space-x-2">
                    <input 
                        type="text" 
                        className="flex-1 p-3 bg-slate-50 rounded-xl border-none"
                        placeholder="np. Mechanika Kwantowa"
                        value={newTopic.title}
                        onChange={e => setNewTopic({...newTopic, title: e.target.value})}
                    />
                    <button 
                        onClick={handleSuggestKeywords}
                        disabled={loadingKeywords || !newTopic.title}
                        className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100"
                        title="Zasugeruj słowa kluczowe przez AI"
                    >
                        <Sparkles size={20} className={loadingKeywords ? 'animate-spin' : ''} />
                    </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Słowa kluczowe (oddziel przecinkiem)</label>
                <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 rounded-xl border-none"
                    placeholder="np. kot, atom, fala"
                    value={newTopic.keywords.join(', ')}
                    onChange={e => setNewTopic({...newTopic, keywords: e.target.value.split(',').map(s => s.trim())})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notatki</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 rounded-xl border-none resize-none"
                  rows={2}
                  value={newTopic.notes}
                  onChange={e => setNewTopic({...newTopic, notes: e.target.value})}
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-500 font-medium">Anuluj</button>
              <button 
                onClick={() => { onAddTopic(newTopic); setShowModal(false); }}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                Dodaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
