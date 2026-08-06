import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  Student, 
  ClassRoom, 
  AttendanceRecord, 
  GradeRecord, 
  RppItem, 
  SchoolSettings, 
  TeacherProfile,
  AttendanceStatus 
} from './types';
import { loadInitialData, saveToStorage, STORAGE_KEYS } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { AttendanceManagement } from './components/AttendanceManagement';
import { GradeManagement } from './components/GradeManagement';
import { RppGenerator } from './components/RppGenerator';
import { GoogleSheetsIntegration } from './components/GoogleSheetsIntegration';
import { SettingsModule } from './components/SettingsModule';
import { INITIAL_CLASSES, INITIAL_SCHOOL_SETTINGS, INITIAL_TEACHER_PROFILE, INITIAL_STUDENTS, INITIAL_RPPS, generateDummyAttendance, generateDummyGrades } from './data/dummyData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // App Data States
  const [classes, setClasses] = useState<ClassRoom[]>(() => loadInitialData().classes);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => loadInitialData().schoolSettings);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => loadInitialData().teacherProfile);
  const [students, setStudents] = useState<Student[]>(() => loadInitialData().students);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadInitialData().attendance);
  const [grades, setGrades] = useState<GradeRecord[]>(() => loadInitialData().grades);
  const [rpps, setRpps] = useState<RppItem[]>(() => loadInitialData().rpps);
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const data = loadInitialData();
    return data.classes.length > 0 ? data.classes[0].id : 'class-1';
  });

  // Handlers for Students
  const handleAddStudent = (studentData: Partial<Student>) => {
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      classId: studentData.classId || selectedClassId,
      nisn: studentData.nisn || '',
      nis: studentData.nis || '',
      name: studentData.name || '',
      gender: studentData.gender || 'L',
      birthPlace: studentData.birthPlace || '',
      birthDate: studentData.birthDate || '',
      parentName: studentData.parentName || '',
      parentPhone: studentData.parentPhone || '',
      address: studentData.address || '',
    };
    const updated = [newStudent, ...students];
    setStudents(updated);
    saveToStorage(STORAGE_KEYS.STUDENTS, updated);
  };

  const handleUpdateStudent = (id: string, studentData: Partial<Student>) => {
    const updated = students.map((s) => (s.id === id ? { ...s, ...studentData } : s));
    setStudents(updated);
    saveToStorage(STORAGE_KEYS.STUDENTS, updated);
  };

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    saveToStorage(STORAGE_KEYS.STUDENTS, updated);
  };

  const handleAddClass = (className: string, gradeLevel: string) => {
    const newClass: ClassRoom = {
      id: `class-${Date.now()}`,
      name: className,
      gradeLevel: gradeLevel,
      academicYear: '2026/2027',
      homeroomTeacher: teacherProfile.name,
    };
    const updated = [...classes, newClass];
    setClasses(updated);
    saveToStorage(STORAGE_KEYS.CLASSES, updated);
    setSelectedClassId(newClass.id);
  };

  // Handlers for Attendance
  const handleUpdateAttendance = (
    studentId: string,
    date: string,
    status: AttendanceStatus,
    notes?: string
  ) => {
    const existingIndex = attendance.findIndex(
      (a) => a.studentId === studentId && a.date === date
    );
    let updated: AttendanceRecord[] = [];
    if (existingIndex >= 0) {
      updated = [...attendance];
      updated[existingIndex] = { ...updated[existingIndex], status, notes };
    } else {
      updated = [
        ...attendance,
        { id: `att-${studentId}-${date}`, studentId, date, status, notes },
      ];
    }
    setAttendance(updated);
    saveToStorage(STORAGE_KEYS.ATTENDANCE, updated);
  };

  const handleBulkUpdateAttendance = (date: string, status: AttendanceStatus) => {
    const classStudents = students.filter((s) => s.classId === selectedClassId);
    let updated = [...attendance];
    classStudents.forEach((std) => {
      const idx = updated.findIndex((a) => a.studentId === std.id && a.date === date);
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], status };
      } else {
        updated.push({ id: `att-${std.id}-${date}`, studentId: std.id, date, status });
      }
    });
    setAttendance(updated);
    saveToStorage(STORAGE_KEYS.ATTENDANCE, updated);
  };

  // Handlers for Grades
  const handleUpdateGrade = (
    studentId: string,
    subject: string,
    classId: string,
    updatedFields: Partial<GradeRecord>
  ) => {
    const idx = grades.findIndex((g) => g.studentId === studentId && g.subject === subject);
    let updated: GradeRecord[] = [];
    if (idx >= 0) {
      updated = [...grades];
      updated[idx] = { ...updated[idx], ...updatedFields };
    } else {
      const newGrade: GradeRecord = {
        id: `grd-${studentId}-${subject}`,
        studentId,
        classId,
        subject,
        tugas1: 80,
        tugas2: 80,
        tugas3: 80,
        uh: 80,
        uts: 80,
        uas: 80,
        nilaiAkhir: 80,
        predikat: 'B (Baik)',
        ...updatedFields,
      };
      updated = [...grades, newGrade];
    }
    setGrades(updated);
    saveToStorage(STORAGE_KEYS.GRADES, updated);
  };

  // Handlers for RPP
  const handleSaveRpp = (rpp: RppItem) => {
    const idx = rpps.findIndex((r) => r.id === rpp.id);
    let updated: RppItem[] = [];
    if (idx >= 0) {
      updated = [...rpps];
      updated[idx] = rpp;
    } else {
      updated = [rpp, ...rpps];
    }
    setRpps(updated);
    saveToStorage(STORAGE_KEYS.RPPS, updated);
  };

  const handleDeleteRpp = (id: string) => {
    const updated = rpps.filter((r) => r.id !== id);
    setRpps(updated);
    saveToStorage(STORAGE_KEYS.RPPS, updated);
  };

  // Handlers for Google Sheets Integration
  const handleSyncStudents = (importedStudents: Student[]) => {
    const updated = [...importedStudents, ...students];
    setStudents(updated);
    saveToStorage(STORAGE_KEYS.STUDENTS, updated);
  };

  // Settings Handlers
  const handleSaveSchoolSettings = (settings: SchoolSettings) => {
    setSchoolSettings(settings);
    saveToStorage(STORAGE_KEYS.SCHOOL_SETTINGS, settings);
  };

  const handleSaveTeacherProfile = (profile: TeacherProfile) => {
    setTeacherProfile(profile);
    saveToStorage(STORAGE_KEYS.TEACHER_PROFILE, profile);
  };

  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua data ke data default awal?')) {
      localStorage.clear();
      setClasses(INITIAL_CLASSES);
      setSchoolSettings(INITIAL_SCHOOL_SETTINGS);
      setTeacherProfile(INITIAL_TEACHER_PROFILE);
      setStudents(INITIAL_STUDENTS);
      setAttendance(generateDummyAttendance());
      setGrades(generateDummyGrades());
      setRpps(INITIAL_RPPS);
      setSelectedClassId('class-1');
      alert('Data berhasil di-reset ke standar awal!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans antialiased">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* HEADER */}
        <Header
          schoolSettings={schoolSettings}
          teacherProfile={teacherProfile}
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={(id) => setSelectedClassId(id)}
        />

        {/* BODY WORKSPACE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              students={students}
              classes={classes}
              attendance={attendance}
              rpps={rpps}
              selectedClassId={selectedClassId}
              onNavigate={(tab) => setCurrentTab(tab)}
              schoolSettings={schoolSettings}
              teacherProfile={teacherProfile}
            />
          )}

          {currentTab === 'students' && (
            <StudentManagement
              students={students}
              classes={classes}
              selectedClassId={selectedClassId}
              onSelectClass={(id) => setSelectedClassId(id)}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onAddClass={handleAddClass}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceManagement
              students={students}
              attendance={attendance}
              classes={classes}
              selectedClassId={selectedClassId}
              onSelectClass={(id) => setSelectedClassId(id)}
              onUpdateAttendance={handleUpdateAttendance}
              onBulkUpdateAttendance={handleBulkUpdateAttendance}
              schoolSettings={schoolSettings}
              teacherProfile={teacherProfile}
            />
          )}

          {currentTab === 'grades' && (
            <GradeManagement
              students={students}
              grades={grades}
              classes={classes}
              selectedClassId={selectedClassId}
              onSelectClass={(id) => setSelectedClassId(id)}
              onUpdateGrade={handleUpdateGrade}
              schoolSettings={schoolSettings}
              teacherProfile={teacherProfile}
            />
          )}

          {currentTab === 'rpp' && (
            <RppGenerator
              rpps={rpps}
              onSaveRpp={handleSaveRpp}
              onDeleteRpp={handleDeleteRpp}
              schoolSettings={schoolSettings}
              teacherProfile={teacherProfile}
            />
          )}

          {currentTab === 'integration' && (
            <GoogleSheetsIntegration
              students={students}
              classes={classes}
              selectedClassId={selectedClassId}
              onSyncStudents={handleSyncStudents}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsModule
              schoolSettings={schoolSettings}
              teacherProfile={teacherProfile}
              onSaveSchoolSettings={handleSaveSchoolSettings}
              onSaveTeacherProfile={handleSaveTeacherProfile}
              onResetToDefault={handleResetToDefault}
            />
          )}
        </main>
      </div>
    </div>
  );
}
