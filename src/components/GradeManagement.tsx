import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Award, 
  BookOpen, 
  Save, 
  RefreshCw,
  TrendingUp,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Student, GradeRecord, ClassRoom, SchoolSettings, TeacherProfile } from '../types';
import { calculateNilaiAkhir, calculatePredikat } from '../data/dummyData';
import { exportLegerExcel } from '../utils/excelGenerator';

interface GradeManagementProps {
  students: Student[];
  grades: GradeRecord[];
  classes: ClassRoom[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  onUpdateGrade: (studentId: string, subject: string, classId: string, updatedFields: Partial<GradeRecord>) => void;
  schoolSettings: SchoolSettings;
  teacherProfile: TeacherProfile;
}

export const GradeManagement: React.FC<GradeManagementProps> = ({
  students,
  grades,
  classes,
  selectedClassId,
  onSelectClass,
  onUpdateGrade,
  schoolSettings,
  teacherProfile,
}) => {
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const subjects = ['Matematika', 'Fisika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Sejarah'];

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Stats calculation
  const subjectGrades = classStudents.map((std) => {
    const existing = grades.find((g) => g.studentId === std.id && g.subject === selectedSubject);
    if (existing) return existing;
    return {
      id: `temp-${std.id}`,
      studentId: std.id,
      classId: selectedClassId,
      subject: selectedSubject,
      tugas1: 80,
      tugas2: 80,
      tugas3: 80,
      uh: 80,
      uts: 80,
      uas: 80,
      nilaiAkhir: 80,
      predikat: 'B (Baik)',
    };
  });

  const avgNA = subjectGrades.length > 0
    ? Math.round((subjectGrades.reduce((sum, g) => sum + g.nilaiAkhir, 0) / subjectGrades.length) * 10) / 10
    : 0;

  const maxNA = subjectGrades.length > 0 ? Math.max(...subjectGrades.map((g) => g.nilaiAkhir)) : 0;
  const minNA = subjectGrades.length > 0 ? Math.min(...subjectGrades.map((g) => g.nilaiAkhir)) : 0;

  const countA = subjectGrades.filter((g) => g.nilaiAkhir >= 90).length;
  const countB = subjectGrades.filter((g) => g.nilaiAkhir >= 80 && g.nilaiAkhir < 90).length;
  const countC = subjectGrades.filter((g) => g.nilaiAkhir >= 70 && g.nilaiAkhir < 80).length;
  const countD = subjectGrades.filter((g) => g.nilaiAkhir < 70).length;

  const handleInputChange = (
    studentId: string,
    field: 'tugas1' | 'tugas2' | 'tugas3' | 'uh' | 'uts' | 'uas',
    valueStr: string
  ) => {
    const val = Math.min(100, Math.max(0, Number(valueStr) || 0));
    const existing = grades.find((g) => g.studentId === studentId && g.subject === selectedSubject) || {
      tugas1: 80,
      tugas2: 80,
      tugas3: 80,
      uh: 80,
      uts: 80,
      uas: 80,
      nilaiAkhir: 80,
      predikat: 'B (Baik)',
    };

    const newObj = {
      ...existing,
      [field]: val,
    };

    const na = calculateNilaiAkhir(
      newObj.tugas1,
      newObj.tugas2,
      newObj.tugas3,
      newObj.uh,
      newObj.uts,
      newObj.uas
    );
    const pred = calculatePredikat(na);

    onUpdateGrade(studentId, selectedSubject, selectedClassId, {
      ...newObj,
      nilaiAkhir: na,
      predikat: pred,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Penilaian & Leger Nilai
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Input nilai Tugas, UH, UTS, UAS dengan perhitungan otomatis Nilai Akhir (NA) & Predikat + Export Excel Rumus (=AVERAGE, =SUM)
            </p>
          </div>
        </div>

        {/* EXCEL EXPORT BUTTON */}
        <button
          id="btn-export-leger-excel"
          onClick={() => exportLegerExcel(currentClass, students, grades, selectedSubject, schoolSettings, teacherProfile)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel (.XLSX) Leger</span>
        </button>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* CLASS SELECTOR */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas:</span>
            <div className="flex items-center gap-2">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  id={`btn-grade-class-${cls.id}`}
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

          {/* SUBJECT SELECTOR */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran:</span>
            <select
              id="select-grade-subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold text-indigo-900 focus:outline-none focus:border-indigo-600"
            >
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FORMULA & BOBOT INFO BOX */}
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              <strong>Rumus Nilai Akhir (NA):</strong> (Rata Tugas × 20%) + (UH × 20%) + (UTS × 30%) + (UAS × 30%)
            </span>
          </div>
          <span className="font-semibold text-indigo-700 bg-white px-2.5 py-1 rounded-md border border-indigo-200 self-start sm:self-auto">
            Predikat: A (≥90) | B (≥80) | C (≥70) | D (&lt;70)
          </span>
        </div>
      </div>

      {/* STATS STRIP FOR LEGER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Kelas</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{avgNA}</div>
          <p className="text-[11px] text-slate-400">Nilai Akhir Rata-Rata</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nilai Tertinggi / MAX</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{maxNA}</div>
          <p className="text-[11px] text-slate-400">Nilai Teratas di Kelas</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nilai Terendah / MIN</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">{minNA}</div>
          <p className="text-[11px] text-slate-400">Perlu Pengayaan / Bimbingan</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Distribusi Predikat</span>
          <div className="text-xs font-bold text-slate-800 mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">A: {countA}</span>
            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">B: {countB}</span>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">C: {countC}</span>
            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">D: {countD}</span>
          </div>
        </div>
      </div>

      {/* GRADE INPUT LEGER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-3 font-semibold w-10 text-center">No</th>
                <th className="py-3.5 px-3 font-semibold">NISN</th>
                <th className="py-3.5 px-3 font-semibold min-w-[180px]">Nama Lengkap Siswa</th>
                <th className="py-3.5 px-3 font-semibold text-center w-12">L/P</th>
                <th className="py-3.5 px-3 font-semibold text-center w-16 bg-slate-800">Tugas 1</th>
                <th className="py-3.5 px-3 font-semibold text-center w-16 bg-slate-800">Tugas 2</th>
                <th className="py-3.5 px-3 font-semibold text-center w-16 bg-slate-800">Tugas 3</th>
                <th className="py-3.5 px-3 font-semibold text-center w-16 bg-slate-800 text-teal-300">UH</th>
                <th className="py-3.5 px-3 font-semibold text-center w-16 bg-slate-800 text-amber-300">UTS</th>
                <th className="py-3.5 px-3 font-semibold text-center w-16 bg-slate-800 text-rose-300">UAS</th>
                <th className="py-3.5 px-3 font-semibold text-center w-24 bg-indigo-950 text-indigo-200">Nilai Akhir (NA)</th>
                <th className="py-3.5 px-3 font-semibold text-center min-w-[120px]">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {classStudents.map((std, idx) => {
                const grd = grades.find((g) => g.studentId === std.id && g.subject === selectedSubject) || {
                  tugas1: 80,
                  tugas2: 80,
                  tugas3: 80,
                  uh: 80,
                  uts: 80,
                  uas: 80,
                  nilaiAkhir: 80,
                  predikat: 'B (Baik)',
                };

                return (
                  <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono text-xs text-slate-400 font-bold">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs font-bold text-slate-700">
                      {std.nisn}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {std.name}
                    </td>
                    <td className="py-2.5 px-3 text-center text-xs font-bold text-slate-500">
                      {std.gender}
                    </td>

                    {/* INPUT TUGAS 1 */}
                    <td className="py-2 px-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={grd.tugas1}
                        onChange={(e) => handleInputChange(std.id, 'tugas1', e.target.value)}
                        className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-1 font-semibold text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </td>

                    {/* INPUT TUGAS 2 */}
                    <td className="py-2 px-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={grd.tugas2}
                        onChange={(e) => handleInputChange(std.id, 'tugas2', e.target.value)}
                        className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-1 font-semibold text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </td>

                    {/* INPUT TUGAS 3 */}
                    <td className="py-2 px-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={grd.tugas3}
                        onChange={(e) => handleInputChange(std.id, 'tugas3', e.target.value)}
                        className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-1 font-semibold text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </td>

                    {/* INPUT UH */}
                    <td className="py-2 px-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={grd.uh}
                        onChange={(e) => handleInputChange(std.id, 'uh', e.target.value)}
                        className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-1 font-semibold text-xs text-teal-800 focus:outline-none focus:border-teal-600 focus:bg-white"
                      />
                    </td>

                    {/* INPUT UTS */}
                    <td className="py-2 px-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={grd.uts}
                        onChange={(e) => handleInputChange(std.id, 'uts', e.target.value)}
                        className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-1 font-semibold text-xs text-amber-800 focus:outline-none focus:border-amber-600 focus:bg-white"
                      />
                    </td>

                    {/* INPUT UAS */}
                    <td className="py-2 px-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={grd.uas}
                        onChange={(e) => handleInputChange(std.id, 'uas', e.target.value)}
                        className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-1 font-semibold text-xs text-rose-800 focus:outline-none focus:border-rose-600 focus:bg-white"
                      />
                    </td>

                    {/* CALCULATED NA */}
                    <td className="py-2.5 px-3 text-center font-bold text-sm text-indigo-700 bg-indigo-50/40">
                      {grd.nilaiAkhir}
                    </td>

                    {/* PREDIKAT BADGE */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md ${
                          grd.nilaiAkhir >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : grd.nilaiAkhir >= 80
                            ? 'bg-indigo-100 text-indigo-800'
                            : grd.nilaiAkhir >= 70
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {grd.predikat}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FOOTER INFO */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-2">
          <span>
            Leger Nilai Mata Pelajaran <strong>{selectedSubject}</strong> Kelas <strong>{currentClass.name}</strong>
          </span>
          <span className="text-emerald-700 font-semibold">
            Perubahan nilai langsung tersimpan otomatis di memori lokal
          </span>
        </div>
      </div>
    </div>
  );
};
