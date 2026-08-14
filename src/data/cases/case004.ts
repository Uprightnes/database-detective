import { CaseData } from '../../types';

const case004: CaseData = {
  id: 'case-004',
  title: 'The Midnight Ledger',
  subtitle: 'A CFO is dead. The company books were wiped. Someone knew exactly what was in them.',
  difficulty: 'Senior Detective',
  estimatedTime: '30–40 min',
  setting: 'Harlow City Financial District, 2003',
  briefing: `Marcus Okafor, Chief Financial Officer of Delvane Capital, was found dead in his office on the 14th floor at 2:17 AM on a Thursday. The building's after-hours access log shows he swiped in at 11:48 PM and never swiped out.

Cause of death: blunt force trauma. His laptop was wiped. A USB drive was missing from his desk drawer — confirmed by his assistant. The company's internal financial records covering Q3 and Q4 2003 had been deleted from the shared server between midnight and 1:15 AM.

Three people had after-hours access that night. All three were executives with motive: Delvane Capital was under a quiet SEC investigation for falsified fund returns, and Marcus had scheduled a meeting with an SEC contact for Friday morning — a meeting nobody else was supposed to know about.

Your job: use the access logs, financial anomalies, communication records, and forensic data to identify who killed Marcus Okafor and why.`,
  schema: [
    {
      name: 'employees',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'name', type: 'TEXT' },
        { name: 'title', type: 'TEXT' },
        { name: 'department', type: 'TEXT' },
        { name: 'salary', type: 'INTEGER' },
        { name: 'hire_date', type: 'TEXT' },
        { name: 'status', type: 'TEXT', note: 'active | terminated | deceased' },
      ],
    },
    {
      name: 'access_logs',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'employee_id', type: 'INTEGER', note: 'FK → employees' },
        { name: 'swipe_time', type: 'TEXT' },
        { name: 'direction', type: 'TEXT', note: 'entry | exit' },
        { name: 'floor', type: 'INTEGER' },
        { name: 'notes', type: 'TEXT' },
      ],
    },
    {
      name: 'financial_records',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'quarter', type: 'TEXT' },
        { name: 'fund_name', type: 'TEXT' },
        { name: 'reported_return_pct', type: 'REAL' },
        { name: 'actual_return_pct', type: 'REAL' },
        { name: 'discrepancy_pct', type: 'REAL' },
        { name: 'approved_by_id', type: 'INTEGER', note: 'FK → employees' },
      ],
    },
    {
      name: 'communications',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'sender_id', type: 'INTEGER', note: 'FK → employees' },
        { name: 'recipient_id', type: 'INTEGER', note: 'FK → employees' },
        { name: 'sent_at', type: 'TEXT' },
        { name: 'channel', type: 'TEXT', note: 'email | phone | encrypted_msg' },
        { name: 'subject', type: 'TEXT' },
        { name: 'flagged', type: 'INTEGER', note: '1 = flagged by forensics' },
      ],
    },
    {
      name: 'forensic_evidence',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'evidence_type', type: 'TEXT' },
        { name: 'found_location', type: 'TEXT' },
        { name: 'linked_employee_id', type: 'INTEGER', note: 'FK → employees, NULL if unlinked' },
        { name: 'confidence', type: 'TEXT' },
        { name: 'detail', type: 'TEXT' },
      ],
    },
  ],
  seedSQL: `
    CREATE TABLE employees (
      id INTEGER PRIMARY KEY,
      name TEXT,
      title TEXT,
      department TEXT,
      salary INTEGER,
      hire_date TEXT,
      status TEXT
    );
    INSERT INTO employees VALUES
      (1, 'Marcus Okafor',    'CFO',                    'Finance',    310000, '1998-03-12', 'deceased'),
      (2, 'Diana Stohl',      'CEO',                    'Executive',  520000, '1995-07-01', 'active'),
      (3, 'Garrett Lind',     'Head of Compliance',     'Legal',      285000, '2000-09-14', 'active'),
      (4, 'Priya Nair',       'VP of Investments',      'Finance',    260000, '2001-02-28', 'active'),
      (5, 'Tom Ashby',        'IT Director',            'Technology', 190000, '1999-06-05', 'active'),
      (6, 'Rachel Osei',      'Executive Assistant',    'Executive',  72000,  '2002-01-10', 'active'),
      (7, 'SEC Agent Flores', 'External Investigator',  'External',   0,      '2003-01-01', 'active');

    CREATE TABLE access_logs (
      id INTEGER PRIMARY KEY,
      employee_id INTEGER,
      swipe_time TEXT,
      direction TEXT,
      floor INTEGER,
      notes TEXT
    );
    INSERT INTO access_logs VALUES
      (1,  1, '2003-11-06 23:48:00', 'entry', 14, 'Marcus swiped in. No exit recorded.'),
      (2,  2, '2003-11-06 23:52:00', 'entry', 14, 'Diana swiped in 4 minutes after Marcus.'),
      (3,  3, '2003-11-07 00:11:00', 'entry', 14, 'Garrett entered. Claimed he was working late on compliance report.'),
      (4,  4, '2003-11-07 00:19:00', 'entry', 12, 'Priya entered on floor 12, not 14. Investment floor.'),
      (5,  5, '2003-11-07 00:25:00', 'entry', 3,  'Tom Ashby entered server room floor.'),
      (6,  4, '2003-11-07 00:38:00', 'entry', 14, 'Priya swiped into floor 14 nineteen minutes after entering floor 12.'),
      (7,  5, '2003-11-07 01:22:00', 'exit',  3,  'Tom exited server room. Deletion window for financial records: 00:00–01:15.'),
      (8,  3, '2003-11-07 01:44:00', 'exit',  14, 'Garrett exited floor 14.'),
      (9,  4, '2003-11-07 02:01:00', 'exit',  14, 'Priya exited floor 14.'),
      (10, 2, '2003-11-07 02:09:00', 'exit',  14, 'Diana exited floor 14. Last to leave.');

    CREATE TABLE financial_records (
      id INTEGER PRIMARY KEY,
      quarter TEXT,
      fund_name TEXT,
      reported_return_pct REAL,
      actual_return_pct REAL,
      discrepancy_pct REAL,
      approved_by_id INTEGER
    );
    INSERT INTO financial_records VALUES
      (1,  'Q1-2003', 'Delvane Growth Fund',    12.4,  11.9,  0.5,  4),
      (2,  'Q1-2003', 'Delvane Stable Income',   8.1,   8.0,  0.1,  4),
      (3,  'Q2-2003', 'Delvane Growth Fund',    14.2,  10.3,  3.9,  4),
      (4,  'Q2-2003', 'Delvane Stable Income',   7.9,   6.1,  1.8,  4),
      (5,  'Q2-2003', 'Delvane Emerging Mkts',  22.1,  11.4, 10.7,  2),
      (6,  'Q3-2003', 'Delvane Growth Fund',    18.3,   8.2, 10.1,  2),
      (7,  'Q3-2003', 'Delvane Stable Income',   9.4,   4.1,  5.3,  4),
      (8,  'Q3-2003', 'Delvane Emerging Mkts',  28.7,   9.9, 18.8,  2),
      (9,  'Q4-2003', 'Delvane Growth Fund',    21.0,   6.3, 14.7,  2),
      (10, 'Q4-2003', 'Delvane Stable Income',  11.2,   3.8,  7.4,  4),
      (11, 'Q4-2003', 'Delvane Emerging Mkts',  35.0,   7.1, 27.9,  2);

    CREATE TABLE communications (
      id INTEGER PRIMARY KEY,
      sender_id INTEGER,
      recipient_id INTEGER,
      sent_at TEXT,
      channel TEXT,
      subject TEXT,
      flagged INTEGER
    );
    INSERT INTO communications VALUES
      (1,  1, 7, '2003-11-05 09:14:00', 'email',         'Friday meeting — Q3/Q4 fund reporting anomalies', 1),
      (2,  1, 6, '2003-11-05 09:16:00', 'email',         'Please block Friday 9am — external meeting, confidential', 0),
      (3,  2, 1, '2003-11-05 14:33:00', 'email',         'Re: Q4 projections — lets align before any external calls', 1),
      (4,  1, 2, '2003-11-05 15:02:00', 'email',         'Re: Q4 projections — I have obligations I cannot defer', 1),
      (5,  2, 3, '2003-11-05 16:48:00', 'encrypted_msg', 'Friday situation — need your read', 1),
      (6,  3, 2, '2003-11-05 17:11:00', 'encrypted_msg', 'Understood. What is the exposure?', 1),
      (7,  2, 4, '2003-11-05 17:22:00', 'encrypted_msg', 'Priya — how quickly can Emerging Mkts records be restructured', 1),
      (8,  4, 2, '2003-11-05 17:58:00', 'encrypted_msg', 'Not quickly. And not without Marcus knowing.', 1),
      (9,  2, 5, '2003-11-06 08:30:00', 'email',         'Tom — I may need server maintenance access tonight. Standby.', 1),
      (10, 5, 2, '2003-11-06 08:44:00', 'email',         'Understood. I will keep my schedule clear.', 1),
      (11, 1, 7, '2003-11-06 10:00:00', 'phone',         'Confirmation call — Friday 9am SEC meeting confirmed', 1),
      (12, 3, 2, '2003-11-06 21:15:00', 'encrypted_msg', 'Tonight then. I will be there.', 1);

    CREATE TABLE forensic_evidence (
      id INTEGER PRIMARY KEY,
      evidence_type TEXT,
      found_location TEXT,
      linked_employee_id INTEGER,
      confidence TEXT,
      detail TEXT
    );
    INSERT INTO forensic_evidence VALUES
      (1, 'fingerprint',     'Marcus laptop keyboard',     2,    'confirmed',    'Diana Stohls prints found on Marcus keyboard. She claims she touched it days earlier.'),
      (2, 'fingerprint',     'USB drive slot on laptop',   2,    'confirmed',    'Diana Stohls prints on USB slot. Consistent with removing a drive.'),
      (3, 'fiber',           'Victims jacket collar',      2,    'probable',     'Synthetic fiber consistent with fabric from Dianas known wardrobe.'),
      (4, 'server_log',      'Delvane file server',        5,    'confirmed',    'Tom Ashbys credentials used to delete Q3 and Q4 financial records at 00:47 AM.'),
      (5, 'encrypted_msgs',  'Diana Stohl device',         NULL, 'confirmed',    'Full encrypted message thread recovered. Shows coordination between Diana, Garrett, and Priya starting Nov 5.'),
      (6, 'blunt_instrument','14th floor storage closet',  NULL, 'inconclusive', 'Heavy bookend found. No prints. No DNA match possible — surface too smooth.'),
      (7, 'access_anomaly',  'Floor 12 then Floor 14',     4,    'probable',     'Priya accessed investment floor then executive floor. Unusual pattern. No business reason given.'),
      (8, 'phone_record',    'Marcus cell phone',          1,    'confirmed',    'Last outgoing call from Marcus: 11:31 PM to an unlisted number. Call lasted 4 minutes. Number traced to a prepaid phone purchased with cash.');
  `,
  chapters: [
    {
      id: 'ch-1',
      narrative: `Marcus Okafor is dead. Three executives were in the building. One of them didn't have a reason to be there.

Start by pulling the access log for the night in question. Show who entered, at what time, which floor, and in which direction. Join the employees table for names. Order by swipe time.`,
      objective: 'Show employee name, swipe_time, direction, floor, and notes from access_logs. JOIN employees. ORDER BY swipe_time.',
      expectedColumns: ['name', 'swipe_time', 'direction', 'floor', 'notes'],
      expectedRowCount: 10,
      hints: [
        'JOIN access_logs with employees on employee_id = id.',
        'SELECT e.name, al.swipe_time, al.direction, al.floor, al.notes FROM access_logs al JOIN employees e ON e.id = al.employee_id',
        'Add ORDER BY al.swipe_time at the end.',
      ],
      successMessage: "Ten swipes. Four people on the 14th floor. Tom Ashby in the server room during the deletion window. Priya moved between floors with no explanation.",
      partnerOnSuccess: "Now look at the money. That's always where it starts.",
    },
    {
      id: 'ch-2',
      narrative: `The SEC investigation was about falsified fund returns. Someone was reporting numbers that weren't real.

Find the total discrepancy per approver — the person who signed off on the bad numbers. Show the approver's name and the sum of discrepancy_pct across all records they approved. Order by total discrepancy descending.`,
      objective: 'Show approver name and SUM(discrepancy_pct) AS total_discrepancy. GROUP BY approved_by_id. JOIN employees. ORDER BY total_discrepancy DESC.',
      expectedColumns: ['approver_name', 'total_discrepancy'],
      expectedRowCount: 2,
      hints: [
        'JOIN financial_records with employees on approved_by_id = id.',
        'GROUP BY approved_by_id and SUM(discrepancy_pct).',
        'SELECT e.name AS approver_name, SUM(fr.discrepancy_pct) AS total_discrepancy FROM financial_records fr JOIN employees e ON e.id = fr.approved_by_id GROUP BY fr.approved_by_id ORDER BY total_discrepancy DESC',
      ],
      successMessage: "Two approvers. One had minor rounding errors. The other approved over 70 percentage points of total discrepancy. That person had the most to lose when Marcus called the SEC.",
      partnerOnSuccess: "The fraud is clear. Now let's see who knew about Marcus's SEC meeting.",
    },
    {
      id: 'ch-3',
      narrative: `Marcus emailed the SEC contact the day before he died. Then the emails started flying.
      
Show all flagged communications. Include sender name, recipient name, time sent, channel, and subject. Order by sent_at.`,
      objective: 'Show sender name, recipient name, sent_at, channel, subject for flagged = 1 communications. JOIN employees twice. ORDER BY sent_at.',
      expectedColumns: ['sender_name', 'recipient_name', 'sent_at', 'channel', 'subject'],
      expectedRowCount: 12,
      hints: [
        'JOIN communications with employees twice: once for sender_id, once for recipient_id.',
        'Use aliases: JOIN employees s ON s.id = sender_id, JOIN employees r ON r.id = recipient_id.',
        'SELECT s.name AS sender_name, r.name AS recipient_name, c.sent_at, c.channel, c.subject FROM communications c JOIN employees s ON s.id = c.sender_id JOIN employees r ON r.id = c.recipient_id WHERE c.flagged = 1 ORDER BY c.sent_at',
      ],
      successMessage: "Twelve flagged messages. Marcus told the SEC. Diana tried to stop him. Garrett and Priya were brought in. Tom Ashby was put on standby. All in 36 hours.",
      partnerOnSuccess: "The chain of command is clear. Now the forensics.",
    },
    {
      id: 'ch-4',
      narrative: `The forensic team recovered evidence from the scene and the server logs.

Show all forensic evidence with a confidence of 'confirmed' or 'probable'. Include the linked employee's name where available. Show evidence_type, found_location, confidence, and detail.`,
      objective: "Show evidence_type, found_location, employee name (or 'Unlinked'), confidence, detail WHERE confidence IN ('confirmed','probable'). LEFT JOIN employees.",
      expectedColumns: ['evidence_type', 'found_location', 'employee_name', 'confidence', 'detail'],
      expectedRowCount: 6,
      hints: [
        'Use LEFT JOIN employees on linked_employee_id = id — some evidence has no linked person.',
        "Use COALESCE(e.name, 'Unlinked') AS employee_name to handle NULLs.",
        "SELECT fe.evidence_type, fe.found_location, COALESCE(e.name, 'Unlinked') AS employee_name, fe.confidence, fe.detail FROM forensic_evidence fe LEFT JOIN employees e ON e.id = fe.linked_employee_id WHERE fe.confidence IN ('confirmed','probable')",
      ],
      successMessage: "Diana's prints on the laptop and USB slot. Tom's credentials deleted the files. Priya's access pattern flagged. The encrypted messages recovered. Every thread leads somewhere.",
      partnerOnSuccess: "Last step. Pull it all together.",
    },
    {
      id: 'ch-5',
      narrative: `The building had four people on floor 14 that night. Three of them are suspects.

For each suspect, calculate how long they were on floor 14 — the difference in minutes between their last exit and first entry on that floor. Show name, entry time, exit time, and minutes on floor 14. Only show people who both entered and exited floor 14.`,
      objective: "Show name, entry swipe_time, exit swipe_time, and minutes between them for employees who have both an entry and exit on floor 14. Use a subquery or GROUP BY.",
      expectedColumns: ['name', 'entry_time', 'exit_time', 'minutes_on_floor'],
      expectedRowCount: 3,
      hints: [
        'Get the MIN swipe_time WHERE direction = entry and floor = 14, and MAX WHERE direction = exit and floor = 14 per employee.',
        'Use a subquery: SELECT employee_id, MIN(swipe_time) as entry_time, MAX(swipe_time) as exit_time FROM access_logs WHERE floor = 14 GROUP BY employee_id HAVING COUNT(DISTINCT direction) = 2',
        `SELECT e.name, sub.entry_time, sub.exit_time,
  ROUND((JULIANDAY(sub.exit_time) - JULIANDAY(sub.entry_time)) * 1440) AS minutes_on_floor
FROM (
  SELECT employee_id,
    MIN(CASE WHEN direction='entry' THEN swipe_time END) AS entry_time,
    MAX(CASE WHEN direction='exit' THEN swipe_time END) AS exit_time
  FROM access_logs WHERE floor = 14
  GROUP BY employee_id
  HAVING entry_time IS NOT NULL AND exit_time IS NOT NULL
) sub
JOIN employees e ON e.id = sub.employee_id`,
      ],
      successMessage: "Diana: 137 minutes on the floor. Garrett: 93 minutes. Priya: 83 minutes. Diana arrived four minutes after Marcus, and was last to leave. She had the most time alone with him.",
      partnerOnSuccess: "That's your answer. Write it on the board.",
    },
  ],
  solution: {
    suspectName: 'Diana Stohl',
    suspectRole: 'CEO, Delvane Capital',
    closingNarrative: `Diana Stohl had approved or orchestrated over 70 percentage points of falsified fund returns across Q2–Q4 2003. The SEC investigation threatened not just her position but a potential criminal fraud charge.

When Marcus Okafor confirmed his Friday 9AM meeting with SEC Agent Flores, Diana spent 36 hours coordinating: looping in Garrett Lind (Compliance) and Priya Nair (who had access to the investment records), and placing Tom Ashby on standby for server access.

That night she entered the building four minutes after Marcus. Her fingerprints were found on his keyboard and on the USB slot — consistent with removing his backup drive. Tom Ashby deleted the financial records from the server room between midnight and 1:15 AM.

Marcus's last call — at 11:31 PM — was to a prepaid phone. The number was never traced.

Diana Stohl was arrested in March 2004. She was convicted of securities fraud, obstruction of justice, and first-degree murder. Tom Ashby pleaded guilty to obstruction and received a reduced sentence. Garrett and Priya were not charged — their communications were deemed insufficient to prove conspiracy beyond reasonable doubt.

The SEC investigation into Delvane Capital resulted in the firm's dissolution and investor restitution proceedings.`,
  },
  evidenceItems: [
    {
      id: 'ev-1',
      unlockedAfterChapter: 'ch-1',
      type: 'record',
      label: 'Building Access Log — Nov 6/7, 2003',
      content: 'Four executives on the 14th floor. Tom Ashby in the server room. Deletion window: 00:00–01:15 AM. Tom exited at 01:22 AM.',
    },
    {
      id: 'ev-2',
      unlockedAfterChapter: 'ch-2',
      type: 'document',
      label: 'Financial Fraud Summary',
      content: 'Diana Stohl approved 70.4% total discrepancy. Priya Nair approved 6.3%. Diana had the most to lose from Marcus\'s SEC meeting.',
    },
    {
      id: 'ev-3',
      unlockedAfterChapter: 'ch-3',
      type: 'note',
      label: 'Encrypted Message Chain',
      content: 'Nov 5: Diana → Garrett: "Friday situation." Diana → Priya: "How quickly can records be restructured." Nov 6: Garrett → Diana: "Tonight then. I will be there."',
    },
    {
      id: 'ev-4',
      unlockedAfterChapter: 'ch-4',
      type: 'record',
      label: 'Forensic Report',
      content: "Diana's prints on laptop + USB slot. Tom's credentials deleted Q3/Q4 records at 00:47 AM. Fiber on victim's collar matches Diana's wardrobe.",
    },
    {
      id: 'ev-5',
      unlockedAfterChapter: 'ch-5',
      type: 'note',
      label: 'Floor 14 Timeline',
      content: 'Diana: 137 min. Garrett: 93 min. Priya: 83 min. Diana entered 4 minutes after Marcus. Last to leave at 02:09 AM. Marcus was found dead at 02:17 AM.',
    },
  ],
};

export default case004;
