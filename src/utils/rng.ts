// Seeded RNG (mulberry32). Used by the room generator so a given (seed, turn)
// produces the same room — important for replays and tests.

export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickIndex(rand: () => number, length: number): number {
  return Math.floor(rand() * length);
}
