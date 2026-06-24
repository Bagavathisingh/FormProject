import React, { useState, useEffect } from 'react';
import { isAttendanceLocked } from './utils/attendanceHelper';
import {
  initialBatches,
  initialInsights,
  initialStudents,
  journeyStagesList,
  attendanceLogs
} from './mockData';

// Import extracted components
import Auth from './components/Auth';
import TopNavBar from './components/TopNavBar';
import MobileNavBar from './components/MobileNavBar';
import DashboardView from './components/DashboardView';
import StudentsDirectoryView from './components/StudentsDirectoryView';
import StudentProfileView from './components/StudentProfileView';
import AttendanceView from './components/AttendanceView';
import AssessmentsView from './components/AssessmentsView';
import AnalyticsView from './components/AnalyticsView';
import ReportsView from './components/ReportsView';
import RegisterStudentModal from './components/RegisterStudentModal';
import EnterMarksModal from './components/EnterMarksModal';
import QuickAttendanceModal from './components/QuickAttendanceModal';

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

  const updateAttendanceStatus = (studentId, dateString, newStatus) => {
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

      // Recalculate attendance percentages
      setStudents(prevStudents => prevStudents.map(s => {
        const dates = Object.values(nextAttendanceObj[s.id] || {});
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

      return nextAttendanceObj;
    });
  };

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

  if (!user) {
    return (
      <Auth
        authMode={authMode}
        setAuthMode={setAuthMode}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        signupStep={signupStep}
        setSignupStep={setSignupStep}
        signupForm={signupForm}
        setSignupForm={setSignupForm}
        handleLogin={handleLogin}
        handleSignupNext={handleSignupNext}
        handleSignupComplete={handleSignupComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col font-sans">
      <TopNavBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        globalSearchQuery={globalSearchQuery}
        setGlobalSearchQuery={setGlobalSearchQuery}
        showQuickAddDropdown={showQuickAddDropdown}
        setShowQuickAddDropdown={setShowQuickAddDropdown}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        notificationsList={notificationsList}
        setNotificationsList={setNotificationsList}
        user={user}
        handleLogout={handleLogout}
        students={students}
        setSelectedStudentId={setSelectedStudentId}
        setShowAddStudentModal={setShowAddStudentModal}
        setShowMarksEntryModal={setShowMarksEntryModal}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 p-4 sm:p-6 pb-24 sm:pb-6 max-w-7xl w-full mx-auto animate-fade-in">
        {currentView === 'dashboard' && (
          <DashboardView
            batches={batches}
            insights={insights}
            setInsights={setInsights}
            students={students}
            todayAttendanceChecklist={todayAttendanceChecklist}
            setTodayAttendanceChecklist={setTodayAttendanceChecklist}
            setCurrentView={setCurrentView}
            setSelectedStudentId={setSelectedStudentId}
            setShowAddStudentModal={setShowAddStudentModal}
            setShowMarksEntryModal={setShowMarksEntryModal}
          />
        )}

        {currentView === 'students' && (
          <StudentsDirectoryView
            students={students}
            setStudents={setStudents}
            studentSearchQuery={studentSearchQuery}
            setStudentSearchQuery={setStudentSearchQuery}
            setSelectedStudentId={setSelectedStudentId}
            setCurrentView={setCurrentView}
            setMarksStudentId={setMarksStudentId}
            setMarksForm={setMarksForm}
            setShowMarksEntryModal={setShowMarksEntryModal}
            setAttendanceSelectedStudentId={setAttendanceSelectedStudentId}
            setShowAttendanceToggleModal={setShowAttendanceToggleModal}
            setShowAddStudentModal={setShowAddStudentModal}
            getStatusColor={getStatusColor}
          />
        )}

        {currentView === 'profile' && selectedStudent && (
          <StudentProfileView
            selectedStudent={selectedStudent}
            setCurrentView={setCurrentView}
            setStudents={setStudents}
            attendance={attendance}
            getStatusColor={getStatusColor}
            journeyStagesList={journeyStagesList}
          />
        )}

        {currentView === 'attendance' && (
          <AttendanceView
            sessionDate={sessionDate}
            setSessionDate={setSessionDate}
            selectedBatch={selectedBatch}
            setSelectedBatch={setSelectedBatch}
            attendanceSearchQuery={attendanceSearchQuery}
            setAttendanceSearchQuery={setAttendanceSearchQuery}
            attendance={attendance}
            attendanceDraft={attendanceDraft}
            attendancePage={attendancePage}
            setAttendancePage={setAttendancePage}
            filteredRoster={filteredRoster}
            rosterTotalCount={rosterTotalCount}
            rosterMarkedCount={rosterMarkedCount}
            rosterComplianceRate={rosterComplianceRate}
            handleDraftChange={handleDraftChange}
            markAllPresent={markAllPresent}
            saveAttendanceRoster={saveAttendanceRoster}
            discardAttendanceChanges={discardAttendanceChanges}
            batches={batches}
            students={students}
          />
        )}

        {currentView === 'marks' && (
          <AssessmentsView
            students={students}
            marksSearchQuery={marksSearchQuery}
            setMarksSearchQuery={setMarksSearchQuery}
            setSelectedStudentId={setSelectedStudentId}
            setCurrentView={setCurrentView}
            setMarksStudentId={setMarksStudentId}
            setMarksForm={setMarksForm}
            setShowMarksEntryModal={setShowMarksEntryModal}
            moveStudentMarkCategory={moveStudentMarkCategory}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView students={students} />
        )}

        {currentView === 'reports' && (
          <ReportsView
            reportMetrics={reportMetrics}
            setReportMetrics={setReportMetrics}
            reportDeptFilter={reportDeptFilter}
            setReportDeptFilter={setReportDeptFilter}
            reportPerformanceFilter={reportPerformanceFilter}
            setReportPerformanceFilter={setReportPerformanceFilter}
            reportExportSuccess={reportExportSuccess}
            setReportExportSuccess={setReportExportSuccess}
            students={students}
            journeyStagesList={journeyStagesList}
          />
        )}
      </main>

      <MobileNavBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        setGlobalSearchQuery={setGlobalSearchQuery}
      />

      <RegisterStudentModal
        showAddStudentModal={showAddStudentModal}
        setShowAddStudentModal={setShowAddStudentModal}
        newStudentData={newStudentData}
        setNewStudentData={setNewStudentData}
        addNewStudent={addNewStudent}
      />

      <EnterMarksModal
        showMarksEntryModal={showMarksEntryModal}
        setShowMarksEntryModal={setShowMarksEntryModal}
        marksStudentId={marksStudentId}
        setMarksStudentId={setMarksStudentId}
        marksForm={marksForm}
        setMarksForm={setMarksForm}
        updateMarks={updateMarks}
        students={students}
      />

      <QuickAttendanceModal
        showAttendanceToggleModal={showAttendanceToggleModal}
        setShowAttendanceToggleModal={setShowAttendanceToggleModal}
        attendanceSelectedStudentId={attendanceSelectedStudentId}
        students={students}
        attendance={attendance}
        updateAttendanceStatus={updateAttendanceStatus}
      />
    </div>
  );
}
