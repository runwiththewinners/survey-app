"use client";
import { useState, useEffect } from "react";

// Whop store URLs
const PRODUCTS = {
  free: "prod_OVVaWf1nemJrp",
  premium: "prod_o1jjamUG8rP8W",
  high_rollers: "prod_bNsUIqwSfzLzU",
  player_props: "prod_RYRii4L26sK9m",
  max_bet: "prod_12U89lKiPpVxP",
};
const WHOP_URLS = { premium: "https://whop.com/rwtw/rwtw/", high_rollers: "https://whop.com/rwtw/rwtw-premium-copy/", player_props: "https://whop.com/rwtw/rwtw-propboard/" };
const CHALKBOARD_URL = "https://go.chalkboard.io/websignup-v1-tt?utm_source=promo&offer=flare";

const CHALK_STATES = [
  "Alaska","Arkansas","California","Delaware","Florida","Georgia","Illinois",
  "Indiana","Kansas","Kentucky","Maine","Massachusetts","Minnesota","Missouri",
  "Nebraska","New Hampshire","New Mexico","North Carolina","North Dakota",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Texas","Utah","Vermont","Virginia","Washington, D.C.",
  "West Virginia","Wisconsin","Wyoming","Canada (excl. Ontario)",
];

const ALL_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
  "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","Washington, D.C.","West Virginia","Wisconsin",
  "Wyoming","Canada (excl. Ontario)","Other / International",
];

const TIERS = {
  "High Rollers": {
    icon: "👑", badge: "👑 ELITE TIER", name: "HIGH ROLLERS",
    price: "$249.99 / month",
    desc: "Our most exclusive tier with VIP high-stakes picks, direct strategist access, and plays designed for serious bettors who go big.",
    highlights: ["VIP Picks", "High-Stakes Plays", "Direct Access", "Priority Alerts"],
    url: WHOP_URLS.high_rollers,
  },
  Premium: {
    icon: "🔥", badge: "🔥 MOST POPULAR", name: "PREMIUM",
    price: "$39.99 / week",
    desc: "The complete package — daily picks across all sports, full strategy breakdowns, and community access. Perfect for bettors ready to level up.",
    highlights: ["Daily Picks", "All Sports", "Strategy Breakdowns", "Full Community Access"],
    url: WHOP_URLS.premium,
  },
  "Player Props": {
    icon: "🎲", badge: "🎲 PROPS SPECIALIST", name: "PLAYER PROPS",
    price: "See pricing",
    desc: "Focused player prop picks with detailed analysis. Ideal if you love betting on individual player performance and building SGPs.",
    highlights: ["Player Props", "SGP Builds", "Stat Analysis", "Daily Prop Picks"],
    url: WHOP_URLS.player_props,
  },
};

const QUESTIONS = [
  {
    key: "sports", num: 1, title: "What sports do you bet on?", hint: "Select all that apply", multi: true, cols: "cols4",
    options: [
      { val: "NFL", icon: "🏈", label: "NFL" }, { val: "NBA", icon: "🏀", label: "NBA" },
      { val: "MLB", icon: "⚾", label: "MLB" }, { val: "NHL", icon: "🏒", label: "NHL" },
      { val: "UFC", icon: "🥊", label: "UFC" }, { val: "Boxing", icon: "🥋", label: "Boxing" },
      { val: "Soccer", icon: "⚽", label: "Soccer" }, { val: "Tennis", icon: "🎾", label: "Tennis" },
    ],
  },
  {
    key: "frequency", num: 2, title: "How often do you bet?", hint: "Pick one", multi: false, cols: "cols2",
    options: [
      { val: "Daily", icon: "⚡", label: "Daily" }, { val: "Few Times a Week", icon: "🔥", label: "Few Times a Week" },
      { val: "Weekends Only", icon: "📅", label: "Weekends Only" }, { val: "Just Getting Started", icon: "🌱", label: "Just Getting Started" },
    ],
  },
  {
    key: "experience", num: 3, title: "How long have you been betting?", hint: "Pick one", multi: false, cols: "cols2",
    options: [
      { val: "0–6 Months", icon: "🌱", label: "0–6 Months" }, { val: "6M–2 Years", icon: "📈", label: "6 Mo – 2 Years" },
      { val: "2–4 Years", icon: "💪", label: "2–4 Years" }, { val: "4+ Years", icon: "👑", label: "4+ Years" },
    ],
  },
  {
    key: "avg_bet_size", num: 4, title: "What's your average bet size?", hint: "Pick one", multi: false, cols: "cols2",
    options: [
      { val: "Under $25", icon: "💵", label: "Under $25" }, { val: "$25–$100", icon: "💵💵", label: "$25 – $100" },
      { val: "$100–$500", icon: "💰", label: "$100 – $500" }, { val: "$500+", icon: "🤑", label: "$500+" },
    ],
  },
  {
    key: "bet_types", num: 5, title: "What types of bets do you prefer?", hint: "Select all that apply", multi: true, cols: "cols2",
    options: [
      { val: "Moneyline", icon: "🎯", label: "Moneyline" }, { val: "Spread", icon: "📊", label: "Spread" },
      { val: "Over/Under", icon: "⚖️", label: "Over / Under" }, { val: "Parlays", icon: "🔗", label: "Parlays" },
      { val: "Props", icon: "🎲", label: "Player Props" }, { val: "Same Game Parlay", icon: "🔥", label: "Same Game Parlay" },
    ],
  },
  {
    key: "priority", num: 6, title: "What matters most to you?", hint: "Pick one", multi: false, cols: "cols2",
    options: [
      { val: "Winning Picks Daily", icon: "📬", label: "Winning Picks Daily", sub: "Consistent plays every day" },
      { val: "Props & SGP Builds", icon: "🎲", label: "Props & SGP Builds", sub: "Player props & same game parlays" },
      { val: "VIP High-Stakes Access", icon: "👑", label: "VIP High-Stakes Access", sub: "Elite plays for serious bettors" },
      { val: "Learning to Build My Edge", icon: "📚", label: "Build My Own Edge", sub: "Learn strategy & analysis" },
    ],
  },
];

