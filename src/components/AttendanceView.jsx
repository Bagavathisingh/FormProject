import React from 'react';
import { Search, Check, Save } from 'lucide-react';
import { isFutureDate, isAttendanceLocked } from '../utils/attendanceHelper';

export default function AttendanceView({
  sessionDate,
  setSessionDate,
  selectedBatch,
  setSelectedBatch,
  attendanceSearchQuery,
  setAttendanceSearchQuery,
  attendance,
  attendanceDraft,
  attendancePage,
  setAttendancePage,
  filteredRoster,
  rosterTotalCount,
  rosterMarkedCount,
  rosterComplianceRate,
  handleDraftChange,
  markAllPresent,
  saveAttendanceRoster,
  discardAttendanceChanges,
  batches,
  students
}) {
  const itemsPerPage = 5;
  const paginatedRoster = filteredRoster.slice((attendancePage - 1) * itemsPerPage, attendancePage * itemsPerPage);
  const totalPages = Math.ceil(filteredRoster.length / itemsPerPage) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daily Attendance</h2>
        <p className="text-xs text-slate-500 mt-1">Manage and track student presence for the current session.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Daily Attendance Controls & Roster */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily Attendance Controls */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200/40 text-left">
            <div className="flex flex-wrap items-end gap-5">
              <div className="relative">
                <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">Session Date</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-indigo-650 transition cursor-pointer"
                />
              </div>
              
              <div className="relative">
                <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">Batch / Cohort</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-indigo-655 transition w-44 cursor-pointer"
                >
                  <option value="All">All Batches</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Roster filter input */}
              <div className="relative flex-grow min-w-[200px]">
                <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">Search Roster</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter by name, department..."
                    value={attendanceSearchQuery}
                    onChange={(e) => setAttendanceSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-indigo-650 transition"
                  />
                  {attendanceSearchQuery && (
                    <button onClick={() => setAttendanceSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-650 text-xs">✕</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Attendance Heatmap */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Cohort Daily Attendance Heatmap</h4>
            
            <div className="flex flex-wrap gap-1.5 justify-start">
              {Array.from({ length: 30 }).map((_, idx) => {
                const day = idx + 1;
                const dayStr = `2026-06-${day < 10 ? '0' + day : day}`;
                
                const isFuture = isFutureDate(dayStr);
                const studentList = Object.values(attendance);
                const presentCount = isFuture ? 0 : studentList.filter(logs => logs[dayStr] === 'present').length;
                const excusedCount = isFuture ? 0 : studentList.filter(logs => logs[dayStr] === 'excused').length;
                const waitingCount = isFuture ? 0 : studentList.filter(logs => logs[dayStr] === 'waiting').length;
                const activeTrainees = students.length;
                
                const ratio = activeTrainees > 0 ? (presentCount + (excusedCount + waitingCount) * 0.5) / activeTrainees : 0;
                
                let color = 'bg-slate-100';
                if (ratio > 0.8) color = 'bg-emerald-600 glow-success';
                else if (ratio > 0.6) color = 'bg-emerald-400';
                else if (ratio > 0.4) color = 'bg-amber-400';
                else if (ratio > 0.0) color = 'bg-rose-400';

                return (
                  <div
                    key={idx}
                    title={`${dayStr}: Compliance rating ${Math.round(ratio * 100)}%`}
                    className={`h-6.5 w-6.5 rounded-md flex items-center justify-center text-[8px] font-bold text-slate-900 border border-black/5 hover:scale-110 transition cursor-help ${color}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="h-3 w-3 bg-emerald-600 rounded" /> Excellent (&gt;80%)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 bg-emerald-400 rounded" /> Good (60%-80%)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 bg-amber-400 rounded" /> Warning (40%-60%)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 bg-rose-400 rounded" /> Critical (&lt;40%)</span>
            </div>
          </div>

          {/* Student Roster Card */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200/40 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Student Roster</h4>
              <button
                onClick={markAllPresent}
                disabled={isAttendanceLocked(sessionDate)}
                className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-55 disabled:cursor-not-allowed text-indigo-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="h-4 w-4" /> Mark all as Present
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Student ID</th>
                    <th className="pb-3">Full Name</th>
                    <th className="pb-3">Last Saved</th>
                    <th className="pb-3 text-right pr-6">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRoster.map(s => {
                    const savedStatus = (attendance[s.id] || {})[sessionDate];
                    const currentStatus = attendanceDraft[s.id];
                    const isLocked = isAttendanceLocked(sessionDate);
                    const initials = s.name.split(' ').map(n => n[0]).join('');
                    
                    return (
                      <tr key={s.id} className="text-xs text-slate-700">
                        <td className="py-3.5 font-bold text-indigo-600">ST-2026-00{s.id}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-slate-100/80 flex items-center justify-center font-extrabold text-[9px] text-slate-500 border border-slate-200/50">
                              {initials}
                            </div>
                            <span className="font-bold text-slate-800">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            savedStatus === 'present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            savedStatus === 'absent' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            savedStatus === 'excused' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            savedStatus === 'waiting' ? 'bg-indigo-50 text-indigo-650 border-indigo-100' :
                            'bg-slate-50 text-slate-450 border-slate-150'
                          }`}>
                            {savedStatus || 'Not Marked'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="inline-flex rounded-xl bg-slate-100/80 p-0.5 gap-0.5 border border-slate-200/50">
                            <button
                              onClick={() => handleDraftChange(s.id, 'present')}
                              disabled={isLocked}
                              className={`px-3 py-1 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer ${
                                currentStatus === 'present' 
                                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' 
                                  : 'text-slate-500 hover:text-slate-855 hover:bg-white/60'
                              } ${isLocked ? 'opacity-55 cursor-not-allowed' : ''}`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleDraftChange(s.id, 'absent')}
                              disabled={isLocked}
                              className={`px-3 py-1 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer ${
                                currentStatus === 'absent' 
                                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/10' 
                                  : 'text-slate-500 hover:text-slate-855 hover:bg-white/60'
                              } ${isLocked ? 'opacity-55 cursor-not-allowed' : ''}`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleDraftChange(s.id, 'excused')}
                              disabled={isLocked}
                              className={`px-3 py-1 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer ${
                                currentStatus === 'excused' 
                                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/10' 
                                  : 'text-slate-500 hover:text-slate-855 hover:bg-white/60'
                              } ${isLocked ? 'opacity-55 cursor-not-allowed' : ''}`}
                            >
                              Excused
                            </button>
                            <button
                              onClick={() => handleDraftChange(s.id, 'waiting')}
                              disabled={isLocked}
                              className={`px-3 py-1 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer ${
                                currentStatus === 'waiting' 
                                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' 
                                  : 'text-slate-500 hover:text-slate-855 hover:bg-white/60'
                              } ${isLocked ? 'opacity-55 cursor-not-allowed' : ''}`}
                            >
                              Waiting
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRoster.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-xs text-slate-400">No students found matching current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredRoster.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-3 gap-3 border-t border-slate-100">
                <span>
                  Showing {filteredRoster.length > 0 ? (attendancePage - 1) * itemsPerPage + 1 : 0} to {Math.min(attendancePage * itemsPerPage, filteredRoster.length)} of {filteredRoster.length} students
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAttendancePage(prev => Math.max(prev - 1, 1))}
                    disabled={attendancePage === 1}
                    className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setAttendancePage(i + 1)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                        attendancePage === i + 1 ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' : 'border border-slate-200 hover:bg-slate-50 text-slate-650'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setAttendancePage(prev => Math.min(prev + 1, totalPages))}
                    disabled={attendancePage === totalPages}
                    className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Roster Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={discardAttendanceChanges}
              className="px-5 py-2.5 border border-slate-205 hover:bg-slate-50 text-slate-655 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              onClick={saveAttendanceRoster}
              disabled={isAttendanceLocked(sessionDate)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-55 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/15 transition cursor-pointer flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" /> Save Attendance Records
            </button>
          </div>

        </div>

        {/* Right Side Column: Attendance Summary card */}
        <div className="lg:col-span-1 space-y-6 text-left">
          
          {/* Attendance Summary */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-600/15">
            {/* Decorative abstract grids */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
            
            <span className="text-[9px] font-bold text-indigo-100 uppercase tracking-widest block">Attendance Summary</span>
            
            <h3 className="text-4xl font-extrabold text-white block mt-3 leading-none">
              {rosterMarkedCount} <span className="text-lg font-medium text-indigo-200">/ {rosterTotalCount}</span>
            </h3>
            <span className="text-[10px] text-indigo-200 font-semibold block mt-1.5">Students marked today</span>
            
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-indigo-500/40 rounded-full mt-5 overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500" 
                style={{ width: `${rosterTotalCount > 0 ? (rosterMarkedCount / rosterTotalCount) * 100 : 0}%` }}
              />
            </div>
            
            <span className="text-[11px] text-indigo-100 font-bold block mt-4 uppercase tracking-wider">
              📈 {rosterComplianceRate}% Compliance Rate
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
