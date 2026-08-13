import React from 'react';
import { EvidenceItem } from '../types';

interface EvidenceBoardProps {
  evidenceItems: EvidenceItem[];
  unlockedChapters: string[];
}

const typeIcon: Record<EvidenceItem['type'], string> = {
  photo: '📷',
  document: '📄',
  note: '📌',
  record: '🗂',
};

const typeColor: Record<EvidenceItem['type'], string> = {
  photo: 'border-aged bg-manila/10',
  document: 'border-wire bg-wire/5',
  note: 'border-badge bg-badge/5',
  record: 'border-muted bg-muted/5',
};

const EvidenceBoard: React.FC<EvidenceBoardProps> = ({
  evidenceItems,
  unlockedChapters,
}) => {
  const unlocked = evidenceItems.filter((e) =>
    unlockedChapters.includes(e.unlockedAfterChapter)
  );
  const locked = evidenceItems.filter(
    (e) => !unlockedChapters.includes(e.unlockedAfterChapter)
  );

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Cork board texture */}
      <div
        className="min-h-full rounded-lg p-4 relative"
        style={{
          background: '#7a5c3a',
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(0,0,0,0.15) 0%, transparent 50%)
          `,
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {unlocked.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3 opacity-40">📋</div>
            <p className="text-manila/50 font-display text-sm">
              No evidence yet.
              <br />
              Run a correct query to pin something.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {unlocked.map((item, i) => (
            <div
              key={item.id}
              className={`pin-drop border rounded-sm p-3 shadow-md ${typeColor[item.type]}`}
              style={{
                animationDelay: `${i * 60}ms`,
                transform: `rotate(${((i * 7) % 7) - 3}deg)`,
                backgroundColor: '#f2ede4',
              }}
            >
              {/* Pin */}
              <div
                className="w-3 h-3 rounded-full bg-stamp shadow-sm mx-auto -mt-5 mb-2"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
              />
              <div className="flex items-start gap-2">
                <span className="text-lg">{typeIcon[item.type]}</span>
                <div>
                  <p className="text-ink font-display text-xs font-bold leading-tight mb-1">
                    {item.label}
                  </p>
                  <p className="text-ink/70 font-body text-xs leading-snug">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Locked placeholders */}
          {locked.map((item) => (
            <div
              key={item.id}
              className="border border-dashed border-manila/20 rounded-sm p-3 opacity-30"
              style={{ backgroundColor: 'rgba(242,237,228,0.05)' }}
            >
              <p className="text-manila/40 font-mono text-xs text-center">
                ??? — Evidence locked
              </p>
            </div>
          ))}
        </div>

        {/* String decorations between cards */}
        {unlocked.length > 1 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <line
              x1="50%"
              y1="80px"
              x2="50%"
              y2="160px"
              stroke="#c8333a"
              strokeWidth="1"
              strokeDasharray="4,3"
              opacity="0.4"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default EvidenceBoard;