const TOTAL = 7;
const LABELS = { sports: "Sports", frequency: "Frequency", experience: "Experience", avg_bet_size: "Avg Bet Size", bet_types: "Bet Types", priority: "Priority", state: "Location" };

function getRecommendation(answers) {
  const freq = answers.frequency || "";
  const exp = answers.experience || "";
  const betSize = answers.avg_bet_size || "";
  const betTypes = answers.bet_types || [];
  const priority = answers.priority || "";
  let score = { "High Rollers": 0, Premium: 0, "Player Props": 0 };

  if (freq === "Daily") { score["High Rollers"] += 4; score.Premium += 3; }
  if (freq === "Few Times a Week") { score.Premium += 4; score["High Rollers"] += 2; }
  if (freq === "Weekends Only") { score.Premium += 3; score["Player Props"] += 2; }
  if (freq === "Just Getting Started") { score.Premium += 4; }

  if (exp === "4+ Years") { score["High Rollers"] += 3; }
  if (exp === "2–4 Years") { score["High Rollers"] += 2; score.Premium += 2; }
  if (exp === "6M–2 Years") { score.Premium += 3; }
  if (exp === "0–6 Months") { score.Premium += 3; }

  if (betSize === "$500+") { score["High Rollers"] += 6; score.Premium += 1; }
  if (betSize === "$100–$500") { score["High Rollers"] += 3; score.Premium += 4; }
  if (betSize === "$25–$100") { score.Premium += 4; score["Player Props"] += 2; }
  if (betSize === "Under $25") { score.Premium += 3; score["Player Props"] += 3; }

  if (betTypes.includes("Props")) score["Player Props"] += 5;
  if (betTypes.includes("Same Game Parlay")) score["Player Props"] += 4;
  if (betTypes.includes("Moneyline")) { score.Premium += 2; score["High Rollers"] += 1; }
  if (betTypes.includes("Spread")) { score.Premium += 2; score["High Rollers"] += 1; }
  if (betTypes.includes("Parlays")) { score.Premium += 1; score["Player Props"] += 1; }
  if (betTypes.includes("Over/Under")) score.Premium += 1;

  if (priority === "Winning Picks Daily") { score.Premium += 6; score["High Rollers"] += 2; }
  if (priority === "Props & SGP Builds") score["Player Props"] += 8;
  if (priority === "VIP High-Stakes Access") score["High Rollers"] += 8;
  if (priority === "Learning to Build My Edge") score.Premium += 5;

  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  return { primary: sorted[0][0], secondary: sorted.slice(1).map((s) => s[0]) };
}

function isChalkEligible(state) {
  if (!state) return false;
  const n = state.toLowerCase().trim();
  return CHALK_STATES.some((s) => {
    if (n.includes("canada") && s.toLowerCase().includes("canada")) return true;
    return n === s.toLowerCase();
  });
}

