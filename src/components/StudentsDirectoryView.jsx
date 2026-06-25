import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';

export default function StudentsDirectoryView({
  students,
  setStudents,
  studentSearchQuery,
  setStudentSearchQuery,
  setSelectedStudentId,
  setCurrentView,
  setMarksStudentId,
  setMarksForm,
  setShowMarksEntryModal,
  setAttendanceSelectedStudentId,
  setShowAttendanceToggleModal,
  setShowAddStudentModal,
  getStatusColor,
  batches = []
}) {
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.dept.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.performance.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-xs text-slate-500 mt-1">Hover student cards to view quick actions and manage placement records.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          {/* Local search input for Student Grid */}
          <div className="relative grow sm:grow-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter students by name, status..."
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white/60 text-xs text-slate-800 focus:outline-indigo-600 focus:bg-white transition"
            />
            {studentSearchQuery && (
              <button onClick={() => setStudentSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-655 text-xs">✕</button>
            )}
          </div>

          <button
            onClick={() => setShowAddStudentModal(true)}
            className="flex-grow sm:flex-grow-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10"
          >
            <Plus className="h-4 w-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Students Grid - Simplified visible layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm glass-panel rounded-3xl">
            No matching student records found.
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="rounded-2xl bg-white/70 border border-slate-200/50 p-5 flex flex-col justify-between hover:shadow-md transition duration-200 text-left">
              <div>
                <div className="flex items-start justify-between">
                  <img
                    src={student.image}
                    className="h-12 w-12 rounded-xl object-cover cursor-pointer hover:opacity-85 transition"
                    onClick={() => { setSelectedStudentId(student.id); setCurrentView('profile'); }}
                    alt={student.name}
                  />
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(student.performance)}`}>
                    {student.performance}
                  </span>
                </div>

                <h3
                  className="text-xs font-extrabold text-slate-800 mt-3.5 tracking-tight cursor-pointer hover:text-indigo-600 transition"
                  onClick={() => { setSelectedStudentId(student.id); setCurrentView('profile'); }}
                >
                  {student.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  {student.dept} Dept • {batches.find(b => b.id === student.batchId)?.name || 'No Batch'}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Attendance</span>
                  <span className="text-xs font-bold text-slate-700 block mt-0.5">{student.attendance}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Avg Score</span>
                  <span className="text-xs font-bold text-slate-700 block mt-0.5">
                    {Math.round(Object.values(student.scores).reduce((a,b)=>a+b,0)/5)}%
                  </span>
                </div>
              </div>

              {/* Action Panel Buttons (Visible directly) */}
              <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => { setSelectedStudentId(student.id); setCurrentView('profile'); }}
                  className="py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[9px] font-bold transition flex items-center justify-center gap-1"
                  title="View Profile Details"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setMarksStudentId(student.id);
                    setMarksForm({ ...student.scores });
                    setShowMarksEntryModal(true);
                  }}
                  className="py-1.5 border border-slate-205 hover:bg-slate-50 text-slate-650 rounded-lg text-[9px] font-semibold transition"
                  title="Record Assessment Scores"
                >
                  Grades
                </button>
                <button
                  onClick={() => {
                    setAttendanceSelectedStudentId(student.id);
                    setShowAttendanceToggleModal(true);
                  }}
                  className="py-1.5 border border-slate-205 hover:bg-slate-50 text-slate-650 rounded-lg text-[9px] font-semibold transition"
                  title="Log Attendance"
                >
                  Attd
                </button>
              </div>

              <div className="flex justify-end mt-2.5 pt-1.5">
                <button
                  onClick={() => {
                    if (confirm(`Remove ${student.name} from training register?`)) {
                      setStudents(prev => prev.filter(s => s.id !== student.id));
                    }
                  }}
                  className="text-[9px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-0.5"
                >
                  <Trash2 className="h-2.5 w-2.5" /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
