import sys
import os
from sqlalchemy.orm import Session
import bcrypt

# Add parent directory to sys.path so we can import from backend.app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.database import engine, Base, SessionLocal
from backend.app.models import User, Batch, Student, AttendanceLog, Insight, Notification

def get_password_hash(password):
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def populate_defaults(db):
    try:
        # 1. Seed Users
        print("Seeding users...")
        default_user = User(
            email="admin@university.edu",
            hashed_password=get_password_hash("admin123"),
            name="Admin Coordinator",
            role="coordinator"
        )
        db.add(default_user)

        # 2. Seed Batches
        print("Seeding batches...")
        batches_data = [
            { "id": "elite-batch-1", "name": "Elite Batch 1", "count": 12, "focus": "Product Engineering & Advanced DSA", "trainer": "Dr. Ramesh Kumar" },
            { "id": "batch-2", "name": "Batch 2", "count": 15, "focus": "Full-Stack Development & System Design", "trainer": "Prof. Sarah D'Souza" },
            { "id": "batch-3", "name": "Batch 3", "count": 18, "focus": "Core Engineering Fundamentals & Aptitude", "trainer": "Mr. Amit Verma" },
            { "id": "batch-4", "name": "Batch 4", "count": 10, "focus": "Embedded Systems & Automation", "trainer": "Dr. Neha Sharma" }
        ]
        for b in batches_data:
            db_batch = Batch(
                id=b["id"],
                name=b["name"],
                count=b["count"],
                focus=b["focus"],
                trainer=b["trainer"]
            )
            db.add(db_batch)

        # 3. Seed Insights
        print("Seeding insights...")
        insights_data = [
            { "id": "feed-1", "type": "warning", "title": "Low Attendance Alert", "message": "Ananya Iyer (ECE) attendance has dropped to 71% (Critical limit is 75%).", "time": "10 mins ago" },
            { "id": "feed-2", "type": "success", "title": "Top Performance Milestone", "message": "Priya Sharma (CSE) scored 98% in coding assessment, moving to Elite status.", "time": "1 hour ago" },
            { "id": "feed-3", "type": "info", "title": "Upcoming Activity", "message": "Technical Assessment 3 (Core DBMS & OS) is scheduled for Elite Batch 1 tomorrow at 10:00 AM.", "time": "2 hours ago" },
            { "id": "feed-4", "type": "success", "title": "Journey Advance", "message": "Sneha Rao (IT) has advanced to 'Mock Interview' stage after clearing Technical rounds.", "time": "4 hours ago" },
            { "id": "feed-5", "type": "warning", "title": "Marks Pending Entry", "message": "Aptitude Assessment marks for Batch 3 are pending review and submission.", "time": "5 hours ago" }
        ]
        for ins in insights_data:
            db_insight = Insight(
                id=ins["id"],
                type=ins["type"],
                title=ins["title"],
                message=ins["message"],
                time=ins["time"]
            )
            db.add(db_insight)

        # 4. Seed Notifications
        print("Seeding notifications...")
        notifications_data = [
            { "text": "New student registration request pending approval.", "unread": True, "time": "5 mins ago" },
            { "text": "Batch 4 attendance report has been compiled and is ready.", "unread": True, "time": "2 hours ago" },
            { "text": "System update complete: Grade charts loaded.", "unread": False, "time": "1 day ago" }
        ]
        for notif in notifications_data:
            db_notif = Notification(
                text=notif["text"],
                unread=notif["unread"],
                time=notif["time"]
            )
            db.add(db_notif)

        # 5. Seed Students
        print("Seeding students...")
        students_data = [
            {
                "id": 1,
                "name": "Arjun Mehta",
                "dept": "CSE",
                "batch_id": "elite-batch-1",
                "performance": "Elite",
                "attendance": 96,
                "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120",
                "email": "arjun.mehta@university.edu",
                "phone": "+91 98765 43210",
                "journey_stage": 5,
                "scores": { "aptitude": 92, "coding": 95, "technical": 90, "communication": 88, "mockInterview": 94 },
                "growth": [78, 82, 85, 91, 92],
                "recommendations": [
                    "Focus on system design scaling and microservices architecture.",
                    "Refine behavioral answers using the STAR method for mock HR rounds.",
                    "Continue practice on dynamic programming and graph structures."
                ]
            },
            {
                "id": 2,
                "name": "Sneha Rao",
                "dept": "IT",
                "batch_id": "batch-2",
                "performance": "Placement Ready",
                "attendance": 92,
                "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
                "email": "sneha.rao@university.edu",
                "phone": "+91 98765 43211",
                "journey_stage": 4,
                "scores": { "aptitude": 85, "coding": 88, "technical": 82, "communication": 90, "mockInterview": 80 },
                "growth": [70, 75, 80, 82, 85],
                "recommendations": [
                    "Take 2 more mock coding tests under time constraint to build speed.",
                    "Review fundamental concepts of Computer Networks and Database locks.",
                    "Work on vocal projection and pace of speech during tech interviews."
                ]
            },
            {
                "id": 3,
                "name": "Vikram Malhotra",
                "dept": "CSE",
                "batch_id": "batch-3",
                "performance": "Progressing",
                "attendance": 88,
                "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
                "email": "vikram.m@university.edu",
                "phone": "+91 98765 43212",
                "journey_stage": 3,
                "scores": { "aptitude": 78, "coding": 72, "technical": 75, "communication": 82, "mockInterview": 74 },
                "growth": [65, 68, 72, 74, 76],
                "recommendations": [
                    "Complete the dedicated module on Object Oriented Programming principles.",
                    "Practice medium level problems on string manipulation and array search.",
                    "Review basic mock interview feedback to maintain better eye contact."
                ]
            },
            {
                "id": 4,
                "name": "Ananya Iyer",
                "dept": "ECE",
                "batch_id": "batch-4",
                "performance": "At Risk",
                "attendance": 71,
                "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
                "email": "ananya.iyer@university.edu",
                "phone": "+91 98765 43213",
                "journey_stage": 2,
                "scores": { "aptitude": 60, "coding": 55, "technical": 64, "communication": 70, "mockInterview": 58 },
                "growth": [68, 64, 61, 62, 61],
                "recommendations": [
                    "Must attend special remedial classes for Basic Aptitude and Quantitative Logic.",
                    "Attendance tracker is critical. Must clear regular makeup hours to cross the 75% bar.",
                    "Set up one-on-one counseling to address placement blockages."
                ]
            },
            {
                "id": 5,
                "name": "Kabir Singh",
                "dept": "MECH",
                "batch_id": "batch-3",
                "performance": "Progressing",
                "attendance": 84,
                "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
                "email": "kabir.singh@university.edu",
                "phone": "+91 98765 43214",
                "journey_stage": 1,
                "scores": { "aptitude": 75, "coding": 60, "technical": 70, "communication": 76, "mockInterview": 68 },
                "growth": [60, 62, 65, 68, 70],
                "recommendations": [
                    "Review basic programming structures (Loops, Conditionals, Functions).",
                    "Attend weekly communication workshops to gain confidence in Group Discussions.",
                    "Practice logical reasoning sets regularly (Blood relations, Syllogisms)."
                ]
            },
            {
                "id": 6,
                "name": "Priya Sharma",
                "dept": "CSE",
                "batch_id": "elite-batch-1",
                "performance": "Elite",
                "attendance": 98,
                "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120",
                "email": "priya.s@university.edu",
                "phone": "+91 98765 43215",
                "journey_stage": 5,
                "scores": { "aptitude": 95, "coding": 98, "technical": 94, "communication": 92, "mockInterview": 96 },
                "growth": [80, 85, 90, 93, 95],
                "recommendations": [
                    "Ready for product-based direct interview pathways.",
                    "Review complex concurrent programming and database optimization.",
                    "Act as a mentor in student study groups to strengthen leadership profile."
                ]
            },
            {
                "id": 7,
                "name": "Rohan Das",
                "dept": "ECE",
                "batch_id": "batch-2",
                "performance": "Placement Ready",
                "attendance": 90,
                "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120",
                "email": "rohan.das@university.edu",
                "phone": "+91 98765 43216",
                "journey_stage": 4,
                "scores": { "aptitude": 82, "coding": 80, "technical": 86, "communication": 84, "mockInterview": 82 },
                "growth": [72, 75, 78, 80, 83],
                "recommendations": [
                    "Practice embedded systems coding problems on bit manipulation.",
                    "Take communication tests to polish standard interview opening lines.",
                    "Revise SQL queries, specifically complex JOINS and indexes."
                ]
            },
            {
                "id": 8,
                "name": "Aditi Verma",
                "dept": "EEE",
                "batch_id": "batch-4",
                "performance": "At Risk",
                "attendance": 74,
                "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
                "email": "aditi.v@university.edu",
                "phone": "+91 98765 43217",
                "journey_stage": 2,
                "scores": { "aptitude": 64, "coding": 50, "technical": 60, "communication": 72, "mockInterview": 62 },
                "growth": [68, 65, 63, 62, 62],
                "recommendations": [
                    "Focus heavily on coding fundamentals (Arrays, Math operations, Basic logic).",
                    "Increase attendance immediately in active laboratory training classes.",
                    "Work with a programming peer-mentor twice a week."
                ]
            }
        ]

        for s in students_data:
            db_student = Student(
                id=s["id"],
                name=s["name"],
                dept=s["dept"],
                batch_id=s["batch_id"],
                performance=s["performance"],
                attendance=s["attendance"],
                image=s["image"],
                email=s["email"],
                phone=s["phone"],
                journey_stage=s["journey_stage"],
                scores=s["scores"],
                growth=s["growth"],
                recommendations=s["recommendations"]
            )
            db.add(db_student)

        # 6. Seed Attendance Logs
        print("Seeding attendance logs...")
        attendance_logs_data = {
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
        }

        for student_id, logs in attendance_logs_data.items():
            for date_str, status in logs.items():
                db_log = AttendanceLog(
                    student_id=student_id,
                    date=date_str,
                    status=status
                )
                db.add(db_log)

        db.commit()

        # Sync database sequence values to avoid insert unique constraint violations
        from sqlalchemy import text
        db.execute(text("SELECT setval('students_id_seq', COALESCE((SELECT MAX(id) FROM students), 0) + 1, false)"))
        db.execute(text("SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false)"))
        db.execute(text("SELECT setval('attendance_logs_id_seq', COALESCE((SELECT MAX(id) FROM attendance_logs), 0) + 1, false)"))
        db.execute(text("SELECT setval('notifications_id_seq', COALESCE((SELECT MAX(id) FROM notifications), 0) + 1, false)"))
        db.commit()

        print("Database defaults populated and sequences synchronized successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e

def seed_db():
    print("Re-creating all database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        populate_defaults(db)
    except Exception as e:
        print(f"Error during explicit seed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
