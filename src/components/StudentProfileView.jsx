import React from 'react';
import { Mail, Phone, Check, TrendingUp, Sparkles } from 'lucide-react';

export default function StudentProfileView({
  selectedStudent,
  setCurrentView,
  setStudents,
  attendance,
  getStatusColor,
  journeyStagesList
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('students')}
          className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition flex items-center gap-1"
        >
          ← Back to Grid
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs text-slate-500">Student Profile: {selectedStudent.name}</span>
      </div>

      {/* Profile layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Profile Main Card */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Cover */}
          <div className="glass-panel rounded-3xl border border-slate-200/40 overflow-hidden relative">
            <div className="h-32 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            </div>

            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-10 mb-4 gap-4">
                <img src={selectedStudent.image} className="h-20 w-20 rounded-2xl object-cover border-4 border-white shadow-lg" alt={selectedStudent.name} />
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${getStatusColor(selectedStudent.performance)}`}>
                    {selectedStudent.performance}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-full">
                    Stage {selectedStudent.journeyStage + 1}/6
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedStudent.dept} Department | Engineering Trainee</p>
                
                <div className="flex flex-wrap gap-4 pt-3 text-slate-400 text-xs font-medium">
                  <span className="flex items-center gap-1"><Mail className="h-4 w-4 text-slate-400" /> {selectedStudent.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-4 w-4 text-slate-400" /> {selectedStudent.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Journey tracker */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Student Journey Path</h4>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2 relative">
              <div className="absolute h-0.5 bg-slate-200 left-6 right-6 top-3 hidden md:block -z-10" />
              <div
                className="absolute h-0.5 bg-indigo-600 left-6 top-3 hidden md:block -z-10 transition-all duration-300"
                style={{ width: `${(selectedStudent.journeyStage / (journeyStagesList.length - 1)) * 90}%` }}
              />

              {journeyStagesList.map((stage, idx) => (
                <div
                  key={idx}
                  className="flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center flex-1 cursor-pointer"
                  onClick={() => {
                    setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, journeyStage: idx } : s));
                  }}
                >
                  <div className={`h-6.5 w-6.5 rounded-full border-2 font-bold text-[10px] flex items-center justify-center transition-all ${
                    selectedStudent.journeyStage === idx ? 'bg-indigo-600 text-white border-indigo-600 glow-primary scale-110' :
                    selectedStudent.journeyStage > idx ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {selectedStudent.journeyStage > idx ? <Check className="h-3 w-3" /> : (idx + 1)}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider block ${selectedStudent.journeyStage === idx ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline and Marks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attendance Log */}
            <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Attendance Timeline</h4>
              <div className="space-y-3">
                {Object.keys(attendance[selectedStudent.id] || {}).slice(-4).reverse().map((dateStr) => {
                  const status = attendance[selectedStudent.id][dateStr];
                  return (
                    <div key={dateStr} className="p-3 bg-white/60 rounded-2xl border border-slate-100 flex items-center justify-between text-left">
                      <div>
                        <span className="text-[10px] font-bold text-slate-800">{dateStr}</span>
                        <span className="text-[8px] text-slate-450 block mt-0.5">Session check-in stamp</span>
                      </div>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        status === 'present' ? 'bg-emerald-50 text-emerald-600' :
                        status === 'absent' ? 'bg-rose-50 text-rose-600' :
                        status === 'excused' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assessment Scores */}
            <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Assessment Scores</h4>
              <div className="space-y-3 text-left">
                {Object.entries(selectedStudent.scores).map(([subject, value]) => (
                  <div key={subject} className="p-2.5 bg-white/60 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <span>{subject === 'mockInterview' ? 'Mock Interview' : subject}</span>
                      <span className="text-slate-800 font-extrabold">{value}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-grow bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            value >= 90 ? 'bg-indigo-500' : value >= 80 ? 'bg-emerald-500' : value >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700 w-8 text-right">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE PANEL: Skill Profiles */}
        <div className="space-y-6">
          
          {/* SVG Performance Chart */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Performance Growth</h4>
              <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Score Trend</span>
            </div>

            <div className="h-44 w-full">
              <svg className="h-full w-full" viewBox="0 0 200 100">
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d={`M 10 90 
                      L 50 ${90 - (selectedStudent.growth[0] - 50) * 1} 
                      L 90 ${90 - (selectedStudent.growth[1] - 50) * 1} 
                      L 130 ${90 - (selectedStudent.growth[2] - 50) * 1} 
                      L 170 ${90 - (selectedStudent.growth[3] - 50) * 1}`}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d={`M 10 90 
                      L 50 ${90 - (selectedStudent.growth[0] - 50) * 1} 
                      L 90 ${90 - (selectedStudent.growth[1] - 50) * 1} 
                      L 130 ${90 - (selectedStudent.growth[2] - 50) * 1} 
                      L 170 ${90 - (selectedStudent.growth[3] - 50) * 1}
                      L 170 90 Z`}
                  fill="url(#growthGrad)"
                />

                {[
                  { x: 50, y: 90 - (selectedStudent.growth[0] - 50) * 1 },
                  { x: 90, y: 90 - (selectedStudent.growth[1] - 50) * 1 },
                  { x: 130, y: 90 - (selectedStudent.growth[2] - 50) * 1 },
                  { x: 170, y: 90 - (selectedStudent.growth[3] - 50) * 1 }
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.5" />
                ))}

                <line x1="10" y1="90" x2="190" y2="90" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="3,3" />
                <text x="10" y="98" fill="#94a3b8" fontSize="6" fontWeight="bold">Start</text>
                <text x="170" y="98" fill="#94a3b8" fontSize="6" fontWeight="bold">Current</text>
              </svg>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Training Recommendations</h4>
            <div className="space-y-3">
              {selectedStudent.recommendations.map((rec, i) => (
                <div key={i} className="p-3 bg-white/60 rounded-2xl border border-slate-100 flex gap-2.5 items-start text-left">
                  <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-semibold text-slate-700 leading-normal">{rec}</span>
                </div>
              ))}

              <div className="relative pt-2">
                <input
                  type="text"
                  placeholder="Add professional note..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const note = e.target.value;
                      setStudents(prev => prev.map(s => {
                        if (s.id === selectedStudent.id) {
                          return {
                            ...s,
                            recommendations: [...s.recommendations, note]
                          };
                        }
                        return s;
                      }));
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[10px] focus:outline-indigo-650 bg-white"
                />
                <span className="absolute right-2.5 top-4.5 text-[8px] text-slate-400">Press ↵</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
