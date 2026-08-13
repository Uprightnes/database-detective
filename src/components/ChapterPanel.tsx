import React, { useState } from 'react';
import { CaseChapter } from '../types';
import { useGameStore } from '../store/gameStore';

interface ChapterPanelProps {
  chapter: CaseChapter;
  chapterIndex: number;
  totalChapters: number;
  caseId: string;
  isHardMode: boolean;
}

const ChapterPanel: React.FC<ChapterPanelProps> = ({
  chapter,
  chapterIndex,
  totalChapters,
  caseId,
  isHardMode,
}) => {
  const { hintIndex, revealNextHint, setPartnerMessage } = useGameStore();
  const [showHints, setShowHints] = useState(false);

  const revealedHints = chapter.hints.slice(0, hintIndex);
  const hasMoreHints = hintIndex < chapter.hints.length;

  const handleHint = () => {
    if (!hasMoreHints) return;
    revealNextHint();
    setPartnerMessage(
      hintIndex === 0
        ? "Fine. Here's a nudge. Don't make a habit of this."
        : hintIndex === 1
        ? "Another one. I'm starting to wonder who the real detective is here."
        : "Last hint. After this you're on your own."
    );
    setShowHints(true);
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      {/* Chapter header */}
      <div className="px-4 pt-4 pb-2 border-b border-[#2a2520]">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-xs text-muted uppercase tracking-widest">
            Chapter {chapterIndex + 1} of {totalChapters}
          </span>
          {isHardMode && (
            <span className="bg-danger/20 text-danger font-mono text-xs px-2 py-0.5 rounded">
              HARD MODE
            </span>
          )}
        </div>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: totalChapters }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < chapterIndex
                  ? 'bg-solved'
                  : i === chapterIndex
                  ? 'bg-badge'
                  : 'bg-[#2a2520]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Narrative */}
      <div className="px-4 py-4 border-b border-[#2a2520] flex-shrink-0">
        <p className="text-paper/80 font-body text-sm leading-relaxed whitespace-pre-line">
          {chapter.narrative}
        </p>
      </div>

      {/* Objective */}
      <div className="px-4 py-4 border-b border-[#2a2520] flex-shrink-0">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-badge font-mono text-xs uppercase tracking-widest">
            Objective
          </span>
        </div>
        <p className="text-badge/90 font-body text-sm leading-relaxed">
          {chapter.objective}
        </p>
      </div>

      {/* Expected output hint */}
      <div className="px-4 py-3 border-b border-[#2a2520] flex-shrink-0">
        <p className="text-muted font-mono text-xs">
          Expected columns:{' '}
          {chapter.expectedColumns.map((c, i) => (
            <React.Fragment key={c}>
              <span className="text-wire">{c}</span>
              {i < chapter.expectedColumns.length - 1 && ', '}
            </React.Fragment>
          ))}
        </p>
        <p className="text-muted font-mono text-xs mt-0.5">
          Expected rows: <span className="text-wire">{chapter.expectedRowCount}</span>
        </p>
      </div>

      {/* Hints */}
      {!isHardMode && (
        <div className="px-4 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-muted uppercase tracking-widest">
              Hints ({hintIndex}/{chapter.hints.length} used)
            </span>
            {revealedHints.length > 0 && (
              <button
                onClick={() => setShowHints((s) => !s)}
                className="text-muted hover:text-aged font-mono text-xs underline"
              >
                {showHints ? 'Hide' : 'Show'}
              </button>
            )}
          </div>

          {showHints && revealedHints.length > 0 && (
            <div className="space-y-2 mb-3">
              {revealedHints.map((hint, i) => (
                <div
                  key={i}
                  className="bg-[#1e1c18] border border-[#2a2520] rounded px-3 py-2"
                >
                  <p className="text-aged font-mono text-xs">
                    <span className="text-muted mr-2">#{i + 1}</span>
                    {hint}
                  </p>
                </div>
              ))}
            </div>
          )}

          {hasMoreHints ? (
            <button
              onClick={handleHint}
              className="w-full py-2 rounded border border-muted/30 text-muted hover:text-aged hover:border-aged/40 font-mono text-xs transition-colors"
            >
              Reveal Hint ({hintIndex + 1}/{chapter.hints.length})
            </button>
          ) : (
            <p className="text-muted font-mono text-xs italic text-center">
              All hints revealed.
            </p>
          )}
        </div>
      )}

      {isHardMode && (
        <div className="px-4 py-4">
          <div className="bg-danger/10 border border-danger/20 rounded px-3 py-2">
            <p className="text-danger font-mono text-xs text-center">
              No hints in Hard Mode. You're on your own, Detective.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterPanel;
