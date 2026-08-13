import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sections = [
  {
    id: 'basics',
    title: 'The Basics',
    content: [
      {
        label: 'SELECT all columns',
        sql: 'SELECT * FROM persons',
        note: 'Pulls every column from the persons table.',
      },
      {
        label: 'SELECT specific columns',
        sql: 'SELECT name, occupation FROM persons',
        note: 'Only returns the columns you name.',
      },
      {
        label: 'Filter rows with WHERE',
        sql: "SELECT * FROM persons WHERE role = 'suspect'",
        note: 'Only returns rows where the condition is true.',
      },
      {
        label: 'Sort results',
        sql: 'SELECT * FROM incidents ORDER BY incident_date ASC',
        note: 'ASC = oldest first. DESC = newest first.',
      },
    ],
  },
  {
    id: 'filters',
    title: 'Filtering Like a Detective',
    content: [
      {
        label: 'Multiple conditions',
        sql: "SELECT * FROM persons WHERE role = 'suspect' AND occupation = 'painter'",
        note: 'Use AND to combine conditions. Both must be true.',
      },
      {
        label: 'Either/or condition',
        sql: "SELECT * FROM incidents WHERE incident_type = 'death' OR incident_type = 'missing'",
        note: 'Use OR when either condition being true is enough.',
      },
      {
        label: 'NULL checks',
        sql: 'SELECT * FROM insurance_policies WHERE claimed_date IS NOT NULL',
        note: 'NULL means the value is empty. IS NULL / IS NOT NULL to check.',
      },
      {
        label: 'Pattern matching',
        sql: "SELECT * FROM persons WHERE name LIKE 'Ray%'",
        note: "% is a wildcard. 'Ray%' matches anything starting with Ray.",
      },
    ],
  },
  {
    id: 'joins',
    title: 'JOINing Tables',
    content: [
      {
        label: 'INNER JOIN (most common)',
        sql: `SELECT p.name, cr.offense
FROM criminal_records cr
JOIN persons p ON p.id = cr.person_id`,
        note: 'Connects two tables by a matching column. Only returns rows that match in both.',
      },
      {
        label: 'LEFT JOIN',
        sql: `SELECT p.name, ip.amount
FROM persons p
LEFT JOIN insurance_policies ip ON ip.policyholder_id = p.id`,
        note: 'Returns all rows from the left table, even if there is no match on the right.',
      },
      {
        label: 'JOIN the same table twice',
        sql: `SELECT p1.name AS policyholder, p2.name AS beneficiary, ip.amount
FROM insurance_policies ip
JOIN persons p1 ON p1.id = ip.policyholder_id
JOIN persons p2 ON p2.id = ip.beneficiary_id`,
        note: 'Use aliases (p1, p2) to join the same table multiple times.',
      },
    ],
  },
  {
    id: 'aggregates',
    title: 'Counting & Grouping',
    content: [
      {
        label: 'Count rows',
        sql: 'SELECT COUNT(*) FROM incidents',
        note: 'Returns how many rows are in the table.',
      },
      {
        label: 'Group by a value',
        sql: 'SELECT incident_type, COUNT(*) FROM incidents GROUP BY incident_type',
        note: 'Groups rows together and counts each group.',
      },
      {
        label: 'Filter groups with HAVING',
        sql: `SELECT person_id, COUNT(*) as total
FROM criminal_records
GROUP BY person_id
HAVING total > 1`,
        note: 'HAVING filters after GROUP BY. Use it instead of WHERE for grouped results.',
      },
    ],
  },
];

const HowToPlayPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('basics');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (sql: string) => {
    navigator.clipboard.writeText(sql).then(() => {
      setCopied(sql);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const active = sections.find((s) => s.id === activeSection);

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
        <button
          onClick={() => navigate('/cases')}
          className="text-muted hover:text-aged font-mono text-xs transition-colors"
        >
          Cases →
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-display text-3xl text-paper mb-2">How to Play</h1>
          <p className="text-muted font-body text-sm max-w-xl">
            You don't need to be a SQL expert to start. You need to be curious.
            Here's everything you need to solve your first case.
          </p>
        </div>

        {/* Game loop */}
        <div className="bg-[#161410] border border-[#2a2520] rounded-lg p-6 mb-10">
          <h2 className="font-display text-lg text-badge mb-4">The Game Loop</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            {[
              { step: '1', label: 'Read the briefing' },
              { step: '2', label: 'Check the schema' },
              { step: '3', label: 'Write a query' },
              { step: '4', label: 'Read the result' },
              { step: '5', label: 'Find the culprit' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-badge/20 border border-badge/30 flex items-center justify-center">
                  <span className="text-badge font-mono text-sm font-bold">{s.step}</span>
                </div>
                <p className="text-aged font-body text-xs leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SQL Reference */}
        <div className="mb-8">
          <h2 className="font-display text-lg text-paper mb-4">SQL Quick Reference</h2>
          <div className="flex gap-2 flex-wrap mb-6">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-4 py-2 font-mono text-xs rounded transition-colors ${
                  activeSection === s.id
                    ? 'bg-badge text-ink font-bold'
                    : 'border border-[#2a2520] text-muted hover:text-aged'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {active && (
            <div className="space-y-4">
              {active.content.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#161410] border border-[#2a2520] rounded-lg overflow-hidden"
                >
                  <div className="px-4 py-2 border-b border-[#2a2520] flex items-center justify-between">
                    <span className="text-aged font-body text-sm">{item.label}</span>
                    <button
                      onClick={() => handleCopy(item.sql)}
                      className="text-muted hover:text-aged font-mono text-xs transition-colors"
                    >
                      {copied === item.sql ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="px-4 py-3 font-mono text-sm text-badge overflow-x-auto">
                    {item.sql}
                  </pre>
                  <div className="px-4 py-2 bg-[#1a1710] border-t border-[#2a2520]">
                    <p className="text-muted font-body text-xs">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-[#161410] border border-[#2a2520] rounded-lg p-6 mb-8">
          <h2 className="font-display text-lg text-badge mb-4">Detective Tips</h2>
          <ul className="space-y-3">
            {[
              "Start with SELECT * FROM [tablename] to see what's in a table.",
              'The Schema Browser (top-left) shows all tables and their columns.',
              "When in doubt, filter: add WHERE to narrow down suspects.",
              'Use ORDER BY to sort by date and build a timeline.',
              "JOIN connects two tables — look for matching IDs between them.",
              'Hints cost rating points, but they\'re there when you need them.',
              'Ctrl+Enter (or Cmd+Enter on Mac) runs your query.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-badge font-mono text-sm flex-shrink-0 mt-0.5">→</span>
                <p className="text-paper/80 font-body text-sm leading-snug">{tip}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/cases')}
            className="px-8 py-3 bg-badge text-ink font-mono text-sm font-bold rounded hover:bg-badge/80 transition-colors"
          >
            Start Your First Case →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayPage;
