// Mock Database for the Placement Training Management System

export const initialBatches = [
  { id: 'batch-alpha', name: 'Batch Alpha (CSE/IT)', count: 24, focus: 'Advanced Coding & System Design', trainer: 'Dr. Ramesh Kumar' },
  { id: 'batch-beta', name: 'Batch Beta (ECE/EEE)', count: 18, focus: 'Embedded Systems & Aptitude', trainer: 'Prof. Sarah D\'Souza' },
  { id: 'batch-gamma', name: 'Batch Gamma (Mech/Civil)', count: 15, focus: 'Aptitude & Core Technical Fundamentals', trainer: 'Mr. Amit Verma' }
];

export const initialInsights = [
  { id: 'feed-1', type: 'warning', title: 'Low Attendance Alert', message: 'Ananya Iyer (ECE) attendance has dropped to 71% (Critical limit is 75%).', time: '10 mins ago' },
  { id: 'feed-2', type: 'success', title: 'Top Performance Milestone', message: 'Priya Sharma (CSE) scored 98% in coding assessment, moving to Elite status.', time: '1 hour ago' },
  { id: 'feed-3', type: 'info', title: 'Upcoming Activity', message: 'Technical Assessment 3 (Core DBMS & OS) is scheduled for Batch Alpha tomorrow at 10:00 AM.', time: '2 hours ago' },
  { id: 'feed-4', type: 'success', title: 'Journey Advance', message: 'Sneha Rao (IT) has advanced to "Mock Interview" stage after clearing Technical rounds.', time: '4 hours ago' },
  { id: 'feed-5', type: 'warning', title: 'Marks Pending Entry', message: 'Aptitude Assessment marks for Batch Gamma are pending review and submission.', time: '5 hours ago' }
];

