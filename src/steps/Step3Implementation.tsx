import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";
import Counter from "../components/Counter";
import { LIMITS } from "../utils/limits";
import { polishText } from "../utils/grammar";

const wc = (s: string) => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0);

const SECTOR_EXAMPLES = {
  Education: {
    beneficiaries: "250 primary school teachers in 15 rural schools • 1,200 students in grades 1-3 across Musanze district",
    activities: "Train 250 teachers on phonics-based reading methods; distribute 5,000 reading books; conduct monthly classroom observations",
    expected: "250 teachers certified in new methods; 80% of grade 2 students read at level by end of year; 15 schools achieve literacy benchmarks"
  },
  Agriculture: {
    beneficiaries: "300 smallholder farmers in 6 cooperatives • 1,800 household members in Nyabihu district",
    activities: "Train 50 lead farmers on climate-smart techniques; establish 10 demonstration plots; conduct 24 monthly field visits",
    expected: "300 farmers adopt improved seeds; average yields increase from 2.1 to 2.7 tons/hectare; 15 new buyer contracts signed"
  },
  Health: {
    beneficiaries: "45 community health workers in 15 health centers • 12,000 women of reproductive age in target catchments",
    activities: "Train 45 CHWs on maternal health protocols; distribute emergency birth kits to 15 centers; conduct quarterly supervision visits",
    expected: "45 certified CHWs deployed; emergency referral time reduced by 40%; 200 safe deliveries recorded in target centers"
  },
  WASH: {
    beneficiaries: "2,500 households in 8 villages • 15,000 community members lacking improved water access",
    activities: "Construct 12 water points with solar pumps; train 24 water committee members; conduct hygiene education in 8 schools",
    expected: "12 functional water systems serving 2,500 HH; water access time reduced to under 30 minutes; 80% practice handwashing"
  },
  "Economic Development": {
    beneficiaries: "180 youth entrepreneurs aged 18-35 • 60 women's savings groups in peri-urban areas",
    activities: "Deliver business skills training to 180 youth; provide startup grants to 120 participants; establish 12 market linkages",
    expected: "120 new businesses launched; average monthly income increases by 40%; 60 savings groups mobilize $50,000 collectively"
  },
  Other: {
    beneficiaries: "Target population in specified geographic area • Key stakeholder groups affected by the intervention",
    activities: "Implement capacity building activities; establish systems and processes; conduct monitoring and evaluation",
    expected: "Measurable improvements in target indicators; strengthened institutional capacity; sustainable behavior change"
  }
} as const;

