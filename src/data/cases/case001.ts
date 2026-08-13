import { CaseData } from '../../types';

const case001: CaseData = {
  id: 'case-001',
  title: 'The Painter and the Dancer',
  subtitle: 'A woman is dead. Her husband filed for the insurance before the flowers wilted.',
  difficulty: 'Rookie',
  estimatedTime: '15–20 min',
  setting: 'Harlow City, 1991',
  briefing: `A woman named Elaine Voss was found unconscious on Route 9 at 2 AM on a Tuesday. 
  Hit and run, according to the first officer on scene. She never woke up. 
  Five days later she was gone.
  
  Her husband, Raymond Voss — a house painter with a bad back and a worse temper — filed 
  a life insurance claim the following Monday. $80,000. Policy taken out four months prior.
  
  The club where Elaine worked says she had a friend. A co-worker named Donna Reyes. 
  Donna went missing three weeks before Elaine died, after a very public fight with Raymond.
  
  Your job: find out who was involved, who had motive, and whether Raymond Voss 
  is as innocent as he claims.`,
  schema: [
    {
      name: 'persons',
      columns: [
        { name: 'id', type: 'INTEGER', note: 'Primary key' },
        { name: 'name', type: 'TEXT' },
        { name: 'role', type: 'TEXT', note: 'e.g. suspect, victim, witness' },
        { name: 'occupation', type: 'TEXT' },
        { name: 'known_alias', type: 'TEXT' },
        { name: 'address', type: 'TEXT' },
      ],
    },
    {
      name: 'relationships',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'person_a_id', type: 'INTEGER', note: 'FK → persons' },
        { name: 'person_b_id', type: 'INTEGER', note: 'FK → persons' },
        { name: 'relationship_type', type: 'TEXT', note: 'e.g. married, coworker, conflict' },
      ],
    },
    {
      name: 'insurance_policies',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'policyholder_id', type: 'INTEGER', note: 'FK → persons' },
        { name: 'beneficiary_id', type: 'INTEGER', note: 'FK → persons' },
        { name: 'amount', type: 'INTEGER', note: 'USD' },
        { name: 'issued_date', type: 'TEXT', note: 'YYYY-MM-DD' },
        { name: 'claimed_date', type: 'TEXT', note: 'YYYY-MM-DD, NULL if unclaimed' },
      ],
    },
    {
      name: 'incidents',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'person_id', type: 'INTEGER', note: 'FK → persons — who was involved' },
        { name: 'incident_type', type: 'TEXT', note: 'assault, missing, death, accident' },
        { name: 'incident_date', type: 'TEXT', note: 'YYYY-MM-DD' },
        { name: 'location', type: 'TEXT' },
        { name: 'notes', type: 'TEXT' },
      ],
    },
    {
      name: 'criminal_records',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'person_id', type: 'INTEGER', note: 'FK → persons' },
        { name: 'offense', type: 'TEXT' },
        { name: 'conviction_year', type: 'INTEGER' },
        { name: 'sentence', type: 'TEXT' },
      ],
    },
    {
      name: 'witness_statements',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'witness_id', type: 'INTEGER', note: 'FK → persons' },
        { name: 'about_person_id', type: 'INTEGER', note: 'FK → persons — who is described' },
        { name: 'statement', type: 'TEXT' },
        { name: 'statement_date', type: 'TEXT' },
      ],
    },
  ],
  seedSQL: `
    CREATE TABLE persons (
      id INTEGER PRIMARY KEY,
      name TEXT,
      role TEXT,
      occupation TEXT,
      known_alias TEXT,
      address TEXT
    );
    INSERT INTO persons VALUES
      (1, 'Raymond Voss', 'suspect', 'house painter', 'Ray', '14 Cinder Lane, Harlow City'),
      (2, 'Elaine Voss', 'victim', 'exotic dancer', NULL, '14 Cinder Lane, Harlow City'),
      (3, 'Donna Reyes', 'missing', 'exotic dancer', NULL, '89 Maple Court, Harlow City'),
      (4, 'Gloria Marsh', 'witness', 'club manager', NULL, 'The Velvet Room, Downtown'),
      (5, 'Officer Dale Pruitt', 'witness', 'police officer', NULL, 'Harlow City PD'),
      (6, 'Marcus Webb', 'witness', 'Elaine coworker friend', NULL, '33 Pine St, Harlow City'),
      (7, 'Linda Voss', 'next of kin', 'unemployed', NULL, '77 Reedbank Rd, Harlow City');

    CREATE TABLE relationships (
      id INTEGER PRIMARY KEY,
      person_a_id INTEGER,
      person_b_id INTEGER,
      relationship_type TEXT
    );
    INSERT INTO relationships VALUES
      (1, 1, 2, 'married'),
      (2, 2, 3, 'coworker'),
      (3, 2, 3, 'close friends'),
      (4, 1, 3, 'conflict'),
      (5, 3, 1, 'conflict'),
      (6, 1, 7, 'siblings');

    CREATE TABLE insurance_policies (
      id INTEGER PRIMARY KEY,
      policyholder_id INTEGER,
      beneficiary_id INTEGER,
      amount INTEGER,
      issued_date TEXT,
      claimed_date TEXT
    );
    INSERT INTO insurance_policies VALUES
      (1, 2, 1, 80000, '1991-06-14', '1991-10-28'),
      (2, 1, 7, 25000, '1988-03-01', NULL);

    CREATE TABLE incidents (
      id INTEGER PRIMARY KEY,
      person_id INTEGER,
      incident_type TEXT,
      incident_date TEXT,
      location TEXT,
      notes TEXT
    );
    INSERT INTO incidents VALUES
      (1, 3, 'assault', '1991-09-04', 'Velvet Room parking lot', 'Raymond Voss struck Donna Reyes in the face. Witnessed by 3 club staff.'),
      (2, 3, 'missing', '1991-09-08', 'Harlow City', 'Donna left her apartment to visit a friend. Never arrived. Car found at bus depot.'),
      (3, 2, 'accident', '1991-10-01', 'Route 9 Northbound', 'Elaine found unconscious. Suspected hit and run. Raymond claims he was home asleep.'),
      (4, 2, 'death', '1991-10-06', 'Harlow General Hospital', 'Died of head trauma. Attending physician noted old bruising and classified as homicide.'),
      (5, 1, 'fled', '1991-10-29', 'Unknown', 'Raymond Voss left Harlow City two days after filing insurance claim. New address unknown.');

    CREATE TABLE criminal_records (
      id INTEGER PRIMARY KEY,
      person_id INTEGER,
      offense TEXT,
      conviction_year INTEGER,
      sentence TEXT
    );
    INSERT INTO criminal_records VALUES
      (1, 1, 'assault and battery', 1983, '18 months probation'),
      (2, 1, 'fraud — false identity', 1987, 'dismissed, insufficient evidence'),
      (3, 1, 'domestic disturbance', 1989, 'charges dropped');

    CREATE TABLE witness_statements (
      id INTEGER PRIMARY KEY,
      witness_id INTEGER,
      about_person_id INTEGER,
      statement TEXT,
      statement_date TEXT
    );
    INSERT INTO witness_statements VALUES
      (1, 4, 1, 'Raymond came to the club looking for Donna. He was not calm. He said if Elaine ever left him he would kill her.', '1991-09-05'),
      (2, 4, 2, 'Elaine was getting better. She was sitting up, talking a little. Then Raymond banned us from visiting. Three days later she was gone.', '1991-10-09'),
      (3, 6, 1, 'Raymond told us he was asleep when Elaine had her accident. But I saw his truck on Route 9 that same night around 1:30 AM.', '1991-10-08'),
      (4, 5, 2, 'The head wound was inconsistent with a typical vehicle strike. The angle suggested a blunt instrument, not a bumper.', '1991-10-07'),
      (5, 7, 1, 'Raymond asked me if he could borrow $500 in August. Said things were tight. Then two months later he has an $80,000 insurance claim. I am his sister and I do not believe him.', '1991-10-30');
  `,
  chapters: [
    {
      id: 'ch-1',
      narrative: `You're staring at a cold cup of coffee and a case file that smells like trouble.
      Elaine Voss. Exotic dancer. Dead at 31. Husband filed for insurance before anyone 
      sent flowers. Before you point fingers, you need to understand who's who.`,
      objective: 'List all persons in the database. Show their name, role, and occupation.',
      expectedColumns: ['name', 'role', 'occupation'],
      expectedRowCount: 7,
      hints: [
        'Start with the persons table. Try: SELECT * FROM persons',
        'You only need three columns. Use SELECT name, role, occupation FROM persons',
        'That\'s it — just SELECT name, role, occupation FROM persons',
      ],
      successMessage: 'Seven people. One dead. One missing. One very suspicious husband.',
      partnerOnSuccess: "Good. Now you know the players. Don't get attached to any of them.",
    },
    {
      id: 'ch-2',
      narrative: `Raymond Voss. House painter. Bad back. Claimed he was asleep the night 
      his wife ended up on Route 9. But a witness saw his truck out there at 1:30 AM.
      
      Before we go after him, let's see what the record says. A man's past has a way 
      of showing up in his present.`,
      objective: "Find all criminal records for Raymond Voss. Show the offense, conviction year, and sentence. Raymond's person ID is 1.",
      expectedColumns: ['offense', 'conviction_year', 'sentence'],
      expectedRowCount: 3,
      hints: [
        'Look in the criminal_records table. It has a person_id column.',
        'Use WHERE person_id = 1 to filter for Raymond.',
        'SELECT offense, conviction_year, sentence FROM criminal_records WHERE person_id = 1',
      ],
      successMessage: "Three entries. Assault. Fraud. Domestic disturbance. This isn't his first time dancing near the line.",
      partnerOnSuccess: "Three priors. Fraud, assault, domestic. And he's walking free. Keep going.",
    },
    {
      id: 'ch-3',
      narrative: `Here's what we know: Donna Reyes went missing September 8th. 
      Three weeks before Elaine died. And before she disappeared, Raymond 
      punched her in the face in a parking lot.
      
      The insurance policy on Elaine was taken out in June. Four months before she died.
      We need to see the timeline clearly — every incident, ordered by date.`,
      objective: 'List all incidents ordered by incident_date ascending. Show incident_type, incident_date, location, and notes.',
      expectedColumns: ['incident_type', 'incident_date', 'location', 'notes'],
      expectedRowCount: 5,
      hints: [
        'Use the incidents table.',
        'ORDER BY incident_date ASC will sort chronologically.',
        'SELECT incident_type, incident_date, location, notes FROM incidents ORDER BY incident_date ASC',
      ],
      successMessage: 'The timeline tells a story. Assault. Disappearance. Accident. Death. Fled. Every step leads back to one man.',
      partnerOnSuccess: "Read that timeline again. Slowly. Then tell me Raymond Voss is innocent.",
    },
    {
      id: 'ch-4',
      narrative: `The insurance policy. Raymond filed the claim on October 28th — 
      22 days after Elaine died. The policy was worth $80,000 and was issued in June, 
      just four months before her death.
      
      We need to confirm who took out the policy, who benefits, and when it was claimed. 
      Cross-reference it with the persons table so we have names, not just IDs.`,
      objective: "Show the policyholder name, beneficiary name, amount, issued_date, and claimed_date for all claimed policies. JOIN persons twice to get names.",
      expectedColumns: ['policyholder', 'beneficiary', 'amount', 'issued_date', 'claimed_date'],
      expectedRowCount: 1,
      hints: [
        'You need to JOIN the persons table twice — once for policyholder, once for beneficiary.',
        'Use aliases: JOIN persons p1 ON p1.id = policyholder_id, JOIN persons p2 ON p2.id = beneficiary_id',
        'Filter with WHERE claimed_date IS NOT NULL to show only claimed policies.',
      ],
      successMessage: "Elaine insured. Raymond benefits. Policy issued four months before she died. Claimed three weeks after. That's not grief. That's a plan.",
      partnerOnSuccess: "There it is. Write it on the board.",
    },
    {
      id: 'ch-5',
      narrative: `Last piece. The witnesses. Three people gave statements about Raymond.
      We need to see what they said — and who each statement is about.
      Pull the witness names and the statements they gave about Raymond Voss.`,
      objective: "Show each witness's name and their statement, but only statements made about Raymond Voss (person_id = 1). JOIN persons to get witness names.",
      expectedColumns: ['witness_name', 'statement'],
      expectedRowCount: 3,
      hints: [
        'Join witness_statements with persons on witness_id to get the witness name.',
        'Filter with WHERE about_person_id = 1',
        'SELECT p.name as witness_name, ws.statement FROM witness_statements ws JOIN persons p ON p.id = ws.witness_id WHERE ws.about_person_id = 1',
      ],
      successMessage: 'Three witnesses. Three different angles. Same conclusion. Raymond Voss is your man.',
      partnerOnSuccess: "Case closed. Get the DA on the phone.",
    },
  ],
  solution: {
    suspectName: 'Raymond Voss',
    suspectRole: 'Husband / House Painter',
    closingNarrative: `Raymond Voss had motive (the $80,000 policy), opportunity (his truck was spotted on Route 9 that night), 
    and a history of violence. He assaulted Donna Reyes three weeks before Elaine died. He banned Elaine's friends 
    from visiting her in hospital — and she died shortly after. He fled Harlow City two days after filing the claim.
    
    Donna Reyes was never found. Three witnesses put Raymond at the scene or confirm his lies. 
    The attending physician ruled Elaine's death a homicide.
    
    Raymond Voss walked free. But not in your precinct.`,
  },
  evidenceItems: [
    {
      id: 'ev-1',
      unlockedAfterChapter: 'ch-1',
      type: 'photo',
      label: "Elaine Voss — Victim",
      content: 'Club ID photo. Elaine Voss, age 31. Harlow City, 1991.',
    },
    {
      id: 'ev-2',
      unlockedAfterChapter: 'ch-2',
      type: 'record',
      label: 'Raymond Voss — Priors',
      content: '1983: Assault & Battery. 1987: Fraud. 1989: Domestic Disturbance.',
    },
    {
      id: 'ev-3',
      unlockedAfterChapter: 'ch-3',
      type: 'note',
      label: 'Incident Timeline',
      content: 'Sept 4: Assault on Donna. Sept 8: Donna missing. Oct 1: Elaine on Route 9. Oct 6: Elaine dead. Oct 28: Insurance filed. Oct 29: Raymond gone.',
    },
    {
      id: 'ev-4',
      unlockedAfterChapter: 'ch-4',
      type: 'document',
      label: 'Insurance Policy — $80,000',
      content: 'Policy on Elaine Voss. Beneficiary: Raymond Voss. Issued June 14, 1991. Claimed October 28, 1991.',
    },
    {
      id: 'ev-5',
      unlockedAfterChapter: 'ch-5',
      type: 'note',
      label: 'Witness: Gloria Marsh',
      content: '"Raymond said if Elaine ever left him he would kill her."',
    },
  ],
};

export default case001;
