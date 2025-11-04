import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import CourseView from './components/CourseView';
import LessonView from './components/LessonView';
import QuizView from './components/QuizView';
import { Course, Lesson, User, LessonProgress, SubMateri, Quiz } from './types';
import { DUMMY_COURSES, getInitialProgress } from './constants';
import { SparklesIcon, BookOpenIcon, CheckCircleIcon } from './components/icons';

type ActiveSession =
  | { type: 'apersepsiIntro'; lesson: Lesson }
  | { type: 'asesmenAwalResult'; lesson: Lesson; score: number }
  | { type: 'kegiatanInti'; lesson: Lesson; subMateri: SubMateri }
  | { type: 'quiz'; quiz: Quiz; onFinish: (score: number) => void; quizType: 'awal' | 'submateri' | 'akhir' }
  | { type: 'penutup'; lesson: Lesson; onFinish: (reflection: string) => void };

/**
 * Extracts the YouTube video ID from a given URL.
 * Handles standard, short, and embed URLs.
 * @param url The YouTube URL.
 * @returns The video ID or null if not found.
 */
const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return match[2];
    }
    return null;
};


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [courses] = useState<Course[]>(DUMMY_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});

  useEffect(() => {
    const savedUser = localStorage.getItem('mooc_user');
    const savedProgress = localStorage.getItem('mooc_progress');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const updateProgress = (lessonId: string, newProgress: Partial<LessonProgress>) => {
    setProgress(prev => {
      const current = prev[lessonId] || getInitialProgress(lessonId);
      const updated = { ...current, ...newProgress };
      const newProgressState = { ...prev, [lessonId]: updated };
      localStorage.setItem('mooc_progress', JSON.stringify(newProgressState));
      return newProgressState;
    });
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('mooc_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCourse(null);
    setSelectedLesson(null);
    setActiveSession(null);
    localStorage.removeItem('mooc_user');
  };
  
  const handleSelectCourse = (course: Course | null) => {
    setSelectedCourse(course);
    setSelectedLesson(null);
    setActiveSession(null);
    setSidebarOpen(false);
  };
  
  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    if (!progress[lesson.id]) {
      setProgress(prev => ({...prev, [lesson.id]: getInitialProgress(lesson.id)}));
    }
  };
  
  const handleBackToCourse = () => {
    setSelectedLesson(null);
    setActiveSession(null);
  };
  
  const handleBackToLesson = () => {
      setActiveSession(null);
  }

  const handleStartSession = (session: 'apersepsi' | 'kegiatanInti' | 'asesmenAkhir' | 'penutup', subMateriIndex?: number) => {
    if (!selectedLesson) return;

    if (session === 'apersepsi') {
        setActiveSession({ type: 'apersepsiIntro', lesson: selectedLesson });
    } else if (session === 'kegiatanInti' && subMateriIndex !== undefined) {
        const subMateri = selectedLesson.kegiatanInti[subMateriIndex];
        setActiveSession({ type: 'kegiatanInti', lesson: selectedLesson, subMateri: subMateri });
    } else if (session === 'asesmenAkhir') {
        setActiveSession({ type: 'quiz', quiz: selectedLesson.asesmenAkhir, onFinish: handleAsesmenAkhirFinish, quizType: 'akhir' });
    }
  };

  const handleStartAsesmenAwal = (lesson: Lesson) => {
      if (lesson.asesmenAwal) {
          setActiveSession({ type: 'quiz', quiz: lesson.asesmenAwal, onFinish: (score) => handleAsesmenAwalFinish(score, lesson), quizType: 'awal' });
      } else {
          updateProgress(lesson.id, { completedApersepsi: true });
          setActiveSession(null);
      }
  };

  const handleAsesmenAwalFinish = (score: number, lesson: Lesson) => {
      updateProgress(lesson.id, { completedAsesmenAwal: true, asesmenAwalScore: score, completedApersepsi: true });
      setActiveSession({ type: 'asesmenAwalResult', lesson: lesson, score: score });
  };

  const handleStartSubMateriQuiz = (subMateri: SubMateri) => {
    if (!selectedLesson) return;
    const subMateriIndex = selectedLesson.kegiatanInti.findIndex(sm => sm.id === subMateri.id);
    setActiveSession({ type: 'quiz', quiz: subMateri.quiz, onFinish: (score) => handleSubMateriQuizFinish(score, subMateriIndex), quizType: 'submateri' });
  };

  const handleSubMateriQuizFinish = (score: number, subMateriIndex: number) => {
      if (!selectedLesson) return;
      updateProgress(selectedLesson.id, { completedKegiatanInti: subMateriIndex + 1 });
      setActiveSession(null);
  };
  
  const handleAsesmenAkhirFinish = (score: number) => {
      if (!selectedLesson) return;
      updateProgress(selectedLesson.id, { completedAsesmenAkhir: true });
      setActiveSession(null);
  };
  
  const KegiatanIntiContainer: React.FC<{ subMateri: SubMateri, onStartQuiz: () => void }> = ({ subMateri, onStartQuiz }) => {
    const videoId = getYoutubeVideoId(subMateri.videoUrl);
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
             <button
                onClick={handleBackToLesson}
                className="mb-6 text-sm font-medium text-green-600 dark:text-green-400 hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Kembali ke Daftar Sesi
              </button>
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4">{subMateri.title}</h2>
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                    {videoId ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={subMateri.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white"><p>URL video tidak valid.</p></div>
                      )}
                </div>
                 <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Tonton video di atas, lalu kerjakan kuis untuk menguji pemahamanmu.</p>
                     <button
                        onClick={onStartQuiz}
                        className="px-8 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:cursor-not-allowed transition-all"
                      >
                        Mulai Kuis
                      </button>
                 </div>
            </div>
        </div>
    );
  }

  const renderContent = () => {
    if (activeSession?.type === 'apersepsiIntro') {
        return (
             <div className="p-4 sm:p-6 lg:p-8 animate-fade-in flex items-center justify-center h-full">
                <div className="w-full max-w-2xl text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <BookOpenIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sesi 1: Apersepsi</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-left leading-relaxed">{activeSession.lesson.apersepsi}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Selanjutnya, kita akan melakukan asesmen awal untuk mengukur pemahaman dasarmu. Hasilnya tidak akan mempengaruhi nilai akhir.</p>
                    <button
                        onClick={() => handleStartAsesmenAwal(activeSession.lesson)}
                        className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Mulai Asesmen Awal
                    </button>
                </div>
             </div>
        )
    }

    if (activeSession?.type === 'asesmenAwalResult') {
        const isSuccess = activeSession.score >= 70;
        const recommendation = isSuccess
            ? 'Kerja bagus! Kamu sudah memiliki pemahaman awal yang baik. Mari kita lanjutkan untuk memperdalam pengetahuanmu.'
            : 'Tidak apa-apa, ini baru pemanasan! Asesmen ini membantu kita tahu bagian mana yang perlu lebih diperhatikan. Ayo fokus pada materi berikutnya, kamu pasti bisa!';
        return (
            <div className="p-4 sm:p-6 lg:p-8 animate-fade-in flex items-center justify-center h-full">
                <div className="w-full max-w-lg text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hasil Asesmen Awal</h2>
                    {isSuccess ? <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 my-4" /> : <SparklesIcon className="w-16 h-16 mx-auto text-yellow-500 my-4" />}
                    <p className="text-5xl font-bold my-4">{activeSession.score}<span className="text-2xl text-gray-500">/100</span></p>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">{recommendation}</p>
                    <button
                        onClick={handleBackToLesson}
                        className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Lanjutkan ke Materi
                    </button>
                </div>
            </div>
        )
    }

    if (activeSession?.type === 'kegiatanInti') {
        return <KegiatanIntiContainer key={activeSession.subMateri.id} subMateri={activeSession.subMateri} onStartQuiz={() => handleStartSubMateriQuiz(activeSession.subMateri)} />
    }

    if (activeSession?.type === 'quiz') {
      const lessonProgress = progress[selectedLesson?.id || ''];
      const attempt = (lessonProgress?.quizAttempts[activeSession.quiz.id]?.attempts || 0) + 1;
      const maxAttempts = activeSession.quizType === 'awal' ? 1 : 2;
      return <QuizView quiz={activeSession.quiz} onFinish={activeSession.onFinish} attempt={attempt} maxAttempts={maxAttempts} />;
    }

    if (selectedLesson) {
      return <LessonView lesson={selectedLesson} onBack={handleBackToCourse} onStartSession={handleStartSession} progress={progress[selectedLesson.id] || getInitialProgress(selectedLesson.id)} />;
    }
    if (selectedCourse) {
      return <CourseView course={selectedCourse} onSelectLesson={handleSelectLesson} />;
    }
    
    return (
      <div className="p-8 text-center">
          <SparklesIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Selamat Datang, {user?.name}!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Pilih mata pelajaran dari menu di samping untuk memulai.</p>
      </div>
    );
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        courses={courses}
        selectedCourse={selectedCourse}
        onSelectCourse={handleSelectCourse}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;