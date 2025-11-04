import React from 'react';
import { MenuIcon, UserCircleIcon, LogoutIcon } from './icons';
import { User } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, user, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white mr-4"
              aria-label="Buka menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              MOOC <span className="text-green-600 dark:text-green-400">MTsN 4 Jombang</span>
            </h1>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-3">
               <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
               <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
            </div>
            <UserCircleIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            <button 
              onClick={onLogout}
              className="ml-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              aria-label="Keluar"
            >
                <LogoutIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;