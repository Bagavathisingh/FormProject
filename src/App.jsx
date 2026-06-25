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
import ReportsView from './components/ReportsView';
import RegisterStudentModal from './components/RegisterStudentModal';
import EnterMarksModal from './components/EnterMarksModal';
import QuickAttendanceModal from './components/QuickAttendanceModal';

export default function App() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [students, setStudentsState] = useState([]);
  const [batches, setBatches] = useState([]);
  const [insights, setInsights] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [notificationsList, setNotificationsList] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pts_user');
    return saved ? JSON.parse(saved) : null;
  });

  const fetchData = async () => {
    try {
      const [resStudents, resBatches, resInsights, resAttendance, resNotifications] = await Promise.all([
        fetch(`${API_BASE_URL}/api/students`),
        fetch(`${API_BASE_URL}/api/batches`),
        fetch(`${API_BASE_URL}/api/insights`),
        fetch(`${API_BASE_URL}/api/attendance/map`),
        fetch(`${API_BASE_URL}/api/notifications`)
      ]);

      if (resStudents.ok) {
        const data = await resStudents.json();
        const mappedStudents = data.map(s => ({
          ...s,
          batchId: s.batch_id,
          journeyStage: s.journey_stage
        }));
        setStudentsState(mappedStudents);
      }
      if (resBatches.ok) {
        const data = await resBatches.json();
        setBatches(data);
      }
      if (resInsights.ok) {
        const data = await resInsights.json();
        setInsights(data);
      }
      if (resAttendance.ok) {
        const data = await resAttendance.json();
        setAttendance(data);
      }
      if (resNotifications.ok) {
        const data = await resNotifications.json();
        setNotificationsList(data);
      }
    } catch (err) {
      console.error("Error fetching data from backend API:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pts_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pts_user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const setStudents = async (updater) => {
    let newStudents;
    if (typeof updater === 'function') {
      newStudents = updater(students);
    } else {
      newStudents = updater;
    }

    if (newStudents.length < students.length) {
      const deletedStudent = students.find(s => !newStudents.some(ns => ns.id === s.id));
      if (deletedStudent) {
        try {
          await fetch(`${API_BASE_URL}/api/students/${deletedStudent.id}`, { method: 'DELETE' });
        } catch (e) {
          console.error("Error deleting student:", e);
        }
      }
    }

    else if (newStudents.length === students.length) {
      for (let i = 0; i < students.length; i++) {
        const oldS = students[i];
        const newS = newStudents.find(ns => ns.id === oldS.id);
        if (newS) {
          if (newS.journeyStage !== oldS.journeyStage) {
            try {
              await fetch(`${API_BASE_URL}/api/students/${oldS.id}/journey`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ journey_stage: newS.journeyStage })
              });
            } catch (e) {
              console.error(e);
            }
          }
          if (JSON.stringify(newS.recommendations) !== JSON.stringify(oldS.recommendations)) {
            try {
              await fetch(`${API_BASE_URL}/api/students/${oldS.id}/recommendations`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recommendations: newS.recommendations })
              });
            } catch (e) {
              console.error(e);
            }
          }
          if (JSON.stringify(newS.scores) !== JSON.stringify(oldS.scores)) {
            try {
              await fetch(`${API_BASE_URL}/api/students/${oldS.id}/scores`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newS.scores)
              });
            } catch (e) {
              console.error(e);
            }
          }
          if (newS.performance !== oldS.performance) {
            try {
              await fetch(`${API_BASE_URL}/api/students/${oldS.id}/performance`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ performance: newS.performance })
              });
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    }
    await fetchData();
  };

  const setNotificationsListWrapper = async (updater) => {
    let newNotifs;
    if (typeof updater === 'function') {
      newNotifs = updater(notificationsList);
    } else {
      newNotifs = updater;
    }

    const allRead = !newNotifs.some(n => n.unread);
    const wasUnread = notificationsList.some(n => n.unread);
    if (allRead && wasUnread) {
      try {
        await fetch(`${API_BASE_URL}/api/notifications/read-all`, { method: 'PUT' });
      } catch (e) {
        console.error(e);
      }
    }
    setNotificationsList(newNotifs);
  };

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

  // --- Dialog/Modal States ---
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    name: '', dept: 'CSE', batchId: 'elite-batch-1', performance: 'Progressing', attendance: 85,
    email: '', phone: '', journeyStage: 1,
    scores: { aptitude: 70, coding: 70, technical: 70, communication: 70, mockInterview: 70 }
  });

  const [showAttendanceToggleModal, setShowAttendanceToggleModal] = useState(false);
  const [attendanceSelectedStudentId, setAttendanceSelectedStudentId] = useState(null);

  // --- Session-centric daily attendance states ---
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
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
    { id: 1, name: 'Elite Batch 1 (Coding Practicum)', done: false },
    { id: 2, name: 'Batch 2 (Mock HR Prep)', done: true },
    { id: 3, name: 'Batch 3 (Aptitude Remedial)', done: false },
    { id: 4, name: 'Batch 4 (Systems Practice)', done: false }
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setUser(data.user);
        setCurrentView('dashboard');
        fetchData();
      } else {
        const errData = await response.json();
        alert(errData.detail || "Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login connection error:", err);
      alert("Failed to connect to authentication server.");
    }
  };

  const handleSignupNext = async () => {
    if (signupStep === 2) {
      try {
        const payload = {
          email: signupForm.email,
          password: signupForm.password,
          name: signupForm.fullName,
          role: signupForm.role
        };
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          setSignupStep(3);
        } else {
          const errData = await response.json();
          alert(errData.detail || "Registration failed.");
        }
      } catch (err) {
        console.error("Registration error:", err);
        alert("Failed to connect to authentication server.");
      }
    } else {
      if (signupStep < 3) setSignupStep(prev => prev + 1);
    }
  };

  const handleSignupComplete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupForm.email, password: signupForm.password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setUser(data.user);
        setSignupStep(1);
        setAuthMode('login');
        setCurrentView('dashboard');
        fetchData();
      } else {
        setSignupStep(1);
        setAuthMode('login');
      }
    } catch (err) {
      setSignupStep(1);
      setAuthMode('login');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfileDropdown(false);
    setAuthMode('login');
  };

  // --- Mutators ---
  const addNewStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentData.name,
          dept: newStudentData.dept,
          batch_id: newStudentData.batchId,
          performance: newStudentData.performance,
          attendance: Number(newStudentData.attendance),
          email: newStudentData.email,
          phone: newStudentData.phone,
          journey_stage: Number(newStudentData.journeyStage),
          scores: newStudentData.scores
        })
      });

      if (response.ok) {
        setShowAddStudentModal(false);
        setNewStudentData({
          name: '', dept: 'CSE', batchId: 'elite-batch-1', performance: 'Progressing', attendance: 85,
          email: '', phone: '', journeyStage: 1,
          scores: { aptitude: 70, coding: 70, technical: 70, communication: 70, mockInterview: 70 }
        });
        fetchData();
      } else {
        const errData = await response.json();
        alert(errData.detail || "Failed to register student.");
      }
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Connection error.");
    }
  };

  const updateMarks = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${marksStudentId}/scores`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marksForm)
      });
      if (response.ok) {
        setShowMarksEntryModal(false);
        fetchData();
      } else {
        const errData = await response.json();
        alert(errData.detail || "Failed to update scores.");
      }
    } catch (err) {
      console.error("Error updating scores:", err);
      alert("Connection error.");
    }
  };

  const moveStudentMarkCategory = async (studentId, direction) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const statuses = ['At Risk', 'Progressing', 'Placement Ready', 'Elite'];
    const curIdx = statuses.indexOf(student.performance);
    let newIdx = curIdx + direction;
    if (newIdx >= 0 && newIdx < statuses.length) {
      const newPerformance = statuses[newIdx];
      let multiplier = 1;
      if (newPerformance === 'Elite') multiplier = 1.15;
      if (newPerformance === 'Placement Ready') multiplier = 1.05;
      if (newPerformance === 'Progressing') multiplier = 0.95;
      if (newPerformance === 'At Risk') multiplier = 0.8;

      const updatedScores = {
        aptitude: Math.min(100, Math.round(student.scores.aptitude * multiplier)),
        coding: Math.min(100, Math.round(student.scores.coding * multiplier)),
        technical: Math.min(100, Math.round(student.scores.technical * multiplier)),
        communication: Math.min(100, Math.round(student.scores.communication * multiplier)),
        mockInterview: Math.min(100, Math.round(student.scores.mockInterview * multiplier))
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/scores`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedScores)
        });
        if (response.ok) {
          await fetch(`${API_BASE_URL}/api/students/${studentId}/performance`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ performance: newPerformance })
          });
          fetchData();
        }
      } catch (err) {
        console.error("Error moving student performance category:", err);
      }
    }
  };

  const updateAttendanceStatus = async (studentId, dateString, newStatus) => {
    if (isAttendanceLocked(dateString)) {
      alert("Attendance records cannot be entered or modified for future dates.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/student/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateString,
          status: newStatus
        })
      });
      if (response.ok) {
        fetchData();
      } else {
        alert("Failed to update attendance.");
      }
    } catch (err) {
      console.error("Error updating attendance:", err);
    }
  };

  const handleDraftChange = (studentId, status) => {
    if (isAttendanceLocked(sessionDate)) {
      alert("Attendance records cannot be entered or modified for future dates.");
      return;
    }
    setAttendanceDraft(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllPresent = () => {
    if (isAttendanceLocked(sessionDate)) {
      alert("Attendance records cannot be entered or modified for future dates.");
      return;
    }
    const nextDraft = { ...attendanceDraft };
    filteredRoster.forEach(s => {
      nextDraft[s.id] = 'present';
    });
    setAttendanceDraft(nextDraft);
  };

  const saveAttendanceRoster = async () => {
    if (isAttendanceLocked(sessionDate)) {
      alert("Attendance records cannot be entered or modified for future dates.");
      return;
    }
    const records = {};
    students.forEach(s => {
      const status = attendanceDraft[s.id];
      if (status !== undefined) {
        records[s.id] = status;
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: sessionDate,
          records: records
        })
      });
      if (response.ok) {
        alert(`Attendance records for ${sessionDate} saved successfully!`);
        fetchData();
      } else {
        alert("Failed to save attendance roster.");
      }
    } catch (err) {
      console.error("Error saving attendance roster:", err);
      alert("Connection error.");
    }
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
    return matchesSearch && s.batchId === selectedBatch;
  });

  const rosterTotalCount = filteredRoster.length;
  const rosterMarkedCount = filteredRoster.filter(s => attendanceDraft[s.id] === 'present' ).length;
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
        setNotificationsList={setNotificationsListWrapper}
        user={user}
        handleLogout={handleLogout}
        students={students}
        setSelectedStudentId={setSelectedStudentId}
        setShowAddStudentModal={setShowAddStudentModal}
        setShowMarksEntryModal={setShowMarksEntryModal}
        batches={batches}
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
            batches={batches}
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
            batches={batches}
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
        batches={batches}
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
          batches={batches}
        />
    </div>
  );
}
