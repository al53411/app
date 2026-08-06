import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Download, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  UserX,
  FileSpreadsheet,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus, ClassRoom, SchoolSettings, TeacherProfile } from '../types';
import { exportAttendancePdf } from '../utils/pdfGenerator';

interface AttendanceManagementProps {
  students: Student[];
  attendance: AttendanceRecord[];
  classes: ClassRoom[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  onUpdateAttendance: (studentId: string, date: string, status: AttendanceStatus, notes?: string) => void;
  onBulkUpdateAttendance: (date: string, status: AttendanceStatus) => void;
  schoolSettings: SchoolSettings;
  teacherProfile: TeacherProfile;
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({
  students,
  attendance,
  classes,
  selectedClassId,
  onSelectClass,
  onUpdateAttendance,
  onBulkUpdateAttendance,
  schoolSettings,
  teacherProfile,
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState('2026-08-06');
  const [selectedMonth, setSelectedMonth] = useState('Agustus 2026');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Status helper mapping
  const statusConfig: Record<AttendanceStatus, { label: string; bg: string; text: string; border: string }> = {
    H: { label: 'Hadir', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
    S: { label: 'Sakit', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
    I: { label: 'Izin', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
    A: { label: 'Alpa', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
  };

  // Quick stats for selected date
  const todayAttendance = classStudents.map((std) => {
    const record = attendance.find((a) => a.studentId === std.id && a.date === selectedDate);
    return record ? record.status : ('H' as AttendanceStatus);
  });

  const countH = todayAttendance.filter((s) => s === 'H').length;
  const countS = todayAttendance.filter((s) => s === 'S').length;
  const countI = todayAttendance.filter((s) => s === 'I').length;
  const countA = todayAttendance.filter((s) => s === 'A').length;

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Rekap Presensi & Kehadiran Siswa
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Input absensi harian, rekapitulasi bulanan, dan cetak laporan PDF bersetempel kop sekolah
            </p>
          </div>
        </div>

        {/* PDF EXPORT BUTTON */}
        <button
          id="btn-export-attendance-pdf"
          onClick={() => exportAttendancePdf(currentClass, students, attendance, selectedMonth, schoolSettings, teacherProfile)}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Cetak PDF Kop Sekolah</span>
        </button>
      </div>

      {/* CLASS & MODE CONTROLS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* CLASS SELECTOR */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas:</span>
            <div className="flex items-center gap-2">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  id={`btn-att-class-${cls.id}`}
                  onClick={() => onSelectClass(cls.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    cls.id === selectedClassId
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          </div>

          {/* VIEW MODE TOGGLE (Daily vs Monthly) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="btn-view-mode-daily"
              onClick={() => setActiveViewMode('daily')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === 'daily'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Input Harian
            </button>
            <button
              id="btn-view-mode-monthly"
              onClick={() => setActiveViewMode('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === 'monthly'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Rekap Bulanan
            </button>
          </div>
        </div>

        {/* DAILY MODE DATE CONTROL */}
        {activeViewMode === 'daily' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tanggal Presensi:</span>
              <input
                type="date"
                id="input-attendance-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* QUICK BULK SET TO HADIR */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Aksi Cepat:</span>
              <button
                id="btn-bulk-hadir"
                onClick={() => onBulkUpdateAttendance(selectedDate, 'H')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tandai Semua Hadir</span>
              </button>
            </div>
          </div>
        ) : (
          /* MONTHLY RECAP CONTROLS */
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pilih Bulan Rekap:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none"
            >
              <option value="Agustus 2026">Agustus 2026</option>
              <option value="Juli 2026">Juli 2026</option>
              <option value="September 2026">September 2026</option>
            </select>
          </div>
        )}
      </div>

      {/* STATS STRIP FOR SELECTED DATE */}
      {activeViewMode === 'daily' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-800">Hadir (H)</div>
              <div className="text-2xl font-bold text-emerald-900">{countH} Siswa</div>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-800">Sakit (S)</div>
              <div className="text-2xl font-bold text-amber-900">{countS} Siswa</div>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-indigo-800">Izin (I)</div>
              <div className="text-2xl font-bold text-indigo-900">{countI} Siswa</div>
            </div>
              <AlertCircle className="w-8 h-8 text-indigo-600" />
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-rose-800">Alpa (A)</div>
              <div className="text-2xl font-bold text-rose-900">{countA} Siswa</div>
            </div>
            <UserX className="w-8 h-8 text-rose-600" />
          </div>
        </div>
      )}

      {/* MAIN DATA TABLE VIEW */}
      {activeViewMode === 'daily' ? (
        /* DAILY MATRIX CHECKLIST TABLE */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4 font-semibold w-12 text-center">No</th>
                  <th className="py-3.5 px-4 font-semibold">NISN</th>
                  <th className="py-3.5 px-4 font-semibold">Nama Siswa</th>
                  <th className="py-3.5 px-4 font-semibold text-center w-16">L/P</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status Kehadiran</th>
                  <th className="py-3.5 px-4 font-semibold">Catatan / Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {classStudents.map((std, idx) => {
                  const currentRecord = attendance.find(
                    (a) => a.studentId === std.id && a.date === selectedDate
                  );
                  const currentStatus: AttendanceStatus = currentRecord ? currentRecord.status : 'H';
                  const currentNotes = currentRecord ? currentRecord.notes || '' : '';

                  return (
                    <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-400 font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-slate-700">
                        {std.nisn}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {std.name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xs font-bold text-slate-500">{std.gender}</span>
                      </td>

                      {/* TOGGLE MATRIX STATUS BUTTONS */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {(['H', 'S', 'I', 'A'] as AttendanceStatus[]).map((st) => {
                            const isSelected = currentStatus === st;
                            const conf = statusConfig[st];
                            return (
                              <button
                                key={st}
                                id={`btn-att-${std.id}-${st}`}
                                onClick={() => onUpdateAttendance(std.id, selectedDate, st, currentNotes)}
                                className={`w-9 h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
                                  isSelected
                                    ? `${conf.bg} ${conf.text} ${conf.border} ring-2 ring-indigo-500/20 scale-105`
                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                }`}
                                title={`${conf.label}`}
                              >
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* NOTES INPUT */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Keterangan sakit/izin/alpa..."
                          value={currentNotes}
                          onChange={(e) => onUpdateAttendance(std.id, selectedDate, currentStatus, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-indigo-600 text-slate-700"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* MONTHLY RECAP TABLE */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4 font-semibold w-12 text-center">No</th>
                  <th className="py-3.5 px-4 font-semibold">NISN</th>
                  <th className="py-3.5 px-4 font-semibold">Nama Siswa</th>
                  <th className="py-3.5 px-4 font-semibold text-center w-16">L/P</th>
                  <th className="py-3.5 px-4 font-semibold text-center text-emerald-400">Hadir (H)</th>
                  <th className="py-3.5 px-4 font-semibold text-center text-amber-400">Sakit (S)</th>
                  <th className="py-3.5 px-4 font-semibold text-center text-indigo-400">Izin (I)</th>
                  <th className="py-3.5 px-4 font-semibold text-center text-rose-400">Alpa (A)</th>
                  <th className="py-3.5 px-4 font-semibold text-center">% Kehadiran</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {classStudents.map((std, idx) => {
                  const stdAtt = attendance.filter((a) => a.studentId === std.id);
                  const hCount = stdAtt.filter((a) => a.status === 'H').length;
                  const sCount = stdAtt.filter((a) => a.status === 'S').length;
                  const iCount = stdAtt.filter((a) => a.status === 'I').length;
                  const aCount = stdAtt.filter((a) => a.status === 'A').length;
                  const totalRecorded = stdAtt.length || 1;
                  const pct = Math.round((hCount / totalRecorded) * 100);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-400 font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-slate-700">
                        {std.nisn}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {std.name}
                      </td>
                      <td className="py-3 px-4 text-center text-xs font-bold text-slate-500">
                        {std.gender}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-emerald-50/50">
                        {hCount}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-amber-700 bg-amber-50/50">
                        {sCount}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-indigo-700 bg-indigo-50/50">
                        {iCount}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-rose-700 bg-rose-50/50">
                        {aCount}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {pct}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                            pct >= 85
                              ? 'bg-emerald-100 text-emerald-800'
                              : pct >= 75
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {pct >= 85 ? 'Sangat Baik' : pct >= 75 ? 'Baik' : 'Perlu Bimbingan'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
