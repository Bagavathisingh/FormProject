import React from 'react';
import { Search } from 'lucide-react';

export default function AssessmentsView({
  students,
  marksSearchQuery,
  setMarksSearchQuery,
  setSelectedStudentId,
  setCurrentView,
  setMarksStudentId,
  setMarksForm,
  setShowMarksEntryModal,
  moveStudentMarkCategory
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Local Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Grade Assessment Boards</h2>
          <p className="text-xs text-slate-500 mt-1">Review candidates grouped by assessment levels. Move cards between stages.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter cards by name..."
            value={marksSearchQuery}
            onChange={(e) => setMarksSearchQuery(e.target.value)}
            className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white/60 text-xs text-slate-800 focus:outline-indigo-600 focus:bg-white transition"
          />
          {marksSearchQuery && (
            <button onClick={() => setMarksSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs">✕</button>
          )}
        </div>
      </div>

      {/* Assessment Categories Layout */}
      <div className="overflow-x-auto flex md:grid md:grid-cols-4 gap-6 pb-6 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 items-start">
        {['Elite', 'Placement Ready', 'Progressing', 'At Risk'].map((status) => {
          const columnStudents = students
            .filter(s => s.performance === status)
            .filter(s => s.name.toLowerCase().includes(marksSearchQuery.toLowerCase()));

          return (
            <div key={status} className="w-[280px] sm:w-[320px] md:w-auto shrink-0 snap-center glass-panel rounded-3xl p-4 border border-slate-200/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    status === 'Elite' ? 'bg-violet-500' :
                    status === 'Placement Ready' ? 'bg-emerald-500' :
                    status === 'Progressing' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  {status}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                  {columnStudents.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[300px] overflow-y-auto max-h-[500px] pr-1">
                {columnStudents.map((student) => {
                  const avg = Math.round(Object.values(student.scores).reduce((a,b)=>a+b,0)/5);
                  return (
                    <div
                      key={student.id}
                      className="p-4 bg-white hover:bg-slate-50/50 rounded-2xl border border-slate-150 shadow-sm relative group transition cursor-pointer"
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setCurrentView('profile');
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img src={student.image} className="h-9 w-9 rounded-xl object-cover" alt="" />
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition">{student.name}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Avg Score: {avg}%</span>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 font-semibold">{student.dept}</span>
                        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            title="Demote status"
                            onClick={() => moveStudentMarkCategory(student.id, -1)}
                            className="h-5 w-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-[10px] transition cursor-pointer font-bold"
                          >
                            -
                          </button>
                          <button
                            title="Quick Edit Grades"
                            onClick={() => {
                              setMarksStudentId(student.id);
                              setMarksForm({ ...student.scores });
                              setShowMarksEntryModal(true);
                            }}
                            className="h-5 px-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-650 text-[8px] font-extrabold transition cursor-pointer"
                          >
                            EDIT
                          </button>
                          <button
                            title="Promote status"
                            onClick={() => moveStudentMarkCategory(student.id, 1)}
                            className="h-5 w-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-[10px] transition cursor-pointer font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {columnStudents.length === 0 && (
                  <div className="h-48 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-[10px] text-slate-400 font-medium">
                    No students in column.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
