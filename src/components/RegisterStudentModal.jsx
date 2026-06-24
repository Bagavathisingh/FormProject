import React from 'react';

export default function RegisterStudentModal({
  showAddStudentModal,
  setShowAddStudentModal,
  newStudentData,
  setNewStudentData,
  addNewStudent
}) {
  if (!showAddStudentModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-2xl animate-fade-in space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Register New Student</h3>
          <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={addNewStudent} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Student Name</label>
            <input
              type="text"
              required
              value={newStudentData.name}
              onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
              placeholder="e.g. Rohan Das"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
              <select
                value={newStudentData.dept}
                onChange={(e) => setNewStudentData({ ...newStudentData, dept: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              >
                <option>CSE</option>
                <option>ECE</option>
                <option>IT</option>
                <option>MECH</option>
                <option>EEE</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attendance Target</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={newStudentData.attendance}
                onChange={(e) => setNewStudentData({ ...newStudentData, attendance: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                required
                value={newStudentData.email}
                onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                placeholder="student@university.edu"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
              <input
                type="text"
                required
                value={newStudentData.phone}
                onChange={(e) => setNewStudentData({ ...newStudentData, phone: e.target.value })}
                placeholder="+91 98765..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-1 shadow-md shadow-indigo-600/10"
          >
            Register Record
          </button>
        </form>
      </div>
    </div>
  );
}
