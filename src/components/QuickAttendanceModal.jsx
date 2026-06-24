import React from 'react';
import { isAttendanceLocked } from '../utils/attendanceHelper';

export default function QuickAttendanceModal({
  showAttendanceToggleModal,
  setShowAttendanceToggleModal,
  attendanceSelectedStudentId,
  students,
  attendance,
  updateAttendanceStatus
}) {
  if (!showAttendanceToggleModal || !attendanceSelectedStudentId) return null;

  const selectedStudent = students.find(s => s.id === attendanceSelectedStudentId);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-2xl animate-fade-in space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Quick Attendance Check</h3>
          <button onClick={() => setShowAttendanceToggleModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <p className="text-xs text-slate-500 text-left">Configure attendance days log for <strong>{selectedStudent?.name}</strong>:</p>

        <div className="grid grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-2.5 border border-slate-100 rounded-2xl bg-slate-50/50">
          {Array.from({ length: 15 }).map((_, idx) => {
            const day = idx + 10;
            const dateStr = `2026-06-${day < 10 ? '0' + day : day}`;
            const status = (attendance[attendanceSelectedStudentId] || {})[dateStr];
            const locked = isAttendanceLocked(dateStr);
            
            return (
              <div key={idx} className="bg-white p-2 rounded-xl border border-slate-100/80 shadow-sm flex flex-col justify-between">
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition shadow-md shadow-indigo-600/10"
        >
          Close and Save Changes
        </button>
      </div>
    </div>
  );
}
