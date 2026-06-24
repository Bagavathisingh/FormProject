import React from 'react';
import { 
  Search, Plus, Bell, User, LogOut, Users, Award, 
  CalendarCheck2, FileText 
} from 'lucide-react';

export default function TopNavBar({
  currentView,
  setCurrentView,
  globalSearchQuery,
  setGlobalSearchQuery,
  showQuickAddDropdown,
  setShowQuickAddDropdown,
  showNotifications,
  setShowNotifications,
  showProfileDropdown,
  setShowProfileDropdown,
  notificationsList,
  setNotificationsList,
  user,
  handleLogout,
  students,
  setSelectedStudentId,
  setShowAddStudentModal,
  setShowMarksEntryModal
}) {
  return (
    <nav className="h-16 px-6 glass-panel border-b border-slate-200/50 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/20 text-lg">⏃</div>
          <div>
            <span className="font-extrabold tracking-tight text-slate-900 block leading-none">placement training portal </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mt-0.5">Staff Portal</span>
          </div>
        </div>

        {/* Nav Links: Simplified for Staff */}
        <div className="hidden lg:flex items-center gap-1.5 ml-4 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => { setCurrentView('dashboard'); setGlobalSearchQuery(''); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Overview
          </button>
          <button
            onClick={() => { setCurrentView('attendance'); setGlobalSearchQuery(''); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Attendance
          </button>
          <button
            onClick={() => { setCurrentView('marks'); setGlobalSearchQuery(''); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'marks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Assessments
          </button>
          <button
            onClick={() => { setCurrentView('analytics'); setGlobalSearchQuery(''); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => { setCurrentView('reports'); setGlobalSearchQuery(''); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Reports
          </button>
          <button
            onClick={() => { setCurrentView('students'); setGlobalSearchQuery(''); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'students' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Students
          </button>
        </div>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center gap-4">
        
        {/* Fixed Global Search */}
        <div className="relative max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search student..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="w-52 pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-transparent text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
          />
          {globalSearchQuery && (
            <button onClick={() => setGlobalSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-450 hover:text-slate-650 text-xs font-semibold">✕</button>
          )}

          {/* Global Search Floating Dropdown */}
          {globalSearchQuery && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 max-h-64 overflow-y-auto animate-fade-in">
              <div className="px-3.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Trainee Records</div>
              {students.filter(s => s.name.toLowerCase().includes(globalSearchQuery.toLowerCase())).length === 0 ? (
                <div className="px-4 py-3 text-xs text-slate-400 text-center">No students found</div>
              ) : (
                students
                  .filter(s => s.name.toLowerCase().includes(globalSearchQuery.toLowerCase()))
                  .map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        setCurrentView('profile');
                        setGlobalSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 transition"
                    >
                      <img src={s.image} className="h-6.5 w-6.5 rounded-lg object-cover" alt="" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">{s.name}</div>
                        <div className="text-[9px] text-slate-400">{s.dept} • Status: {s.performance}</div>
                      </div>
                    </button>
                  ))
              )}
            </div>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowQuickAddDropdown(!showQuickAddDropdown);
              setShowNotifications(false);
              setShowProfileDropdown(false);
            }}
            className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition shadow-md shadow-indigo-600/10"
          >
            <Plus className="h-5 w-5" />
          </button>

          {showQuickAddDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Command</div>
              <button
                onClick={() => { setShowAddStudentModal(true); setShowQuickAddDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Users className="h-4 w-4 text-slate-400" /> Register Student
              </button>
              <button
                onClick={() => { setShowMarksEntryModal(true); setShowQuickAddDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Award className="h-4 w-4 text-slate-400" /> Enter Marks
              </button>
              <button
                onClick={() => { setCurrentView('attendance'); setShowQuickAddDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <CalendarCheck2 className="h-4 w-4 text-slate-400" /> View Attendance
              </button>
              <button
                onClick={() => { setCurrentView('reports'); setShowQuickAddDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <FileText className="h-4 w-4 text-slate-400" /> Generate Report
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowQuickAddDropdown(false);
              setShowProfileDropdown(false);
            }}
            className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center relative transition"
          >
            <Bell className="h-4 w-4" />
            {notificationsList.some(n => n.unread) && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-fade-in">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Workspace Alerts</span>
                <button
                  onClick={() => setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })))}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto mt-2">
                {notificationsList.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No active alerts.</div>
                ) : (
                  notificationsList.map(n => (
                    <div key={n.id} className={`px-4 py-2.5 border-b border-slate-50 text-[11px] text-slate-650 flex items-start gap-2 hover:bg-slate-50 ${n.unread ? 'bg-indigo-50/30' : ''}`}>
                      <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-indigo-600' : 'bg-transparent'}`} />
                      <div>
                        <div>{n.text}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3.5 border-l border-slate-200 pl-4 relative">
          <div className="hidden md:block text-right select-none">
            <span className="text-xs font-bold text-slate-800 block leading-tight">{user.name}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{user.role}</span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotifications(false);
                setShowQuickAddDropdown(false);
              }}
              className={`h-9 w-9 rounded-xl flex items-center justify-center font-semibold text-xs border transition ${
                showProfileDropdown ? 'bg-indigo-650 text-indigo-600 border-indigo-200' : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border-transparent'
              }`}
            >
              <User className="h-4.5 w-4.5" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2.5 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-800">{user.name}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold mt-1"
                >
                  <LogOut className="h-4 w-4" /> Terminate Session
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}
