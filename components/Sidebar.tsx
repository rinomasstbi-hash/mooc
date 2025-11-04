
import React from 'react';
import { Course, Lesson } from '../types';
import { BookOpenIcon, CloseIcon, HomeIcon } from './icons';

interface SidebarProps {
  courses: Course[];
  selectedCourse: Course | null;
  onSelectCourse: (course: Course | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ courses, selectedCourse, onSelectCourse, isOpen, onClose }) => {
  
  const NavLink: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
  }> = ({ onClick, isActive, children }) => (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center p-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Mata Pelajaran</h2>
        <button onClick={onClose} className="md:hidden text-gray-500 dark:text-gray-400">
            <CloseIcon />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink onClick={() => onSelectCourse(null)} isActive={!selectedCourse}>
          <HomeIcon className="w-5 h-5 mr-3" />
          <span>Beranda</span>
        </NavLink>
        {courses.map(course => (
          <NavLink
            key={course.id}
            onClick={() => onSelectCourse(course)}
            isActive={selectedCourse?.id === course.id}
          >
            <BookOpenIcon className="w-5 h-5 mr-3" />
            <span className="flex-1">{course.title}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          &copy; 2024 MTsN 4 Jombang
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-30 bg-gray-900 bg-opacity-50 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:w-64 md:flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
