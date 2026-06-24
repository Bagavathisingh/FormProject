import React from 'react';

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
      <div className="bg-white/95 rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-2xl animate-fade-in space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Record Assessment Marks</h3>
          <button onClick={() => setShowMarksEntryModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={updateMarks} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Student</label>
            <select
              value={marksStudentId}
              onChange={(e) => {
                setMarksStudentId(Number(e.target.value));
                const stu = students.find(s => s.id === Number(e.target.value));
                if (stu) setMarksForm({ ...stu.scores });
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs cursor-pointer"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.dept})</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {Object.entries(marksForm).map(([key, val]) => (
              <div key={key} className="flex flex-col gap-1.5 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold capitalize text-slate-650 tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-bold text-slate-700">{val}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => setMarksForm({ ...marksForm, [key]: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-1 shadow-md shadow-indigo-600/10"
          >
            Record Marks Sheet
          </button>
        </form>
      </div>
    </div>
  );
}