export const initialStudents = [
  {
    id: 1,
    name: 'Arjun Mehta',
    dept: 'CSE',
    performance: 'Elite',
    attendance: 96,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120',
    email: 'arjun.mehta@university.edu',
    phone: '+91 98765 43210',
    journeyStage: 5, // Registered, Training Started, Assessment 1, Assessment 2, Mock Interview, Placement Ready
    scores: { aptitude: 92, coding: 95, technical: 90, communication: 88, mockInterview: 94 },
    growth: [78, 82, 85, 91, 92],
    recommendations: [
      'Focus on system design scaling and microservices architecture.',
      'Refine behavioral answers using the STAR method for mock HR rounds.',
      'Continue practice on dynamic programming and graph structures.'
    ]
  },
  {
    id: 2,
    name: 'Sneha Rao',
    dept: 'IT',
    performance: 'Placement Ready',
    attendance: 92,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    email: 'sneha.rao@university.edu',
    phone: '+91 98765 43211',
    journeyStage: 4,
    scores: { aptitude: 85, coding: 88, technical: 82, communication: 90, mockInterview: 80 },
    growth: [70, 75, 80, 82, 85],
    recommendations: [
      'Take 2 more mock coding tests under time constraint to build speed.',
      'Review fundamental concepts of Computer Networks and Database locks.',
      'Work on vocal projection and pace of speech during tech interviews.'
    ]
  },
  {
    id: 3,
    name: 'Vikram Malhotra',
    dept: 'CSE',
    performance: 'Progressing',
    attendance: 88,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    email: 'vikram.m@university.edu',
    phone: '+91 98765 43212',
    journeyStage: 3,
    scores: { aptitude: 78, coding: 72, technical: 75, communication: 82, mockInterview: 74 },
    growth: [65, 68, 72, 74, 76],
    recommendations: [
      'Complete the dedicated module on Object Oriented Programming principles.',
      'Practice medium level problems on string manipulation and array search.',
      'Review basic mock interview feedback to maintain better eye contact.'
    ]
  },
  {
    id: 4,
    name: 'Ananya Iyer',
    dept: 'ECE',
    performance: 'At Risk',
    attendance: 71,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    email: 'ananya.iyer@university.edu',
    phone: '+91 98765 43213',
    journeyStage: 2,
    scores: { aptitude: 60, coding: 55, technical: 64, communication: 70, mockInterview: 58 },
    growth: [68, 64, 61, 62, 61],
    recommendations: [
      'Must attend special remedial classes for Basic Aptitude and Quantitative Logic.',
      'Attendance tracker is critical. Must clear regular makeup hours to cross the 75% bar.',
      'Set up one-on-one counseling to address placement blockages.'
    ]
  },
  {
    id: 5,
    name: 'Kabir Singh',
    dept: 'MECH',
    performance: 'Progressing',
    attendance: 84,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    email: 'kabir.singh@university.edu',
    phone: '+91 98765 43214',
    journeyStage: 1,
    scores: { aptitude: 75, coding: 60, technical: 70, communication: 76, mockInterview: 68 },
    growth: [60, 62, 65, 68, 70],
    recommendations: [
      'Review basic programming structures (Loops, Conditionals, Functions).',
      'Attend weekly communication workshops to gain confidence in Group Discussions.',
      'Practice logical reasoning sets regularly (Blood relations, Syllogisms).'
    ]
  },
  {
    id: 6,
    name: 'Priya Sharma',
    dept: 'CSE',
    performance: 'Elite',
    attendance: 98,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
    email: 'priya.s@university.edu',
    phone: '+91 98765 43215',
    journeyStage: 5,
    scores: { aptitude: 95, coding: 98, technical: 94, communication: 92, mockInterview: 96 },
    growth: [80, 85, 90, 93, 95],
    recommendations: [
      'Ready for product-based direct interview pathways.',
      'Review complex concurrent programming and database optimization.',
      'Act as a mentor in student study groups to strengthen leadership profile.'
    ]
  },
  {
    id: 7,
    name: 'Rohan Das',
    dept: 'ECE',
    performance: 'Placement Ready',
    attendance: 90,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    email: 'rohan.das@university.edu',
    phone: '+91 98765 43216',
    journeyStage: 4,
    scores: { aptitude: 82, coding: 80, technical: 86, communication: 84, mockInterview: 82 },
    growth: [72, 75, 78, 80, 83],
    recommendations: [
      'Practice embedded systems coding problems on bit manipulation.',
      'Take communication tests to polish standard interview opening lines.',
      'Revise SQL queries, specifically complex JOINS and indexes.'
    ]
  },
  {
    id: 8,
    name: 'Aditi Verma',
    dept: 'EEE',
    performance: 'At Risk',
    attendance: 74,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    email: 'aditi.v@university.edu',
    phone: '+91 98765 43217',
    journeyStage: 2,
    scores: { aptitude: 64, coding: 50, technical: 60, communication: 72, mockInterview: 62 },
    growth: [68, 65, 63, 62, 62],
    recommendations: [
      'Focus heavily on coding fundamentals (Arrays, Math operations, Basic logic).',
      'Increase attendance immediately in active laboratory training classes.',
      'Work with a programming peer-mentor twice a week.'
    ]
  }
];

export const journeyStagesList = [
  'Registered',
  'Training Started',
  'Assessment 1',
  'Assessment 2',
  'Mock Interview',
  'Placement Ready'
];

