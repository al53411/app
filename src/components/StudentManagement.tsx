import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Filter, 
  Plus, 
  Phone, 
  User,
  GraduationCap
} from 'lucide-react';
import { Student, ClassRoom } from '../types';
import { StudentModal } from './StudentModal';

interface StudentManagementProps {
  students: Student[];
  classes: ClassRoom[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  onAddStudent: (studentData: Partial<Student>) => void;
  onUpdateStudent: (id: string, studentData: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
  onAddClass: (className: string, gradeLevel: string) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  classes,
  selectedClassId,
  onSelectClass,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAddClass,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'Semua' | 'L' | 'P'>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // New Class Inline Form Toggle
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newGradeLevel, setNewGradeLevel] = useState('Kelas X');

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Filter students for current class & search query & gender filter
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  const filteredStudents = classStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nisn.includes(searchQuery) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender =
      genderFilter === 'Semua' ? true : student.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  const countL = classStudents.filter((s) => s.gender === 'L').length;
  const countP = classStudents.filter((s) => s.gender === 'P').length;

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (std: Student) => {
    setEditingStudent(std);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (data: Partial<Student>) => {
    if (editingStudent) {
      onUpdateStudent(editingStudent.id, data);
    } else {
      onAddStudent(data);
    }
  };

  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    onAddClass(newClassName.trim(), newGradeLevel);
    setNewClassName('');
    setShowAddClassForm(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Data Siswa & Kelas
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Kelola biodata siswa, NISN, wali murid, serta pengelompokan kelas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-add-class-toggle"
            onClick={() => setShowAddClassForm(!showAddClassForm)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kelas Baru</span>
          </button>
          <button
            id="btn-add-student"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* INLINE FORM ADD CLASS */}
      {showAddClassForm && (
        <form
          onSubmit={handleCreateClassSubmit}
          className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3"
        >
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-4 h-4" /> Buat Kelas Baru:
          </span>
          <input
            type="text"
            required
            placeholder="Nama Kelas (Contoh: XII MIPA 3)"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-indigo-600 flex-1"
          />
          <select
            value={newGradeLevel}
            onChange={(e) => setNewGradeLevel(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none"
          >
            <option value="Kelas X">Kelas X</option>
            <option value="Kelas XI">Kelas XI</option>
            <option value="Kelas XII">Kelas XII</option>
          </select>
          <button
            type="submit"
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
          >
            Simpan Kelas
          </button>
          <button
            type="button"
            onClick={() => setShowAddClassForm(false)}
            className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300"
          >
            Batal
          </button>
        </form>
      )}

      {/* BARIS CLASS SELECTOR & SEARCH & FILTER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* CLASS SELECTOR TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {classes.map((cls) => {
              const isActive = cls.id === selectedClassId;
              const countInClass = students.filter((s) => s.classId === cls.id).length;
              return (
                <button
                  key={cls.id}
                  id={`class-tab-${cls.id}`}
                  onClick={() => onSelectClass(cls.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{cls.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {countInClass} Siswa
                  </span>
                </button>
              );
            })}
          </div>

          {/* QUICK COUNTER BADGES */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 flex-shrink-0">
            <span>Total: <strong className="text-slate-900">{classStudents.length}</strong></span>
            <span>|</span>
            <span className="text-indigo-600">Laki-Laki: <strong>{countL}</strong></span>
            <span>|</span>
            <span className="text-rose-600">Perempuan: <strong>{countP}</strong></span>
          </div>
        </div>

        {/* SEARCH & GENDER FILTER */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-search-students"
              placeholder="Cari nama siswa, NISN, atau nama orang tua..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-600 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">Gender:</span>
            <select
              id="select-gender-filter"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as 'Semua' | 'L' | 'P')}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none"
            >
              <option value="Semua">Semua (L & P)</option>
              <option value="L">Hanya Laki-Laki (L)</option>
              <option value="P">Hanya Perempuan (P)</option>
            </select>
          </div>
        </div>
      </div>

      {/* FLAT STUDENT DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4 font-semibold w-12 text-center">No</th>
                <th className="py-3.5 px-4 font-semibold">NISN / NIS</th>
                <th className="py-3.5 px-4 font-semibold">Nama Lengkap Siswa</th>
                <th className="py-3.5 px-4 font-semibold text-center w-16">L/P</th>
                <th className="py-3.5 px-4 font-semibold">Tempat, Tgl Lahir</th>
                <th className="py-3.5 px-4 font-semibold">Orang Tua / Wali</th>
                <th className="py-3.5 px-4 font-semibold">No HP / Whatsapp</th>
                <th className="py-3.5 px-4 font-semibold text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((std, idx) => (
                  <tr
                    key={std.id}
                    className="hover:bg-slate-50/80 transition-colors text-slate-700"
                  >
                    <td className="py-3 px-4 font-mono text-xs text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs font-bold text-slate-800">
                        {std.nisn}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        NIS: {std.nis || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {std.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md ${
                          std.gender === 'L'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {std.gender}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div className="font-medium text-slate-700">{std.birthPlace || '-'}</div>
                      <div className="text-slate-400">{std.birthDate || '-'}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-700">
                      {std.parentName || '-'}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-600">
                      {std.parentPhone ? (
                        <a
                          href={`https://wa.me/${std.parentPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline font-semibold"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          {std.parentPhone}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          id={`btn-edit-student-${std.id}`}
                          onClick={() => handleOpenEditModal(std)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Siswa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-delete-student-${std.id}`}
                          onClick={() => {
                            if (confirm(`Hapus data siswa ${std.name}?`)) {
                              onDeleteStudent(std.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <User className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium">Tidak ada data siswa ditemukan</p>
                    <p className="text-xs">Coba ubah kata kunci pencarian atau filter kelas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER TABLE INFO */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Menampilkan <strong>{filteredStudents.length}</strong> dari{' '}
            <strong>{classStudents.length}</strong> siswa di Kelas {selectedClass.name}
          </span>
          <span>Daftar Siswa Resmi TA 2026/2027</span>
        </div>
      </div>

      {/* STUDENT MODAL */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        initialData={editingStudent}
        classes={classes}
        selectedClassId={selectedClassId}
      />
    </div>
  );
};
