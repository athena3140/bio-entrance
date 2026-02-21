'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, BookOpen } from 'lucide-react';

type VocabularyData = Record<string, Record<string, string>>;

interface SessionRecord {
  chapter: string;
  score: number;
  total: number;
  date: string;
}

interface LibraryProps {
  vocabularyData: VocabularyData;
  recentSessions?: SessionRecord[];
  onSessionClick?: (index: number) => void;
  onPractice?: () => void;
  onBack?: () => void;
}

export default function Library({ vocabularyData, recentSessions = [], onSessionClick, onPractice, onBack }: LibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const chapterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const chapters = Object.entries(vocabularyData) as [string, Record<string, string>][];
  
  const getChapterNumber = (key: string): number => {
    const match = key.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const sortedChapters = chapters.sort((a, b) => getChapterNumber(a[0]) - getChapterNumber(b[0]));

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 300);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToChapter = (chapterKey: string) => {
    const element = chapterRefs.current[chapterKey];
    if (element) {
      const stickyBarHeight = 140; // Height of sticky search bar (adjusted for mobile)
      const margin = 16; // Small margin below sticky bar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - (stickyBarHeight + margin);
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const scrollToPractice = () => {
    onPractice?.();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg mb-4 transition-colors font-medium text-xs md:text-sm"
            >
              ← Back
            </button>
          )}
          <h1 className="text-2xl md:text-4xl font-light tracking-tight text-gray-900">
            Vocabulary Library
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Browse all biology terms by chapter</p>
        </div>
      </header>

      {/* Search Bar with Menu */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search... (Ctrl+K)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 md:pr-6 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="Jump to chapter"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Hamburger Menu - Chapter List */}
          {menuOpen && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-4 border-t border-gray-200 pt-4">
              {sortedChapters.map(([chapterKey, data]) => (
                <button
                  key={chapterKey}
                  onClick={() => scrollToChapter(chapterKey)}
                  className="text-left px-3 py-2 text-sm hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                >
                  <p className="font-medium text-gray-900">Chapter {getChapterNumber(chapterKey)}</p>
                  <p className="text-xs text-gray-500">{Object.keys(data).length} words</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
        {sortedChapters.map(([chapterKey, data]) => {
          const chapterNumber = getChapterNumber(chapterKey);
          const words = Object.entries(data) as [string, string][];
          
          // Filter words based on search term
          const filteredWords = words.filter(([word, definition]) => 
            word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            definition.toLowerCase().includes(searchTerm.toLowerCase())
          );

          // Only show chapter if it has matching words or no search is active
          if (searchTerm && filteredWords.length === 0) {
            return null;
          }

          return (
            <div
              key={chapterKey}
              ref={(el) => {
                if (el) chapterRefs.current[chapterKey] = el;
              }}
              className="mb-12"
            >
              {/* Chapter Header */}
              <div className="mb-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold text-blue-600">{chapterNumber}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-light text-gray-900">
                    Chapter {chapterNumber}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {searchTerm ? `${filteredWords.length} matching words` : `${words.length} words`}
                  </p>
                </div>
              </div>

              {/* Words Grid */}
              <div className="space-y-2">
                {(searchTerm ? filteredWords : words).map(([word, definition], idx) => {
                  const wordNumberInChapter = words.findIndex(([w]) => w === word) + 1;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-start gap-4"
                    >
                      <div className="text-sm font-medium text-gray-400 min-w-fit pt-1">
                        {wordNumberInChapter}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{word}</p>
                        <p className="text-gray-600 text-sm mt-1">{definition}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>

        {/* No Results Message */}
        {searchTerm && sortedChapters.every(([_, data]) => {
          const words = Object.entries(data) as [string, string][];
          return !words.some(([word, definition]) =>
            word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            definition.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }) && (
          <div className="text-center py-12">
            <p className="text-gray-600">No words found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Floating Practice Navigation Button */}
      {showFloatingButton && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => onBack?.(), 300);
          }}
          className="fixed bottom-6 md:bottom-8 right-6 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl"
          title="Go to Practice page"
        >
          <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}
    </div>
  );
}
