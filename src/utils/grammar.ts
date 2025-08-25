// src/utils/grammar.ts
export function polishText(text: string): string {
  if (!text) return text;
  let t = text.replace(/\s+/g, " ").trim();

  // split by sentence and keep punctuation
  const parts = t.split(/([.!?])\s+/).filter(Boolean);
  const rebuilt: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const sentence = (parts[i] || "").trim();
    const punct = parts[i + 1] || ".";
    if (!sentence) continue;
    const cap = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    rebuilt.push(cap.endsWith(punct) ? cap : cap + punct);
  }
  t = rebuilt.join(" ");
  t = t.replace(/\s+([,;:.!?])/g, "$1").replace(/\s{2,}/g, " ").trim();
  return t;
}