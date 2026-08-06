import React from 'react';
import { 
  Users, 
  School, 
  CheckCircle2, 
  FileText, 
  CalendarCheck, 
  PlusCircle, 
  Clock, 
  Megaphone,
  ArrowUpRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { Student, ClassRoom, AttendanceRecord, RppItem, NavigationTab, SchoolSettings, TeacherProfile } from '../types';
import { exportAttendancePdf } from '../utils/pdfGenerator';

interface DashboardProps {
  students: Student[];
  classes: ClassRoom[];
  attendance: AttendanceRecord[];
  rpps: RppItem[];
  selectedClassId: string;
  onNavigate: (tab: NavigationTab) => void;
  schoolSettings: SchoolSettings;
  teacherProfile: TeacherProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  classes,
  attendance,
  rpps,
  selectedClassId,
  onNavigate,
  schoolSettings,
  teacherProfile,
}) => {
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classNameDisplay = currentClass?.name || 'X IPA 1';
  const totalStudents = students.length;
  const totalClasses = classes.length;

  // Calculate attendance percentage
  const totalAttRecords = attendance.length;
  const totalHadir = attendance.filter((a) => a.status === 'H').length;
  const attendancePercentage = totalAttRecords > 0 ? Math.round((totalHadir / totalAttRecords) * 100) : 0;

  const totalRpps = rpps.length;

  // Today's schedule
  const todaySchedule = [
    { time: '07:30 - 09:00', subject: 'Matematika Wajib', class: 'Kelas X IPA 1', room: 'Ruang 104', type: 'primary' },
    { time: '09:00 - 09:30', subject: 'Istirahat', class: 'Seluruh Siswa', room: 'Kantin / Lapangan', type: 'neutral' },
    { time: '09:30 - 11:00', subject: 'Matematika Peminatan', class: 'Kelas XI IPA 2', room: 'Ruang 202', type: 'teal' },
  ];

  // Announcements
  const announcements = [
    { id: 1, title: 'Batas Akhir Input Nilai Tengah Semester (UTS)', date: '10 Agustus 2026', tag: 'Penting', type: 'danger' },
    { id: 2, title: 'Rapat Koordinasi Evaluasi Kurikulum Merdeka', date: '12 Agustus 2026', tag: 'Dinas', type: 'info' },
    { id: 3, title: 'Upload Perangkat Ajar RPP Semester Ganjil', date: '15 Agustus 2026', tag: 'Administrasi', type: 'warning' },
  ];

  return (
    <div className="space-y-6">
      {/* DASHBOARD TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 font-medium">
            Selamat datang, <span className="font-bold text-slate-700">{teacherProfile.name}</span> • {teacherProfile.mainSubject} ({teacherProfile.homeroomClass})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportAttendancePdf(currentClass, students, attendance, 'Agustus 2026', schoolSettings, teacherProfile)}
            className="flex items-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-semibold bg-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Rekap PDF</span>
          </button>
          <button
            id="btn-dash-quick-attendance"
            onClick={() => onNavigate('attendance')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Input Absensi Hari Ini</span>
          </button>
        </div>
      </div>

      {/* 4 SLEEK STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: TOTAL SISWA */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-1 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Total Siswa
          </span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalStudents}</span>
            <span className="text-xs text-emerald-500 font-bold">Aktif</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Siswa terdaftar di {totalClasses} kelas</p>
        </div>

        {/* CARD 2: KEHADIRAN */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-1 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Rata-rata Kehadiran
          </span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">{attendancePercentage}%</span>
            <span className="text-xs text-emerald-500 font-bold">+2.1%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Berdasarkan data bulan berjalan</p>
        </div>

        {/* CARD 3: RPP TERVERIFIKASI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-1 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            RPP / Modul Ajar
          </span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalRpps}</span>
            <span className="text-xs text-amber-500 font-bold">Tersimpan</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Kurikulum Merdeka</p>
        </div>

        {/* CARD 4: KELAS DIAMPU */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-1 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Kelas Diampu
          </span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalClasses} Kelas</span>
            <span className="text-xs text-indigo-600 font-bold">TA 2026/2027</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Wali Kelas: {teacherProfile.homeroomClass}</p>
        </div>
      </div>

      {/* MAIN CONTENT GRID: RECENT STUDENTS + SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT STUDENTS TABLE (2 COLS) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Daftar Siswa Kelas ({classNameDisplay})
            </h2>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Lihat Semua Siswa <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">NISN</th>
                  <th className="p-3">Nama Lengkap</th>
                  <th className="p-3 text-center">Gender</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {students
                  .filter((s) => s.classId === selectedClassId)
                  .slice(0, 5)
                  .map((std, idx) => (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-medium text-slate-500">{String(idx + 1).padStart(2, '0')}</td>
                      <td className="p-3 font-mono font-medium text-slate-700">{std.nisn}</td>
                      <td className="p-3 font-semibold text-slate-900">{std.name}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            std.gender === 'L' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'
                          }`}
                        >
                          {std.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onNavigate('students')}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: SCHEDULE & ANNOUNCEMENTS */}
        <div className="space-y-6">
          {/* TEACHING SCHEDULE */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Jadwal Mengajar Hari Ini</h2>
            <div className="space-y-3">
              {todaySchedule.map((item, idx) => {
                if (item.type === 'primary') {
                  return (
                    <div key={idx} className="bg-indigo-50 border-l-4 border-indigo-500 p-3.5 rounded-r-lg">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold text-indigo-900">{item.subject}</h3>
                        <span className="text-[10px] font-bold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-700 mt-1">
                        {item.class} • {item.room}
                      </p>
                    </div>
                  );
                }
                if (item.type === 'teal') {
                  return (
                    <div key={idx} className="bg-teal-50 border-l-4 border-teal-500 p-3.5 rounded-r-lg">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold text-teal-900">{item.subject}</h3>
                        <span className="text-[10px] font-bold bg-teal-200 text-teal-800 px-2 py-0.5 rounded">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-700 mt-1">
                        {item.class} • {item.room}
                      </p>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="bg-slate-100 border-l-4 border-slate-300 p-3.5 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold text-slate-800">{item.subject}</h3>
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                        {item.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ANNOUNCEMENT BOX */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold text-[10px] uppercase tracking-wide">
              <Megaphone className="w-3.5 h-3.5 text-amber-600" />
              <span>Pengumuman Sekolah</span>
            </div>
            <p className="text-xs font-semibold text-amber-900 leading-snug">
              Batas Akhir Input Nilai Tengah Semester (UTS) adalah tanggal 10 Agustus 2026.
            </p>
            <p className="text-[11px] text-amber-700">
              Harap memastikan seluruh leger nilai kelas diisi tepat waktu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

