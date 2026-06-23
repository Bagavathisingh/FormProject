import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Bell, User, CheckCircle2, AlertTriangle, Info,
  ChevronRight, BarChart3, Users, Calendar, Award, FileText,
  Compass, LogOut, ArrowRight, Check, X, ShieldAlert, Sparkles,
  TrendingUp, RefreshCw, Mail, Phone, Edit3, Trash2, Printer, Download, Save,
  ExternalLink, ArrowLeftRight, CheckSquare, ListTodo, GraduationCap,
  CalendarCheck2
} from 'lucide-react';

import {
  initialBatches,
  initialInsights,
  initialStudents,
  journeyStagesList,
  attendanceLogs
} from './mockData';

export default function App() {
  // --- Persistent State ---
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('pts_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [batches, setBatches] = useState(() => {
    const saved = localStorage.getItem('pts_batches');
    return saved ? JSON.parse(saved) : initialBatches;
  });

  const [insights, setInsights] = useState(() => {
    const saved = localStorage.getItem('pts_insights');
    return saved ? JSON.parse(saved) : initialInsights;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('pts_attendance');
    return saved ? JSON.parse(saved) : attendanceLogs;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pts_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('pts_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('pts_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('pts_insights', JSON.stringify(insights));
  }, [insights]);

  useEffect(() => {
    localStorage.setItem('pts_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pts_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pts_user');
    }
  }, [user]);

  // --- UI Routing State ---
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, students, profile, attendance, marks, analytics, reports
  const [selectedStudentId, setSelectedStudentId] = useState(1);
  
  // --- Search States ---
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState('');
  const [marksSearchQuery, setMarksSearchQuery] = useState('');
  
  // --- Dropdown States ---
  const [showQuickAddDropdown, setShowQuickAddDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, text: 'Rahul Malhotra attendance alert: 74%', unread: true },
    { id: 2, text: 'Batch Gamma aptitude scores uploaded', unread: true },
    { id: 3, text: 'TCS Placement registration deadline tomorrow', unread: false }
  ]);

  // --- Dialog/Modal States ---
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    name: '', dept: 'CSE', performance: 'Progressing', attendance: 85,
    email: '', phone: '', journeyStage: 1,
    scores: { aptitude: 70, coding: 70, technical: 70, communication: 70, mockInterview: 70 }
  });

  const [showAttendanceToggleModal, setShowAttendanceToggleModal] = useState(false);
  const [attendanceSelectedStudentId, setAttendanceSelectedStudentId] = useState(null);
  const [activePopover, setActivePopover] = useState(null); // { studentId, dateString }

  // --- Session-centric daily attendance states ---
  const [sessionDate, setSessionDate] = useState('2026-06-23');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [attendanceDraft, setAttendanceDraft] = useState({});
  const [attendancePage, setAttendancePage] = useState(1);

  useEffect(() => {
    const draft = {};
    students.forEach(s => {
      const savedStatus = (attendance[s.id] || {})[sessionDate];
      draft[s.id] = savedStatus;
    });
    setAttendanceDraft(draft);
  }, [sessionDate, attendance, students]);

  useEffect(() => {
    setAttendancePage(1);
  }, [sessionDate, selectedBatch, attendanceSearchQuery]);

  const [showMarksEntryModal, setShowMarksEntryModal] = useState(false);
  const [marksStudentId, setMarksStudentId] = useState(1);
  const [marksForm, setMarksForm] = useState({ aptitude: 75, coding: 75, technical: 75, communication: 75, mockInterview: 75 });

  // --- Auth Pages States ---
  const [authMode, setAuthMode] = useState('login');
  const [loginEmail, setLoginEmail] = useState('staff@university.edu');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  
  // Onboarding Signup steps
  const [signupStep, setSignupStep] = useState(1);
  const [signupForm, setSignupForm] = useState({
    fullName: '', department: 'Computer Science', phone: '',
    email: '', password: '', role: 'Placement Staff'
  });

  // --- Command Center Attendance Checklist ---
  const [todayAttendanceChecklist, setTodayAttendanceChecklist] = useState([
    { id: 1, name: 'Batch Alpha (Coding Practicum)', done: false },
    { id: 2, name: 'Batch Beta (Mock HR Prep)', done: true },
    { id: 3, name: 'Batch Gamma (Aptitude Remedial)', done: false }
  ]);

  // --- Report Builder States ---
  const [reportMetrics, setReportMetrics] = useState({
    name: true, dept: true, performance: true, attendance: true,
    scores: true, journey: true
  });
  const [reportDeptFilter, setReportDeptFilter] = useState('All');
  const [reportPerformanceFilter, setReportPerformanceFilter] = useState('All');
  const [reportExportSuccess, setReportExportSuccess] = useState(false);

  // --- Helper Getters ---
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({
      email: loginEmail,
      name: loginEmail === 'staff@university.edu' ? 'Dr. Sarah D\'Souza' : loginEmail.split('@')[0],
      role: 'Placement Committee Staff'
    });
    setCurrentView('dashboard');
  };

  const handleSignupNext = () => {
    if (signupStep < 3) setSignupStep(prev => prev + 1);
  };

  const handleSignupComplete = () => {
    setUser({
      email: signupForm.email || 'newuser@university.edu',
      name: signupForm.fullName || 'Staff User',
      role: signupForm.role
    });
    setSignupStep(1);
    setAuthMode('login');
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfileDropdown(false);
    setAuthMode('login');
  };

  // --- Mutators ---
  const addNewStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      ...newStudentData,
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
      image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=120&h=120`,
      growth: [65, 70, 72, newStudentData.attendance, 75],
      recommendations: [
        'Complete baseline diagnostic assessment.',
        'Review standard platform guidelines.'
      ]
    };
    setStudents(prev => [...prev, newStudent]);
    setShowAddStudentModal(false);
    
    const newInsight = {
      id: `feed-${Date.now()}`,
      type: 'info',
      title: 'New Student Registered',
      message: `${newStudent.name} (${newStudent.dept}) has been registered in the student database.`,
      time: 'Just now'
    };
    setInsights(prev => [newInsight, ...prev]);
    
    setNewStudentData({
      name: '', dept: 'CSE', performance: 'Progressing', attendance: 85,
      email: '', phone: '', journeyStage: 1,
      scores: { aptitude: 70, coding: 70, technical: 70, communication: 70, mockInterview: 70 }
    });
  };

  const updateMarks = (e) => {
    e.preventDefault();
    setStudents(prev => prev.map(s => {
      if (s.id === Number(marksStudentId)) {
        const avg = Object.values(marksForm).reduce((a, b) => Number(a) + Number(b), 0) / 5;
        let performance = 'Progressing';
        if (avg >= 90) performance = 'Elite';
        else if (avg >= 80) performance = 'Placement Ready';
        else if (avg < 70) performance = 'At Risk';

        return {
          ...s,
          scores: { ...marksForm },
          performance
        };
      }
      return s;
    }));
    setShowMarksEntryModal(false);
    const updatedStudent = students.find(s => s.id === Number(marksStudentId));
    const newInsight = {
      id: `feed-${Date.now()}`,
      type: 'success',
      title: 'Scores Updated',
      message: `Recorded test assessment grades for ${updatedStudent?.name}.`,
      time: 'Just now'
    };
    setInsights(prev => [newInsight, ...prev]);
  };

  const moveStudentMarkCategory = (studentId, direction) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const statuses = ['At Risk', 'Progressing', 'Placement Ready', 'Elite'];
        const curIdx = statuses.indexOf(s.performance);
        let newIdx = curIdx + direction;
        if (newIdx >= 0 && newIdx < statuses.length) {
          const newPerformance = statuses[newIdx];
          let multiplier = 1;
          if (newPerformance === 'Elite') multiplier = 1.15;
          if (newPerformance === 'Placement Ready') multiplier = 1.05;
          if (newPerformance === 'Progressing') multiplier = 0.95;
          if (newPerformance === 'At Risk') multiplier = 0.8;

          const updatedScores = {
            aptitude: Math.min(100, Math.round(s.scores.aptitude * multiplier)),
            coding: Math.min(100, Math.round(s.scores.coding * multiplier)),
            technical: Math.min(100, Math.round(s.scores.technical * multiplier)),
            communication: Math.min(100, Math.round(s.scores.communication * multiplier)),
            mockInterview: Math.min(100, Math.round(s.scores.mockInterview * multiplier))
          };

          return { ...s, performance: newPerformance, scores: updatedScores };
        }
      }
      return s;
    }));
  };

  const isFutureDate = (dateString) => {
    const today = new Date('2026-06-23T06:36:23+05:30');
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const target = new Date(dateString);
    const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    return targetMidnight > todayMidnight;
  };

  const isAttendanceLocked = (dateString) => {
    const today = new Date('2026-06-23T06:36:23+05:30');
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const target = new Date(dateString);
    const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const diffTime = todayMidnight - targetMidnight;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    // Locked if not the current day (diffDays !== 0)
    return diffDays !== 0;
  };

  const updateAttendanceStatus = (studentId, dateString, newStatus) => {
    if (isFutureDate(dateString)) {
      alert("You cannot log attendance for future dates.");
      return;
    }
    if (isAttendanceLocked(dateString)) {
      alert("Attendance records can only be entered or modified for the current day.");
      return;
    }
    setAttendance(prev => {
      const studentLogs = { ...(prev[studentId] || {}) };
      
      if (newStatus === undefined) {
        delete studentLogs[dateString];
      } else {
        studentLogs[dateString] = newStatus;
      }

      const nextAttendanceObj = {
        ...prev,
        [studentId]: studentLogs
      };

      const dates = Object.values(nextAttendanceObj[studentId]);
      const presents = dates.filter(d => d === 'present').length;
      const excused = dates.filter(d => d === 'excused').length;
      const waiting = dates.filter(d => d === 'waiting').length;
      const total = dates.length;
      const newPercentage = total > 0 ? Math.round(((presents + (excused + waiting) * 0.5) / total) * 100) : 100;

      setStudents(prevStudents => prevStudents.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            attendance: newPercentage,
            performance: newPercentage < 75 ? 'At Risk' : s.performance
          };
        }
        return s;
      }));

      return nextAttendanceObj;
    });
  };

  // --- Local Filtering Logics ---
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.dept.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.performance.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  const filteredAttendanceStudents = students.filter(s =>
    s.name.toLowerCase().includes(attendanceSearchQuery.toLowerCase()) ||
    s.dept.toLowerCase().includes(attendanceSearchQuery.toLowerCase())
  );

  // --- Roster Filtering for Session Attendance ---
  const filteredRoster = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(attendanceSearchQuery.toLowerCase()) || 
                          s.dept.toLowerCase().includes(attendanceSearchQuery.toLowerCase());
    if (selectedBatch === 'All') return matchesSearch;
    const batch = batches.find(b => b.id === selectedBatch);
    if (!batch) return matchesSearch;
    if (batch.id === 'batch-alpha') {
      return matchesSearch && (s.dept === 'CSE' || s.dept === 'IT');
    }
    if (batch.id === 'batch-beta') {
      return matchesSearch && (s.dept === 'ECE' || s.dept === 'EEE');
    }
    if (batch.id === 'batch-gamma') {
      return matchesSearch && (s.dept === 'MECH' || s.dept === 'CIVIL');
    }
    return matchesSearch;
  });

  const rosterTotalCount = filteredRoster.length;
  const rosterMarkedCount = filteredRoster.filter(s => attendanceDraft[s.id] !== undefined).length;
  const rosterComplianceRate = rosterTotalCount > 0 ? Math.round((filteredRoster.filter(s => attendanceDraft[s.id] === 'present' || attendanceDraft[s.id] === 'excused' || attendanceDraft[s.id] === 'waiting').length / rosterTotalCount) * 100) : 0;

  const handleDraftChange = (studentId, status) => {
    if (isAttendanceLocked(sessionDate)) {
      alert("Attendance records can only be entered or modified for the current day.");
      return;
    }
    setAttendanceDraft(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllPresent = () => {
    if (isAttendanceLocked(sessionDate)) {
      alert("Attendance records can only be entered or modified for the current day.");
      return;
    }
    const nextDraft = { ...attendanceDraft };
    filteredRoster.forEach(s => {
      nextDraft[s.id] = 'present';
    });
    setAttendanceDraft(nextDraft);
  };

  const saveAttendanceRoster = () => {
    if (isAttendanceLocked(sessionDate)) {
      alert("Attendance records can only be entered or modified for the current day.");
      return;
    }
    setAttendance(prev => {
      const nextAttendance = { ...prev };
      students.forEach(s => {
        const status = attendanceDraft[s.id];
        const studentLogs = { ...(nextAttendance[s.id] || {}) };
        if (status === undefined) {
          delete studentLogs[sessionDate];
        } else {
          studentLogs[sessionDate] = status;
        }
        nextAttendance[s.id] = studentLogs;
      });

      // Recalculate attendance percentages
      setStudents(prevStudents => prevStudents.map(s => {
        const dates = Object.values(nextAttendance[s.id] || {});
        const presents = dates.filter(d => d === 'present').length;
        const excused = dates.filter(d => d === 'excused').length;
        const waiting = dates.filter(d => d === 'waiting').length;
        const total = dates.length;
        const newPercentage = total > 0 ? Math.round(((presents + (excused + waiting) * 0.5) / total) * 100) : 100;
        return {
          ...s,
          attendance: newPercentage,
          performance: newPercentage < 75 ? 'At Risk' : s.performance
        };
      }));

      return nextAttendance;
    });
    alert(`Attendance records for ${sessionDate} saved successfully!`);
  };

  const discardAttendanceChanges = () => {
    const draft = {};
    students.forEach(s => {
      const savedStatus = (attendance[s.id] || {})[sessionDate];
      draft[s.id] = savedStatus;
    });
    setAttendanceDraft(draft);
    alert("Changes discarded.");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Elite': return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'Placement Ready': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Progressing': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'At Risk': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-animated-mesh flex items-center justify-center p-4">
        {authMode === 'login' ? (
          <div className="w-full max-w-[390px] rounded-3xl backdrop-blur-xl bg-white/70 border border-white/60 p-8 shadow-2xl shadow-slate-200/40 animate-fade-in text-center relative overflow-hidden">
            {/* Absolute Decorative Blurs */}
            <div className="absolute -top-12 -left-12 h-32 w-32 bg-indigo-200/25 rounded-full filter blur-xl -z-10 animate-pulse-slow" />
            <div className="absolute -bottom-12 -right-12 h-32 w-32 bg-violet-200/20 rounded-full filter blur-xl -z-10 animate-pulse-slow" />

            {/* Minimal Logo tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/60 border border-indigo-100/50 text-[8px] font-extrabold uppercase tracking-widest text-indigo-600 mb-5 select-none">
              ✨ Coordinator Hub
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">Welcome Back</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Access your placement training workspace</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder=" "
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-xs text-slate-800 focus:pt-5 focus:pb-1 peer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-550/10 transition-all duration-200"
                />
                <label 
                  htmlFor="login-email" 
                  className="absolute left-4 top-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:text-[9px] peer-focus:text-indigo-600 peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                >
                  Staff Email Address
                </label>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder=" "
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-xs text-slate-800 focus:pt-5 focus:pb-1 peer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-550/10 transition-all duration-200"
                />
                <label 
                  htmlFor="login-password" 
                  className="absolute left-4 top-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:text-[9px] peer-focus:text-indigo-600 peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                >
                  Workspace Password
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/10 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 mt-3.5 cursor-pointer"
              >
                Enter Workspace Panel <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="mt-8 pt-4 border-t border-slate-100/70 text-center text-xs text-slate-500">
              New workspace coordinator?{' '}
              <button
                onClick={() => { setAuthMode('signup'); setSignupStep(1); }}
                className="text-indigo-600 hover:text-indigo-800 font-bold underline decoration-indigo-200 hover:decoration-indigo-600 decoration-2 underline-offset-2 transition cursor-pointer"
              >
                Create Hub Account
              </button>
            </div>
          </div>
        ) : (
          /* Multi-step Onboarding Signup */
          <div className="w-full max-w-2xl bg-white/70 rounded-3xl glass-panel shadow-2xl p-8 md:p-12 animate-fade-in">
            {/* Progress indicators */}
            <div className="flex items-center justify-between mb-8 max-w-md mx-auto relative">
              <div className="absolute h-0.5 bg-slate-200 left-4 right-4 top-4 -z-10" />
              <div className="absolute h-0.5 bg-indigo-600 left-4 top-4 -z-10 transition-all duration-300" style={{ width: `${(signupStep - 1) * 50}%` }} />
              
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center gap-1.5">
                  <div className={`h-8 w-8 rounded-full border-2 font-bold text-xs flex items-center justify-center transition-all ${
                    signupStep === step ? 'bg-indigo-600 text-white border-indigo-600 glow-primary scale-110' :
                    signupStep > step ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {signupStep > step ? <Check className="h-4 w-4" /> : step}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${signupStep === step ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {step === 1 ? 'Personal' : step === 2 ? 'Account' : 'Success'}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Personal Info */}
            {signupStep === 1 && (
              <div className="space-y-4 max-w-md mx-auto animate-fade-in">
                <h3 className="text-xl font-bold text-slate-900 text-center">Placement Staff Onboarding</h3>
                <p className="text-xs text-slate-500 text-center mb-6">Enter your professional workspace details.</p>

                <div className="relative">
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    placeholder=" "
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-sm text-slate-800 focus:pt-5 focus:pb-1 peer"
                  />
                  <label htmlFor="signup-name" className="absolute left-4 top-3.5 text-xs text-slate-400 pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px]">Full Name</label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Department</label>
                    <select
                      value={signupForm.department}
                      onChange={(e) => setSignupForm({ ...signupForm, department: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm text-slate-800 focus:outline-indigo-600"
                    >
                      <option>Computer Science</option>
                      <option>Electronics Eng</option>
                      <option>Mechanical Eng</option>
                      <option>Information Tech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Role</label>
                    <select
                      value={signupForm.role}
                      onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm text-slate-800 focus:outline-indigo-600"
                    >
                      <option>Placement Staff</option>
                      <option>Corporate Relations</option>
                      <option>Training Officer</option>
                      <option>Department Coordinator</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <input
                    id="signup-phone"
                    type="text"
                    required
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    placeholder=" "
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-sm text-slate-800 focus:pt-5 focus:pb-1 peer"
                  />
                  <label htmlFor="signup-phone" className="absolute left-4 top-3.5 text-xs text-slate-400 pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px]">Phone Number</label>
                </div>

                <button
                  type="button"
                  onClick={handleSignupNext}
                  disabled={!signupForm.fullName || !signupForm.phone}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 mt-4"
                >
                  Continue to Credentials <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Step 2: Account Security */}
            {signupStep === 2 && (
              <div className="space-y-4 max-w-md mx-auto animate-fade-in">
                <h3 className="text-xl font-bold text-slate-900 text-center">Secure your account</h3>
                <p className="text-xs text-slate-500 text-center mb-6">Choose email and password for authorization.</p>

                <div className="relative">
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder=" "
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-sm text-slate-800 focus:pt-5 focus:pb-1 peer"
                  />
                  <label htmlFor="signup-email" className="absolute left-4 top-3.5 text-xs text-slate-400 pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px]">Email Address</label>
                </div>

                <div className="relative">
                  <input
                    id="signup-pass"
                    type="password"
                    required
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder=" "
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-sm text-slate-800 focus:pt-5 focus:pb-1 peer"
                  />
                  <label htmlFor="signup-pass" className="absolute left-4 top-3.5 text-xs text-slate-400 pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px]">Security Password</label>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-indigo-800 leading-normal">
                    Password must contain at least 8 characters, one number, and special character symbols.
                  </p>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold py-3 px-4 rounded-xl transition"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSignupNext}
                    disabled={!signupForm.email || !signupForm.password}
                    className="w-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    Validate Signup <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {signupStep === 3 && (
              <div className="text-center max-w-sm mx-auto animate-fade-in space-y-6">
                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto glow-success border border-emerald-100 animate-float">
                  <CheckSquare className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Onboarding Completed!</h3>
                  <p className="text-xs text-slate-500 mt-2">
                    Your institutional staff profile is verified. You have been registered as <strong>{signupForm.fullName} ({signupForm.role})</strong> in the system workspace.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500"><span className="font-medium">Department:</span> <span>{signupForm.department}</span></div>
                  <div className="flex justify-between text-xs text-slate-500"><span className="font-medium">Staff Role:</span> <span>{signupForm.role}</span></div>
                  <div className="flex justify-between text-xs text-slate-500"><span className="font-medium">Database Node:</span> <span>Node-3 (Primary)</span></div>
                </div>

                <button
                  type="button"
                  onClick={handleSignupComplete}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                >
                  Enter Command Center <Sparkles className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="mt-8 text-center text-xs text-slate-500">
              Already have credentials?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-2 underline-offset-2"
              >
                Log In Here
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col font-sans">
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="h-16 px-6 glass-panel border-b border-slate-200/50 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/20 text-lg">⏃</div>
            <div>
              <span className="font-extrabold tracking-tight text-slate-900 block leading-none">PTS</span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mt-0.5">Staff Portal</span>
            </div>
          </div>

          {/* Nav Links: Simplified for Staff */}
          <div className="hidden lg:flex items-center gap-1.5 ml-4 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => { setCurrentView('dashboard'); setGlobalSearchQuery(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Overview
            </button>
            <button
              onClick={() => { setCurrentView('attendance'); setGlobalSearchQuery(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Attendance
            </button>
            <button
              onClick={() => { setCurrentView('marks'); setGlobalSearchQuery(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'marks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Assessments
            </button>
            <button
              onClick={() => { setCurrentView('analytics'); setGlobalSearchQuery(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Analytics
            </button>
            <button
              onClick={() => { setCurrentView('reports'); setGlobalSearchQuery(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Reports
            </button>
                        <button
              onClick={() => { setCurrentView('students'); setGlobalSearchQuery(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${currentView === 'students' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Students
            </button>
          </div>
        </div>

        {/* Global Search & Actions */}
        <div className="flex items-center gap-4">
          
          {/* Fixed Global Search (Does not forcefully switch pages, shows results menu) */}
          <div className="relative max-w-xs hidden sm:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search student..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-52 pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-transparent text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
            />
            {globalSearchQuery && (
              <button onClick={() => setGlobalSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-450 hover:text-slate-650 text-xs font-semibold">✕</button>
            )}

            {/* Global Search Floating Results Dropdown */}
            {globalSearchQuery && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 max-h-64 overflow-y-auto animate-fade-in">
                <div className="px-3.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Trainee Records</div>
                {students.filter(s => s.name.toLowerCase().includes(globalSearchQuery.toLowerCase())).length === 0 ? (
                  <div className="px-4 py-3 text-xs text-slate-400 text-center">No students found</div>
                ) : (
                  students
                    .filter(s => s.name.toLowerCase().includes(globalSearchQuery.toLowerCase()))
                    .map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          setCurrentView('profile');
                          setGlobalSearchQuery('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 transition"
                      >
                        <img src={s.image} className="h-6.5 w-6.5 rounded-lg object-cover" alt="" />
                        <div>
                          <div className="text-xs font-bold text-slate-800">{s.name}</div>
                          <div className="text-[9px] text-slate-400">{s.dept} • Status: {s.performance}</div>
                        </div>
                      </button>
                    ))
                )}
              </div>
            )}
          </div>

          {/* Quick Add Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowQuickAddDropdown(!showQuickAddDropdown);
                setShowNotifications(false);
                setShowProfileDropdown(false);
              }}
              className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition shadow-md shadow-indigo-600/10"
            >
              <Plus className="h-5 w-5" />
            </button>

            {showQuickAddDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Command</div>
                <button
                  onClick={() => { setShowAddStudentModal(true); setShowQuickAddDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-slate-400" /> Register Student
                </button>
                <button
                  onClick={() => { setShowMarksEntryModal(true); setShowQuickAddDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Award className="h-4 w-4 text-slate-400" /> Enter Marks
                </button>
                <button
                  onClick={() => { setCurrentView('attendance'); setShowQuickAddDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <CalendarCheck2 className="h-4 w-4 text-slate-400" /> View Attendance
                </button>
                <button
                  onClick={() => { setCurrentView('reports'); setShowQuickAddDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-slate-400" /> Generate Report
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowQuickAddDropdown(false);
                setShowProfileDropdown(false);
              }}
              className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center relative transition"
            >
              <Bell className="h-4 w-4" />
              {notificationsList.some(n => n.unread) && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-fade-in">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Workspace Alerts</span>
                  <button
                    onClick={() => setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })))}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto mt-2">
                  {notificationsList.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No active alerts.</div>
                  ) : (
                    notificationsList.map(n => (
                      <div key={n.id} className={`px-4 py-2.5 border-b border-slate-50 text-[11px] text-slate-600 flex items-start gap-2 hover:bg-slate-50 ${n.unread ? 'bg-indigo-50/30' : ''}`}>
                        <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-indigo-600' : 'bg-transparent'}`} />
                        <div>
                          <div>{n.text}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile - Fixed Hover Gap Bug with click toggler */}
          <div className="flex items-center gap-3.5 border-l border-slate-200 pl-4 relative">
            <div className="hidden md:block text-right select-none">
              <span className="text-xs font-bold text-slate-800 block leading-tight">{user.name}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{user.role}</span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifications(false);
                  setShowQuickAddDropdown(false);
                }}
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-semibold text-xs border transition ${
                  showProfileDropdown ? 'bg-indigo-650 text-indigo-600 border-indigo-200' : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border-transparent'
                }`}
              >
                <User className="h-4.5 w-4.5" />
              </button>

              {/* Toggle Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2.5 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-800">{user.name}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold mt-1"
                  >
                    <LogOut className="h-4 w-4" /> Terminate Session
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </nav>

      {/* MOBILE NAVIGATION OVERLAY (Sticky Bottom Navigation Bar) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 border-t border-slate-200/50 backdrop-blur-lg px-4 py-2 flex items-center justify-around gap-2 z-40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] pb-safe">
        <button onClick={() => { setCurrentView('dashboard'); setGlobalSearchQuery(''); }} className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'dashboard' ? 'text-indigo-600 font-bold' : ''}`}>
          <Compass className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Overview</span>
        </button>
        <button onClick={() => { setCurrentView('students'); setGlobalSearchQuery(''); }} className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'students' ? 'text-indigo-600 font-bold' : ''}`}>
          <Users className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Students</span>
        </button>
        <button onClick={() => { setCurrentView('attendance'); setGlobalSearchQuery(''); }} className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'attendance' ? 'text-indigo-600 font-bold' : ''}`}>
          <Calendar className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Attendance</span>
        </button>
        <button onClick={() => { setCurrentView('marks'); setGlobalSearchQuery(''); }} className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'marks' ? 'text-indigo-600 font-bold' : ''}`}>
          <Award className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Assessments</span>
        </button>
        <button onClick={() => { setCurrentView('analytics'); setGlobalSearchQuery(''); }} className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'analytics' ? 'text-indigo-600 font-bold' : ''}`}>
          <BarChart3 className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Analytics</span>
        </button>
        <button onClick={() => { setCurrentView('reports'); setGlobalSearchQuery(''); }} className={`flex flex-col items-center p-1 rounded-lg text-slate-500 ${currentView === 'reports' ? 'text-indigo-600 font-bold' : ''}`}>
          <FileText className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Reports</span>
        </button>
      </div>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-4 sm:p-6 pb-24 sm:pb-6 max-w-7xl w-full mx-auto animate-fade-in">
        
        {/* ==================== VIEW 1: OVERVIEW (DASHBOARD) ==================== */}
        {currentView === 'dashboard' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            {/* LEFT PANEL: Quick Actions Tiles */}
            <div className="xl:col-span-1 space-y-4">
              <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Workspace Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="p-4 rounded-2xl glass-card flex flex-col items-start gap-2.5 text-left border border-white hover:border-indigo-100"
                  >
                    <div className="h-9.5 w-9.5 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Users className="h-5 w-5" /></div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Register Student</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Add a new trainee to database</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentView('attendance')}
                    className="p-4 rounded-2xl glass-card flex flex-col items-start gap-2.5 text-left border border-white hover:border-indigo-100"
                  >
                    <div className="h-9.5 w-9.5 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center"><CalendarCheck2 className="h-5 w-5" /></div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Take Attendance</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Mark daily check-in log</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowMarksEntryModal(true)}
                    className="p-4 rounded-2xl glass-card flex flex-col items-start gap-2.5 text-left border border-white hover:border-indigo-100"
                  >
                    <div className="h-9.5 w-9.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Award className="h-5 w-5" /></div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Enter Assessment Marks</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Record test performance metrics</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentView('reports')}
                    className="p-4 rounded-2xl glass-card flex flex-col items-start gap-2.5 text-left border border-white hover:border-indigo-100"
                  >
                    <div className="h-9.5 w-9.5 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><FileText className="h-5 w-5" /></div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Generate Report</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Export custom data metrics</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* CENTER PANEL: Placement Command Center */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    Placement Command Center <Sparkles className="h-5 w-5 text-indigo-500" />
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Configure active schedules, tasks, and priority trainee markers.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-full font-bold">
                    Active Cohorts: {batches.length}
                  </span>
                </div>
              </div>

              {/* Interactive Cards */}
              <div className="grid grid-cols-1 gap-5">
                
                {/* 1. Active Training Batches */}
                <div className="glass-panel rounded-3xl p-5 border border-slate-200/40 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-slate-900 tracking-wide flex items-center gap-1.5">
                      <GraduationCap className="h-4.5 w-4.5 text-indigo-600" /> Active Training Batches
                    </span>
                    <span className="text-[10px] text-slate-400">Order by schedule priorities</span>
                  </div>

                  <div className="space-y-3">
                    {batches.map((batch) => (
                      <div
                        key={batch.id}
                        className="p-4 bg-white/60 hover:bg-white rounded-2xl border border-slate-100 flex items-center justify-between group transition cursor-grab"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition">
                            {batch.name.split(' ')[1].charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{batch.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{batch.focus}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-700 block">{batch.count} Trainees</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{batch.trainer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Today's Attendance Tasks */}
                <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-slate-900 tracking-wide flex items-center gap-1.5">
                      <ListTodo className="h-4.5 w-4.5 text-indigo-600" /> Today's Attendance Checklist
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                      {todayAttendanceChecklist.filter(c => c.done).length}/{todayAttendanceChecklist.length} Checked
                    </span>
                  </div>

                  <div className="space-y-2">
                    {todayAttendanceChecklist.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setTodayAttendanceChecklist(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
                        }}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          task.done ? 'bg-emerald-50/40 border-emerald-100 text-slate-500' : 'bg-white/60 border-slate-100 hover:bg-white text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-5.5 w-5.5 rounded-lg flex items-center justify-center border transition ${
                            task.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                          }`}>
                            {task.done && <Check className="h-3.5 w-3.5" />}
                          </div>
                          <span className="text-xs font-semibold">{task.name}</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          task.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {task.done ? 'Registered' : 'Action Required'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Students Requiring Immediate Attention */}
                <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-slate-900 tracking-wide flex items-center gap-1.5">
                      <ShieldAlert className="h-4.5 w-4.5 text-indigo-600 animate-pulse-slow" /> Students Requiring Attention
                    </span>
                    <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-bold">
                      {students.filter(s => s.attendance < 75 || s.performance === 'At Risk').length} Critical
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {students.filter(s => s.attendance < 75 || s.performance === 'At Risk').map((student) => (
                      <div
                        key={student.id}
                        className="p-3.5 bg-white/60 hover:bg-white rounded-2xl border border-slate-100 flex items-center justify-between group transition cursor-pointer"
                        onClick={() => {
                          setSelectedStudentId(student.id);
                          setCurrentView('profile');
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img src={student.image} className="h-9 w-9 rounded-xl object-cover" alt={student.name} />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition">{student.name}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">Avg: {Math.round(Object.values(student.scores).reduce((a,b)=>a+b,0)/5)}% | Attd: {student.attendance}%</span>
                          </div>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center transition">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT PANEL: Insights Activity Feed */}
            <div className="xl:col-span-1 space-y-4">
              <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">Insights Feed</h4>
                  <button
                    onClick={() => {
                      const refreshed = [...insights];
                      refreshed.unshift(refreshed.pop());
                      setInsights(refreshed);
                    }}
                    className="h-6 w-6 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center transition"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {insights.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white/60 rounded-2xl border border-slate-100 flex gap-3 text-left hover:bg-white transition"
                    >
                      <div className="mt-0.5">
                        {item.type === 'warning' ? <AlertTriangle className="h-4.5 w-4.5 text-rose-500" /> :
                         item.type === 'success' ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> :
                         <Info className="h-4.5 w-4.5 text-indigo-500" />}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-800 leading-tight">{item.title}</div>
                        <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">{item.message}</div>
                        <div className="text-[9px] text-slate-400 mt-1.5">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIEW 2: STUDENTS DIRECTORY GRID ==================== */}
        {currentView === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Directory</h2>
                <p className="text-xs text-slate-500 mt-1">Hover student cards to view quick actions and manage placement records.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                
                {/* Local search input for Student Grid */}
                <div className="relative flex-grow sm:flex-grow-0">
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
                    className="rounded-2xl bg-white/70 border border-slate-200/50 p-5 flex flex-col justify-between hover:shadow-md transition duration-200 text-left"
                  >
                    <div>
                      {/* Avatar Header */}
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

                      {/* Name Details */}
                      <h3
                        className="text-xs font-extrabold text-slate-800 mt-3.5 tracking-tight cursor-pointer hover:text-indigo-600 transition"
                        onClick={() => { setSelectedStudentId(student.id); setCurrentView('profile'); }}
                      >
                        {student.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{student.dept} Dept</span>
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
                        className="py-1.5 border border-slate-205 hover:bg-slate-50 text-slate-600 rounded-lg text-[9px] font-semibold transition"
                        title="Record Assessment Scores"
                      >
                        Grades
                      </button>
                      <button
                        onClick={() => {
                          setAttendanceSelectedStudentId(student.id);
                          setShowAttendanceToggleModal(true);
                        }}
                        className="py-1.5 border border-slate-205 hover:bg-slate-50 text-slate-600 rounded-lg text-[9px] font-semibold transition"
                        title="Log Attendance"
                      >
                        Attd
                      </button>
                    </div>

                    {/* Remove Action Button */}
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
        )}
        {/* ==================== VIEW 3: STUDENT PROFILE ==================== */}
        {currentView === 'profile' && selectedStudent && (
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
                          <div key={dateStr} className="p-3 bg-white/60 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700">{dateStr}</span>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              status === 'present' ? 'bg-emerald-50 text-emerald-600' :
                              status === 'absent' ? 'bg-rose-50 text-rose-600' :
                              status === 'excused' ? 'bg-amber-50 text-amber-600' :
                              status === 'waiting' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'
                            }`}>
                              {status}
                            </span>
                          </div>
                        );
                      })}
                      {Object.keys(attendance[selectedStudent.id] || {}).length === 0 && (
                        <div className="text-center py-6 text-xs text-slate-400">No attendance logs logged.</div>
                      )}
                    </div>
                  </div>

                  {/* Marks Assessment */}
                  <div className="glass-panel rounded-3xl p-5 border border-slate-200/40">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Marks Timeline</h4>
                    <div className="space-y-2.5">
                      {Object.entries(selectedStudent.scores).map(([category, value]) => (
                        <div key={category} className="flex items-center justify-between text-xs">
                          <span className="capitalize font-semibold text-slate-505 tracking-tight">{category.replace(/([A-Z])/g, ' $1')}</span>
                          <div className="flex items-center gap-3.5">
                            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
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
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[10px] focus:outline-indigo-600 bg-white"
                      />
                      <span className="absolute right-2.5 top-4.5 text-[8px] text-slate-400">Press ↵</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

          {/* ==================== VIEW 4: ATTENDANCE MODULE ==================== */}
        {currentView === 'attendance' && (() => {
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
                            <button onClick={() => setAttendanceSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs">✕</button>
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
                      className="px-5 py-2.5 border border-slate-205 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-semibold transition cursor-pointer"
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
        })()}

        {/* ==================== VIEW 5: ASSESSMENTS MODULE ==================== */}
        {currentView === 'marks' && (
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

            {/* Assessment Categories Layout (Horizontal scroll on mobile, grid on desktop) */}
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
                                  className="h-5.5 px-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-semibold transition"
                                >
                                  ←
                                </button>
                                <button
                                  title="Promote status"
                                  onClick={() => moveStudentMarkCategory(student.id, 1)}
                                  className="h-5.5 px-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-semibold transition"
                                >
                                  →
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {columnStudents.length === 0 && (
                        <div className="text-center py-12 text-[10px] text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                          No students in column.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== VIEW 6: PERFORMANCE ANALYTICS ==================== */}
        {currentView === 'analytics' && (
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
        )}

        {/* ==================== VIEW 7: REPORT BUILDER ==================== */}
        {currentView === 'reports' && (
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
                              {reportMetrics.journey && <td className="py-2.5 font-semibold text-[10px] text-indigo-600">{journeyStagesList[s.journeyStage]}</td>}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* ==================== DIALOG MODALS ==================== */}

      {/* 1. Modal: Register Student */}
      {showAddStudentModal && (
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
      )}

      {/* 2. Modal: Enter Assessment Marks */}
      {showMarksEntryModal && (
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
                    setMarksStudentId(e.target.value);
                    const stu = students.find(s => s.id === Number(e.target.value));
                    if (stu) setMarksForm({ ...stu.scores });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
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
                      className="w-full"
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
      )}

      {/* 3. Modal: Edit Attendance Logs */}
      {showAttendanceToggleModal && attendanceSelectedStudentId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Quick Attendance Check</h3>
              <button onClick={() => setShowAttendanceToggleModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-500 text-left">Configure attendance days log for <strong>{students.find(s=>s.id===attendanceSelectedStudentId)?.name}</strong>:</p>

            <div className="grid grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-2.5 border border-slate-100 rounded-2xl bg-slate-50/50">
              {Array.from({ length: 15 }).map((_, idx) => {
                const day = idx + 10;
                const dateStr = `2026-06-${day < 10 ? '0' + day : day}`;
                const status = (attendance[attendanceSelectedStudentId] || {})[dateStr];
                const locked = isAttendanceLocked(dateStr);
                
                return (
                  <div key={idx} className="bg-white p-2 rounded-xl border border-slate-100/80 shadow-sm flex flex-col justify-between">
                    <span className="text-[9px] text-slate-400 font-extrabold block mb-1">June {day} {locked && '🔒'}</span>
                    <select
                      value={status || ''}
                      disabled={locked}
                      onChange={(e) => {
                        const val = e.target.value === '' ? undefined : e.target.value;
                        updateAttendanceStatus(attendanceSelectedStudentId, dateStr, val);
                      }}
                      className={`w-full py-1 px-1.5 rounded-lg text-[9px] font-bold border transition-colors focus:outline-none cursor-pointer ${
                        status === 'present' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        status === 'absent' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        status === 'excused' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        status === 'waiting' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' :
                        'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      <option value="">Unmarked</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="excused">Excused</option>
                      <option value="waiting">Waiting</option>
                    </select>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowAttendanceToggleModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition shadow-md shadow-indigo-600/10"
            >
              Close and Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
