'use client';

import { useState } from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';

type ChapterKey = string;
type VocabularyData = Record<ChapterKey, Record<string, string>>;

interface HomeProps {
  vocabularyData: VocabularyData;
  onSelectChapter: (chapter: ChapterKey) => void;
  onViewLibrary: () => void;
  recentSessions: Array<{
    chapter: ChapterKey;
    startIndex: number;
    endIndex: number;
    score: number;
    total: number;
    date: string;
  }>;
  onSessionClick: (index: number) => void;
  selectedChapter: ChapterKey | null;
}

export default function Home({ vocabularyData, onSelectChapter, onViewLibrary, recentSessions, onSessionClick, selectedChapter }: HomeProps) {
  const chapters = Object.entries(vocabularyData) as [ChapterKey, Record<string, string>][];
  const [examMode, setExamMode] = useState(false);

  const getChapterNumber = (key: ChapterKey): number => {
    const match = key.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const sortedChapters = chapters.sort((a, b) => getChapterNumber(a[0]) - getChapterNumber(b[0]));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-gray-200 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
                G12 Biology Entrance Practice
              </h1>
              <p className="text-gray-500 mt-2 text-sm md:text-base">Master English-Burmese biology terminology</p>
            </div>
            <button
              onClick={onViewLibrary}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap shadow-md hover:shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              View Library
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        {/* Exam Ready Mode */}
        <section className="mb-12 p-6 md:p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200">
          <h2 className="text-xl md:text-2xl font-semibold text-purple-900 mb-3">Exam Ready Mode</h2>
          <p className="text-purple-700 mb-4 text-sm md:text-base">Get comprehensive practice with 50 randomly selected questions evenly distributed across all 6 chapters. Perfect for full exam preparation.</p>
          <button
            onClick={() => {
              setExamMode(true);
              onSelectChapter('exam-mode');
            }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm md:text-base shadow-md hover:shadow-lg"
          >
            Start Exam Ready Mode (50 Questions)
          </button>
        </section>

        {/* Chapters Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2 tracking-tight">
              Chapter Practice
            </h2>
            <p className="text-gray-600 text-sm md:text-base">Choose which chapter you want to take a quiz from.</p>
          </div>
          
          <div className="space-y-3">
            {sortedChapters.map(([chapterKey, data]) => {
              const wordCount = Object.keys(data).length;
              const chapterNumber = getChapterNumber(chapterKey);

              return (
                <button
                  key={chapterKey}
                  onClick={() => {
                    setExamMode(false);
                    onSelectChapter(chapterKey);
                  }}
                  className="w-full flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <span className="text-base md:text-lg font-semibold text-blue-600">{chapterNumber}</span>
                      </div>
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm md:text-base">Chapter {chapterNumber}</h3>
                      <p className="text-xs md:text-sm text-gray-500">{wordCount} words</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
              Recent Activity
            </h2>

            <div className="space-y-3">
              {recentSessions.slice(0, 5).map((session, idx) => {
                const chapterNum = getChapterNumber(session.chapter);
                const percentage = Math.round((session.score / session.total) * 100);

                return (
                  <button
                    key={idx}
                    onClick={() => onSessionClick(idx)}
                    className="w-full p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all text-left group hover:shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base truncate">
                          Chapter {chapterNum} • Words {session.startIndex + 1}-{session.endIndex}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">{session.date}</p>
                      </div>
                      <div className="flex items-center justify-between md:flex-col md:items-end gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm md:text-base">
                            {session.score}/{session.total}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">{percentage}% correct</p>
                        </div>
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0 transition-colors" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
