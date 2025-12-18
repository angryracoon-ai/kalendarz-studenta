
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Users, 
  Sparkles,
  Menu
} from 'lucide-react';
import { RaccoonLogo } from './RaccoonLogo';
import { APP_NAME } from '../constants';

const NavItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
  <Link 
    to={path} 
    className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 ${
      active ? 'text-purple-600 scale-110' : 'text-slate-400'
    }`}
  >
    <div className={`p-2 rounded-2xl ${active ? 'bg-purple-100' : ''}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className={`text-[10px] font-bold mt-1 ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const getTitle = () => {
    switch(location.pathname) {
      case '/schedule': return 'Nocne Buszowanie';
      case '/tasks': return 'Fanty do zdobycia';
      case '/professors': return 'Strażnicy Wiedzy';
      case '/topics': return 'Zapas śmieci';
      default: return APP_NAME;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Top Mobile Header */}
      <header className="sticky top-0 z-50 glass-card px-6 py-4 flex items-center justify-between border-b border-white/20">
        <div className="flex items-center space-x-3">
          <RaccoonLogo size={32} />
          <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            {getTitle()}
          </h1>
        </div>
        <button className="p-2 bg-white/50 rounded-xl text-slate-400 hover:text-purple-500 transition-colors">
          <Sparkles size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-8 animate-in fade-in duration-500">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/40 px-4 py-3 flex items-center justify-around bottom-nav">
        <NavItem icon={LayoutDashboard} label="Nora" path="/" active={location.pathname === '/'} />
        <NavItem icon={Calendar} label="Buszuj" path="/schedule" active={location.pathname === '/schedule'} />
        <NavItem icon={CheckSquare} label="Fanty" path="/tasks" active={location.pathname === '/tasks'} />
        <NavItem icon={Users} label="Katedra" path="/professors" active={location.pathname === '/professors'} />
        <NavItem icon={BookOpen} label="Śmieci" path="/topics" active={location.pathname === '/topics'} />
      </nav>
    </div>
  );
};
