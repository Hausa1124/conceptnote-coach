// src/utils/nudges.ts
export type Step2Guidance = {
  problemPlaceholder: string;
  problemHint: string;
  objectivesPlaceholder: string;
  objectivesHint: string;
};

const sectorBase: Record<string, Partial<Step2Guidance>> = {
  Health: {
    problemPlaceholder: 'State the health gap (who/where) and the evidence/baseline.',
    objectivesPlaceholder: '2-3 SMART outcomes (e.g., +30% ANC visits in 12 months).',
    problemHint: 'Name the population, location, and evidence source (HMIS, survey).',
    objectivesHint: 'Use numbers and a timeframe. Example: "Increase X by 25% in 12 months."',
  },
  Education: {
    problemPlaceholder: 'Describe the learning gap (grades/skills) and root causes.',
    objectivesPlaceholder: 'SMART targets (e.g., +15% reading proficiency by Term 3).',
    problemHint: 'Who is behind, where, and what metrics prove it?',
    objectivesHint: 'Tie to literacy/numeracy metrics with a date.',
  },
  WASH: {
    problemPlaceholder: 'Explain the access/quality gap (water distance, latrines, hygiene).',
    objectivesPlaceholder: 'Targets like <30 min to water; +25% latrine coverage in 1 year.',
    problemHint: 'Use service levels or coverage data if you have it.',
    objectivesHint: 'Include a percent or count and a month/year.',
  },
  Agriculture: {
    problemPlaceholder: 'Clarify yield/market/input constraints for the target crop.',
    objectivesPlaceholder: 'Yield/income goals (e.g., +20% pineapple yields by Season B).',
    problemHint: 'Mention crop, district, and farmer segment.',
    objectivesHint: 'Quantify yield/income and set a season or month.',
  },
  'Economic Development': {
    problemPlaceholder: 'State MSME bottleneck (finance, skills, market linkages).',
    objectivesPlaceholder: 'Jobs/income targets with timeframe.',
    problemHint: 'Name the group (women/youth), place, and constraint.',
    objectivesHint: 'Use counts or % and a clear deadline.',
  },
};

const donorAdds: Record<string, string[]> = {
  EU: ['Keep SMART and align to logframe.'],
  USAID: ['Reference RF/CDCS if relevant.'],
  UN: ['Map to SDGs briefly.'],
  FAO: ['Emphasize smallholders and markets.'],
};

export function getStep2Guidance(sector: string, donor: string): Step2Guidance {
  const s = sectorBase[sector] || {};
  const bonus = donorAdds[donor]?.[0] || '';
  return {
    problemPlaceholder:
      s.problemPlaceholder ||
      'Describe the core problem, who is affected, and the evidence.',
    objectivesPlaceholder:
      s.objectivesPlaceholder ||
      'Write 2-3 SMART objectives with numbers and a timeframe.',
    problemHint: [s.problemHint || '', bonus].filter(Boolean).join(' '),
    objectivesHint: [s.objectivesHint || '', bonus].filter(Boolean).join(' '),
  };
}