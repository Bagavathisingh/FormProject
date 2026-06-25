import React from 'react';
import { isAttendanceLocked } from '../utils/attendanceHelper';
import { Calendar, Sparkles } from 'lucide-react';

export default function QuickAttendanceModal({
  showAttendanceToggleModal,
  setShowAttendanceToggleModal,
  attendanceSelectedStudentId,
  students,
  attendance,
  updateAttendanceStatus,
  batches = []
}) {
  if (!showAttendanceToggleModal || !attendanceSelectedStudentId) return null;

  const selectedStudent = students.find(s => s.id === attendanceSelectedStudentId);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 max-w-md w-full p-6 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in space-y-4">
        {/* Decorative Ambient Glows */}
        <div className="absolute -top-12 -left-12 h-32 w-32 bg-indigo-200/25 rounded-full filter blur-xl -z-10 pointer-events-none animate-pulse-slow" />
        <div className="absolute -bottom-12 -right-12 h-32 w-32 bg-violet-200/20 rounded-full filter blur-xl -z-10 pointer-events-none animate-pulse-slow" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100/60 pb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/60 border border-indigo-100/50 text-[8px] font-extrabold uppercase tracking-widest text-indigo-600 select-none">
            ✨ Attendance Tracker
          </div>
          <button 
            onClick={() => setShowAttendanceToggleModal(false)} 
            className="h-6 w-6 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="text-left">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">Quick Attendance Log</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">
            Reviewing log history sheets for <strong>{selectedStudent?.name}</strong> ({batches.find(b => b.id === selectedStudent?.batchId)?.name || 'No Batch'}).
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-2.5 border border-slate-200/50 rounded-2xl bg-white/40">
          {Array.from({ length: 15 }).map((_, idx) => {
            const day = idx + 10;
            const dateStr = `2026-06-${day < 10 ? '0' + day : day}`;
            const status = (attendance[attendanceSelectedStudentId] || {})[dateStr];
            const locked = isAttendanceLocked(dateStr);
            
            return (
              <div key={idx} className="bg-white/90 p-2 rounded-xl border border-slate-100/80 shadow-sm flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 font-extrabold block mb-1">June {day} {locked && '🔒'}</span>
                <select
                  value={status || ''}
                  disabled={locked}
                  onChange={(e) => {
                    const val = e.target.value === '' ? undefined : e.target.value;
                    updateAttendanceStatus(attendanceSelectedStudentId, dateStr, val);
                  }}
                  className={`w-full py-1 px-1.5 rounded-lg text-[9px] font-bold border transition-colors focus:outline-none cursor-pointer ${
                    status === 'present' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    status === 'absent' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    status === 'excused' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    status === 'waiting' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' :
                    'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  <option value="">Unmarked</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="excused">Excused</option>
                  <option value="waiting">Waiting</option>
                </select>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setShowAttendanceToggleModal(false)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/10 active:scale-[0.98] transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          Confirm Log Changes <Calendar className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
