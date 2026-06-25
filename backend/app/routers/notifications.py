from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Notification
from ..schemas import NotificationResponse, NotificationCreate

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).order_by(Notification.id.desc()).all()

@router.post("", response_model=NotificationResponse)
def create_notification(notification_in: NotificationCreate, db: Session = Depends(get_db)):
    db_notif = Notification(
        text=notification_in.text,
        unread=notification_in.unread,
        time=notification_in.time
    )
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif

@router.put("/read-all")
def mark_all_read(db: Session = Depends(get_db)):
    db.query(Notification).update({Notification.unread: False})
    db.commit()
    return {"detail": "All notifications marked as read"}

@router.put("/{notif_id}/read", response_model=NotificationResponse)
def mark_read(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.unread = False
    db.commit()
    db.refresh(notif)
    return notif

@router.delete("/{notif_id}")
def delete_notification(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notif)
    db.commit()
    return {"detail": "Notification deleted successfully"}
