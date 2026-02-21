'use client';

import { ChevronLeft, ArrowLeft } from 'lucide-react';
import { normalizeWord } from '@/lib/word-utils';

type ChapterKey = keyof any;
type VocabularyData = Record<string, Record<string, string>>;

interface SessionAnswer {
  word: string;
  correct: boolean;
  userAnswer?: string;
  skipped?: boolean;
}

interface SessionRecord {
  chapter: ChapterKey;
  startIndex: number;
  endIndex: number;
  score: number;
  total: number;
  date: string;
  answers: SessionAnswer[];
}

interface SessionDetailsProps {
  session: SessionRecord;
  vocabularyData: VocabularyData;
  onBack: () => void;
}

export default function SessionDetails({ session, vocabularyData, onBack }: SessionDetailsProps) {
  const percentage = session.total > 0 ? Math.round((session.score / session.total) * 100) : 0;
  const chapterNumber = parseInt(session.chapter.match(/\d+/)?.[0] || '0');

  const getPerformanceColor = (answer: SessionAnswer) => {
    if (answer.correct) {
      return 'bg-green-50 border-green-200';
    }
    if (!answer.userAnswer) {
      return 'bg-yellow-50 border-yellow-200';
    }
    return 'bg-red-50 border-red-200';
  };

  const getAnswerLabel = (answer: SessionAnswer) => {
    if (answer.correct) {
      return 'Correct';
    }
    if (answer.skipped) {
      return 'Skipped';
    }
    return 'Incorrect';
  };

  const getAnswerColor = (answer: SessionAnswer) => {
    if (answer.correct) {
      return 'text-green-900';
    }
    if (answer.skipped) {
      return 'text-yellow-900';
    }
    return 'text-red-900';
  };

  const reviewAnswers = session.answers.filter(a => !a.correct);
  const skipCount = session.answers.filter(a => a.skipped).length;
  const incorrectCount = session.answers.filter(a => !a.correct && !a.skipped).length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-light tracking-tight text-gray-900">
            Session Details
          </h1>
          <p className="text-gray-500 mt-2">Chapter {chapterNumber} • {session.date}</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        {/* Score Section */}
        <div className="mb-12 text-center">
          <div className="text-6xl font-light text-gray-900 mb-4">{percentage}%</div>
          <p className="text-2xl text-gray-600 mb-4">
            {session.score} of {session.total} correct
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-8 mb-12">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-2xl font-light text-green-900">{session.score}</p>
              <p className="text-xs text-green-700 uppercase tracking-wide mt-1">Correct</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-2xl font-light text-yellow-900">{skipCount}</p>
              <p className="text-xs text-yellow-700 uppercase tracking-wide mt-1">Skipped</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-2xl font-light text-red-900">{incorrectCount}</p>
              <p className="text-xs text-red-700 uppercase tracking-wide mt-1">Incorrect</p>
            </div>
          </div>
        </div>

        {/* Words to Review */}
        {reviewAnswers.length > 0 && (
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Words to Review</h2>
            <div className="space-y-3">
              {reviewAnswers.map((item, idx) => {
                const chapterData = vocabularyData[session.chapter];
                const burmeseMeaning = chapterData ? chapterData[item.word] : '';
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${getPerformanceColor(item)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className={`font-medium ${getAnswerColor(item)}`}>{normalizeWord(item.word)}</p>
                        {burmeseMeaning && (
                          <p className="text-sm text-gray-600 mt-1">{burmeseMeaning}</p>
                        )}
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 ml-4 ${
                        item.correct ? 'bg-green-100 text-green-700' :
                        item.skipped ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {getAnswerLabel(item)}
                      </span>
                    </div>
                    {item.userAnswer && (
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-medium">Your answer:</span> {item.userAnswer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
