from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random

from ..database import get_db
from ..models import Insight
from ..schemas import InsightResponse, InsightCreate

router = APIRouter(prefix="/api/insights", tags=["Insights"])

@router.get("", response_model=List[InsightResponse])
def get_insights(db: Session = Depends(get_db)):
    return db.query(Insight).all()

@router.post("", response_model=InsightResponse)
def create_insight(insight_in: InsightCreate, db: Session = Depends(get_db)):
    # Check if ID exists, generate one if not
    ins_id = insight_in.id or f"feed-{int(random.random() * 100000000)}"
    
    db_insight = Insight(
        id=ins_id,
        type=insight_in.type,
        title=insight_in.title,
        message=insight_in.message,
        time=insight_in.time
    )
    db.add(db_insight)
    db.commit()
    db.refresh(db_insight)
    return db_insight

@router.delete("/{insight_id}")
def delete_insight(insight_id: str, db: Session = Depends(get_db)):
    insight = db.query(Insight).filter(Insight.id == insight_id).first()
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    db.delete(insight)
    db.commit()
    return {"detail": "Insight deleted successfully"}
