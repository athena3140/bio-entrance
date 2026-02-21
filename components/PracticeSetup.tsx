'use client';

import { useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';

type ChapterKey = keyof any;

interface PracticeSetupProps {
  chapter: ChapterKey;
  chapterData: Record<string, string>;
  onStartPractice: (start: number, end: number) => void;
  onBack: () => void;
}

export default function PracticeSetup({
  chapter,
  chapterData,
  onStartPractice,
  onBack
}: PracticeSetupProps) {
  const words = Object.keys(chapterData);
  const wordCount = words.length;
  const chapterNumber = parseInt(chapter.match(/\d+/)?.[0] || '0');
  
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(wordCount - 1);
  const [startSearchOpen, setStartSearchOpen] = useState(false);
  const [endSearchOpen, setEndSearchOpen] = useState(false);
  const [startSearchTerm, setStartSearchTerm] = useState('');
  const [endSearchTerm, setEndSearchTerm] = useState('');

  const filterWords = (term: string, start: number | null = null, end: number | null = null) => {
    return words
      .map((word, idx) => ({ word, idx }))
      .filter(({ word, idx }) => {
        const matchesTerm = word.toLowerCase().includes(term.toLowerCase());
        if (start !== null && end !== null) {
          return matchesTerm && idx >= start && idx <= end;
        }
        return matchesTerm;
      });
  };

  const filteredStartWords = startSearchTerm ? filterWords(startSearchTerm, 0, endIndex) : words.map((w, i) => ({ word: w, idx: i })).slice(0, endIndex + 1);
  const filteredEndWords = endSearchTerm ? filterWords(endSearchTerm, startIndex) : words.map((w, i) => ({ word: w, idx: i })).slice(startIndex);

  const handleStartPractice = () => {
    onStartPractice(startIndex, endIndex + 1);
  };

  const totalSelected = endIndex - startIndex + 1;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto w-full px-4 md:px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors text-sm md:text-base"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-gray-900">
            Chapter {chapterNumber}
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">{wordCount} total words in this chapter</p>
        </div>
      </header>

      {/* Setup Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        <div className="space-y-6 md:space-y-8">
          {/* Start Word Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Start from word
            </label>
            <div className="relative">
              <button
                onClick={() => setStartSearchOpen(!startSearchOpen)}
                className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-left bg-white hover:border-blue-400 transition-colors flex items-center justify-between text-sm md:text-base"
              >
                <span className="truncate">{startIndex + 1}. {words[startIndex]}</span>
                <span className="text-gray-400 flex-shrink-0 ml-2">▼</span>
              </button>
              {startSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
                  <input
                    type="text"
                    placeholder="Search words..."
                    value={startSearchTerm}
                    onChange={(e) => setStartSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                    autoFocus
                  />
                  <div className="max-h-96 overflow-y-auto">
                    {filteredStartWords.map(({ word, idx }) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setStartIndex(idx);
                          setStartSearchOpen(false);
                          setStartSearchTerm('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                      >
                        {idx + 1}. {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* End Word Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              End at word
            </label>
            <div className="relative">
              <button
                onClick={() => setEndSearchOpen(!endSearchOpen)}
                className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-left bg-white hover:border-blue-400 transition-colors flex items-center justify-between text-sm md:text-base"
              >
                <span className="truncate">{endIndex + 1}. {words[endIndex]}</span>
                <span className="text-gray-400 flex-shrink-0 ml-2">▼</span>
              </button>
              {endSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
                  <input
                    type="text"
                    placeholder="Search words..."
                    value={endSearchTerm}
                    onChange={(e) => setEndSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                    autoFocus
                  />
                  <div className="max-h-96 overflow-y-auto">
                    {filteredEndWords.map(({ word, idx }) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setEndIndex(idx);
                          setEndSearchOpen(false);
                          setEndSearchTerm('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                      >
                        {idx + 1}. {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 md:p-6 border border-blue-200">
            <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">Summary</p>
            <p className="text-2xl md:text-3xl font-light text-gray-900 mt-2">
              {totalSelected} <span className="text-base md:text-lg text-gray-500">words</span>
            </p>
            <p className="text-xs md:text-sm text-gray-600 mt-3 break-words">
              From <span className="font-medium">{words[startIndex]}</span> to <span className="font-medium">{words[endIndex]}</span>
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartPractice}
            className="w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg text-sm md:text-base"
          >
            Start Practice
          </button>
        </div>
      </div>
    </div>
  );
}
