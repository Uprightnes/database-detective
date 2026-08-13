import React, { useState, useEffect, useCallback } from 'react';
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

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseData = getCaseById(id || '');

  const {
    currentQuery, setQuery,
    queryResult, queryError, setQueryResult,
    partnerMessage, setPartnerMessage,
    isHardMode,
    caseProgress, startCase, completeChapter, completeCase, incrementQueryCount,
  } = useGameStore();

  const { ready, initError, runQuery, validateResult } = useSQLEngine(caseData || null);

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [leftTab, setLeftTab] = useState<PanelTab>('case');
  const [rightTab, setRightTab] = useState<ResultTab>('results');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const progress = caseData ? caseProgress[caseData.id] : null;
  const completedChapters = progress?.completedChapters || [];

  useEffect(() => {
    if (caseData && !caseProgress[caseData.id]) {
      startCase(caseData.id);
    }
  }, [caseData, caseProgress, startCase]);

  // Restore chapter index from progress
  useEffect(() => {
    if (!caseData || !progress) return;
    const lastDone = progress.completedChapters.length;
    const nextIdx = Math.min(lastDone, caseData.chapters.length - 1);
    setActiveChapterIndex(nextIdx);
  }, [caseData, progress]);

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
        setShowSuccess(true);
        setPartnerMessage(chapter.partnerOnSuccess);
        setRightTab('evidence');

        if (!completedChapters.includes(chapter.id)) {
          completeChapter(chapter.id, caseData.id);
        }

        // Check if last chapter
        const isLastChapter = activeChapterIndex === caseData.chapters.length - 1;
        if (isLastChapter) {
          completeCase(caseData.id);
          setTimeout(() => navigate(`/case/${caseData.id}/solved`), 2200);
        }
      } else {
        // Diagnose the failure
        if (rowCount === 0) {
          setPartnerMessage(partnerMessages.emptyResult());
        } else if (rowCount > chapter.expectedRowCount * 2) {
          setPartnerMessage(partnerMessages.tooManyRows(rowCount));
        } else if (rowCount < chapter.expectedRowCount) {
          setPartnerMessage(partnerMessages.tooFewRows(rowCount, chapter.expectedRowCount));
        } else {
          setPartnerMessage(partnerMessages.wrongColumns());
        }
      }

      setIsRunning(false);
    }, 120);
  }, [ready, caseData, currentQuery, activeChapterIndex, runQuery, validateResult, completeCase, completeChapter, completedChapters, incrementQueryCount, navigate, setPartnerMessage, setQueryResult]);

  const handleNextChapter = () => {
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
  };

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
          <span className="text-badge font-display text-sm">Database Detective</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted font-mono text-xs truncate max-w-[200px]">
            {caseData.title}
          </span>
          {isHardMode && (
            <span className="bg-danger/20 text-danger font-mono text-xs px-2 py-0.5 rounded">
              HARD
            </span>
          )}
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded ${
              caseData.difficulty === 'Rookie'
                ? 'bg-solved/20 text-green-400'
                : 'bg-wire/20 text-wire'
            }`}
          >
            {caseData.difficulty}
          </span>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL — Case / Schema */}
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

          {/* Results area */}
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
                  {tab === 'evidence' ? `Evidence Board (${completedChapters.length})` : 'Results'}
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

          {/* Partner bar */}
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
