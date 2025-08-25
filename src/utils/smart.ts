// src/utils/smart.ts
export type SmartFlags = {
  specific: boolean;
  measurable: boolean;
  achievable: boolean;
  relevant: boolean;
  timebound: boolean;
  score: number; // 0–5
};

const TIME_WORDS = /(month|months|week|weeks|year|years|quarter|Q[1-4]|by\s+\d{4}|within\s+\d+\s+(weeks?|months?|years?))/i;
const HAS_NUMBER = /\d+%?|\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i;
const ACTION_WORDS = /\b(increase|reduce|improve|strengthen|establish|train|deliver|deploy|build|launch|adopt|scale|expand)\b/i;
const OVERPROMISE = /\b(100%|eliminate|end all|eradicate|zero\b)/i;
const CONTEXT_WORDS = /\b(women|youth|farmers|students|households?|clinics?|schools?|cooperatives?|district|sector|village|province|rwanda|kenya|uganda)\b/i;

export function evalSMART(text: string, relatedProblem?: string): SmartFlags {
  const t = (text || "").trim();
  if (!t) return { specific:false, measurable:false, achievable:false, relevant:false, timebound:false, score:0 };

  const specific = CONTEXT_WORDS.test(t);
  const measurable = HAS_NUMBER.test(t);
  const timebound = TIME_WORDS.test(t);
  const achievable = !OVERPROMISE.test(t);
  const relevant = ACTION_WORDS.test(t) || !!relatedProblem;

  const score = [specific, measurable, achievable, relevant, timebound].filter(Boolean).length;
  return { specific, measurable, achievable, relevant, timebound, score };
}