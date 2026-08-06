export type Gender = 'L' | 'P';

export type AttendanceStatus = 'H' | 'S' | 'I' | 'A';

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  name: string;
  gender: Gender;
  birthPlace: string;
  birthDate: string;
  parentName: string;
  parentPhone: string;
  classId: string;
  address?: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g., 'X IPA 1', 'XI IPS 2'
  gradeLevel: string;
  academicYear: string;
  homeroomTeacher: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  tugas1: number;
  tugas2: number;
  tugas3: number;
  uh: number; // Ujian Harian
  uts: number; // Ujian Tengah Semester
  uas: number; // Ujian Akhir Semester
  nilaiAkhir: number;
  predikat: string;
}

export interface RppItem {
  id: string;
  title: string;
  mataPelajaran: string;
  faseKelas: string; // e.g., "Fase E / Kelas X"
  elemen: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  alokasiWaktu: string;
  kegiatanPendahuluan: string;
  kegiatanInti: string;
  kegiatanPenutup: string;
  asesmen: string;
  mediaSumber: string;
  createdAt: string;
}

export interface SchoolSettings {
  schoolName: string;
  npsn: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  principalNip: string;
  logoUrl?: string;
  kopLine1: string;
  kopLine2: string;
}

export interface TeacherProfile {
  name: string;
  nip: string;
  mainSubject: string;
  homeroomClass: string;
  email: string;
  phone: string;
}

export type NavigationTab = 
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'grades'
  | 'rpp'
  | 'integration'
  | 'settings';
