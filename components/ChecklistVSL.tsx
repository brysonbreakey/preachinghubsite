export function ChecklistVSL() {
  return (
    <div className="max-w-2xl mx-auto mb-10 text-center">
      <div
        className="rounded-2xl overflow-hidden shadow-xl shadow-blue-100/50 border border-slate-200 bg-black mb-6"
      >
        <video className="w-full aspect-video" controls preload="metadata" poster="/video/checklist-vsl-poster.jpg" playsInline>
          <source src="/video/checklist-vsl.mp4" type="video/mp4" />
        </video>
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
        Your checklist is on its way to your inbox.
      </h2>
      <p className="text-slate-500 leading-relaxed">
        Watch the quick video above — then, while you wait, try the free sermon evaluator below and get coaching feedback on your last message.
      </p>
    </div>
  );
}
