from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)

class Batch(Base):
    __tablename__ = "batches"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    count = Column(Integer, default=0)
    focus = Column(String, nullable=True)
    trainer = Column(String, nullable=True)

    students = relationship("Student", back_populates="batch")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    dept = Column(String, nullable=False)
    batch_id = Column(String, ForeignKey("batches.id"), nullable=False)
    performance = Column(String, default="Progressing")
    attendance = Column(Integer, default=100)
    image = Column(String, nullable=True)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    journey_stage = Column(Integer, default=1)
    
    scores = Column(JSON, default=dict)
    growth = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)

    batch = relationship("Batch", back_populates="students")
    attendance_records = relationship("AttendanceLog", back_populates="student", cascade="all, delete-orphan")

class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    date = Column(String, nullable=False, index=True)
    status = Column(String, nullable=False)

    student = relationship("Student", back_populates="attendance_records")

class Insight(Base):
    __tablename__ = "insights"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    time = Column(String, nullable=False)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    unread = Column(Boolean, default=True)
    time = Column(String, nullable=False)
