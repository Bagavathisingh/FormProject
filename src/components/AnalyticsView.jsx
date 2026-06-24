import React from 'react';

export default function AnalyticsView({ students }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Performance Analytics</h2>
        <p className="text-xs text-slate-500 mt-1">Cross-cohort analytics, average skill mappings, and growth indicators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 border border-slate-200/40">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trainee Skill Map Index</h4>
              <span className="text-[10px] text-slate-500 mt-1 block">Aptitude, coding, communication, core theory, and interview benchmarks.</span>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">5 metrics</span>
          </div>

          <div className="flex items-center justify-center p-4">
            <div className="h-64 w-64 relative">
              <svg className="h-full w-full" viewBox="0 0 200 200">
                <defs>
                  <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {[20, 40, 60, 80, 100].map((radius, rIdx) => {
                  const points = Array.from({ length: 5 }).map((_, i) => {
                    const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
                    const x = 100 + radius * Math.cos(angle);
                    const y = 100 + radius * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={rIdx}
                      points={points}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="0.8"
                    />
                  );
                })}

                {Array.from({ length: 5 }).map((_, i) => {
                  const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
                  const x = 100 + 100 * Math.cos(angle);
                  const y = 100 + 100 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1="100"
                      y1="100"
                      x2={x}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="0.8"
                    />
                  );
                })}

                {(() => {
                  const totals = students.reduce((acc, s) => {
                    acc.aptitude += s.scores.aptitude;
                    acc.coding += s.scores.coding;
                    acc.technical += s.scores.technical;
                    acc.communication += s.scores.communication;
                    acc.mockInterview += s.scores.mockInterview;
                    return acc;
                  }, { aptitude: 0, coding: 0, technical: 0, communication: 0, mockInterview: 0 });

                  const count = students.length || 1;
                  const averages = [
                    totals.aptitude / count,
                    totals.coding / count,
                    totals.technical / count,
                    totals.communication / count,
                    totals.mockInterview / count
                  ];

                  const polyPoints = averages.map((val, i) => {
                    const radius = val;
                    const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
                    const x = 100 + radius * Math.cos(angle);
                    const y = 100 + radius * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polygon
                      points={polyPoints}
                      fill="url(#radarGlow)"
                      stroke="#4f46e5"
                      strokeWidth="2"
                    />
                  );
                })()}

                {['Aptitude', 'Coding', 'Technical', 'Comm', 'Mock HR'].map((label, i) => {
                  const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
                  const x = 100 + 115 * Math.cos(angle);
                  const y = 100 + 115 * Math.sin(angle);
                  return (
                    <text
                      key={label}
                      x={x}
                      y={y}
                      fill="#64748b"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {label}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-5 border border-slate-200/40 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cohort Distribution</h4>
          <div className="space-y-3 text-left">
            {['Elite', 'Placement Ready', 'Progressing', 'At Risk'].map((status) => {
              const count = students.filter(s => s.performance === status).length;
              const pct = Math.round((count / students.length) * 100) || 0;

              return (
                <div key={status} className="p-3.5 bg-white/60 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-slate-800">{status}</span>
                    <span className="text-slate-500 font-semibold">{count} students ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        status === 'Elite' ? 'bg-violet-500' :
                        status === 'Placement Ready' ? 'bg-emerald-500' :
                        status === 'Progressing' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Department Comparison */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Department-wise Metrics Index</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['CSE', 'IT', 'ECE'].map((dept) => {
            const deptStudents = students.filter(s => s.dept === dept);
            const count = deptStudents.length;
            const avgAttd = count > 0 ? Math.round(deptStudents.reduce((acc, s) => acc + s.attendance, 0) / count) : 0;
            const avgScore = count > 0 ? Math.round(deptStudents.reduce((acc, s) => {
              const avg = Object.values(s.scores).reduce((a,b)=>a+b,0)/5;
              return acc + avg;
            }, 0) / count) : 0;

            return (
              <div key={dept} className="p-4 bg-white/60 rounded-2xl border border-slate-100 space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800">{dept} Engineering</span>
                  <span className="text-[9px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{count} Trainees</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Average Attendance</span>
                    <span className="font-bold text-slate-700">{avgAttd}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Average Test Score</span>
                    <span className="font-bold text-slate-700">{avgScore}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
