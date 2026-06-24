import React from 'react';
import { Printer } from 'lucide-react';

export default function ReportsView({
  reportMetrics,
  setReportMetrics,
  reportDeptFilter,
  setReportDeptFilter,
  reportPerformanceFilter,
  setReportPerformanceFilter,
  reportExportSuccess,
  setReportExportSuccess,
  students,
  journeyStagesList
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & Exports</h2>
        <p className="text-xs text-slate-500 mt-1">Configure criteria limits, customize parameters, and view a live printable summary sheet.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Configuration Controls */}
        <div className="xl:col-span-1 glass-panel rounded-3xl p-5 border border-slate-200/40 space-y-6 text-left">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configure Columns</h4>
          
          <div className="space-y-2.5">
            {Object.entries(reportMetrics).map(([key, val]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={val}
                  onChange={() => setReportMetrics(prev => ({ ...prev, [key]: !prev[key] }))}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300"
                />
                <span className="capitalize">{key === 'dept' ? 'Department' : key}</span>
              </label>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Filter by Department</label>
              <select
                value={reportDeptFilter}
                onChange={(e) => setReportDeptFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              >
                <option>All</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>IT</option>
                <option>MECH</option>
                <option>EEE</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Filter by Status</label>
              <select
                value={reportPerformanceFilter}
                onChange={(e) => setReportPerformanceFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              >
                <option>All</option>
                <option>Elite</option>
                <option>Placement Ready</option>
                <option>Progressing</option>
                <option>At Risk</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setReportExportSuccess(true);
                setTimeout(() => setReportExportSuccess(false), 3000);
                window.print();
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10"
            >
              <Printer className="h-4 w-4" /> Print / Export PDF
            </button>
            {reportExportSuccess && (
              <span className="text-[10px] text-emerald-600 font-bold block text-center animate-fade-in">✓ Exporting summary view sheets...</span>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="xl:col-span-2 glass-panel rounded-3xl p-5 border border-slate-200/40 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Document Preview</h4>
            <span className="text-[10px] text-slate-400 font-bold">June 2026 Summary</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm overflow-x-auto min-h-[300px]">
            <div className="text-center pb-6 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Placement Training Management System</h3>
              <p className="text-[10px] text-slate-400 mt-1">Official Student Performance Report Card Log</p>
            </div>

            <table className="w-full mt-4 text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  {reportMetrics.name && <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</th>}
                  {reportMetrics.dept && <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dept</th>}
                  {reportMetrics.performance && <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>}
                  {reportMetrics.attendance && <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attd%</th>}
                  {reportMetrics.scores && <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average</th>}
                  {reportMetrics.journey && <th className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Journey Node</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students
                  .filter(s => reportDeptFilter === 'All' || s.dept === reportDeptFilter)
                  .filter(s => reportPerformanceFilter === 'All' || s.performance === reportPerformanceFilter)
                  .map((s) => {
                    const avg = Math.round(Object.values(s.scores).reduce((a,b)=>a+b,0)/5);
                    return (
                      <tr key={s.id} className="text-xs text-slate-700">
                        {reportMetrics.name && <td className="py-2.5 font-bold">{s.name}</td>}
                        {reportMetrics.dept && <td className="py-2.5">{s.dept}</td>}
                        {reportMetrics.performance && (
                          <td className="py-2.5">
                            <span className="font-semibold">{s.performance}</span>
                          </td>
                        )}
                        {reportMetrics.attendance && <td className="py-2.5">{s.attendance}%</td>}
                        {reportMetrics.scores && <td className="py-2.5">{avg}%</td>}
                        {reportMetrics.journey && <td className="py-2.5 font-semibold text-[10px] text-indigo-650">{journeyStagesList[s.journeyStage]}</td>}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
