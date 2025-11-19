const adjectives = [
    "fast",
    "happy",
    "brave",
    "calm",
    "eager",
    "fancy",
    "gentle",
    "jolly",
    "kind",
    "lively",
    "proud",
    "silly",
    "witty",
    "zealous",
    "bright",
    "clever",
    "daring",
    "fair",
    "great",
    "lucky",
];

const nouns = [
    "flyer",
    "runner",
    "dreamer",
    "thinker",
    "maker",
    "artist",
    "pilot",
    "driver",
    "rider",
    "walker",
    "baker",
    "cook",
    "diver",
    "gamer",
    "hiker",
    "joker",
    "lover",
    "miner",
    "painter",
    "reader",
];

export function generateUsername(): string {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 900) + 100; // 100-999
    return `${adj}-${noun}-${num}`;
}
