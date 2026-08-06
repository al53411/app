import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Plus, 
  Eye, 
  Save, 
  FileText, 
  Trash2, 
  Sparkles,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { RppItem, SchoolSettings, TeacherProfile } from '../types';
import { exportRppPdf } from '../utils/pdfGenerator';

interface RppGeneratorProps {
  rpps: RppItem[];
  onSaveRpp: (rpp: RppItem) => void;
  onDeleteRpp: (id: string) => void;
  schoolSettings: SchoolSettings;
  teacherProfile: TeacherProfile;
}

export const RppGenerator: React.FC<RppGeneratorProps> = ({
  rpps,
  onSaveRpp,
  onDeleteRpp,
  schoolSettings,
  teacherProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'editor'>('list');
  const [selectedRpp, setSelectedRpp] = useState<RppItem | null>(rpps[0] || null);
  const [previewMode, setPreviewMode] = useState<boolean>(true);

  // Form State for editing or creating RPP
  const [formData, setFormData] = useState<Partial<RppItem>>({
    title: '',
    mataPelajaran: 'Matematika',
    faseKelas: 'Fase E / Kelas X',
    elemen: '',
    capaianPembelajaran: '',
    tujuanPembelajaran: '',
    alokasiWaktu: '2 JP x 45 Menit',
    kegiatanPendahuluan: '',
    kegiatanInti: '',
    kegiatanPenutup: '',
    asesmen: '',
    mediaSumber: '',
  });

  const handleStartNew = () => {
    setFormData({
      title: 'Modul Ajar: ',
      mataPelajaran: teacherProfile.mainSubject || 'Matematika',
      faseKelas: 'Fase E / Kelas X',
      elemen: 'Aljabar dan Fungsi',
      capaianPembelajaran: 'Peserta didik dapat menganalisis dan menyelesaikan masalah kontekstual.',
      tujuanPembelajaran: '1. Mengidentifikasi konsep dasar.\n2. Menyelesaikan soal latihan kontekstual.',
      alokasiWaktu: '2 JP x 45 Menit',
      kegiatanPendahuluan: '- Salam pembuka dan doa bersama.\n- Apersepsi & pengantar materi.',
      kegiatanInti: '- Orientasi peserta didik pada masalah.\n- Pengorganisasian kelompok belajar.\n- Presentasi hasil diskusi.',
      kegiatanPenutup: '- Kesimpulan materi bersama guru.\n- Evaluasi singkat dan penutupan.',
      asesmen: '- Asesmen Formatif (Observasi & LKPD).\n- Asesmen Sumatif (Kuis Uraian).',
      mediaSumber: 'Buku Paket Siswa Kurikulum Merdeka, Proyektor, LKPD Cetak.',
    });
    setSelectedRpp(null);
    setActiveTab('editor');
  };

  const handleEditExisting = (rpp: RppItem) => {
    setSelectedRpp(rpp);
    setFormData(rpp);
    setActiveTab('editor');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.mataPelajaran) {
      alert('Judul Modul Ajar dan Mata Pelajaran wajib diisi!');
      return;
    }

    const newRppItem: RppItem = {
      id: selectedRpp ? selectedRpp.id : `rpp-${Date.now()}`,
      title: formData.title || 'Modul Ajar',
      mataPelajaran: formData.mataPelajaran || 'Matematika',
      faseKelas: formData.faseKelas || 'Fase E / Kelas X',
      elemen: formData.elemen || '',
      capaianPembelajaran: formData.capaianPembelajaran || '',
      tujuanPembelajaran: formData.tujuanPembelajaran || '',
      alokasiWaktu: formData.alokasiWaktu || '2 JP x 45 Menit',
      kegiatanPendahuluan: formData.kegiatanPendahuluan || '',
      kegiatanInti: formData.kegiatanInti || '',
      kegiatanPenutup: formData.kegiatanPenutup || '',
      asesmen: formData.asesmen || '',
      mediaSumber: formData.mediaSumber || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveRpp(newRppItem);
    setSelectedRpp(newRppItem);
    alert('Modul Ajar / RPP berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Perangkat Pembelajaran (RPP / Modul Ajar)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Generator RPP Kurikulum Merdeka (Capaian, Tujuan, Kegiatan, Asesmen) & Export PDF Cetak
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-rpp-tab-list"
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === 'list'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Daftar Modul Ajar ({rpps.length})
          </button>
          <button
            id="btn-rpp-create-new"
            onClick={handleStartNew}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Modul Ajar Baru</span>
          </button>
        </div>
      </div>

      {/* VIEW CONTENT SWITCH */}
      {activeTab === 'list' ? (
        /* LIST OF RPPS CARD GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rpps.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                    {item.mataPelajaran}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.faseKelas}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  <strong className="text-slate-700">CP:</strong> {item.capaianPembelajaran}
                </p>
                <div className="text-[11px] text-slate-400 font-medium pt-1">
                  Alokasi Waktu: {item.alokasiWaktu} | Dibuat: {item.createdAt}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`btn-edit-rpp-${item.id}`}
                  onClick={() => handleEditExisting(item)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Edit / Preview</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-pdf-rpp-${item.id}`}
                    onClick={() => exportRppPdf(item, schoolSettings, teacherProfile)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    id={`btn-delete-rpp-${item.id}`}
                    onClick={() => {
                      if (confirm(`Hapus Modul Ajar "${item.title}"?`)) {
                        onDeleteRpp(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* EDITOR & PREVIEW SPLIT VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: RPP FORM EDITOR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">
                Form Modul Ajar Kurikulum Merdeka
              </h3>
              <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md">
                Mode Penyuntingan
              </span>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Judul Modul Ajar / Topik Pembelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Mata Pelajaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mataPelajaran || ''}
                    onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Fase & Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.faseKelas || ''}
                    onChange={(e) => setFormData({ ...formData, faseKelas: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Elemen Domain
                  </label>
                  <input
                    type="text"
                    value={formData.elemen || ''}
                    onChange={(e) => setFormData({ ...formData, elemen: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Alokasi Waktu
                  </label>
                  <input
                    type="text"
                    value={formData.alokasiWaktu || ''}
                    onChange={(e) => setFormData({ ...formData, alokasiWaktu: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Capaian Pembelajaran (CP)
                </label>
                <textarea
                  rows={2}
                  value={formData.capaianPembelajaran || ''}
                  onChange={(e) => setFormData({ ...formData, capaianPembelajaran: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Tujuan Pembelajaran (TP)
                </label>
                <textarea
                  rows={2}
                  value={formData.tujuanPembelajaran || ''}
                  onChange={(e) => setFormData({ ...formData, tujuanPembelajaran: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Kegiatan Pendahuluan
                </label>
                <textarea
                  rows={2}
                  value={formData.kegiatanPendahuluan || ''}
                  onChange={(e) => setFormData({ ...formData, kegiatanPendahuluan: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Kegiatan Inti
                </label>
                <textarea
                  rows={3}
                  value={formData.kegiatanInti || ''}
                  onChange={(e) => setFormData({ ...formData, kegiatanInti: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Kegiatan Penutup & Refleksi
                </label>
                <textarea
                  rows={2}
                  value={formData.kegiatanPenutup || ''}
                  onChange={(e) => setFormData({ ...formData, kegiatanPenutup: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Asesmen & Evaluasi
                  </label>
                  <textarea
                    rows={2}
                    value={formData.asesmen || ''}
                    onChange={(e) => setFormData({ ...formData, asesmen: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Media & Sumber Belajar
                  </label>
                  <textarea
                    rows={2}
                    value={formData.mediaSumber || ''}
                    onChange={(e) => setFormData({ ...formData, mediaSumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Modul Ajar</span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: REALTIME PREVIEW DOCUMENT */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-800">
                  Preview Dokumen Cetak
                </h3>
              </div>

              <button
                id="btn-rpp-preview-pdf-download"
                onClick={() => {
                  if (formData.title) {
                    exportRppPdf(formData as RppItem, schoolSettings, teacherProfile);
                  }
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Cetak PDF</span>
              </button>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-serif text-slate-900 space-y-4 text-xs leading-relaxed max-h-[600px] overflow-y-auto">
              <div className="text-center space-y-1 pb-3 border-b border-slate-300">
                <h4 className="font-bold text-sm tracking-wide">
                  {schoolSettings.schoolName.toUpperCase()}
                </h4>
                <p className="font-sans text-[11px] text-slate-600">
                  {schoolSettings.address}, {schoolSettings.city}
                </p>
                <h5 className="font-bold text-xs uppercase pt-2 font-sans tracking-wide text-indigo-900">
                  MODUL AJAR KURIKULUM MERDEKA
                </h5>
                <h6 className="font-bold text-sm font-sans text-slate-800">
                  {formData.title || 'Judul Modul Ajar'}
                </h6>
              </div>

              <div className="grid grid-cols-2 gap-2 font-sans text-[11px] bg-white p-3 rounded-lg border border-slate-200">
                <div><strong>Mapel:</strong> {formData.mataPelajaran}</div>
                <div><strong>Fase/Kelas:</strong> {formData.faseKelas}</div>
                <div><strong>Elemen:</strong> {formData.elemen}</div>
                <div><strong>Waktu:</strong> {formData.alokasiWaktu}</div>
              </div>

              <div className="space-y-1 font-sans">
                <h5 className="font-bold text-xs text-slate-800 bg-slate-200/80 px-2 py-1 rounded-sm">
                  I. CAPAIAN PEMBELAJARAN (CP)
                </h5>
                <p className="text-slate-700 pl-2">{formData.capaianPembelajaran || '-'}</p>
              </div>

              <div className="space-y-1 font-sans">
                <h5 className="font-bold text-xs text-slate-800 bg-slate-200/80 px-2 py-1 rounded-sm">
                  II. TUJUAN PEMBELAJARAN (TP)
                </h5>
                <p className="text-slate-700 pl-2 whitespace-pre-line">{formData.tujuanPembelajaran || '-'}</p>
              </div>

              <div className="space-y-2 font-sans">
                <h5 className="font-bold text-xs text-slate-800 bg-slate-200/80 px-2 py-1 rounded-sm">
                  III. KEGIATAN PEMBELAJARAN
                </h5>
                <div className="pl-2 space-y-2 text-slate-700">
                  <div>
                    <strong className="block text-slate-900">A. Pendahuluan:</strong>
                    <p className="whitespace-pre-line">{formData.kegiatanPendahuluan || '-'}</p>
                  </div>
                  <div>
                    <strong className="block text-slate-900">B. Kegiatan Inti:</strong>
                    <p className="whitespace-pre-line">{formData.kegiatanInti || '-'}</p>
                  </div>
                  <div>
                    <strong className="block text-slate-900">C. Penutup:</strong>
                    <p className="whitespace-pre-line">{formData.kegiatanPenutup || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1 font-sans">
                <h5 className="font-bold text-xs text-slate-800 bg-slate-200/80 px-2 py-1 rounded-sm">
                  IV. ASESMEN & EVALUASI
                </h5>
                <p className="text-slate-700 pl-2 whitespace-pre-line">{formData.asesmen || '-'}</p>
              </div>

              <div className="space-y-1 font-sans">
                <h5 className="font-bold text-xs text-slate-800 bg-slate-200/80 px-2 py-1 rounded-sm">
                  V. MEDIA & SUMBER BELAJAR
                </h5>
                <p className="text-slate-700 pl-2 whitespace-pre-line">{formData.mediaSumber || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
