export function FeedbackReportMockup() {
  const pacingBars = [18,22,28,35,40,38,42,45,50,48,52,58,62,60,65,68,70,65,72,75,78,80,76,74,70,68,72,74,78,82,85,80,76,70,65,60,52,45,38,28];

  const categories = [
    { label: "Textual Faithfulness", text: "Textual grounding is solid. The cultural context you drew on landed well with the passage's original setting." },
    { label: "Big Idea Clarity", text: "Big idea was stated clearly and repeated well. A few supporting points could be connected back to it more directly." },
    { label: "Introduction Strength", text: "Strong opening tension. The hook created genuine curiosity and set up the passage naturally.", strong: true },
    { label: "Movement & Structure", text: "Clear three-movement flow. The transition into the body felt slightly abrupt — consider a stronger bridge from your hook." },
    { label: "Illustration & Clarity", text: "The prodigal retelling was fresh and vivid. The secondary illustration felt slightly disconnected from the main point.", strong: true },
    { label: "Application Design", text: "Application stayed general. Push toward one concrete, specific ask your listener can act on this week." },
    { label: "Conclusion & Tension Resolution", text: "The close landed well emotionally. The call to action could be stated more directly before the final image.", strong: true },
    { label: "Gospel Faithfulness", text: "The grace moment in the third movement was genuinely moving and theologically grounded. This is your strongest area." },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/80 overflow-hidden bg-white select-none text-[10px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div className="bg-[#3760ad] px-5 py-3.5">
        <div className="text-[7px] font-bold uppercase tracking-widest text-blue-200 mb-1">Sermon Feedback Report</div>
        <div className="text-white font-bold text-[13px] leading-tight">Grace That Finds Us</div>
        <div className="text-blue-200 text-[8px] mt-0.5">Luke 15:11-32 &middot; Jul 6, 2026 &middot; 38 min</div>
      </div>

      <div className="p-4 space-y-3.5">
        {/* Your Biggest Wins */}
        <div className="rounded-xl bg-green-50 border border-green-100 p-3">
          <div className="text-[7px] font-bold uppercase tracking-widest text-green-600 mb-1">Your Biggest Wins</div>
          <div className="text-[9px] text-slate-700 leading-snug font-medium">Gospel clarity in the third movement.</div>
          <div className="text-[8px] text-slate-500 leading-snug mt-0.5">Your gospel turn was theologically grounded and emotionally resonant. Protect this instinct — it&apos;s the heart of your preaching.</div>
        </div>

        {/* Category Breakdown */}
        <div>
          <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-2">Category Breakdown</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {categories.map(({ label, text }) => (
              <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                <div className="font-semibold text-[#3760ad] mb-0.5 text-[8px]">{label}</div>
                <div className="text-[7.5px] text-slate-500 leading-snug">{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Growth Areas + Questions side by side */}
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Top Growth Areas</div>
            {[
              { label: "Application", tip: "Give one concrete, specific action your listener can take this week — tied directly to the text." },
              { label: "Engagement", tip: "Plan a deliberate re-engagement moment around the 20-minute mark to recapture attention." },
            ].map(({ label, tip }) => (
              <div key={label} className="flex gap-1.5 mb-2 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="w-0.5 bg-amber-400 rounded-full shrink-0" />
                <div>
                  <div className="font-semibold text-slate-700 text-[8px]">{label}</div>
                  <div className="text-[7.5px] text-slate-500 leading-snug mt-0.5">{tip}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-48 shrink-0">
            <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Questions Worth Considering</div>
            {[
              "What would it look like for someone in your congregation to live this text out by Thursday?",
              "Where did you feel most alive while preaching? What does that tell you about your calling?",
              "What single sentence best captures what you wanted people to leave with?",
            ].map((q, i) => (
              <div key={i} className="flex gap-1.5 mb-2 last:mb-0">
                <div className="w-3.5 h-3.5 rounded-full bg-[#3760ad]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#3760ad] text-[6px] font-bold">{i + 1}</span>
                </div>
                <div className="text-[7.5px] text-slate-500 leading-snug italic">{q}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pacing Analysis */}
        <div>
          <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Pacing Analysis <span className="text-slate-300 font-normal normal-case tracking-normal">(video &amp; audio submissions)</span></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-end gap-px h-12 mb-1.5">
              {pacingBars.map((h, i) => {
                const pct = h / 100;
                const color = pct > 0.72 ? "#3760ad" : pct > 0.45 ? "#93c5fd" : "#dbeafe";
                return <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: color }} />;
              })}
            </div>
            <div className="flex justify-between text-[7px] text-slate-300 mb-2">
              <span>0:00</span><span>19:00</span><span>38:00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {[{ c: "#3760ad", l: "High" }, { c: "#93c5fd", l: "Moderate" }, { c: "#dbeafe", l: "Low" }].map(({ c, l }) => (
                  <div key={l} className="flex items-center gap-1 text-[7px] text-slate-400">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />{l}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 text-[7px]">
                {[["Avg pace", "145 wpm"], ["Peak", "Min 28–35"], ["Pauses", "7"]].map(([k, v]) => (
                  <div key={k}><span className="text-slate-400">{k} </span><span className="font-semibold text-slate-600">{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
