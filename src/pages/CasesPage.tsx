import React from 'react';
import { useNavigate } from 'react-router-dom';
import { allCases } from '../data/cases';
import { useGameStore } from '../store/gameStore';

const difficultyColor: Record<string, string> = {
  'Rookie': 'text-green-400 bg-green-400/10 border-green-400/30',
  'Detective': 'text-wire bg-wire/10 border-wire/30',
  'Senior Detective': 'text-badge bg-badge/10 border-badge/30',
  'Chief': 'text-red-400 bg-red-400/10 border-red-400/30',
};

const CasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { caseProgress, startCase } = useGameStore();

  const handleStart = (caseId: string, hardMode = false) => {
    startCase(caseId, hardMode);
    navigate(`/case/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-ink">
      {/* Header */}
      <div className="border-b border-[#2a2520] px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-muted hover:text-aged font-mono text-xs transition-colors"
        >
          ← Home
        </button>
        <span className="text-badge font-display text-lg">Database Detective</span>
        <div />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-display text-3xl text-paper mb-2">Case Files</h1>
          <p className="text-muted font-body text-sm">
            Choose a case. Open the database. Find the answer.
          </p>
        </div>

        <div className="space-y-4">
          {allCases.map((c, idx) => {
            const progress = caseProgress[c.id];
            const isSolved = !!progress?.completedAt;
            const inProgress = progress && !progress.completedAt && progress.queriesRun > 0;
            const chapsDone = progress?.completedChapters.length || 0;

            return (
              <div
                key={c.id}
                className={`bg-[#161410] border rounded-lg overflow-hidden transition-colors ${
                  isSolved
                    ? 'border-solved/30'
                    : 'border-[#2a2520] hover:border-[#3a3020]'
                }`}
              >
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-muted font-mono text-xs">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded border ${difficultyColor[c.difficulty]}`}
                        >
                          {c.difficulty}
                        </span>
                        <span className="text-muted font-mono text-xs">
                          {c.estimatedTime}
                        </span>
                        {isSolved && (
                          <span className="text-solved font-mono text-xs">
                            ✓ Solved — {progress?.rating}
                          </span>
                        )}
                        {inProgress && !isSolved && (
                          <span className="text-badge font-mono text-xs">
                            ● In Progress ({chapsDone}/{c.chapters.length} chapters)
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-xl text-paper leading-tight mb-1">
                        {c.title}
                      </h2>
                      <p className="text-aged font-body text-sm italic leading-snug">
                        {c.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-paper/60 font-body text-sm leading-relaxed mb-4 line-clamp-2">
                    {c.briefing.slice(0, 180)}...
                  </p>

                  {/* SQL concepts */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {c.schema.slice(0, 4).map((t) => (
                      <span
                        key={t.name}
                        className="font-mono text-xs text-muted bg-[#1e1c18] border border-[#2a2520] px-2 py-0.5 rounded"
                      >
                        {t.name}
                      </span>
                    ))}
                    {c.schema.length > 4 && (
                      <span className="font-mono text-xs text-muted px-1">
                        +{c.schema.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStart(c.id, false)}
                      className="flex-1 py-2.5 bg-badge text-ink font-mono text-sm font-bold rounded hover:bg-badge/80 transition-colors"
                    >
                      {isSolved ? '↩ Replay' : inProgress ? '▶ Continue' : '▶ Start Case'}
                    </button>
                    <button
                      onClick={() => handleStart(c.id, true)}
                      className="px-4 py-2.5 border border-danger/30 text-danger font-mono text-xs rounded hover:bg-danger/10 transition-colors"
                      title="Hard Mode: No hints, no mercy"
                    >
                      Hard
                    </button>
                  </div>
                </div>

                {/* Progress bar if in progress */}
                {(inProgress || isSolved) && (
                  <div className="h-1 bg-[#2a2520]">
                    <div
                      className={`h-full transition-all ${isSolved ? 'bg-solved' : 'bg-badge'}`}
                      style={{
                        width: `${(chapsDone / c.chapters.length) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Coming soon placeholder */}
        <div className="mt-6 bg-[#161410] border border-dashed border-[#2a2520] rounded-lg px-6 py-8 text-center">
          <p className="text-muted font-mono text-xs uppercase tracking-widest mb-2">
            More Cases
          </p>
          <p className="text-muted font-body text-sm">
            New cases added regularly. Check back soon, Detective.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CasesPage;
