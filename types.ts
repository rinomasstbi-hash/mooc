export interface Option {
  id: string;
  text: string;
}

// For matching questions
export interface MatchOption {
  id: string;
  text: string;
  matchId: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'matching';
  text: string;
  // FIX: Made options optional as it's not used for 'matching' type questions.
  options?: Option[]; // Used for multiple-choice and multiple-select
  matchPrompts?: Option[]; // For matching questions (left side)
  matchOptions?: Option[]; // For matching questions (right side)
  correctOptionId?: string; // For multiple-choice
  correctOptionIds?: string[]; // For multiple-select
  correctMatches?: Record<string, string>; // For matching {promptId: optionId}
}


export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface SubMateri {
  id: string;
  title: string;
  videoUrl: string;
  quiz: Quiz;
}

export interface Lesson {
  id: string;
  title: string;
  // Sesi 1
  apersepsi: string;
  asesmenAwal?: Quiz;
  // Sesi 2
  kegiatanInti: SubMateri[];
  // Sesi 3
  asesmenAkhir: Quiz;
  // Sesi 4
  penutup: {
    prompt: string;
  };
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface User {
  role: 'guru' | 'siswa';
  name: string;
}

// --- Types for Progress Tracking ---

export interface QuizAttempt {
  quizId: string;
  attempts: number;
  highScore: number | null; // Score out of 100
}

export interface LessonProgress {
  lessonId: string;
  completedApersepsi: boolean;
  completedAsesmenAwal: boolean;
  asesmenAwalScore: number | null;
  completedKegiatanInti: number; // index of the last completed sub-materi
  completedAsesmenAkhir: boolean;
  completedPenutup: boolean;
  quizAttempts: Record<string, QuizAttempt>; // key is quizId
  reflectionText?: string;
  finalScore: number | null;
}

// Deprecated types - kept for reference if needed elsewhere but not in the new flow
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface DiscussionPost {
  id: string;
  author: string;
  role: 'guru' | 'siswa';
  timestamp: string;
  text: string;
  replies?: DiscussionPost[];
}