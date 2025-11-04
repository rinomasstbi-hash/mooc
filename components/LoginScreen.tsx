import React from 'react';
import { User } from '../types';
import { BookOpenIcon } from './icons';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
        
        <div className="flex flex-col items-center">
          <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
            <BookOpenIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            MOOC MTsN 4 Jombang
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Silakan masuk untuk melanjutkan</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onLogin({ role: 'siswa', name: 'Siswa' })}
            className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
          >
            Masuk sebagai Siswa
          </button>
           <button
            onClick={() => onLogin({ role: 'guru', name: 'Guru' })}
            className="w-full px-4 py-3 font-semibold text-gray-700 bg-gray-200 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-transform transform hover:scale-105"
          >
            Masuk sebagai Guru
          </button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 pt-4">
          Fokus pengembangan saat ini pada fitur alur belajar siswa.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;