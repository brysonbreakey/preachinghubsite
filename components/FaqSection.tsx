import { FAQS } from "@/lib/faqs";
import { Accent, H, INDIGO } from "@/components/FeatureBits";

export function FaqSection({ ids, className = "", bg = "bg-white" }: { ids: string[]; className?: string; bg?: string }) {
  const items = ids.map((id) => FAQS.find((f) => f.id === id)).filter((f): f is NonNullable<typeof f> => !!f);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className={`py-16 sm:py-24 px-6 ${bg} ${className}`}>
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-center" style={{ color: INDIGO }}>FAQ</p>
        <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-10 text-center`}>
          Questions, <Accent>answered.</Accent>
        </h2>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {items.map((f) => (
            <details key={f.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center gap-3 text-base sm:text-lg font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" className="shrink-0" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" className="group-open:hidden" />
                </svg>
                {f.question}
              </summary>
              <p className="mt-3 pl-[30px] text-slate-600 leading-relaxed">
                {f.answer}
                {f.link && (
                  <>
                    {" "}
                    <a href={f.link.href} className="font-semibold underline underline-offset-2" style={{ color: INDIGO }}>
                      {f.link.label}
                    </a>
                    .
                  </>
                )}
              </p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
