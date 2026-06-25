from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional, Any

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# Batch schemas
class BatchBase(BaseModel):
    id: str
    name: str
    count: int
    focus: Optional[str] = None
    trainer: Optional[Optional[str]] = None

class BatchResponse(BatchBase):
    class Config:
        from_attributes = True

# Student schemas
class StudentBase(BaseModel):
    name: str
    dept: str
    batch_id: str
    performance: str
    attendance: int
    image: Optional[str] = None
    email: EmailStr
    phone: str
    journey_stage: int
    scores: Dict[str, int]
    growth: List[int]
    recommendations: List[str]

class StudentCreate(BaseModel):
    name: str
    dept: str
    batch_id: str
    performance: str
    attendance: int
    email: EmailStr
    phone: str
    journey_stage: int
    scores: Dict[str, int]

class StudentResponse(StudentBase):
    id: int

    class Config:
        from_attributes = True

# Attendance schemas
class AttendanceLogBase(BaseModel):
    student_id: int
    date: str
    status: str

class AttendanceUpdate(BaseModel):
    status: Optional[str] = None  # None to delete record

class AttendanceLogResponse(AttendanceLogBase):
    id: int

    class Config:
        from_attributes = True

# Insight schemas
class InsightBase(BaseModel):
    id: str
    type: str
    title: str
    message: str
    time: str

class InsightCreate(InsightBase):
    pass

class InsightResponse(InsightBase):
    class Config:
        from_attributes = True

# Notification schemas
class NotificationBase(BaseModel):
    text: str
    unread: bool
    time: str

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: int

    class Config:
        from_attributes = True
