import React from 'react';
import { Award, Sparkles } from 'lucide-react';

export default function EnterMarksModal({
  showMarksEntryModal,
  setShowMarksEntryModal,
  marksStudentId,
  setMarksStudentId,
  marksForm,
  setMarksForm,
  updateMarks,
  students
}) {
  if (!showMarksEntryModal) return null;

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
            ✨ Academic Hub
          </div>
          <button 
            onClick={() => setShowMarksEntryModal(false)} 
            className="h-6 w-6 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="text-left">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">Record Assessment Marks</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">Grades are mapped directly into student analytics index charts.</p>
        </div>

        {/* Form */}
        <form onSubmit={updateMarks} className="space-y-4 text-left">
          <div>
            <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">Select Student</label>
            <select
              value={marksStudentId}
              onChange={(e) => {
                setMarksStudentId(Number(e.target.value));
                const stu = students.find(s => s.id === Number(e.target.value));
                if (stu) setMarksForm({ ...stu.scores });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/60 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-650/10 transition cursor-pointer"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.dept})</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {Object.entries(marksForm).map(([key, val]) => (
              <div key={key} className="p-2.5 bg-white/50 rounded-2xl border border-slate-100/80 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold capitalize text-slate-650 tracking-tight text-[10px] uppercase">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-extrabold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100/50 text-[10px]">
                    {val}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => setMarksForm({ ...marksForm, [key]: Number(e.target.value) })}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/10 active:scale-[0.98] transition duration-150 flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
          >
            Record Marks Sheet <Award className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
