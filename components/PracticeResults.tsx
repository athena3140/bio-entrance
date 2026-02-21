'use client';

import { RotateCcw, Home } from 'lucide-react';
import { normalizeWord } from '@/lib/word-utils';

type ChapterKey = keyof any;

interface SessionAnswer {
  word: string;
  correct: boolean;
  userAnswer?: string;
  skipped?: boolean;
}

interface PracticeResultsProps {
  score: number;
  total: number;
  chapter: ChapterKey | null;
  answers: SessionAnswer[];
  onBackToHome: () => void;
}

export default function PracticeResults({
  score,
  total,
  chapter,
  answers,
  onBackToHome
}: PracticeResultsProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const incorrectAnswers = answers.filter(a => !a.correct && !a.skipped);
  const skippedAnswers = answers.filter(a => a.skipped);
  const chapterNumber = chapter ? parseInt(chapter.match(/\d+/)?.[0] || '0') : 0;

  const getPerformanceLevel = (percentage: number) => {
    if (percentage === 100) return { level: 'Perfect!', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (percentage >= 80) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (percentage >= 60) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (percentage >= 40) return { level: 'Needs Practice', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    return { level: 'Keep Learning', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const performance = getPerformanceLevel(percentage);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Background Decoration */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -mr-48 -mt-48 opacity-50" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gray-50 rounded-full -ml-48 -mb-48 opacity-50" />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-md text-center">
          {/* Score Card */}
          <div className={`rounded-2xl p-6 md:p-12 border-2 mb-6 md:mb-8 ${performance.bgColor} ${performance.borderColor}`}>
            <p className={`text-sm md:text-lg font-medium ${performance.color} uppercase tracking-wide mb-3 md:mb-4`}>
              {performance.level}
            </p>
            
            <div className="mb-4 md:mb-6">
              <p className="text-4xl md:text-6xl font-light text-gray-900">{percentage}%</p>
            </div>

            <div className="space-y-2">
              <p className="text-lg md:text-2xl font-light text-gray-900">
                {score} <span className="text-base md:text-lg text-gray-500">out of</span> {total}
              </p>
              {chapter && (
                <p className="text-sm md:text-base text-gray-600">
                  {chapter === 'exam-mode' ? 'Exam Ready Mode' : `Chapter ${chapterNumber}`}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-10">
            <div className="bg-green-50 rounded-lg p-2 md:p-4 border border-green-200">
              <p className="text-xl md:text-2xl font-light text-green-700">{score}</p>
              <p className="text-xs md:text-xs text-green-600 uppercase tracking-wide">Correct</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2 md:p-4 border border-red-200">
              <p className="text-xl md:text-2xl font-light text-red-700">{incorrectAnswers.length}</p>
              <p className="text-xs md:text-xs text-red-600 uppercase tracking-wide">Incorrect</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-2 md:p-4 border border-yellow-200">
              <p className="text-xl md:text-2xl font-light text-yellow-700">{skippedAnswers.length}</p>
              <p className="text-xs md:text-xs text-yellow-600 uppercase tracking-wide">Skipped</p>
            </div>
          </div>

          {/* Incorrect Answers Section */}
          {incorrectAnswers.length > 0 && (
            <div className="mb-8 md:mb-10 w-full text-left">
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Words to review</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {incorrectAnswers.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-red-200 bg-red-50"
                  >
                    <p className="font-medium text-gray-900">{normalizeWord(item.word)}</p>
                    {item.userAnswer && (
                      <p className="text-sm text-gray-600 mt-2">
                        You answered: <span className="font-medium">{item.userAnswer}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 md:space-y-3">
            <button
              onClick={onBackToHome}
              className="w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Home className="w-4 h-4 md:w-5 md:h-5" />
              Back to Home
            </button>
            
            <button
              onClick={onBackToHome}
              className="w-full py-3 md:py-4 bg-white border-2 border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              Try Another Chapter
            </button>
          </div>

          {/* Motivational Message */}
          <p className="text-gray-600 text-sm mt-8">
            {percentage === 100 && "Outstanding work! Perfect score! 🎉"}
            {percentage >= 80 && percentage < 100 && "Great job! Keep practicing to get even better."}
            {percentage >= 60 && percentage < 80 && "Good effort! Practice more to improve."}
            {percentage < 60 && "Keep going! Every practice session helps you learn."}
          </p>
        </div>
      </div>
    </div>
  );
}
