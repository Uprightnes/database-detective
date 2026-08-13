import { CaseData } from '../../types';

const case002: CaseData = {
  id: 'case-002',
  title: 'Letters from the Crow',
  subtitle: 'A child drowned. The letters promised it. Nobody believed them until it was too late.',
  difficulty: 'Rookie',
  estimatedTime: '20–25 min',
  setting: 'Valmont, Eastern France, 1984',
  briefing: `For four years, the Aubert family received anonymous letters and phone calls. 
  The sender called themselves "Le Corbeau" — The Crow. The letters promised revenge 
  against Henri Aubert, a factory foreman who had recently been promoted.
  
  Nobody took the letters seriously. Until October 16th, 1984, when four-year-old 
  Thomas Aubert disappeared from his front garden. That evening, the Crow called Henri's 
  brother: "I've strangled him and thrown him in the river. I have my revenge."
  
  Thomas was found the next morning, hands and feet bound, drowned in the Valmont River.
  
  The letters are still in evidence. The Crow was never officially named.
  Your job is to follow the data and find them.`,
  schema: [
    {
      name: 'family_members',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'name', type: 'TEXT' },
        { name: 'relation_to_victim', type: 'TEXT' },
        { name: 'age', type: 'INTEGER' },
        { name: 'occupation', type: 'TEXT' },
        { name: 'address', type: 'TEXT' },
        { name: 'status', type: 'TEXT', note: 'suspect | cleared | victim | witness' },
      ],
    },
    {
      name: 'threatening_letters',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'sent_date', type: 'TEXT' },
        { name: 'target_id', type: 'INTEGER', note: 'FK → family_members' },
        { name: 'handwriting_match_id', type: 'INTEGER', note: 'FK → family_members, NULL if unmatched' },
        { name: 'content_excerpt', type: 'TEXT' },
        { name: 'postmark', type: 'TEXT' },
      ],
    },
    {
      name: 'phone_records',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'caller_id', type: 'INTEGER', note: 'FK → family_members, NULL if unknown' },
        { name: 'recipient_id', type: 'INTEGER', note: 'FK → family_members' },
        { name: 'call_date', type: 'TEXT' },
        { name: 'duration_seconds', type: 'INTEGER' },
        { name: 'notes', type: 'TEXT' },
      ],
    },
    {
      name: 'forensic_analysis',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'evidence_type', type: 'TEXT', note: 'handwriting | dna | fingerprint | fiber' },
        { name: 'sample_source', type: 'TEXT' },
        { name: 'matched_to_id', type: 'INTEGER', note: 'FK → family_members, NULL if no match' },
        { name: 'confidence', type: 'TEXT', note: 'high | medium | low | inconclusive' },
        { name: 'analyst_notes', type: 'TEXT' },
      ],
    },
    {
      name: 'alibis',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'person_id', type: 'INTEGER', note: 'FK → family_members' },
        { name: 'alibi_for_date', type: 'TEXT' },
        { name: 'alibi_description', type: 'TEXT' },
        { name: 'verified', type: 'INTEGER', note: '1 = verified, 0 = unverified' },
      ],
    },
  ],
  seedSQL: `
    CREATE TABLE family_members (
      id INTEGER PRIMARY KEY,
      name TEXT,
      relation_to_victim TEXT,
      age INTEGER,
      occupation TEXT,
      address TEXT,
      status TEXT
    );
    INSERT INTO family_members VALUES
      (1, 'Henri Aubert', 'father', 38, 'factory foreman', '12 Rue des Lilas, Valmont', 'witness'),
      (2, 'Sylvie Aubert', 'mother', 35, 'homemaker', '12 Rue des Lilas, Valmont', 'suspect'),
      (3, 'Thomas Aubert', 'victim', 4, NULL, '12 Rue des Lilas, Valmont', 'victim'),
      (4, 'Bernard Laroche', 'cousin of Henri', 29, 'electrician', '4 Chemin du Bois, Valmont', 'suspect'),
      (5, 'Jacqueline Laroche', 'cousin wife', 27, 'seamstress', '4 Chemin du Bois, Valmont', 'witness'),
      (6, 'Marcel Aubert', 'Henri brother', 34, 'farmer', '88 Route de la Ferme, Valmont', 'witness'),
      (7, 'Odette Franc', 'Henri aunt', 61, 'retired', '3 Impasse Colette, Valmont', 'suspect'),
      (8, 'Georges Franc', 'Henri uncle', 64, 'retired', '3 Impasse Colette, Valmont', 'suspect'),
      (9, 'Nathalie Laroche', 'Bernards sister-in-law', 15, 'student', '4 Chemin du Bois, Valmont', 'witness');

    CREATE TABLE threatening_letters (
      id INTEGER PRIMARY KEY,
      sent_date TEXT,
      target_id INTEGER,
      handwriting_match_id INTEGER,
      content_excerpt TEXT,
      postmark TEXT
    );
    INSERT INTO threatening_letters VALUES
      (1, '1980-11-03', 1, NULL, 'You think your promotion means something. It means nothing. I will have my revenge.', 'Valmont'),
      (2, '1981-04-17', 1, NULL, 'Enjoy your family while you can, boss. The Crow is watching.', 'Valmont'),
      (3, '1982-01-22', 6, NULL, 'Tell your brother the Crow does not forget. Tell him to be afraid.', 'Brionne'),
      (4, '1982-09-10', 1, NULL, 'Your money and your title will not protect you from what is coming.', 'Valmont'),
      (5, '1983-03-04', 1, NULL, 'I am patient. You will lose everything. This I promise you.', 'Valmont'),
      (6, '1984-05-14', 1, 2, 'You will suffer. Your family will suffer. That is my revenge.', 'Valmont'),
      (7, '1984-10-16', 1, 2, 'I hope you die of grief, boss. Your money will not bring back your son. Here is my revenge.', 'Valmont');

    CREATE TABLE phone_records (
      id INTEGER PRIMARY KEY,
      caller_id INTEGER,
      recipient_id INTEGER,
      call_date TEXT,
      duration_seconds INTEGER,
      notes TEXT
    );
    INSERT INTO phone_records VALUES
      (1, NULL, 6, '1984-10-16', 47, 'Anonymous. Caller stated Thomas had been strangled and thrown in the river.'),
      (2, 4, 1, '1984-09-28', 183, 'Bernard called Henri. Content unknown.'),
      (3, 2, 4, '1984-10-02', 312, 'Sylvie called Bernard. Unusual given reported tensions between families.'),
      (4, 9, 5, '1984-10-18', 89, 'Nathalie Laroche called Jacqueline. Possibly regarding her statement to police.'),
      (5, NULL, 1, '1984-10-17', 22, 'Anonymous. No content recorded. Call ended abruptly.');

    CREATE TABLE forensic_analysis (
      id INTEGER PRIMARY KEY,
      evidence_type TEXT,
      sample_source TEXT,
      matched_to_id INTEGER,
      confidence TEXT,
      analyst_notes TEXT
    );
    INSERT INTO forensic_analysis VALUES
      (1, 'handwriting', 'Letters 6 and 7 (1984)', 2, 'medium', 'Letter formation and pen pressure consistent with Sylvie Aubert. Not definitive.'),
      (2, 'handwriting', 'Letters 1 through 5 (1980-1983)', NULL, 'inconclusive', 'Insufficient sample quality. Could not be matched to any known subject.'),
      (3, 'fiber', 'Rope used to bind Thomas', 4, 'low', 'Synthetic fiber present in Bernards workshop. Common type, not exclusive.'),
      (4, 'dna', 'Stamp saliva on letter 7', NULL, 'inconclusive', 'Degraded sample. Could not produce a complete profile.'),
      (5, 'handwriting', 'Letter 3 (1982, sent from Brionne)', 8, 'low', 'Some similarity to Georges Franc handwriting. Analyst not confident.'),
      (6, 'fingerprint', 'Envelope of letter 7', NULL, 'inconclusive', 'Partial print found. No match in database. Surface too degraded.');

    CREATE TABLE alibis (
      id INTEGER PRIMARY KEY,
      person_id INTEGER,
      alibi_for_date TEXT,
      alibi_description TEXT,
      verified INTEGER
    );
    INSERT INTO alibis VALUES
      (1, 1, '1984-10-16', 'Henri was at the factory. Multiple coworkers confirm.', 1),
      (2, 4, '1984-10-16', 'Bernard claims he was at a hardware store in Brionne. No receipt found.', 0),
      (3, 2, '1984-10-16', 'Sylvie claims she was inside preparing lunch. No witness.', 0),
      (4, 7, '1984-10-16', 'Odette refused to provide an alibi to police.', 0),
      (5, 8, '1984-10-16', 'Georges refused to provide an alibi to police.', 0),
      (6, 4, '1984-10-16', 'Nathalie Laroche initially said Bernard was home. Later retracted, said she was coerced.', 0);
  `,
  chapters: [
    {
      id: 'ch-1',
      narrative: `You open the case file. A child is dead. A family destroyed. And somewhere in this 
      village, someone wrote letters for four years promising exactly this.
      Start with the family. Who are all the players — and what is their status in this case?`,
      objective: 'List all family members. Show name, relation_to_victim, occupation, and status.',
      expectedColumns: ['name', 'relation_to_victim', 'occupation', 'status'],
      expectedRowCount: 9,
      hints: [
        'Use the family_members table.',
        'SELECT name, relation_to_victim, occupation, status FROM family_members',
        "That's the full query — SELECT name, relation_to_victim, occupation, status FROM family_members",
      ],
      successMessage: 'Nine people. One victim. Three suspects. The rest claim to be witnesses.',
      partnerOnSuccess: "Get the suspects in your head. Now we look at the letters.",
    },
    {
      id: 'ch-2',
      narrative: `Seven letters. Sent over four years. The Crow was patient and specific.
      But in 1984, something changed. The last two letters were matched — partially — to 
      someone in this family. 
      
      Pull all letters where a handwriting match was found. Show who they were matched to.`,
      objective: "Show the sent_date, content_excerpt, and the name of the person the handwriting was matched to. Only include letters where handwriting_match_id is not NULL. JOIN family_members to get the name.",
      expectedColumns: ['sent_date', 'content_excerpt', 'matched_person'],
      expectedRowCount: 2,
      hints: [
        'JOIN threatening_letters with family_members on handwriting_match_id = id.',
        'Filter with WHERE handwriting_match_id IS NOT NULL',
        "SELECT tl.sent_date, tl.content_excerpt, fm.name as matched_person FROM threatening_letters tl JOIN family_members fm ON fm.id = tl.handwriting_match_id WHERE tl.handwriting_match_id IS NOT NULL",
      ],
      successMessage: "Two letters. Both 1984. Both matched to the same person. The Crow got sloppy at the end.",
      partnerOnSuccess: "Write that name on the board. But we're not done yet.",
    },
    {
      id: 'ch-3',
      narrative: `Forensics found evidence — but most of it was inconclusive. 
      Let's sort the useful from the noise. 
      Show only the forensic results that actually produced a match.`,
      objective: "List all forensic_analysis records where matched_to_id is not NULL. Show evidence_type, sample_source, confidence, and analyst_notes.",
      expectedColumns: ['evidence_type', 'sample_source', 'confidence', 'analyst_notes'],
      expectedRowCount: 3,
      hints: [
        'Filter the forensic_analysis table.',
        'Use WHERE matched_to_id IS NOT NULL',
        'SELECT evidence_type, sample_source, confidence, analyst_notes FROM forensic_analysis WHERE matched_to_id IS NOT NULL',
      ],
      successMessage: "Three matches. Two handwriting, one fiber. Medium, low, low. Enough to point a direction. Not enough to convict alone.",
      partnerOnSuccess: "Soft evidence. We need to look at who couldn't explain where they were.",
    },
    {
      id: 'ch-4',
      narrative: `On the day Thomas disappeared, most suspects were asked for an alibi.
      Some gave one. Some refused. Some gave one and then it fell apart.
      
      Show all alibis that were NOT verified, along with the person's name.`,
      objective: "Show the name of each person with an unverified alibi, their alibi_for_date, and alibi_description. JOIN family_members. Filter where verified = 0.",
      expectedColumns: ['name', 'alibi_for_date', 'alibi_description'],
      expectedRowCount: 4,
      hints: [
        'JOIN alibis with family_members on person_id = id.',
        'Filter WHERE verified = 0',
        'SELECT fm.name, a.alibi_for_date, a.alibi_description FROM alibis a JOIN family_members fm ON fm.id = a.person_id WHERE a.verified = 0',
      ],
      successMessage: "Four people with no verified alibi on the day Thomas died. One of them is the Crow.",
      partnerOnSuccess: "We're close. Cross-reference those four with the handwriting match.",
    },
    {
      id: 'ch-5',
      narrative: `You have the handwriting match. You have the unverified alibis. 
      Time to pull it together.
      
      Find family members who are listed as suspects AND have an unverified alibi. 
      Show name, status, and alibi_description.`,
      objective: "Show name, status, and alibi_description for all persons who are status = 'suspect' AND have an alibi with verified = 0.",
      expectedColumns: ['name', 'status', 'alibi_description'],
      expectedRowCount: 3,
      hints: [
        'JOIN family_members with alibis on id = person_id.',
        "Filter WHERE fm.status = 'suspect' AND a.verified = 0",
        "SELECT fm.name, fm.status, a.alibi_description FROM family_members fm JOIN alibis a ON a.person_id = fm.id WHERE fm.status = 'suspect' AND a.verified = 0",
      ],
      successMessage: "Three suspects. No verified alibis. One of them matched the handwriting on the final two letters. The Crow has a name.",
      partnerOnSuccess: "Write it on the board. Case closed — for now.",
    },
  ],
  solution: {
    suspectName: 'Sylvie Aubert',
    suspectRole: 'Mother / Wife of Henri Aubert',
    closingNarrative: `The handwriting on the final two letters — including the one delivered the day Thomas died — 
    was matched with medium confidence to Sylvie Aubert, Thomas's own mother. 
    
    Her alibi: she was inside preparing lunch. No witness. Not verified.
    
    Motive remains debated. Some investigators believe Sylvie harbored deep resentment 
    toward Henri's ambitions and the life they were forced to live. Others believe she was 
    not the Crow — only that she knew who was.
    
    The case was never officially solved. Sylvie was charged, then released after a hunger strike. 
    She was not officially cleared until years later. The real Crow, if it wasn't her, was never named.`,
  },
  evidenceItems: [
    {
      id: 'ev-1',
      unlockedAfterChapter: 'ch-1',
      type: 'photo',
      label: 'Thomas Aubert — Victim, age 4',
      content: 'Found in the Valmont River. Hands and feet bound. Wool hat pulled over his face.',
    },
    {
      id: 'ev-2',
      unlockedAfterChapter: 'ch-2',
      type: 'document',
      label: 'Letter #7 — The Final Crow Letter',
      content: '"I hope you die of grief, boss. Your money will not bring back your son. Here is my revenge." — The Crow',
    },
    {
      id: 'ev-3',
      unlockedAfterChapter: 'ch-3',
      type: 'record',
      label: 'Forensic Report — Handwriting',
      content: 'Letters 6 & 7 matched with medium confidence to Sylvie Aubert. Analyst: not definitive.',
    },
    {
      id: 'ev-4',
      unlockedAfterChapter: 'ch-4',
      type: 'note',
      label: 'Alibi Log — Oct 16, 1984',
      content: 'Sylvie Aubert: "Inside preparing lunch." No witness. Bernard Laroche: "Hardware store in Brionne." No receipt.',
    },
    {
      id: 'ev-5',
      unlockedAfterChapter: 'ch-5',
      type: 'note',
      label: 'Case Summary',
      content: 'Three suspects. No verified alibis. Handwriting matched to one. The Crow wrote the letter that promised Thomas would die — and Thomas died.',
    },
  ],
};

export default case002;
