'use client';

import { useState, useEffect } from 'react';
import vocabularyData from '@/lib/vocabulary-data.json';
import Home from '@/components/Home';
import Library from '@/components/Library';
import PracticeSetup from '@/components/PracticeSetup';
import PracticeSession from '@/components/PracticeSession';
import PracticeResults from '@/components/PracticeResults';
import SessionDetails from '@/components/SessionDetails';

type ChapterKey = keyof typeof vocabularyData;

interface SessionAnswer {
  word: string;
  correct: boolean;
  userAnswer?: string;
  skipped?: boolean;
}

interface PracticeSessionRecord {
  chapter: ChapterKey;
  startIndex: number;
  endIndex: number;
  score: number;
  total: number;
  date: string;
  answers: SessionAnswer[];
}

const STORAGE_KEY = 'practice_app_sessions';

export default function AppWrapper() {
  const [currentView, setCurrentView] = useState<'home' | 'library' | 'setup' | 'practice' | 'results' | 'session-details'>('home');
  const [selectedChapter, setSelectedChapter] = useState<ChapterKey | null>(null);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number | null>(null);
  const [previousView, setPreviousView] = useState<'home' | 'library'>('home');
  const [practiceRange, setPracticeRange] = useState<{ start: number; end: number } | null>(null);
  const [practiceList, setPracticeList] = useState<Array<{ word: string; definition: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<SessionAnswer[]>([]);
  const [sessionHistory, setSessionHistory] = useState<PracticeSessionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize sessionHistory from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessionHistory(parsed);
      } catch (error) {
        console.error('Failed to parse saved sessions:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Sync sessionHistory changes to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionHistory));
    }
  }, [sessionHistory, isLoading]);

  const handleSelectChapter = (chapter: ChapterKey) => {
    if (chapter === 'exam-mode') {
      // Generate 50 questions evenly distributed across all chapters
      setSelectedChapter(chapter);
      generateExamQuestions();
    } else {
      setSelectedChapter(chapter);
      setCurrentView('setup');
    }
  };

  const generateExamQuestions = () => {
    const chapters = Object.entries(vocabularyData) as [ChapterKey, Record<string, string>][];
    const totalQuestions = 50;
    const questionsPerChapter = Math.floor(totalQuestions / chapters.length);
    const remainder = totalQuestions % chapters.length;
    
    const allQuestions: Array<{ word: string; definition: string }> = [];
    
    chapters.forEach(([chapterKey, data], idx) => {
      const words = Object.entries(data).map(([word, definition]) => ({
        word,
        definition: definition as string
      }));
      
      const count = questionsPerChapter + (idx < remainder ? 1 : 0);
      const shuffled = words.sort(() => Math.random() - 0.5).slice(0, count);
      allQuestions.push(...shuffled);
    });
    
    const finalShuffled = allQuestions.sort(() => Math.random() - 0.5);
    setPracticeList(finalShuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setPracticeRange({ start: 0, end: totalQuestions });
    setCurrentView('practice');
  };

  const handleViewSessionDetails = (index: number) => {
    setPreviousView(currentView === 'library' ? 'library' : 'home');
    setSelectedSessionIndex(index);
    setCurrentView('session-details');
  };

  const handleGoToPractice = () => {
    // Find the first chapter to start practice setup
    const firstChapter = Object.keys(vocabularyData)[0] as ChapterKey;
    setSelectedChapter(firstChapter);
    setCurrentView('setup');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
  };

  const handleStartPractice = (start: number, end: number) => {
    if (!selectedChapter) return;

    const chapterData = vocabularyData[selectedChapter];
    const words = Object.entries(chapterData).slice(start, end).map(([word, definition]) => ({
      word,
      definition: definition as string
    }));

    const shuffled = words.sort(() => Math.random() - 0.5);
    setPracticeList(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setPracticeRange({ start, end });
    setCurrentView('practice');
  };

  const handleCorrectAnswer = () => {
    const newAnswers = [...answers, { word: practiceList[currentIndex].word, correct: true }];
    setAnswers(newAnswers);
    setScore(prev => prev + 1);
    if (currentIndex < practiceList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Session is complete, save with the final state
      saveSessionWithAnswers(newAnswers, score + 1);
    }
  };

  const handleIncorrectAnswer = (userAnswer: string) => {
    const newAnswers = [...answers, { 
      word: practiceList[currentIndex].word, 
      correct: false,
      userAnswer
    }];
    setAnswers(newAnswers);
    if (currentIndex < practiceList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Session is complete, save with the final state
      saveSessionWithAnswers(newAnswers, score);
    }
  };

  const handleSkip = () => {
    const newAnswers = [...answers, { word: practiceList[currentIndex].word, correct: false, skipped: true }];
    setAnswers(newAnswers);
    if (currentIndex < practiceList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Session is complete, save with the final state
      saveSessionWithAnswers(newAnswers, score);
    }
  };

  const saveSessionWithAnswers = (finalAnswers: SessionAnswer[], finalScore: number) => {
    if (selectedChapter && practiceRange) {
      // Use practiceList.length as the single source of truth for total questions
      const newSession: PracticeSessionRecord = {
        chapter: selectedChapter,
        startIndex: practiceRange.start,
        endIndex: practiceRange.end,
        score: finalScore,
        total: practiceList.length, // Use the actual number of questions presented
        date: new Date().toLocaleDateString(),
        answers: finalAnswers // Use the complete answers array from the parameter
      };
      setSessionHistory(prev => [newSession, ...prev]);
    }
    setCurrentView('results');
  };

  const handleBackToHome = () => {
    setSelectedChapter(null);
    setPracticeRange(null);
    setCurrentView('home');
  };

  return (
    <main className="min-h-screen bg-white">
      {currentView === 'home' && (
        <Home 
          vocabularyData={vocabularyData}
          onSelectChapter={handleSelectChapter}
          onViewLibrary={() => setCurrentView('library')}
          recentSessions={sessionHistory}
          onSessionClick={handleViewSessionDetails}
          selectedChapter={selectedChapter}
        />
      )}

      {currentView === 'library' && (
        <Library 
          vocabularyData={vocabularyData}
          recentSessions={sessionHistory}
          onSessionClick={handleViewSessionDetails}
          onPractice={handleGoToPractice}
          onBack={handleBackToHome}
        />
      )}

      {currentView === 'setup' && selectedChapter && (
        <PracticeSetup 
          chapter={selectedChapter}
          chapterData={vocabularyData[selectedChapter]}
          onStartPractice={handleStartPractice}
          onBack={handleBackToHome}
        />
      )}

      {currentView === 'practice' && practiceList.length > 0 && selectedChapter && (
        <PracticeSession 
          item={practiceList[currentIndex]}
          currentIndex={currentIndex}
          totalItems={practiceList.length}
          score={score}
          chapter={selectedChapter}
          onCorrect={handleCorrectAnswer}
          onIncorrect={handleIncorrectAnswer}
          onSkip={handleSkip}
        />
      )}

      {currentView === 'results' && (
        <PracticeResults 
          score={score}
          total={answers.length}
          chapter={selectedChapter}
          answers={answers}
          onBackToHome={handleBackToHome}
        />
      )}

      {currentView === 'session-details' && selectedSessionIndex !== null && (
        <SessionDetails
          session={sessionHistory[selectedSessionIndex]}
          vocabularyData={vocabularyData}
          onBack={() => setCurrentView(previousView)}
        />
      )}
    </main>
  );
}
