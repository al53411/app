import { ClassRoom, Student, AttendanceRecord, GradeRecord, RppItem, SchoolSettings, TeacherProfile } from '../types';
import { 
  INITIAL_CLASSES, 
  INITIAL_SCHOOL_SETTINGS, 
  INITIAL_TEACHER_PROFILE, 
  INITIAL_STUDENTS, 
  INITIAL_RPPS,
  generateDummyAttendance,
  generateDummyGrades
} from '../data/dummyData';

const STORAGE_KEYS = {
  CLASSES: 'simguru_classes',
  SCHOOL_SETTINGS: 'simguru_school_settings',
  TEACHER_PROFILE: 'simguru_teacher_profile',
  STUDENTS: 'simguru_students',
  ATTENDANCE: 'simguru_attendance',
  GRADES: 'simguru_grades',
  RPPS: 'simguru_rpps',
};

export const loadInitialData = () => {
  const getOrSet = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const classes = getOrSet<ClassRoom[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  const schoolSettings = getOrSet<SchoolSettings>(STORAGE_KEYS.SCHOOL_SETTINGS, INITIAL_SCHOOL_SETTINGS);
  const teacherProfile = getOrSet<TeacherProfile>(STORAGE_KEYS.TEACHER_PROFILE, INITIAL_TEACHER_PROFILE);
  const students = getOrSet<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  const attendance = getOrSet<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, generateDummyAttendance());
  const grades = getOrSet<GradeRecord[]>(STORAGE_KEYS.GRADES, generateDummyGrades());
  const rpps = getOrSet<RppItem[]>(STORAGE_KEYS.RPPS, INITIAL_RPPS);

  return {
    classes,
    schoolSettings,
    teacherProfile,
    students,
    attendance,
    grades,
    rpps,
  };
};

export const saveToStorage = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed saving to ${key}:`, err);
  }
};

export { STORAGE_KEYS };
