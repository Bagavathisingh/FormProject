from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from ..database import get_db
from ..models import Student, Batch, Insight, Notification
from ..schemas import StudentCreate, StudentResponse

router = APIRouter(prefix="/api/students", tags=["Students"])

@router.get("", response_model=List[StudentResponse])
def get_students(batch_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Student)
    if batch_id:
        query = query.filter(Student.batch_id == batch_id)
    return query.order_by(Student.id).all()

@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("", response_model=StudentResponse)
def create_student(student_in: StudentCreate, db: Session = Depends(get_db)):
    # Verify batch exists
    batch = db.query(Batch).filter(Batch.id == student_in.batch_id).first()
    if not batch:
        raise HTTPException(status_code=400, detail="Invalid batch_id")

    # Generate a random unsplash image link matching the mockData style
    import random
    random_num = 1500000000000 + random.randint(0, 1000000)
    image_url = f"https://images.unsplash.com/photo-{random_num}?auto=format&fit=crop&q=80&w=120&h=120"

    # Default growth trajectory based on initial scores/attendance
    avg_score = sum(student_in.scores.values()) // len(student_in.scores) if student_in.scores else 70
    growth = [65, 70, 72, student_in.attendance, avg_score]

    recommendations = [
        "Complete baseline diagnostic assessment.",
        "Review standard platform guidelines."
    ]

    new_student = Student(
        name=student_in.name,
        dept=student_in.dept,
        batch_id=student_in.batch_id,
        performance=student_in.performance,
        attendance=student_in.attendance,
        image=image_url,
        email=student_in.email,
        phone=student_in.phone,
        journey_stage=student_in.journey_stage,
        scores=student_in.scores,
        growth=growth,
        recommendations=recommendations
    )
    db.add(new_student)
    
    # Update batch student count
    batch.count += 1

    # Create dashboard insight feed item
    new_insight = Insight(
        id=f"feed-{int(random.random() * 100000000)}",
        type="info",
        title="New Student Registered",
        message=f"{new_student.name} ({new_student.dept}) has been registered in the student database.",
        time="Just now"
    )
    db.add(new_insight)

    # Create a notification
    new_notif = Notification(
        text=f"New student {new_student.name} registered.",
        unread=True,
        time="Just now"
    )
    db.add(new_notif)

    db.commit()
    db.refresh(new_student)
    return new_student

@router.put("/{student_id}/scores", response_model=StudentResponse)
def update_student_scores(student_id: int, scores: Dict[str, int], db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Merge existing and incoming scores
    current_scores = dict(student.scores) if student.scores else {}
    current_scores.update(scores)
    
    student.scores = current_scores
    
    # Recalculate growth average and append to growth list
    avg_score = sum(current_scores.values()) // len(current_scores) if current_scores else 70
    growth_list = list(student.growth) if student.growth else []
    growth_list.append(avg_score)
    # Keep growth list length reasonable (e.g. last 10)
    if len(growth_list) > 10:
        growth_list.pop(0)
    student.growth = growth_list

    # Check if student qualifies for performance change
    if avg_score >= 90:
        student.performance = "Elite"
    elif avg_score >= 80:
        student.performance = "Placement Ready"
    elif avg_score >= 65:
        student.performance = "Progressing"
    else:
        student.performance = "At Risk"

    # Add insight
    import random
    new_insight = Insight(
        id=f"feed-{int(random.random() * 100000000)}",
        type="success",
        title="Assessment Scores Updated",
        message=f"{student.name}'s assessment profile has been updated. Average score is now {avg_score}%.",
        time="Just now"
    )
    db.add(new_insight)

    db.commit()
    db.refresh(student)
    return student

@router.put("/{student_id}/performance", response_model=StudentResponse)
def update_student_performance(student_id: int, payload: Dict[str, str], db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    performance = payload.get("performance")
    if not performance:
        raise HTTPException(status_code=400, detail="performance field is required")
        
    student.performance = performance

    # Add insight
    import random
    new_insight = Insight(
        id=f"feed-{int(random.random() * 100000000)}",
        type="success" if performance in ["Elite", "Placement Ready"] else "warning",
        title="Performance Status Shift",
        message=f"{student.name}'s performance status has been updated to '{performance}'.",
        time="Just now"
    )
    db.add(new_insight)

    db.commit()
    db.refresh(student)
    return student

@router.put("/{student_id}/journey", response_model=StudentResponse)
def update_student_journey(student_id: int, payload: Dict[str, int], db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    stage = payload.get("journey_stage")
    if stage is None:
        raise HTTPException(status_code=400, detail="journey_stage field is required")
        
    student.journey_stage = stage

    # Add insight
    stages = ['Registered', 'Training Started', 'Assessment 1', 'Assessment 2', 'Mock Interview', 'Placement Ready']
    stage_name = stages[stage] if 0 <= stage < len(stages) else f"Stage {stage}"
    
    import random
    new_insight = Insight(
        id=f"feed-{int(random.random() * 100000000)}",
        type="success",
        title="Journey Stage Advanced",
        message=f"{student.name} advanced to '{stage_name}' stage.",
        time="Just now"
    )
    db.add(new_insight)

    db.commit()
    db.refresh(student)
    return student

@router.put("/{student_id}/recommendations", response_model=StudentResponse)
def update_student_recommendations(student_id: int, payload: Dict[str, List[str]], db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    recs = payload.get("recommendations")
    if recs is None:
        raise HTTPException(status_code=400, detail="recommendations field is required")
        
    student.recommendations = recs
    db.commit()
    db.refresh(student)
    return student

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update batch count
    batch = db.query(Batch).filter(Batch.id == student.batch_id).first()
    if batch and batch.count > 0:
        batch.count -= 1

    db.delete(student)
    db.commit()
    return {"detail": "Student deleted successfully"}
