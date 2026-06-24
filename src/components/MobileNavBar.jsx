import React from 'react';
import { Compass, Users, Calendar, Award, BarChart3, FileText } from 'lucide-react';

export default function MobileNavBar({
  currentView,
  setCurrentView,
  setGlobalSearchQuery
}) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 border-t border-slate-200/50 backdrop-blur-lg px-4 py-2 flex items-center justify-around gap-2 z-40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] pb-safe">
      <button 
        onClick={() => { setCurrentView('dashboard'); setGlobalSearchQuery(''); }} 
        className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'dashboard' ? 'text-indigo-600 font-bold' : ''}`}
      >
        <Compass className="h-4 w-4" />
        <span className="text-[9px] mt-0.5">Overview</span>
      </button>
      <button 
        onClick={() => { setCurrentView('students'); setGlobalSearchQuery(''); }} 
        className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'students' ? 'text-indigo-600 font-bold' : ''}`}
      >
        <Users className="h-4 w-4" />
        <span className="text-[9px] mt-0.5">Students</span>
      </button>
      <button 
        onClick={() => { setCurrentView('attendance'); setGlobalSearchQuery(''); }} 
        className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'attendance' ? 'text-indigo-600 font-bold' : ''}`}
      >
        <Calendar className="h-4 w-4" />
        <span className="text-[9px] mt-0.5">Attendance</span>
      </button>
      <button 
        onClick={() => { setCurrentView('marks'); setGlobalSearchQuery(''); }} 
        className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'marks' ? 'text-indigo-600 font-bold' : ''}`}
      >
        <Award className="h-4 w-4" />
        <span className="text-[9px] mt-0.5">Assessments</span>
      </button>
      <button 
        onClick={() => { setCurrentView('analytics'); setGlobalSearchQuery(''); }} 
        className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'analytics' ? 'text-indigo-600 font-bold' : ''}`}
      >
        <BarChart3 className="h-4 w-4" />
        <span className="text-[9px] mt-0.5">Analytics</span>
      </button>
      <button 
        onClick={() => { setCurrentView('reports'); setGlobalSearchQuery(''); }} 
        className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'reports' ? 'text-indigo-600 font-bold' : ''}`}
      >
        <FileText className="h-4 w-4" />
        <span className="text-[9px] mt-0.5">Reports</span>
      </button>
    </div>
  );
}