export default function Step3Implementation() {
  const { data, update } = useWizard();
  const nav = useNavigate();

  // Sector-aware examples
  // Allowed sector keys for examples
  const SECTOR_KEYS = [
    "Education",
    "Agriculture",
    "Health",
    "WASH",
    "Economic Development",
    "Other"
  ] as const;
  type SectorKey = typeof SECTOR_KEYS[number];

  // Normalize current sector to one of our keys
  const rawSector = (data?.sector ?? "").trim();
  const sectorMap: Record<string, SectorKey> = {
    Education: "Education",
    Agriculture: "Agriculture",
    Health: "Health",
    WASH: "WASH",
    "Economic Development": "Economic Development"
  };
  // If not recognized, fall back to "Other"
  const sectorKey: SectorKey = sectorMap[rawSector] ?? "Other";

  // Now safely index examples
  const examples = SECTOR_EXAMPLES[sectorKey];

  // Parse existing risks data safely
  const initial = data.risks ? data.risks.split(", ").filter(Boolean) : [];

  // Risk options that belong on this page
  const riskOptions = ["Funding", "Capacity", "Market", "Climate", "Compliance", "Logistics"];

  // Single source of state (no duplicates)
  const [gridSel, setGridSel] = useState<string[]>(
    initial.filter(r => riskOptions.includes(r))
  );

  const [otherOn, setOtherOn] = useState<boolean>(
    initial.some(r => !riskOptions.includes(r))
  );

  const [otherText, setOtherText] = useState<string>(
    initial.filter(r => !riskOptions.includes(r)).join(", ")
  );

  // Handlers (no undefined ops)
  function toggleItem(item: string) {
    setGridSel(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }

  function handleOtherToggle(checked: boolean) {
    setOtherOn(checked);
    if (!checked) setOtherText("");
  }

  function handleOtherTextChange(v: string) {
    setOtherText(v);
  }

  // Build the canonical risks array when saving/next
  function buildRisks(): string[] {
    const others = otherOn
      ? otherText
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      : [];
    return [...gridSel, ...others];
  }

  // Update risks whenever state changes
  useEffect(() => {
    const risks = buildRisks();
    update({ risks: risks.join(", ") });
  }, [gridSel, otherOn, otherText, update]);

  const canNext =
    wc(data.beneficiaries) > 0 &&
    wc(data.activities) > 0 &&
    wc(data.expectedResults) > 0;

  // Save/Next wiring (no undefined writes)
  function handleNext() {
    const risks = buildRisks();
    update({ risks: risks.join(", ") });
    nav("/wizard/step-4");
  }

  return (
    <section className="section">
      <h2 className="pane-title">Step 3 — Implementation</h2>

      <label className="field">
        <span className="label">Beneficiaries</span>
        <div className="text-sm text-gray-600 mb-1">
          <strong>Examples:</strong> {examples.beneficiaries}
        </div>
        <textarea 
          className="textarea" 
          value={data.beneficiaries} 
          onChange={e => update({ beneficiaries: e.target.value })} 
          placeholder="Who will benefit from this project?"
        />
        <Counter text={data.beneficiaries} lims={LIMITS.beneficiaries} />
        <div className="helper" style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          Who, where, how many. Example: "300 women farmers in Nyabihu, 6 co-ops."
        </div>
        <div className="actions" style={{ marginTop: 6 }}>
          <button 
            className="btn ghost" 
            type="button" 
            onClick={() => update({ beneficiaries: polishText(data.beneficiaries) })}
          >
            Polish
          </button>
        </div>
      </label>

      <label className="field">
        <span className="label">Activities</span>
        <div className="text-sm text-gray-600 mb-1">
          <strong>Examples:</strong> {examples.activities}
        </div>
        <textarea 
          className="textarea" 
          value={data.activities} 
          onChange={e => update({ activities: e.target.value })} 
          placeholder="What activities will be implemented?"
        />
        <Counter text={data.activities} lims={LIMITS.activities} />
        <div className="helper" style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          Start each line with a verb. Example: "Train 6 lead farmers; set up 2 demo plots…"
        </div>
        <div className="actions" style={{ marginTop: 6 }}>
          <button 
            className="btn ghost" 
            type="button" 
            onClick={() => update({ activities: polishText(data.activities) })}
          >
            Polish
          </button>
        </div>
      </label>

      <label className="field">
        <span className="label">Expected Results</span>
        <div className="text-sm text-gray-600 mb-1">
          <strong>Examples:</strong> {examples.expected}
        </div>
        <textarea 
          className="textarea" 
          value={data.expectedResults} 
          onChange={e => update({ expectedResults: e.target.value })} 
          placeholder="What results do you expect to achieve?"
        />
        <Counter text={data.expectedResults} lims={LIMITS.expectedResults} />
        <div className="helper" style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          Quantify results if possible. Example: "+20% yields; 15 new buyer contracts."
        </div>
        <div className="actions" style={{ marginTop: 6 }}>
          <button 
            className="btn ghost" 
            type="button" 
            onClick={() => update({ expectedResults: polishText(data.expectedResults) })}
          >
            Polish
          </button>
        </div>
      </label>

      <div className="field">
        <span className="label">Risks</span>
        {/* Render (map safely) */}
        <div className="grid2">
          {(riskOptions || []).map(risk => (
            <div 
              key={risk}
              className={`card example ${gridSel.includes(risk) ? 'selected' : ''}`}
              onClick={() => toggleItem(risk)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: gridSel.includes(risk) ? '#0d162d' : '#0c1324',
                border: gridSel.includes(risk) ? '1px solid #3b82f6' : '1px solid #1f2937'
              }}
            >
              <div className="card-title">{risk}</div>
            </div>
          ))}
          <div 
            className={`card example ${otherOn ? 'selected' : ''}`}
            onClick={() => handleOtherToggle(!otherOn)}
            style={{ 
              cursor: 'pointer',
              backgroundColor: otherOn ? '#0d162d' : '#0c1324',
              border: otherOn ? '1px solid #3b82f6' : '1px solid #1f2937'
            }}
          >
            <div className="card-title">Other</div>
          </div>
        </div>
        {otherOn && (
          <input
            className="input" 
            style={{ marginTop: 8 }}
            placeholder="Type other risk…"
            value={otherText}
            onChange={(e) => handleOtherTextChange(e.target.value)}
          />
        )}
      </div>

      <div className="navrow">
        <button 
          className="btn ghost" 
          onClick={() => nav("/wizard/step-2")}
        >
          Back
        </button>
        <button 
          className="btn primary" 
          disabled={!canNext}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </section>
  );
}