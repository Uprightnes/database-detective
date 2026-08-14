import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allCases } from '../data/cases';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const fullText = 'SELECT * FROM suspects WHERE motive IS NOT NULL;';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2520]">
        <span className="text-badge font-display text-xl">SQL Precinct</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/how-to-play')}
            className="text-muted hover:text-aged font-mono text-xs transition-colors"
          >
            How to Play
          </button>
          <button
            onClick={() => navigate('/cases')}
            className="px-4 py-2 bg-badge text-ink font-mono text-xs font-bold rounded hover:bg-badge/80 transition-colors"
          >
            Open Cases
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-[#161410] border border-[#2a2520] rounded px-4 py-2 mb-8">
          <span className="font-mono text-sm text-badge">{typedText}</span>
          <span className="animate-pulse text-badge">▋</span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl text-paper leading-tight mb-6">
          You don't chase suspects.
          <br />
          <span className="text-badge">You find them in the data.</span>
        </h1>

        <p className="text-aged font-body text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          SQL Precinct is a mystery game where you solve real crimes
          using SQL queries. Every clue is a table. Every answer is a query.
          The truth is always in the data.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/cases')}
            className="px-8 py-4 bg-badge text-ink font-mono text-sm font-bold rounded-lg hover:bg-badge/80 transition-colors shadow-lg"
          >
            ▶ Start Investigating
          </button>
          <button
            onClick={() => navigate('/how-to-play')}
            className="px-8 py-4 border border-[#3a3020] text-aged font-mono text-sm rounded-lg hover:border-aged/40 hover:text-paper transition-colors"
          >
            How It Works
          </button>
        </div>

        <p className="text-muted font-mono text-xs mt-4">
          Free. No login. Runs in your browser.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="border-t border-[#2a2520] py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Real Cases. Real SQL.',
                body: 'Each case is a fictionalized mystery with real relational data. No fill-in-the-blank. You write the queries.',
              },
              {
                icon: '📌',
                title: 'Evidence Board',
                body: 'Correct queries pin evidence to a cork board. Watch the case come together as you dig deeper.',
              },
              {
                icon: '🏅',
                title: 'Get Rated',
                body: 'Fewer queries, fewer hints, faster time. Every case ends with a Detective Rating you can share.',
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display text-lg text-paper mb-2">{f.title}</h3>
                <p className="text-muted font-body text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case previews */}
      <div className="border-t border-[#2a2520] py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-2xl text-paper mb-8 text-center">
            Open Case Files
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {allCases.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate('/cases')}
                className="bg-[#161410] border border-[#2a2520] hover:border-[#3a3020] rounded-lg p-5 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-muted font-mono text-xs">{c.setting}</span>
                  <span className="text-muted">·</span>
                  <span className="text-green-400 font-mono text-xs">{c.difficulty}</span>
                </div>
                <h3 className="font-display text-lg text-paper group-hover:text-badge transition-colors mb-1">
                  {c.title}
                </h3>
                <p className="text-aged font-body text-sm italic mb-3">{c.subtitle}</p>
                <p className="text-paper/50 font-body text-xs leading-relaxed line-clamp-2">
                  {c.briefing.slice(0, 140)}...
                </p>
                <div className="mt-3 flex items-center gap-1 flex-wrap">
                  {c.schema.slice(0, 3).map((t) => (
                    <span
                      key={t.name}
                      className="font-mono text-xs text-muted bg-[#1e1c18] px-2 py-0.5 rounded"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/cases')}
              className="px-8 py-3 bg-badge text-ink font-mono text-sm font-bold rounded hover:bg-badge/80 transition-colors"
            >
              View All Cases →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#2a2520] py-8 text-center">
        <p className="text-muted font-mono text-xs">
          SQL Precinct — Learn SQL by solving crimes.
        </p>
        <p className="text-muted/50 font-mono text-xs mt-1">
          All cases are fictional. Any resemblance to real persons is coincidental.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
