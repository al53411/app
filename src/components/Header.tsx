import React from 'react';
import { SchoolSettings, TeacherProfile, ClassRoom } from '../types';
import { School, User, Calendar, Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  schoolSettings: SchoolSettings;
  teacherProfile: TeacherProfile;
  classes: ClassRoom[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  schoolSettings,
  teacherProfile,
  classes,
  selectedClassId,
  onSelectClass,
}) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 sticky top-0">
      {/* LEFT: SCHOOL NAME & CLASS SELECTOR */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="bg-slate-100 p-2 rounded-lg text-indigo-600">
            <School className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">
              {schoolSettings.schoolName}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              NPSN: {schoolSettings.npsn}
            </p>
          </div>
        </div>

        {/* ACTIVE CLASS SELECTOR */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
          <span className="text-xs text-slate-500 font-medium">Kelas:</span>
          <div className="relative">
            <select
              id="header-class-selector"
              value={selectedClassId}
              onChange={(e) => onSelectClass(e.target.value)}
              className="appearance-none bg-transparent font-semibold text-xs text-indigo-600 pr-5 focus:outline-none cursor-pointer"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.gradeLevel})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-600 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* RIGHT: DATE & TEACHER INFO */}
      <div className="flex items-center gap-3">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>{currentDate}</span>
        </div>

        {/* Notification Bell */}
        <button 
          id="btn-header-notifications"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Teacher Profile Widget */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center border border-indigo-200 text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {teacherProfile.name}
            </span>
            <span className="text-[10px] text-slate-500">
              {teacherProfile.mainSubject}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

