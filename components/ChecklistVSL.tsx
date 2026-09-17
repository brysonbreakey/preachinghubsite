export function ChecklistVSL() {
  return (
    <div className="max-w-md mx-auto mb-6 text-center">
      <div className="rounded-2xl overflow-hidden shadow-xl shadow-blue-100/50 border border-slate-200 bg-black mb-4">
        <video className="w-full aspect-video" controls preload="metadata" poster="/video/checklist-vsl-poster.jpg" playsInline>
          <source src="/video/checklist-vsl.mp4" type="video/mp4" />
        </video>
      </div>
      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
        Your checklist is on its way to your inbox.
      </h1>
    </div>
  );
}

export function ChecklistThankYouHero() {
  return (
    <div className="text-center mb-8 max-w-xl mx-auto">
      <p className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: "#3760ad" }}>
        While you wait
      </p>
      <p className="text-lg text-slate-500 leading-relaxed">
        Try the free sermon evaluator below and get coaching feedback on your last message.
      </p>
    </div>
  );
}
