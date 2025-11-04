
import React from 'react';
import { Course, Lesson } from '../types';
import { ChevronRightIcon } from './icons';

interface CourseViewProps {
  course: Course;
  onSelectLesson: (lesson: Lesson) => void;
}

const CourseView: React.FC<CourseViewProps> = ({ course, onSelectLesson }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
      </div>

      <div className="space-y-6">
        {course.modules.map((module, index) => (
          <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 bg-gray-50 dark:bg-gray-700/50">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                <span className="text-green-600 dark:text-green-400">Modul {index + 1}:</span> {module.title}
              </h2>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {module.lessons.map(lesson => (
                <li key={lesson.id}>
                  <button
                    onClick={() => onSelectLesson(lesson)}
                    className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                  >
                    <span className="text-md text-gray-700 dark:text-gray-200">{lesson.title}</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseView;
