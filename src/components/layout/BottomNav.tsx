import React from 'react';
import {
  Home,
  GitFork,
  Target,
  BarChart3,
  CalendarCheck,
  Briefcase,
  BotMessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, role, t } = useApp();

  if (role !== 'student') return null;

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'ladder', label: t('navLadder'), icon: GitFork },
    { id: 'matches', label: t('navMatches'), icon: Target },
    { id: 'gaps', label: t('navGapReport'), icon: BarChart3 },
    { id: 'pathway', label: t('navPathway'), icon: CalendarCheck },
    { id: 'opportunities', label: t('navOpportunities'), icon: Briefcase },
    { id: 'chat', label: t('navChat'), icon: BotMessageSquare },
  ];

  return (
    <>
      {/* Tablet Sub-navigation Bar (Hidden on desktop lg:hidden where TopNav has tabs, and hidden on small mobile) */}
      <nav className="hidden md:flex lg:hidden bg-white border-b border-slate-200 px-4 py-2 sticky top-16 z-30 justify-center">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-[#1F4E79] font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1 flex items-center justify-around safe-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg flex-1 min-w-[40px] transition-colors ${
                isActive ? 'text-[#1F4E79]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#1F4E79]' : ''}`} />
              <span className={`text-[10px] mt-0.5 font-medium whitespace-nowrap truncate max-w-[55px] ${isActive ? 'text-[#1F4E79] font-bold' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
