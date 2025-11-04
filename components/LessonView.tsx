import React from 'react';
import { Lesson, LessonProgress } from '../types';
import { BookOpenIcon, CheckCircleIcon, ChevronRightIcon, LockClosedIcon, VideoCameraIcon } from './icons';

interface LessonViewProps {
  lesson: Lesson;
  progress: LessonProgress;
  onBack: () => void;
  onStartSession: (session: 'apersepsi' | 'kegiatanInti' | 'asesmenAkhir' | 'penutup', subMateriIndex?: number) => void;
}

const SessionStatusIcon: React.FC<{ status: 'locked' | 'available' | 'completed' }> = ({ status }) => {
  if (status === 'completed') {
    return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
  }
  if (status === 'locked') {
    return <LockClosedIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />;
  }
  return <ChevronRightIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />;
};

const LessonView: React.FC<LessonViewProps> = ({ lesson, progress, onBack, onStartSession }) => {
  
  const getKegiatanIntiStatus = (index: number): 'locked' | 'available' | 'completed' => {
    if (progress.completedKegiatanInti > index) return 'completed';
    if (progress.completedKegiatanInti === index) return 'available';
    return 'locked';
  }

  const isKegiatanIntiAvailable = progress.completedApersepsi;
  const isAsesmenAkhirAvailable = isKegiatanIntiAvailable && progress.completedKegiatanInti >= lesson.kegiatanInti.length;
  const isPenutupAvailable = isAsesmenAkhirAvailable && progress.completedAsesmenAkhir;

  const getOverallStatus = (session: 'apersepsi' | 'asesmenAkhir' | 'penutup'): 'locked' | 'available' | 'completed' => {
    switch(session) {
      case 'apersepsi':
        return progress.completedApersepsi ? 'completed' : 'available';
      case 'asesmenAkhir':
        if (progress.completedAsesmenAkhir) return 'completed';
        return isAsesmenAkhirAvailable ? 'available' : 'locked';
      case 'penutup':
        if (progress.completedPenutup) return 'completed';
        return isPenutupAvailable ? 'available' : 'locked';
      default:
        return 'locked';
    }
  }

  const SessionButton: React.FC<{
    title: string;
    description: string;
    status: 'locked' | 'available' | 'completed';
    onClick: () => void;
  }> = ({ title, description, status, onClick }) => (
    <button
      onClick={onClick}
      disabled={status === 'locked'}
      className="w-full flex items-center p-5 text-left bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
    >
      <div className="flex-shrink-0 mr-4">
        <SessionStatusIcon status={status} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </button>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 text-sm font-medium text-green-600 dark:text-green-400 hover:underline flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Kembali ke Daftar Pelajaran
      </button>
      
      <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Selesaikan semua sesi secara berurutan untuk menyelesaikan pelajaran.</p>
      </div>

      <div className="space-y-4">
        {/* Sesi 1 */}
        <SessionButton 
          title="Sesi 1: Apersepsi" 
          description="Memulai pelajaran dengan pendahuluan."
          status={getOverallStatus('apersepsi')}
          onClick={() => onStartSession('apersepsi')}
        />

        {/* Sesi 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-5 space-y-3">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Sesi 2: Kegiatan Inti</h3>
          {!isKegiatanIntiAvailable && <p className="text-xs text-center text-gray-400 dark:text-gray-500 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">Selesaikan Sesi 1 untuk membuka sesi ini.</p>}
          {lesson.kegiatanInti.map((sub, index) => {
            const status = getKegiatanIntiStatus(index);
            return (
               <button
                  key={sub.id}
                  onClick={() => onStartSession('kegiatanInti', index)}
                  disabled={status === 'locked' || !isKegiatanIntiAvailable}
                  className="w-full flex items-center p-3 text-left rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
               >
                 <div className="flex-shrink-0 mr-3">
                   <SessionStatusIcon status={status} />
                 </div>
                 <div className="flex-1">
                   <p className="font-medium text-gray-700 dark:text-gray-200">{sub.title}</p>
                 </div>
               </button>
            )
          })}
        </div>

        {/* Sesi 3 */}
         <SessionButton 
          title="Sesi 3: Asesmen Akhir" 
          description="Uji pemahamanmu atas seluruh materi."
          status={getOverallStatus('asesmenAkhir')}
          onClick={() => onStartSession('asesmenAkhir')}
        />

        {/* Sesi 4 */}
         <SessionButton 
          title="Sesi 4: Penutup" 
          description="Berikan refleksimu tentang pelajaran ini."
          status={getOverallStatus('penutup')}
          onClick={() => onStartSession('penutup')}
        />
      </div>
    </div>
  );
};

export default LessonView;
