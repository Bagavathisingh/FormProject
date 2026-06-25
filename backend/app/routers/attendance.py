from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, List, Optional
from pydantic import BaseModel

from ..database import get_db
from ..models import AttendanceLog, Student, Notification, Insight

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])

class AttendanceSavePayload(BaseModel):
    date: str
    records: Dict[int, str]  # student_id -> status ('present', 'absent', 'excused', etc.)

class SingleAttendancePayload(BaseModel):
    date: str
    status: Optional[str] = None  # status, or None to delete the record

# Recalculates student's attendance percentage and updates the student record
def recalculate_student_attendance(student_id: int, db: Session):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return
    
    # Get all logs for student
    logs = db.query(AttendanceLog).filter(AttendanceLog.student_id == student_id).all()
    
    total = len(logs)
    if total == 0:
        new_percentage = 100
    else:
        presents = sum(1 for log in logs if log.status == 'present')
        excused = sum(1 for log in logs if log.status == 'excused')
        waiting = sum(1 for log in logs if log.status == 'waiting')
        
        new_percentage = round(((presents + (excused + waiting) * 0.5) / total) * 100)
        
    old_percentage = student.attendance
    student.attendance = new_percentage
    
    if new_percentage < 75 and old_percentage >= 75:
        student.performance = 'At Risk'
        # Create an attendance warning notification
        alert_text = f"⚠️ {student.name} attendance alert: {new_percentage}% (Critical)"
        
        # Check if notification already exists
        exists = db.query(Notification).filter(Notification.text.like(f"%{student.name}%attendance alert%")).first()
        if not exists:
            new_notif = Notification(
                text=alert_text,
                unread=True,
                time="Just now"
            )
            db.add(new_notif)
            
            # Also add an insight
            import random
            new_insight = Insight(
                id=f"feed-{int(random.random() * 100000000)}",
                type="warning",
                title="Low Attendance Alert",
                message=f"{student.name} ({student.dept}) attendance has dropped to {new_percentage}% (Critical limit is 75%).",
                time="Just now"
            )
            db.add(new_insight)
            
    db.commit()

@router.get("/map")
def get_attendance_map(db: Session = Depends(get_db)):
    """
    Returns attendance logs formatted as a nested dictionary: { student_id: { date_str: status } }
    This matches the React app's local state structure perfectly.
    """
    logs = db.query(AttendanceLog).all()
    attendance_map = {}
    
    for log in logs:
        s_id = str(log.student_id)
        if s_id not in attendance_map:
            attendance_map[s_id] = {}
        attendance_map[s_id][log.date] = log.status
        
    return attendance_map

@router.get("/date/{date_str}")
def get_attendance_by_date(date_str: str, db: Session = Depends(get_db)):
    """
    Get all attendance logs for a specific date: { student_id: status }
    """
    logs = db.query(AttendanceLog).filter(AttendanceLog.date == date_str).all()
    return {log.student_id: log.status for log in logs}

@router.post("/save")
def save_attendance(payload: AttendanceSavePayload, db: Session = Depends(get_db)):
    """
    Bulk save attendance logs for a specific date
    """
    date_str = payload.date
    records = payload.records
    
    for student_id, status in records.items():
        # Check if record already exists for this student and date
        existing_log = db.query(AttendanceLog).filter(
            AttendanceLog.student_id == student_id,
            AttendanceLog.date == date_str
        ).first()
        
        if status is None or status == "":
            if existing_log:
                db.delete(existing_log)
        else:
            if existing_log:
                existing_log.status = status
            else:
                new_log = AttendanceLog(
                    student_id=student_id,
                    date=date_str,
                    status=status
                )
                db.add(new_log)
                
    db.commit()
    
    # Recalculate attendance for all affected students
    for student_id in records.keys():
        recalculate_student_attendance(student_id, db)
        
    return {"message": "Attendance records saved successfully"}

@router.put("/student/{student_id}")
def update_student_attendance_log(student_id: int, payload: SingleAttendancePayload, db: Session = Depends(get_db)):
    """
    Update attendance log for a single student on a specific date
    """
    date_str = payload.date
    status = payload.status
    
    existing_log = db.query(AttendanceLog).filter(
        AttendanceLog.student_id == student_id,
        AttendanceLog.date == date_str
    ).first()
    
    if status is None or status == "":
        if existing_log:
            db.delete(existing_log)
    else:
        if existing_log:
            existing_log.status = status
        else:
            new_log = AttendanceLog(
                student_id=student_id,
                date=date_str,
                status=status
            )
            db.add(new_log)
            
    db.commit()
    recalculate_student_attendance(student_id, db)
    return {"message": "Attendance record updated successfully"}