export default function Survey({ whopUserId, whopUsername, whopEmail }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [stateFilter, setStateFilter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function selectOption(key, val, multi) {
    setAnswers((prev) => {
      if (!multi) return { ...prev, [key]: val };
      const arr = prev[key] || [];
      return { ...prev, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
  }

  function canNext() {
    if (step <= 6) {
      const q = QUESTIONS[step - 1];
      const val = answers[q.key];
      if (q.multi) return val && val.length > 0;
      return !!val;
    }
    if (step === 7) return !!answers.state;
    return false;
  }

  async function handleSubmit() {
    setSubmitting(true);
    const rec = getRecommendation(answers);
    const chalkEligible = isChalkEligible(answers.state);

    const payload = {
      whop_user_id: whopUserId,
      whop_username: whopUsername,
      whop_email: whopEmail,
      sports: Array.isArray(answers.sports) ? answers.sports.join(", ") : null,
      frequency: answers.frequency || null,
      experience: answers.experience || null,
      avg_bet_size: answers.avg_bet_size || null,
      bet_types: Array.isArray(answers.bet_types) ? answers.bet_types.join(", ") : null,
      priority: answers.priority || null,
      state: answers.state || null,
      recommended_tier: rec.primary,
      chalkboard_eligible: chalkEligible,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) showToast("✓ Response saved!", "success");
      else showToast("⚠ Could not save", "error");
    } catch {
      showToast("⚠ Network error", "error");
    }

    setResult({ rec, state: answers.state, chalkEligible });
    setSubmitting(false);
    setStep(8);
  }

  const pct = step <= 7 ? (step / TOTAL) * 100 : 100;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24, position: "relative" }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "-30%", left: "-10%", width: "60%", height: "60%", background: "radial-gradient(ellipse, rgba(255,215,0,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 999,
          background: "var(--surface)", border: `1px solid ${toast.type === "success" ? "var(--green)" : "var(--red)"}`,
          borderRadius: 12, padding: "14px 24px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)", whiteSpace: "nowrap",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: toast.type === "success" ? "var(--green)" : "var(--red)", boxShadow: toast.type === "success" ? "0 0 8px rgba(0,214,125,0.4)" : "none" }} />
          {toast.msg}
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 660, position: "relative", zIndex: 1 }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 4, color: "var(--gold)", opacity: 0.7 }}>RUN WITH THE WINNERS</div>
        </div>

        {step <= 7 && (
          <>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.04))",
                border: "1px solid rgba(255,215,0,0.2)", color: "var(--gold)",
                fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase",
                padding: "8px 18px", borderRadius: 100, marginBottom: 24,
              }}>🏆 WELCOME TO RWTW</div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px, 7vw, 54px)", letterSpacing: 3, lineHeight: 0.95, marginBottom: 14, color: "#fff" }}>
                LET'S BUILD YOUR<br /><span style={{ color: "var(--gold)", textShadow: "0 0 40px rgba(255,215,0,0.2)" }}>WINNING PLAN</span>
              </h1>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Answer a few quick questions so we can recommend the best package for your game</p>
            </div>

            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div style={{ flex: 1, background: "var(--surface2)", borderRadius: 100, height: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, var(--gold-dim), var(--gold))", borderRadius: 100, transition: "width 0.6s cubic-bezier(.22,1,.36,1)", width: `${pct}%`, boxShadow: "0 0 12px rgba(255,215,0,0.3)" }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", whiteSpace: "nowrap" }}>{step} / {TOTAL}</div>
            </div>
          </>
        )}

        {/* Questions 1-6 */}
        {step <= 6 && (() => {
          const q = QUESTIONS[step - 1];
          const val = answers[q.key];
          return (
            <div key={q.key} style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20,
              padding: "40px 36px", position: "relative", overflow: "hidden",
              animation: "fadeUp 0.45s cubic-bezier(.22,1,.36,1) forwards",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.2), transparent)" }} />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12, opacity: 0.8 }}>Question {q.num} of {TOTAL}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(24px, 4.5vw, 32px)", letterSpacing: 1.5, marginBottom: 6, lineHeight: 1.1, color: "#fff" }}>{q.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28 }}>{q.hint}</div>

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: q.cols === "cols4" ? "repeat(auto-fill, minmax(130px, 1fr))" : "1fr 1fr" }}>
                {q.options.map((opt) => {
                  const selected = q.multi ? (val || []).includes(opt.val) : val === opt.val;
                  return (
                    <button key={opt.val} onClick={() => selectOption(q.key, opt.val, q.multi)} style={{
                      background: selected ? "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.06))" : "var(--surface2)",
                      border: `1.5px solid ${selected ? "var(--gold)" : "var(--border)"}`,
                      borderRadius: 14, color: selected ? "var(--gold)" : "var(--text)", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, padding: "16px 12px",
                      textAlign: "center", transition: "all 0.2s", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 6, lineHeight: 1.3, position: "relative",
                      boxShadow: selected ? "0 0 20px rgba(255,215,0,0.08), inset 0 0 20px rgba(255,215,0,0.03)" : "none",
                    }}>
                      <span style={{ fontSize: 22 }}>{opt.icon}</span>
                      {opt.label}
                      {opt.sub && <span style={{ fontSize: 11, color: selected ? "var(--gold)" : "var(--muted)", fontWeight: 500, opacity: selected ? 0.7 : 1, marginTop: 2 }}>{opt.sub}</span>}
                      {selected && <span style={{ position: "absolute", top: 8, right: 10, fontSize: 11, color: "var(--gold)", fontWeight: 800 }}>✓</span>}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: 10, color: "var(--muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, padding: "12px 24px" }}>← Back</button>
                ) : <span style={{ fontSize: 12, color: "var(--muted)" }}>Select {q.multi ? "multiple" : "one"}</span>}
                <button disabled={!canNext()} onClick={() => setStep(step + 1)} style={{
                  background: "linear-gradient(135deg, var(--gold), #e5c200)", border: "none", borderRadius: 10,
                  color: "#000", cursor: canNext() ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, fontWeight: 700, padding: "12px 28px", opacity: canNext() ? 1 : 0.3,
                  boxShadow: canNext() ? "0 2px 16px rgba(255,215,0,0.15)" : "none",
                }}>Next →</button>
              </div>
            </div>
          );
        })()}

        {/* Q7 — State */}
        {step === 7 && (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20,
            padding: "40px 36px", position: "relative", overflow: "hidden",
            animation: "fadeUp 0.45s cubic-bezier(.22,1,.36,1) forwards",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.2), transparent)" }} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12, opacity: 0.8 }}>Question 7 of {TOTAL}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(24px, 4.5vw, 32px)", letterSpacing: 1.5, marginBottom: 6, lineHeight: 1.1, color: "#fff" }}>Where are you located?</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28 }}>This helps us recommend the best tools available in your area</div>

            <input
              type="text" placeholder="Search your state or province…" value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              style={{ width: "100%", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: 12, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, padding: "14px 18px", outline: "none", marginBottom: 14 }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, maxHeight: 280, overflowY: "auto", paddingRight: 4 }}>
              {ALL_STATES.filter((s) => s.toLowerCase().includes(stateFilter.toLowerCase())).map((s) => (
                <button key={s} onClick={() => setAnswers((p) => ({ ...p, state: s }))} style={{
                  background: answers.state === s ? "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.06))" : "var(--surface2)",
                  border: `1.5px solid ${answers.state === s ? "var(--gold)" : "var(--border)"}`,
                  borderRadius: 10, color: answers.state === s ? "var(--gold)" : "var(--text-secondary)",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: answers.state === s ? 700 : 600,
                  padding: "10px 12px", textAlign: "center", transition: "all 0.18s",
                }}>{s}</button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
              <button onClick={() => setStep(6)} style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: 10, color: "var(--muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, padding: "12px 24px" }}>← Back</button>
              <button disabled={!canNext() || submitting} onClick={handleSubmit} style={{
                background: "linear-gradient(135deg, var(--gold), #e5c200)", border: "none", borderRadius: 10,
                color: "#000", cursor: canNext() && !submitting ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 700, padding: "12px 28px", opacity: canNext() && !submitting ? 1 : 0.3,
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: canNext() ? "0 2px 16px rgba(255,215,0,0.15)" : "none",
              }}>
                {submitting ? "Building your plan…" : "See My Plan →"}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 8 && result && (() => {
          const tier = TIERS[result.rec.primary];
          return (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20,
              overflow: "hidden", animation: "fadeUp 0.5s cubic-bezier(.22,1,.36,1) forwards",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)" }} />

              {/* Hero */}
              <div style={{ padding: "44px 36px 32px", textAlign: "center", background: "linear-gradient(180deg, rgba(255,215,0,0.04), transparent)" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>🏆</div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: 3, marginBottom: 8, color: "#fff" }}>
                  YOUR <span style={{ color: "var(--gold)" }}>WINNING PLAN</span>
                </h2>
                <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 380, margin: "0 auto", lineHeight: 1.6 }}>Based on your answers, here's what we recommend to take your betting to the next level.</p>
              </div>

              {/* Primary rec */}
              <div style={{ padding: "0 28px 32px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--gold)", marginBottom: 14, opacity: 0.7 }}>⭐ BEST FIT FOR YOU</div>
                <div style={{
                  background: "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,215,0,0.02))",
                  border: "1.5px solid rgba(255,215,0,0.25)", borderRadius: 16, padding: "28px 24px",
                  textAlign: "left", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent)" }} />
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,215,0,0.15)", borderRadius: 100, padding: "5px 14px", fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>{tier.badge}</div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2, color: "#fff", marginBottom: 4 }}>{tier.name}</h3>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", marginBottom: 12 }}>{tier.price}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>{tier.desc}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {tier.highlights.map((h) => (
                      <span key={h} style={{ background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.12)", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: "var(--gold)" }}>{h}</span>
                    ))}
                  </div>
                  <a href={tier.url} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "linear-gradient(135deg, var(--gold), #e5c200)", border: "none", borderRadius: 10,
                    color: "#000", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
                    padding: "13px 28px", textDecoration: "none", boxShadow: "0 2px 16px rgba(255,215,0,0.2)", width: "100%",
                  }}>Join Now →</a>
                </div>
              </div>

              {/* Secondary recs */}
              <div style={{ padding: "0 28px 8px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12, opacity: 0.7 }}>ALSO WORTH CHECKING OUT</div>
                {result.rec.secondary.map((name) => {
                  const t = TIERS[name];
                  return (
                    <a key={name} href={t.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "flex", alignItems: "center", gap: 14, background: "var(--surface2)",
                      border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px", marginBottom: 10,
                      textDecoration: "none", color: "var(--text)",
                    }}>
                      <span style={{ fontSize: 28, flexShrink: 0 }}>{t.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1.5, color: "#fff", marginBottom: 2 }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.desc.substring(0, 80)}…</div>
                        <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, marginTop: 2 }}>{t.price}</div>
                      </div>
                      <span style={{ color: "var(--muted)", fontSize: 16 }}>→</span>
                    </a>
                  );
                })}
              </div>

              {/* Chalkboard CTA */}
              {result.chalkEligible && result.state && (
                <div style={{
                  margin: "0 28px 28px", background: "linear-gradient(135deg, rgba(0,214,125,0.08), rgba(0,214,125,0.02))",
                  border: "1.5px solid rgba(0,214,125,0.25)", borderRadius: 16, padding: 24, textAlign: "left",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,214,125,0.4), transparent)" }} />
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,214,125,0.15)", borderRadius: 100, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: "var(--green)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>🟢 AVAILABLE IN YOUR STATE</div>
                  <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1.5, color: "#fff", marginBottom: 6 }}>GET $100 FREE ON CHALKBOARD</h4>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>Chalkboard is a daily fantasy / pick'em platform available in your state. Sign up through our link and start with $100 in free plays — the perfect complement to your RWTW picks.</div>
                  <div style={{ fontSize: 11, color: "var(--green)", marginBottom: 16, fontWeight: 600, opacity: 0.8 }}>✓ Available in {result.state}</div>
                  <a href={CHALKBOARD_URL} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "linear-gradient(135deg, var(--green), var(--green-dim))", border: "none", borderRadius: 10,
                    color: "#000", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
                    padding: "12px 24px", textDecoration: "none", boxShadow: "0 2px 16px rgba(0,214,125,0.15)", width: "100%",
                  }}>Claim $100 Free →</a>
                </div>
              )}

              {/* Summary */}
              <div style={{ padding: "0 28px 32px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--gold)", marginBottom: 10, opacity: 0.7 }}>YOUR ANSWERS</div>
                <div style={{ display: "grid", gap: 6 }}>
                  {Object.keys(LABELS).map((key) => {
                    const val = answers[key];
                    const display = Array.isArray(val) ? val.join(", ") : val || "—";
                    return (
                      <div key={key} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ color: "var(--muted)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, flexShrink: 0 }}>{LABELS[key]}</span>
                        <span style={{ fontWeight: 700, color: "var(--gold)", textAlign: "right", fontSize: 12 }}>{display}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
