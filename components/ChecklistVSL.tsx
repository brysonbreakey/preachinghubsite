export function ChecklistVSL() {
  return (
    <div className="max-w-2xl mx-auto mb-10 text-center">
      <div className="rounded-2xl overflow-hidden shadow-xl shadow-blue-100/50 border border-slate-200 bg-black mb-6">
        <video className="w-full aspect-video" controls preload="metadata" poster="/video/checklist-vsl-poster.jpg" playsInline>
          <source src="/video/checklist-vsl.mp4" type="video/mp4" />
        </video>
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Your checklist is on its way to your inbox 🎉
      </h2>
    </div>
  );
}

export function ChecklistThankYouHero() {
  return (
    <div className="text-center mb-10 max-w-2xl mx-auto">
      <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: "#3760ad" }}>
        While you wait
      </p>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
        Get a free instant coaching report on your last sermon
      </h1>
    </div>
  );
}
