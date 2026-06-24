import React from 'react';
import { 
  Users, CalendarCheck2, Award, FileText, Sparkles, GraduationCap, 
  ListTodo, Check, ShieldAlert, ChevronRight, RefreshCw, 
  AlertTriangle, CheckCircle2, Info 
} from 'lucide-react';

export default function DashboardView({
  batches,
  insights,
  setInsights,
  students,
  todayAttendanceChecklist,
  setTodayAttendanceChecklist,
  setCurrentView,
  setSelectedStudentId,
  setShowAddStudentModal,
  setShowMarksEntryModal
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
      {/* LEFT PANEL: Quick Actions Tiles */}
      <div className="xl:col-span-1 space-y-4">
        <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Workspace Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="p-4 rounded-2xl glass-card flex flex-col items-start gap-2.5 text-left border border-white hover:border-indigo-100"
            >
              <div className="h-9.5 w-9.5 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Users className="h-5 w-5" /></div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Register Student</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Add a new trainee to database</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('attendance')}
              className="p-4 rounded-2xl glass-card flex flex-col items-start gap-2.5 text-left border border-white hover:border-indigo-100"
            >
              <div className="h-9.5 w-9.5 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center"><CalendarCheck2 className="h-5 w-5" /></div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Take Attendance</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Mark daily check-in log</span>
              </div>
            </button>

            <button
              onClick={() => setShowMarksEntryModal(true)}
              className="p-4 rounded-2xl glass-card flex flex-col items-start gap-2.5 text-left border border-white hover:border-indigo-100"
            >
              <div className="h-9.5 w-9.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Award className="h-5 w-5" /></div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Enter Assessment Marks</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Record test performance metrics</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('reports')}
              className="p-4 rounded-2xl glass-card flex flex-col items-start gap-2.5 text-left border border-white hover:border-indigo-100"
            >
              <div className="h-9.5 w-9.5 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><FileText className="h-5 w-5" /></div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Generate Report</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Export custom data metrics</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* CENTER PANEL: Placement Command Center */}
      <div className="xl:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Placement Command Center <Sparkles className="h-5 w-5 text-indigo-500" />
            </h2>
            <p className="text-xs text-slate-500 mt-1">Configure active schedules, tasks, and priority trainee markers.</p>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-full font-bold">
              Active Cohorts: {batches.length}
            </span>
          </div>
        </div>

        {/* Interactive Cards */}
        <div className="grid grid-cols-1 gap-5">
          
          {/* 1. Active Training Batches */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200/40 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-slate-900 tracking-wide flex items-center gap-1.5">
                <GraduationCap className="h-4.5 w-4.5 text-indigo-600" /> Active Training Batches
              </span>
              <span className="text-[10px] text-slate-400">Order by schedule priorities</span>
            </div>

            <div className="space-y-3">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-4 bg-white/60 hover:bg-white rounded-2xl border border-slate-100 flex items-center justify-between group transition cursor-grab"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition">
                      {batch.name.split(' ')[1].charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{batch.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{batch.focus}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-700 block">{batch.count} Trainees</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{batch.trainer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Today's Attendance Tasks */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-slate-900 tracking-wide flex items-center gap-1.5">
                <ListTodo className="h-4.5 w-4.5 text-indigo-600" /> Today's Attendance Checklist
              </span>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                {todayAttendanceChecklist.filter(c => c.done).length}/{todayAttendanceChecklist.length} Checked
              </span>
            </div>

            <div className="space-y-2">
              {todayAttendanceChecklist.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setTodayAttendanceChecklist(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    task.done ? 'bg-emerald-50/40 border-emerald-100 text-slate-500' : 'bg-white/60 border-slate-100 hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-5.5 w-5.5 rounded-lg flex items-center justify-center border transition ${
                      task.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                    }`}>
                      {task.done && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className="text-xs font-semibold">{task.name}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    task.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {task.done ? 'Registered' : 'Action Required'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Students Requiring Immediate Attention */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-slate-900 tracking-wide flex items-center gap-1.5">
                <ShieldAlert className="h-4.5 w-4.5 text-indigo-600 animate-pulse-slow" /> Students Requiring Attention
              </span>
              <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-bold">
                {students.filter(s => s.attendance < 75 || s.performance === 'At Risk').length} Critical
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {students.filter(s => s.attendance < 75 || s.performance === 'At Risk').map((student) => (
                <div
                  key={student.id}
                  className="p-3.5 bg-white/60 hover:bg-white rounded-2xl border border-slate-100 flex items-center justify-between group transition cursor-pointer"
                  onClick={() => {
                    setSelectedStudentId(student.id);
                    setCurrentView('profile');
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img src={student.image} className="h-9 w-9 rounded-xl object-cover" alt={student.name} />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition">{student.name}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Avg: {Math.round(Object.values(student.scores).reduce((a,b)=>a+b,0)/5)}% | Attd: {student.attendance}%</span>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center transition">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL: Insights Activity Feed */}
      <div className="xl:col-span-1 space-y-4">
        <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">Insights Feed</h4>
            <button
              onClick={() => {
                const refreshed = [...insights];
                refreshed.unshift(refreshed.pop());
                setInsights(refreshed);
              }}
              className="h-6 w-6 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center transition"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {insights.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white/60 rounded-2xl border border-slate-100 flex gap-3 text-left hover:bg-white transition"
              >
                <div className="mt-0.5">
                  {item.type === 'warning' ? <AlertTriangle className="h-4.5 w-4.5 text-rose-500" /> :
                   item.type === 'success' ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> :
                   <Info className="h-4.5 w-4.5 text-indigo-500" />}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800 leading-tight">{item.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">{item.message}</div>
                  <div className="text-[9px] text-slate-400 mt-1.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
