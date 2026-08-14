import { CaseData } from '../../types';

const case003: CaseData = {
  id: 'case-003',
  title: 'The Wrong Son',
  subtitle: 'He came back from Spain speaking French with the wrong eye color. The family said nothing.',
  difficulty: 'Detective',
  estimatedTime: '25–30 min',
  setting: 'San Marcos, Texas, 1997',
  briefing: `Daniel Reyes disappeared at age 13 on June 13th, 1994. He called home from a basketball court looking for a ride. His brother answered, refused to wake their mother, and told him to walk. He never arrived.

Three years later, the Reyes family received a call: Daniel had been found alive in Seville, Spain. Trafficked abroad, forced to speak only French, his hair and eye color allegedly changed by his captors.

His sister flew to Spain to identify him. She said it was him.

He came home.

Six months later, an FBI fingerprint analysis revealed the man living with the Reyes family was not Daniel. He was Armand Bousquet, a 24-year-old French con artist with over 300 documented identities.

But the deeper question was never answered: what happened to the real Daniel Reyes? And did the family know Armand wasn't Daniel — and play along anyway?

Your job is to follow the data. Find the inconsistencies. Name the truth.`,
  schema: [
    {
      name: 'persons',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'name', type: 'TEXT' },
        { name: 'age_at_incident', type: 'INTEGER' },
        { name: 'role', type: 'TEXT', note: 'victim | suspect | witness | impostor' },
        { name: 'nationality', type: 'TEXT' },
      ],
    },
    {
      name: 'identities',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'person_id', type: 'INTEGER', note: 'FK → persons' },
        { name: 'alias', type: 'TEXT' },
        { name: 'country_used', type: 'TEXT' },
        { name: 'year_used', type: 'INTEGER' },
        { name: 'documents_forged', type: 'TEXT' },
      ],
    },
    {
      name: 'biometric_records',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'person_id', type: 'INTEGER', note: 'FK → persons' },
        { name: 'record_type', type: 'TEXT', note: 'fingerprint | dna | ear_shape | dental' },
        { name: 'sample_date', type: 'TEXT' },
        { name: 'matches_person_id', type: 'INTEGER', note: 'FK → persons — who this matches' },
        { name: 'confidence', type: 'TEXT', note: 'confirmed | probable | inconclusive | mismatch' },
        { name: 'notes', type: 'TEXT' },
      ],
    },
    {
      name: 'timeline_events',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'event_date', type: 'TEXT' },
        { name: 'person_id', type: 'INTEGER', note: 'FK → persons' },
        { name: 'event_type', type: 'TEXT' },
        { name: 'location', type: 'TEXT' },
        { name: 'description', type: 'TEXT' },
        { name: 'flagged_suspicious', type: 'INTEGER', note: '1 = suspicious, 0 = normal' },
      ],
    },
    {
      name: 'family_responses',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'family_member_id', type: 'INTEGER', note: 'FK → persons' },
        { name: 'response_date', type: 'TEXT' },
        { name: 'response_type', type: 'TEXT', note: 'accepted | rejected | suspicious | no_comment' },
        { name: 'detail', type: 'TEXT' },
      ],
    },
  ],
  seedSQL: `
    CREATE TABLE persons (
      id INTEGER PRIMARY KEY,
      name TEXT,
      age_at_incident INTEGER,
      role TEXT,
      nationality TEXT
    );
    INSERT INTO persons VALUES
      (1, 'Daniel Reyes', 13, 'victim', 'American'),
      (2, 'Armand Bousquet', 24, 'impostor', 'French'),
      (3, 'Carmen Reyes', 16, 'witness', 'American'),
      (4, 'Jason Reyes', 19, 'suspect', 'American'),
      (5, 'Gloria Reyes', 42, 'witness', 'American'),
      (6, 'Agent Tom Hirsch', 38, 'witness', 'American'),
      (7, 'Private Investigator Ray Deluca', 51, 'witness', 'American');

    CREATE TABLE identities (
      id INTEGER PRIMARY KEY,
      person_id INTEGER,
      alias TEXT,
      country_used TEXT,
      year_used INTEGER,
      documents_forged TEXT
    );
    INSERT INTO identities VALUES
      (1, 2, 'Daniel Reyes', 'USA', 1997, 'passport, school ID, social security card'),
      (2, 2, 'Pierre Moreau', 'France', 1995, 'national ID'),
      (3, 2, 'Leo Henkes', 'Belgium', 1994, 'passport'),
      (4, 2, 'Thomas Garant', 'Canada', 1996, 'drivers license, health card'),
      (5, 2, 'Marco Solis', 'Spain', 1997, 'passport'),
      (6, 2, 'Damien Avril', 'Switzerland', 1993, 'national ID'),
      (7, 1, 'Danny', 'USA', 1994, NULL);

    CREATE TABLE biometric_records (
      id INTEGER PRIMARY KEY,
      person_id INTEGER,
      record_type TEXT,
      sample_date TEXT,
      matches_person_id INTEGER,
      confidence TEXT,
      notes TEXT
    );
    INSERT INTO biometric_records VALUES
      (1, 2, 'fingerprint', '1998-02-14', 2, 'confirmed', 'FBI lab confirmed prints match Armand Bousquet French criminal record.'),
      (2, 2, 'fingerprint', '1998-02-14', 1, 'mismatch', 'Prints do not match the 1994 juvenile record filed under Daniel Reyes.'),
      (3, 2, 'ear_shape', '1997-11-03', 1, 'mismatch', 'Private investigator Deluca compared ear photos from school photos vs current. Shape inconsistent.'),
      (4, 2, 'dna', '1998-02-14', 1, 'mismatch', 'DNA does not match biological sample from Daniel Reyes family. Not a blood relative of the Reyes family.'),
      (5, 2, 'dental', '1997-10-01', 1, 'inconclusive', 'Dental records from 1992 Daniel Reyes were unavailable for comparison.'),
      (6, 1, 'fingerprint', '1994-06-01', 1, 'confirmed', 'Juvenile prints taken after minor theft charge. On file with San Marcos PD.');

    CREATE TABLE timeline_events (
      id INTEGER PRIMARY KEY,
      event_date TEXT,
      person_id INTEGER,
      event_type TEXT,
      location TEXT,
      description TEXT,
      flagged_suspicious INTEGER
    );
    INSERT INTO timeline_events VALUES
      (1,  '1994-06-13', 1, 'disappearance', 'San Marcos, TX', 'Daniel called home from basketball court. Jason refused to pick him up. Daniel never arrived home.', 0),
      (2,  '1994-06-13', 4, 'phone_call', 'Reyes residence', 'Jason took Daniels call, told him to walk home. Did not alert parents until next morning.', 1),
      (3,  '1994-09-15', 4, 'police_tip', 'San Marcos PD', 'Jason called police claiming he heard Daniel breaking into the garage. No evidence found. No sign of Daniel.', 1),
      (4,  '1997-08-04', 2, 'found', 'Seville, Spain', 'Armand Bousquet contacted US Embassy claiming to be Daniel Reyes, trafficked from Texas. Spoke with heavy French accent.', 0),
      (5,  '1997-08-11', 3, 'identification', 'Seville, Spain', 'Carmen Reyes flew to Spain to identify her brother. She was given time alone with Armand before the official ID test.', 1),
      (6,  '1997-08-11', 2, 'id_test', 'Seville, Spain', 'Armand passed family photo test with one minor error. Authorities cleared him. Carmen coaching suspected later.', 1),
      (7,  '1997-08-18', 2, 'arrival', 'San Marcos, TX', 'Armand arrived home as Daniel Reyes. Family accepted him. Authorities closed the missing persons case.', 0),
      (8,  '1997-10-01', 7, 'investigation', 'San Marcos, TX', 'Deluca hired by documentary crew. Noted ear shape mismatch, accent inconsistency, no childhood memories without prompting.', 1),
      (9,  '1998-02-14', 6, 'arrest', 'San Marcos, TX', 'FBI obtained court order. Fingerprints and DNA taken. Armand Bousquet identified. Charged with fraud and perjury.', 0),
      (10, '1998-03-01', 4, 'death', 'San Marcos, TX', 'Jason Reyes died of drug overdose before full investigation into his role. No charges were ever filed.', 1);

    CREATE TABLE family_responses (
      id INTEGER PRIMARY KEY,
      family_member_id INTEGER,
      response_date TEXT,
      response_type TEXT,
      detail TEXT
    );
    INSERT INTO family_responses VALUES
      (1, 3, '1997-08-11', 'accepted', 'Carmen identified Armand as Daniel despite obvious physical differences. She had briefed him on family members beforehand.'),
      (2, 5, '1997-08-18', 'accepted', 'Gloria welcomed Armand home. Told investigators the accent and appearance changes were explained by trauma and captivity.'),
      (3, 4, '1997-08-18', 'suspicious', 'Jason said only good luck to Armand upon meeting. Did not embrace him. Refused to be photographed with him.'),
      (4, 4, '1998-02-01', 'no_comment', 'Jason stopped speaking to investigators. Overdose occurred 28 days later.'),
      (5, 3, '1998-02-14', 'no_comment', 'Carmen refused to testify after Armand was arrested. Never explained her coaching of Armand in Spain.'),
      (6, 5, '1998-02-14', 'rejected', 'Gloria finally acknowledged inconsistencies but claimed she had been deceived and accepted Armand in good faith.');
  `,
  chapters: [
    {
      id: 'ch-1',
      narrative: `A man is living with a family in San Marcos, Texas. He calls himself Daniel Reyes.
He isn't.

Before you untangle the fraud, understand who the players are. List all persons, their role, and their nationality.`,
      objective: 'List all persons showing name, role, and nationality. Order by role.',
      expectedColumns: ['name', 'role', 'nationality'],
      expectedRowCount: 7,
      hints: [
        'SELECT from the persons table.',
        'SELECT name, role, nationality FROM persons ORDER BY role',
        "That's the full query — add ORDER BY role at the end.",
      ],
      successMessage: 'Seven people. One victim. One impostor. One very suspicious brother.',
      partnerOnSuccess: "Now you know who's who. Let's look at what the evidence says.",
    },
    {
      id: 'ch-2',
      narrative: `Armand Bousquet had been running identities for years across six countries.
Each one was a different name, different documents, different life.

Count how many identities he used per country. Show the country and the count — order by count descending.
His person_id is 2.`,
      objective: 'Count identities per country for person_id = 2. Show country_used and count, ordered by count descending.',
      expectedColumns: ['country_used', 'identity_count'],
      expectedRowCount: 6,
      hints: [
        'Use GROUP BY on country_used after filtering WHERE person_id = 2.',
        'Use COUNT(*) AS identity_count to count per group.',
        'SELECT country_used, COUNT(*) AS identity_count FROM identities WHERE person_id = 2 GROUP BY country_used ORDER BY identity_count DESC',
      ],
      successMessage: "Six countries. One identity per country — except he reused Spain. That's where he was caught.",
      partnerOnSuccess: 'Six countries of lies. And the family said nothing for six months. Keep going.',
    },
    {
      id: 'ch-3',
      narrative: `The biometric evidence is where the truth lives.
Show all biometric records where the result is a mismatch or confirmed — meaning definitive results only.
Join the persons table twice: once for the subject, once for who the record matches (or doesn't match).`,
      objective: "Show record_type, sample_date, confidence, and notes for all biometric records where confidence IN ('confirmed','mismatch'). Also show the subject person's name.",
      expectedColumns: ['subject_name', 'record_type', 'sample_date', 'confidence', 'notes'],
      expectedRowCount: 4,
      hints: [
        "JOIN biometric_records with persons on person_id = id to get the subject name.",
        "Filter WHERE confidence IN ('confirmed', 'mismatch')",
        "SELECT p.name AS subject_name, br.record_type, br.sample_date, br.confidence, br.notes FROM biometric_records br JOIN persons p ON p.id = br.person_id WHERE br.confidence IN ('confirmed','mismatch')",
      ],
      successMessage: "Four definitive results. Three mismatches against Daniel Reyes. One confirmed match to Armand Bousquet's French criminal file. He was never Daniel.",
      partnerOnSuccess: "The science is clear. Now let's see what the family knew — and when.",
    },
    {
      id: 'ch-4',
      narrative: `The suspicious events tell a story within the story.
Pull every timeline event that was flagged as suspicious. Show the date, person's name, event type, and description.
Order chronologically.`,
      objective: "Show event_date, person name, event_type, and description for all flagged_suspicious = 1 events. JOIN persons. ORDER BY event_date.",
      expectedColumns: ['event_date', 'name', 'event_type', 'description'],
      expectedRowCount: 6,
      hints: [
        'JOIN timeline_events with persons on person_id = id.',
        'Filter WHERE flagged_suspicious = 1',
        'SELECT te.event_date, p.name, te.event_type, te.description FROM timeline_events te JOIN persons p ON p.id = te.person_id WHERE te.flagged_suspicious = 1 ORDER BY te.event_date',
      ],
      successMessage: "Six suspicious events. Jason's fake tip. Carmen coaching Armand in Spain. The ID test manipulation. Jason's death. The pattern is clear.",
      partnerOnSuccess: "That timeline is damning. Now we look at how each family member responded.",
    },
    {
      id: 'ch-5',
      narrative: `The family's behavior after Armand arrived is the final piece.
Show each family member's name alongside their most recent response — the one with the latest response_date.
Only include family members who have at least one response on record.`,
      objective: "Show family member name and their latest response_type. Use a subquery or GROUP BY to find the max response_date per person. JOIN persons.",
      expectedColumns: ['name', 'response_type'],
      expectedRowCount: 3,
      hints: [
        'GROUP BY family_member_id and use MAX(response_date) to find the latest.',
        'Then JOIN that result with family_responses and persons to get the response_type and name.',
        `SELECT p.name, fr.response_type FROM family_responses fr
JOIN persons p ON p.id = fr.family_member_id
JOIN (SELECT family_member_id, MAX(response_date) AS latest FROM family_responses GROUP BY family_member_id) latest_fr
ON fr.family_member_id = latest_fr.family_member_id AND fr.response_date = latest_fr.latest`,
      ],
      successMessage: "Carmen: no comment. Jason: no comment — then dead. Gloria: rejected, too late. One helped, one knew, one looked away.",
      partnerOnSuccess: "Write it up. The real Daniel was never found. This case closes with a question mark.",
    },
  ],
  solution: {
    suspectName: 'Jason Reyes (and Carmen Reyes)',
    suspectRole: 'Victim\'s Brother / Victim\'s Sister',
    closingNarrative: `Armand Bousquet was convicted of fraud and perjury and served time in a US prison before being deported to France, where he continued assuming identities.

The real Daniel Reyes was never found. No remains. No witnesses. No charges.

The prevailing theory among investigators: Jason Reyes killed Daniel — possibly accidentally — on the night of June 13th, 1994. His fake garage tip three months later is consistent with behavior seen in cases where the perpetrator attempts to keep the victim "alive" in official records.

When Armand appeared, Carmen may have recognized he wasn't Daniel — but accepting him meant the case stayed closed and Jason stayed free.

Jason died before he could be questioned. Carmen never explained her actions in Spain.

The real Daniel Reyes is still listed as a missing person.`,
  },
  evidenceItems: [
    {
      id: 'ev-1',
      unlockedAfterChapter: 'ch-1',
      type: 'photo',
      label: 'Daniel Reyes — Missing Since 1994',
      content: 'Age 13. Brown hair, blue eyes. Last seen near the basketball courts on Maple Ave, June 13, 1994.',
    },
    {
      id: 'ev-2',
      unlockedAfterChapter: 'ch-2',
      type: 'record',
      label: 'Armand Bousquet — Identity Log',
      content: '6 countries. 6 identities. France, Belgium, Canada, Switzerland, Spain, USA. All documented. All fraudulent.',
    },
    {
      id: 'ev-3',
      unlockedAfterChapter: 'ch-3',
      type: 'document',
      label: 'FBI Biometric Report — Feb 14, 1998',
      content: 'Fingerprints: mismatch with Daniel Reyes. Match confirmed with Armand Bousquet (French criminal record). DNA: not a Reyes family relative.',
    },
    {
      id: 'ev-4',
      unlockedAfterChapter: 'ch-4',
      type: 'note',
      label: 'Suspicious Events — Summary',
      content: "Jason's garage tip (Sept 1994). Carmen alone with Armand in Spain. ID test coaching. Jason's refusal to engage. Jason dead before questioning.",
    },
    {
      id: 'ev-5',
      unlockedAfterChapter: 'ch-5',
      type: 'note',
      label: 'Family Final Positions',
      content: 'Carmen: no comment. Jason: no comment (deceased). Gloria: claimed to have been deceived. Nobody was charged.',
    },
  ],
};

export default case003;
