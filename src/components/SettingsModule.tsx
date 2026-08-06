import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, School, User, CheckCircle2, RotateCcw } from 'lucide-react';
import { SchoolSettings, TeacherProfile } from '../types';

interface SettingsModuleProps {
  schoolSettings: SchoolSettings;
  teacherProfile: TeacherProfile;
  onSaveSchoolSettings: (settings: SchoolSettings) => void;
  onSaveTeacherProfile: (profile: TeacherProfile) => void;
  onResetToDefault: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  schoolSettings,
  teacherProfile,
  onSaveSchoolSettings,
  onSaveTeacherProfile,
  onResetToDefault,
}) => {
  const [schoolForm, setSchoolForm] = useState<SchoolSettings>(schoolSettings);
  const [teacherForm, setTeacherForm] = useState<TeacherProfile>(teacherProfile);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchoolSettings(schoolForm);
    onSaveTeacherProfile(teacherForm);
    setSavedMessage('Pengaturan Sekolah dan Profil Guru Berhasil Diperbarui!');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-2xl">
            <SettingsIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Pengaturan Sekolah & Profil Guru
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sesuaikan identitas sekolah untuk Kop Surat PDF, tanda tangan raport, serta biodata guru pengampu
            </p>
          </div>
        </div>

        <button
          onClick={onResetToDefault}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Data Awal</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs font-semibold text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* SECTION 1: PENGATURAN IDENTITAS SEKOLAH & KOP SURAT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <School className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-800">
              1. Identitas Sekolah & Kop Surat Resmi
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Baris 1 Kop Surat (Dinas Pendidikan)
              </label>
              <input
                type="text"
                value={schoolForm.kopLine1}
                onChange={(e) => setSchoolForm({ ...schoolForm, kopLine1: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Baris 2 Kop Surat (Cabang Dinas / Wilayah)
              </label>
              <input
                type="text"
                value={schoolForm.kopLine2}
                onChange={(e) => setSchoolForm({ ...schoolForm, kopLine2: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Nama Sekolah Resmi *
              </label>
              <input
                type="text"
                required
                value={schoolForm.schoolName}
                onChange={(e) => setSchoolForm({ ...schoolForm, schoolName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                NPSN (Nomor Pokok Sekolah Nasional)
              </label>
              <input
                type="text"
                value={schoolForm.npsn}
                onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-800 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Alamat Lengkap Sekolah
              </label>
              <input
                type="text"
                value={schoolForm.address}
                onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Kota / Kabupaten
              </label>
              <input
                type="text"
                value={schoolForm.city}
                onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Provinsi
              </label>
              <input
                type="text"
                value={schoolForm.province}
                onChange={(e) => setSchoolForm({ ...schoolForm, province: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Telepon Sekolah
              </label>
              <input
                type="text"
                value={schoolForm.phone}
                onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Email Resmi Sekolah
              </label>
              <input
                type="email"
                value={schoolForm.email}
                onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Nama Kepala Sekolah (Untuk Tanda Tangan PDF)
              </label>
              <input
                type="text"
                value={schoolForm.principalName}
                onChange={(e) => setSchoolForm({ ...schoolForm, principalName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={schoolForm.principalNip}
                onChange={(e) => setSchoolForm({ ...schoolForm, principalNip: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: BIODATA GURU PENGAMPU */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-base text-slate-800">
              2. Profil Guru Pengampu / Wali Kelas
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Nama Lengkap Guru (dengan Gelar) *
              </label>
              <input
                type="text"
                required
                value={teacherForm.name}
                onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                NIP Guru
              </label>
              <input
                type="text"
                value={teacherForm.nip}
                onChange={(e) => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Mata Pelajaran Utama
              </label>
              <input
                type="text"
                value={teacherForm.mainSubject}
                onChange={(e) => setTeacherForm({ ...teacherForm, mainSubject: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Wali Kelas Utama
              </label>
              <input
                type="text"
                value={teacherForm.homeroomClass}
                onChange={(e) => setTeacherForm({ ...teacherForm, homeroomClass: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Email Guru
              </label>
              <input
                type="email"
                value={teacherForm.email}
                onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                No HP / Whatsapp Guru
              </label>
              <input
                type="text"
                value={teacherForm.phone}
                onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            id="btn-save-settings"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
