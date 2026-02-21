'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { normalizeWord } from '@/lib/word-utils';

interface PracticeSessionProps {
  item: { word: string; definition: string };
  currentIndex: number;
  totalItems: number;
  score: number;
  chapter?: string;
  onCorrect: () => void;
  onIncorrect: (userAnswer: string) => void;
  onSkip: () => void;
}

export default function PracticeSession({
  item,
  currentIndex,
  totalItems,
  score,
  chapter,
  onCorrect,
  onIncorrect,
  onSkip
}: PracticeSessionProps) {
  const getChapterNumber = (key?: string): number => {
    if (!key) return 0;
    const match = key.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUserAnswer('');
    setShowFeedback(false);
    inputRef.current?.focus();
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedAnswer = normalizeWord(userAnswer.trim());
    const normalizedCorrect = normalizeWord(item.word);
    
    if (normalizedAnswer === normalizedCorrect) {
      setIsCorrect(true);
      setShowFeedback(true);
      setTimeout(() => {
        onCorrect();
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }, 600);
    } else {
      setIsCorrect(false);
      setShowFeedback(true);
    }
  };

  const handleWrongAnswerEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showFeedback && !isCorrect && e.key === 'Enter') {
      e.preventDefault();
      handleContinue();
    }
  };

  const handleContinue = () => {
    if (!isCorrect) {
      onIncorrect(userAnswer);
    } else {
      onSkip();
    }
    // Ensure focus returns to input after state updates
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-1 bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalItems) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto w-full px-4 md:px-6 py-4 md:py-6">
          <div className="flex justify-between items-start md:items-center gap-4">
            <div className="flex-1 min-w-0">
              {chapter && (
                <p className="text-xs md:text-sm text-gray-500">
                  {chapter === 'exam-mode' ? 'Exam Ready Mode' : `Chapter ${getChapterNumber(chapter)}`}
                </p>
              )}
              <p className="text-xs md:text-sm text-gray-500 mt-1">Question {currentIndex + 1} of {totalItems}</p>
              <p className="text-xl md:text-2xl font-light text-gray-900 mt-2">Score: {score}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          {/* Question Card */}
          <div className="mb-8 md:mb-12">
            <div className="bg-gray-50 rounded-xl p-6 md:p-12 text-center border border-gray-200">
              <p className="text-gray-500 text-xs md:text-sm uppercase tracking-wide mb-3 md:mb-4">
                Translate this word
              </p>
              <p className="text-3xl md:text-5xl font-light text-gray-900 mb-4 md:mb-6 tracking-tight break-words">
                {item.definition}
              </p>
              <p className="text-gray-500 text-xs md:text-sm">What is the English word?</p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleWrongAnswerEnter}
              placeholder="Type your answer..."
              disabled={showFeedback && isCorrect}
              className="w-full px-4 md:px-6 py-3 md:py-4 text-base md:text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 disabled:bg-gray-50 disabled:text-gray-600 transition-colors"
            />

            {!showFeedback && (
              <button
                type="submit"
                className="w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Check Answer <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </form>

          {/* Feedback */}
          {showFeedback && (
            <div className={`rounded-lg p-6 mb-8 border-2 transition-colors ${
              isCorrect
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`font-medium mb-3 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              
              {!isCorrect && (
                <div>
                  <p className="text-sm text-gray-700 mb-3">
                    <span className="font-medium">You answered:</span> {userAnswer}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Correct answer:</span> {normalizeWord(item.word)}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleContinue();
                  }}
                  className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Skip Button */}
          {!showFeedback && (
            <button
              onClick={onSkip}
              className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" /> Skip this word
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
