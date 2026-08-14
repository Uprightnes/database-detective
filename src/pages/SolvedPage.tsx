import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCaseById } from '../data/cases';
import { useGameStore } from '../store/gameStore';

const ratingColors: Record<string, string> = {
  'Chief': 'text-badge border-badge',
  'Senior Detective': 'text-wire border-wire',
  'Detective': 'text-green-400 border-green-400',
  'Rookie': 'text-muted border-muted',
};

const ratingEmoji: Record<string, string> = {
  'Chief': '🏅',
  'Senior Detective': '🔍',
  'Detective': '📋',
  'Rookie': '🐣',
};

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

const SolvedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseData = getCaseById(id || '');
  const { caseProgress, startCase } = useGameStore();
  const progress = id ? caseProgress[id] : null;

  if (!caseData || !progress) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted font-mono">No solved case found.</p>
      </div>
    );
  }

  const rating = progress.rating || 'Detective';
  const elapsed = progress.elapsedSeconds;
  const isTimed = ['Detective', 'Senior Detective', 'Chief'].includes(caseData.difficulty);

  const shareText = [
    `🔍 SQL Precinct`,
    `"${caseData.title}"`,
    `Rating: ${ratingEmoji[rating]} ${rating}`,
    `Queries: ${progress.queriesRun} | Hints: ${progress.hintsUsed}${
      isTimed && elapsed ? ` | Time: ${formatTime(elapsed)}` : ''
    }`,
    `Play at: sql-precinct.vercel.app`,
  ].join('\n');

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText).then(() => alert('Copied! Share it.'));
  };

  const handleReplay = () => {
    if (!id) return;
    startCase(id, false);
    navigate(`/case/${id}`);
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="font-display text-4xl text-badge mb-2">Case Closed</h1>
        <p className="text-muted font-mono text-sm">You got them, Detective.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#161410] border border-[#3a3020] rounded-lg overflow-hidden shadow-2xl mb-6">
        <div className="bg-[#1a1710] px-6 py-4 border-b border-[#2a2520]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-badge font-display text-lg">🔍 SQL Precinct</span>
          </div>
          <p className="text-muted font-mono text-xs">{caseData.setting}</p>
        </div>

        <div className="px-6 py-5 border-b border-[#2a2520]">
          <p className="text-muted font-mono text-xs uppercase tracking-widest mb-1">Case File</p>
          <h2 className="font-display text-2xl text-paper leading-tight mb-1">{caseData.title}</h2>
          <p className="text-aged font-body text-sm italic">{caseData.subtitle}</p>
        </div>

        <div className={`grid divide-x divide-[#2a2520] border-b border-[#2a2520] ${isTimed ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <div className="px-4 py-4 text-center">
            <p className="text-muted font-mono text-xs uppercase tracking-widest mb-1">Queries</p>
            <p className="text-paper font-display text-2xl">{progress.queriesRun}</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="text-muted font-mono text-xs uppercase tracking-widest mb-1">Hints</p>
            <p className="text-paper font-display text-2xl">{progress.hintsUsed}</p>
          </div>
          {isTimed && (
            <div className="px-4 py-4 text-center">
              <p className="text-muted font-mono text-xs uppercase tracking-widest mb-1">Time</p>
              <p className="text-paper font-display text-2xl">
                {elapsed !== undefined ? formatTime(elapsed) : '—'}
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-5 flex items-center justify-between border-b border-[#2a2520]">
          <div>
            <p className="text-muted font-mono text-xs uppercase tracking-widest mb-1">Rating</p>
            <p className={`font-display text-xl border-b-2 pb-0.5 inline-block ${ratingColors[rating]}`}>
              {ratingEmoji[rating]} {rating}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted font-mono text-xs uppercase tracking-widest mb-1">Difficulty</p>
            <p className="text-aged font-mono text-sm">{caseData.difficulty}</p>
          </div>
        </div>

        <div className="px-6 py-5 bg-[#1a1710]">
          <p className="text-muted font-mono text-xs uppercase tracking-widest mb-2">The Culprit</p>
          <p className="text-paper font-display text-xl mb-0.5">{caseData.solution.suspectName}</p>
          <p className="text-aged font-mono text-xs">{caseData.solution.suspectRole}</p>
        </div>
      </div>

      {/* Closing narrative */}
      <div className="w-full max-w-md bg-[#1a1710] border border-[#2a2520] rounded-lg px-6 py-5 mb-8">
        <p className="text-muted font-mono text-xs uppercase tracking-widest mb-3">Case Notes</p>
        <p className="text-paper/80 font-body text-sm leading-relaxed whitespace-pre-line">
          {caseData.solution.closingNarrative}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-md">
        <button
          onClick={handleCopyShare}
          className="w-full py-3 bg-badge text-ink font-mono text-sm font-bold rounded hover:bg-badge/80 transition-colors"
        >
          📤 Copy Share Card
        </button>
        <button
          onClick={() => navigate('/cases')}
          className="w-full py-3 border border-[#3a3020] text-aged font-mono text-sm rounded hover:border-aged/40 hover:text-paper transition-colors"
        >
          ← Back to Cases
        </button>
        <button
          onClick={handleReplay}
          className="w-full py-3 border border-[#2a2520] text-muted font-mono text-sm rounded hover:text-aged transition-colors"
        >
          ↩ Replay Case
        </button>
      </div>
    </div>
  );
};

export default SolvedPage;
