import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCaseById } from '../data/cases';
import { useSQLEngine } from '../hooks/useSQLEngine';
import { useGameStore } from '../store/gameStore';
import { partnerMessages } from '../utils/partnerMessages';
import SQLEditor from '../components/SQLEditor';
import ResultsTable from '../components/ResultsTable';
import SchemaBrowser from '../components/SchemaBrowser';
import EvidenceBoard from '../components/EvidenceBoard';
import ChapterPanel from '../components/ChapterPanel';
import PartnerBar from '../components/PartnerBar';

type PanelTab = 'case' | 'schema';
type ResultTab = 'results' | 'evidence';

const TIMED_DIFFICULTIES = ['Detective', 'Senior Detective', 'Chief'];

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseData = getCaseById(id || '');

  const {
    currentQuery, setQuery,
    queryResult, queryError, setQueryResult,
    partnerMessage, setPartnerMessage,
    isHardMode,
    timerSeconds, tickTimer,
    caseProgress, startCase, completeChapter, completeCase, incrementQueryCount,
  } = useGameStore();

  const { ready, initError, runQuery, validateResult } = useSQLEngine(caseData || null);

  // Chapter index is purely local — never driven by progress
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [leftTab, setLeftTab] = useState<PanelTab>('case');
  const [rightTab, setRightTab] = useState<ResultTab>('results');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [caseStarted, setCaseStarted] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTimed = caseData ? TIMED_DIFFICULTIES.includes(caseData.difficulty) : false;

  const progress = caseData ? caseProgress[caseData.id] : null;
  const completedChapters = progress?.completedChapters || [];

  // Start case once on mount
  useEffect(() => {
    if (caseData && !caseStarted) {
      startCase(caseData.id, isHardMode);
      setCaseStarted(true);
      setActiveChapterIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseData?.id]);

  // Timer — only for Detective+ difficulty
  useEffect(() => {
    if (!isTimed || !caseStarted) return;
    timerRef.current = setInterval(() => tickTimer(), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimed, caseStarted]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleRun = useCallback(() => {
    if (!ready || !caseData) {
      setPartnerMessage(partnerMessages.dbNotReady());
      return;
    }
    if (!currentQuery.trim()) return;

    setIsRunning(true);
    setIsCorrect(false);
    setShowSuccess(false);
    incrementQueryCount();

    setTimeout(() => {
      const { result, error } = runQuery(currentQuery);

      if (error) {
        setQueryResult(null, error);
        setPartnerMessage(partnerMessages.syntaxError(error));
        setIsRunning(false);
        return;
      }

      setQueryResult(result, null);

      const chapter = caseData.chapters[activeChapterIndex];
      if (!result) {
        setPartnerMessage(partnerMessages.emptyResult());
        setIsRunning(false);
        return;
      }

      const rowCount = result.rows.length;
      if (rowCount === 0) {
        setPartnerMessage(partnerMessages.emptyResult());
        setIsRunning(false);
        return;
      }

      const valid = validateResult(result, chapter.expectedColumns, chapter.expectedRowCount);

      if (valid) {
        setIsCorrect(true);
        setRightTab('evidence');
        setPartnerMessage(chapter.partnerOnSuccess);

        // Mark chapter done in store (without triggering chapter index change)
        completeChapter(chapter.id, caseData.id);

        const isLastChapter = activeChapterIndex === caseData.chapters.length - 1;
        if (isLastChapter) {
          stopTimer();
          completeCase(caseData.id, timerSeconds);
          setTimeout(() => navigate(`/case/${caseData.id}/solved`), 2200);
        } else {
          setShowSuccess(true);
        }
      } else {
        if (rowCount > chapter.expectedRowCount * 2) {
          setPartnerMessage(partnerMessages.tooManyRows(rowCount));
        } else if (rowCount < chapter.expectedRowCount) {
          setPartnerMessage(partnerMessages.tooFewRows(rowCount, chapter.expectedRowCount));
        } else {
          setPartnerMessage(partnerMessages.wrongColumns());
        }
      }

      setIsRunning(false);
    }, 120);
  }, [
    ready, caseData, currentQuery, activeChapterIndex,
    runQuery, validateResult, completeCase, completeChapter,
    incrementQueryCount, navigate, setPartnerMessage,
    setQueryResult, stopTimer, timerSeconds,
  ]);

  // Next chapter — purely local, no store involvement
  const handleNextChapter = useCallback(() => {
    if (!caseData) return;
    const nextIdx = activeChapterIndex + 1;
    if (nextIdx < caseData.chapters.length) {
      setActiveChapterIndex(nextIdx);
      setQuery('');
      setQueryResult(null, null);
      setPartnerMessage(partnerMessages.idle());
      setIsCorrect(false);
      setShowSuccess(false);
      setLeftTab('case');
    }
  }, [activeChapterIndex, caseData, setPartnerMessage, setQuery, setQueryResult]);

  if (!caseData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted font-mono">Case not found.</p>
      </div>
    );
  }

  const chapter = caseData.chapters[activeChapterIndex];
  const isLastChapter = activeChapterIndex === caseData.chapters.length - 1;

  return (
    <div className="h-screen flex flex-col bg-ink overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-[#2a2520] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/cases')}
            className="text-muted hover:text-aged font-mono text-xs transition-colors"
          >
            ← Cases
          </button>
          <span className="text-[#2a2520]">|</span>
          <span className="text-badge font-display text-sm">🔍 SQL Precinct</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted font-mono text-xs truncate max-w-[180px]">
            {caseData.title}
          </span>
          {isTimed && (
            <span
              className={`font-mono text-sm font-bold tabular-nums px-2 py-0.5 rounded ${
                timerSeconds > 600 ? 'text-danger bg-danger/10' : 'text-badge bg-badge/10'
              }`}
            >
              ⏱ {formatTime(timerSeconds)}
            </span>
          )}
          {isHardMode && (
            <span className="bg-danger/20 text-danger font-mono text-xs px-2 py-0.5 rounded">
              HARD
            </span>
          )}
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded ${
              caseData.difficulty === 'Rookie'
                ? 'bg-solved/20 text-green-400'
                : caseData.difficulty === 'Detective'
                ? 'bg-wire/20 text-wire'
                : caseData.difficulty === 'Senior Detective'
                ? 'bg-badge/20 text-badge'
                : 'bg-danger/20 text-danger'
            }`}
          >
            {caseData.difficulty}
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-72 flex-shrink-0 flex flex-col border-r border-[#2a2520]">
          <div className="flex border-b border-[#2a2520] flex-shrink-0">
            {(['case', 'schema'] as PanelTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className={`flex-1 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                  leftTab === tab
                    ? 'text-badge border-b-2 border-badge bg-[#1a1710]'
                    : 'text-muted hover:text-aged'
                }`}
              >
                {tab === 'case' ? 'Case' : 'Schema'}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            {leftTab === 'case' ? (
              <ChapterPanel
                chapter={chapter}
                chapterIndex={activeChapterIndex}
                totalChapters={caseData.chapters.length}
                caseId={caseData.id}
                isHardMode={isHardMode}
              />
            ) : (
              <SchemaBrowser schema={caseData.schema} />
            )}
          </div>
        </div>

        {/* CENTER — Editor + Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex flex-col border-b border-[#2a2520]" style={{ height: '40%' }}>
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#161410] border-b border-[#2a2520] flex-shrink-0">
              <span className="text-muted font-mono text-xs uppercase tracking-widest">
                SQL Editor
              </span>
              <span className="text-muted font-mono text-xs opacity-50">
                Ctrl+Enter to run
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <SQLEditor
                value={currentQuery}
                onChange={setQuery}
                onRun={handleRun}
                disabled={isRunning}
              />
            </div>
            <div className="flex gap-2 px-3 py-2 bg-[#161410] border-t border-[#2a2520] flex-shrink-0">
              <button
                onClick={handleRun}
                disabled={isRunning || !ready}
                className="flex items-center gap-2 px-4 py-1.5 bg-badge text-ink font-mono text-xs font-bold rounded hover:bg-badge/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? '⟳ Running...' : '▶ Run Query'}
              </button>
              <button
                onClick={() => { setQuery(''); setQueryResult(null, null); }}
                className="px-3 py-1.5 border border-[#2a2520] text-muted hover:text-aged font-mono text-xs rounded transition-colors"
              >
                Clear
              </button>
              {!ready && !initError && (
                <span className="text-muted font-mono text-xs self-center ml-2 animate-pulse">
                  Loading database...
                </span>
              )}
              {initError && (
                <span className="text-danger font-mono text-xs self-center ml-2">
                  {initError}
                </span>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex border-b border-[#2a2520] flex-shrink-0">
              {(['results', 'evidence'] as ResultTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightTab(tab)}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                    rightTab === tab
                      ? 'text-badge border-b-2 border-badge bg-[#1a1710]'
                      : 'text-muted hover:text-aged'
                  }`}
                >
                  {tab === 'evidence'
                    ? `Evidence Board (${completedChapters.length})`
                    : 'Results'}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden">
              {rightTab === 'results' ? (
                <ResultsTable result={queryResult} error={queryError} loading={isRunning} />
              ) : (
                <EvidenceBoard
                  evidenceItems={caseData.evidenceItems}
                  unlockedChapters={completedChapters}
                />
              )}
            </div>
          </div>

          <PartnerBar
            message={partnerMessage}
            isError={!!queryError}
            isSuccess={isCorrect}
          />
        </div>
      </div>

      {/* Chapter success overlay */}
      {showSuccess && !isLastChapter && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a1710] border border-solved/40 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="text-solved font-display text-xl mb-2">Chapter Complete</h3>
              <p className="text-paper/80 font-body text-sm leading-relaxed">
                {chapter.successMessage}
              </p>
              {isTimed && (
                <p className="text-badge font-mono text-sm mt-3">
                  ⏱ {formatTime(timerSeconds)}
                </p>
              )}
            </div>
            <button
              onClick={() => { setShowSuccess(false); handleNextChapter(); }}
              className="w-full py-3 bg-badge text-ink font-mono text-sm font-bold rounded hover:bg-badge/80 transition-colors"
            >
              Next Chapter →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
