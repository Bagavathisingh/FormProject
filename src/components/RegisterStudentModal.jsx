import React from 'react';
import { UserPlus, Sparkles } from 'lucide-react';

export default function RegisterStudentModal({
  showAddStudentModal,
  setShowAddStudentModal,
  newStudentData,
  setNewStudentData,
  addNewStudent,
  batches = []
}) {
  if (!showAddStudentModal) return null;

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
            ✨ Student Database
          </div>
          <button 
            onClick={() => setShowAddStudentModal(false)} 
            className="h-6 w-6 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="text-left">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">Register New Student</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">Enroll a new trainee into the workspace repository.</p>
        </div>

        {/* Form */}
        <form onSubmit={addNewStudent} className="space-y-4 text-left">
          <div>
            <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">Student Name</label>
            <input
              type="text"
              required
              value={newStudentData.name}
              onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
              placeholder="e.g. Arjun Mehta"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/60 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-650/10 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">Department</label>
              <select
                value={newStudentData.dept}
                onChange={(e) => setNewStudentData({ ...newStudentData, dept: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/60 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-650/10 transition cursor-pointer"
              >
                <option>CSE</option>
                <option>ECE</option>
                <option>IT</option>
                <option>MECH</option>
                <option>EEE</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">Training Batch</label>
              <select
                value={newStudentData.batchId || 'elite-batch-1'}
                onChange={(e) => setNewStudentData({ ...newStudentData, batchId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/60 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-650/10 transition cursor-pointer"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">Attendance Target (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={newStudentData.attendance}
                onChange={(e) => setNewStudentData({ ...newStudentData, attendance: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/60 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-650/10 transition"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">Phone Number</label>
              <input
                type="text"
                required
                value={newStudentData.phone}
                onChange={(e) => setNewStudentData({ ...newStudentData, phone: e.target.value })}
                placeholder="+91 98765..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/60 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-650/10 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={newStudentData.email}
              onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
              placeholder="student@university.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/60 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-650/10 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/10 active:scale-[0.98] transition duration-150 flex items-center justify-center gap-1.5 mt-3.5 cursor-pointer"
          >
            Register Student Record <UserPlus className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
