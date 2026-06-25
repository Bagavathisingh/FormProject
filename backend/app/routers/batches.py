from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Batch
from ..schemas import BatchResponse

router = APIRouter(prefix="/api/batches", tags=["Batches"])

@router.get("", response_model=List[BatchResponse])
def get_batches(db: Session = Depends(get_db)):
    return db.query(Batch).all()

@router.get("/{batch_id}", response_model=BatchResponse)
def get_batch(batch_id: str, db: Session = Depends(get_db)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch
