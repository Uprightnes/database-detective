export const partnerMessages = {
  tooManyRows: (count: number) =>
    `${count} results? I could've arrested the whole city. Filter it down, Detective.`,

  tooFewRows: (count: number, expected: number) =>
    `You got ${count} row${count !== 1 ? 's' : ''}. We need ${expected}. Something's missing.`,

  wrongColumns: () =>
    `The rows look about right, but the columns are off. Check what you're selecting.`,

  syntaxError: (msg: string) => {
    const cleaned = msg.replace(/\(.*?\)/g, '').trim();
    return `Your query broke something. The engine says: "${cleaned}". Fix your syntax.`;
  },

  emptyResult: () =>
    `Nothing came back. Either your filter is too strict, or this city is full of saints. Try again.`,

  correct: (successMsg: string) => successMsg,

  idle: () => `Run a query and let's see what the data says.`,

  hintUsed: (hintNum: number) =>
    hintNum === 1
      ? `Fine. Here's a nudge. Don't make a habit of this.`
      : hintNum === 2
      ? `Another one. I'm starting to wonder who the real detective is here.`
      : `Last hint. After this you're on your own.`,

  hardModeWrong: () =>
    `Wrong. In Hard Mode, the board doesn't forgive. Run it back.`,

  caseComplete: () =>
    `That's it. You got them. Write it up and get some sleep.`,

  dbNotReady: () => `Hold on, the database is still loading. Give it a second.`,
};
