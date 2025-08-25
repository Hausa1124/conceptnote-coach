// src/utils/limits.ts
export const LIMITS = {
  problemStatement: { minWords: 60,  maxWords: 150, minChars: 400,  maxChars: 1000 },
  objectives:       { minWords: 40,  maxWords: 120, minChars: 250,  maxChars: 800 },
  beneficiaries:    { minWords: 20,  maxWords: 80,  minChars: 150,  maxChars: 600 },
  activities:       { minWords: 40,  maxWords: 150, minChars: 300,  maxChars: 1100 },
  expectedResults:  { minWords: 30,  maxWords: 100, minChars: 220,  maxChars: 800 },
} as const;