export const attendanceLogs = {
  // Map of studentId -> { dateString: 'present' | 'absent' | 'excused' }
  1: {
    '2026-06-01': 'present', '2026-06-02': 'present', '2026-06-03': 'present',
    '2026-06-04': 'present', '2026-06-05': 'present', '2026-06-08': 'present',
    '2026-06-09': 'present', '2026-06-10': 'present', '2026-06-11': 'present',
    '2026-06-12': 'present', '2026-06-15': 'present', '2026-06-16': 'present',
    '2026-06-17': 'present', '2026-06-18': 'present', '2026-06-19': 'present',
    '2026-06-22': 'present', '2026-06-23': 'present'
  },
  2: {
    '2026-06-01': 'present', '2026-06-02': 'present', '2026-06-03': 'present',
    '2026-06-04': 'absent', '2026-06-05': 'present', '2026-06-08': 'present',
    '2026-06-09': 'present', '2026-06-10': 'present', '2026-06-11': 'present',
    '2026-06-12': 'present', '2026-06-15': 'absent', '2026-06-16': 'present',
    '2026-06-17': 'present', '2026-06-18': 'present', '2026-06-19': 'present',
    '2026-06-22': 'present', '2026-06-23': 'present'
  },
  3: {
    '2026-06-01': 'present', '2026-06-02': 'present', '2026-06-03': 'present',
    '2026-06-04': 'present', '2026-06-05': 'present', '2026-06-08': 'present',
    '2026-06-09': 'present', '2026-06-10': 'absent', '2026-06-11': 'present',
    '2026-06-12': 'present', '2026-06-15': 'present', '2026-06-16': 'present',
    '2026-06-17': 'excused', '2026-06-18': 'present', '2026-06-19': 'present',
    '2026-06-22': 'present', '2026-06-23': 'present'
  },
  4: {
    '2026-06-01': 'present', '2026-06-02': 'absent', '2026-06-03': 'present',
    '2026-06-04': 'absent', '2026-06-05': 'present', '2026-06-08': 'absent',
    '2026-06-09': 'present', '2026-06-10': 'present', '2026-06-11': 'absent',
    '2026-06-12': 'present', '2026-06-15': 'present', '2026-06-16': 'absent',
    '2026-06-17': 'present', '2026-06-18': 'present', '2026-06-19': 'absent',
    '2026-06-22': 'present', '2026-06-23': 'present'
  },
  5: {
    '2026-06-01': 'present', '2026-06-02': 'present', '2026-06-03': 'present',
    '2026-06-04': 'present', '2026-06-05': 'present', '2026-06-08': 'present',
    '2026-06-09': 'absent', '2026-06-10': 'present', '2026-06-11': 'present',
    '2026-06-12': 'present', '2026-06-15': 'present', '2026-06-16': 'present',
    '2026-06-17': 'absent', '2026-06-18': 'absent', '2026-06-19': 'present',
    '2026-06-22': 'present', '2026-06-23': 'present'
  },
  6: {
    '2026-06-01': 'present', '2026-06-02': 'present', '2026-06-03': 'present',
    '2026-06-04': 'present', '2026-06-05': 'present', '2026-06-08': 'present',
    '2026-06-09': 'present', '2026-06-10': 'present', '2026-06-11': 'present',
    '2026-06-12': 'present', '2026-06-15': 'present', '2026-06-16': 'present',
    '2026-06-17': 'present', '2026-06-18': 'present', '2026-06-19': 'present',
    '2026-06-22': 'present', '2026-06-23': 'present'
  },
  7: {
    '2026-06-01': 'present', '2026-06-02': 'present', '2026-06-03': 'present',
    '2026-06-04': 'present', '2026-06-05': 'present', '2026-06-08': 'present',
    '2026-06-09': 'present', '2026-06-10': 'present', '2026-06-11': 'present',
    '2026-06-12': 'absent', '2026-06-15': 'present', '2026-06-16': 'present',
    '2026-06-17': 'present', '2026-06-18': 'present', '2026-06-19': 'present',
    '2026-06-22': 'absent', '2026-06-23': 'present'
  },
  8: {
    '2026-06-01': 'present', '2026-06-02': 'present', '2026-06-03': 'absent',
    '2026-06-04': 'present', '2026-06-05': 'present', '2026-06-08': 'present',
    '2026-06-09': 'absent', '2026-06-10': 'present', '2026-06-11': 'present',
    '2026-06-12': 'absent', '2026-06-15': 'present', '2026-06-16': 'absent',
    '2026-06-17': 'present', '2026-06-18': 'present', '2026-06-19': 'absent',
    '2026-06-22': 'present', '2026-06-23': 'present'
  }
};
