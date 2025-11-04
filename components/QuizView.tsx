import React, { useState } from 'react';
import { Quiz, Question, Option } from '../types';
import { QuestionMarkCircleIcon, ArrowPathIcon } from './icons';

interface QuizViewProps {
  quiz: Quiz;
  onFinish: (score: number) => void; // score is percentage (0-100)
  attempt: number;
  maxAttempts: number;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onFinish, attempt, maxAttempts }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[] | Record<string, string>>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleOptionSelect = (optionId: string) => {
    if (currentQuestion.type === 'multiple-select') {
      const currentSelection = (selectedAnswers[currentQuestion.id] as string[] || []);
      const newSelection = currentSelection.includes(optionId)
        ? currentSelection.filter(id => id !== optionId)
        : [...currentSelection, optionId];
      setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: newSelection });
    } else {
      setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: optionId });
    }
  };

  const handleMatchSelect = (promptId: string, optionId: string) => {
    const currentMatches = (selectedAnswers[currentQuestion.id] as Record<string, string> || {});
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: { ...currentMatches, [promptId]: optionId },
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateAndShowResults();
    }
  };

  const calculateAndShowResults = () => {
    const score = quiz.questions.reduce((totalScore, question) => {
      const answer = selectedAnswers[question.id];
      let isCorrect = false;
      switch (question.type) {
        case 'multiple-choice':
          isCorrect = answer === question.correctOptionId;
          break;
        case 'multiple-select':
          const selected = (answer as string[] || []).sort();
          const correct = (question.correctOptionIds || []).sort();
          isCorrect = selected.length === correct.length && selected.every((val, index) => val === correct[index]);
          break;
        case 'matching':
          const matches = answer as Record<string, string> || {};
          isCorrect = question.correctMatches ? Object.keys(question.correctMatches).every(
            promptId => matches[promptId] === question.correctMatches![promptId]
          ) : false;
          break;
      }
      return totalScore + (isCorrect ? 1 : 0);
    }, 0);
    
    const percentage = Math.round((score / totalQuestions) * 100);
    setCurrentScore(percentage);
    setShowResults(true);
  };
  
  if (showResults) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in flex items-center justify-center h-full">
        <div className="w-full max-w-lg text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hasil Kuis</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{quiz.title}</p>
          {maxAttempts > 1 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Percobaan ke-{attempt} dari {maxAttempts}</p>
          )}
          
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-6">
              <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90 18 18)">
                  <path className="text-gray-200 dark:text-gray-700" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                  <path className="text-green-500" strokeWidth="3" fill="none" strokeDasharray={`${currentScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              </svg>
              <div className="absolute">
                <span className="text-4xl font-bold text-gray-800 dark:text-white">{currentScore}</span>
                <span className="text-lg text-gray-500 dark:text-gray-400">/100</span>
              </div>
          </div>
          
          <p className="text-xl font-medium text-gray-700 dark:text-gray-200">
            Skor Anda: {currentScore}
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            {attempt < maxAttempts && (
               <button
                onClick={() => {
                  // Reset state for retry
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers({});
                  setShowResults(false);
                  setCurrentScore(0);
                  // The onFinish callback will be called with the new score after the next attempt
                }}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-green-700 bg-green-100 border border-green-200 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ArrowPathIcon className="w-5 h-5"/>
                Coba Lagi
              </button>
            )}
            <button
              onClick={() => onFinish(currentScore)}
              className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isNextDisabled = () => {
    const answer = selectedAnswers[currentQuestion.id];
    if (currentQuestion.type === 'multiple-select') return !answer || (answer as string[]).length === 0;
    if (currentQuestion.type === 'matching') {
      const matches = answer as Record<string, string> || {};
      return Object.keys(matches).length !== currentQuestion.matchPrompts?.length;
    }
    return !answer;
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple-select':
        return (
          <div className="space-y-3">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-md">Pilih semua jawaban yang benar.</p>
            {/* FIX: Add optional chaining because 'options' can be undefined for matching questions. */}
            {currentQuestion.options?.map(option => {
              const isSelected = (selectedAnswers[currentQuestion.id] as string[] || []).includes(option.id);
              return (
                <label key={option.id} className={`flex items-center w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 cursor-pointer ${
                    isSelected ? 'bg-green-100 dark:bg-green-900/50 border-green-500' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-green-400'
                  }`}>
                  <input type="checkbox" checked={isSelected} onChange={() => handleOptionSelect(option.id)} className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500" />
                  <span className="ml-3 text-gray-800 dark:text-gray-200">{option.text}</span>
                </label>
              );
            })}
          </div>
        );
      case 'matching':
        const currentMatches = selectedAnswers[currentQuestion.id] as Record<string, string> || {};
        return (
          <div className="space-y-4">
             {currentQuestion.matchPrompts?.map(prompt => (
               <div key={prompt.id} className="grid grid-cols-2 gap-4 items-center">
                 <p className="text-gray-800 dark:text-gray-200">{prompt.text}</p>
                 <select 
                   value={currentMatches[prompt.id] || ''}
                   onChange={(e) => handleMatchSelect(prompt.id, e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-500 focus:ring-green-500 focus:border-green-500"
                 >
                    <option value="" disabled>Pilih...</option>
                    {currentQuestion.matchOptions?.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.text}</option>
                    ))}
                 </select>
               </div>
             ))}
          </div>
        );
      case 'multiple-choice':
      default:
        return (
          <div className="space-y-3">
            {/* FIX: Add optional chaining because 'options' can be undefined for matching questions. */}
            {currentQuestion.options?.map(option => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 ${isSelected ? 'bg-green-100 dark:bg-green-900/50 border-green-500' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-green-400'}`}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-gray-800 dark:text-white mb-2">
            <QuestionMarkCircleIcon className="w-8 h-8 mr-3 text-green-500" />
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
        </p>

        <p className="text-xl text-gray-700 dark:text-gray-200 mb-6 min-h-[60px]">{currentQuestion.text}</p>
        
        {renderQuestion()}

        <div className="mt-8 text-right">
          <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Selanjutnya' : 'Selesai'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;