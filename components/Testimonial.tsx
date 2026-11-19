// A single pull-quote. Unboxed on purpose, like the feature promises above the form —
// the form and the dropdown are the boxes on this page.
export function Testimonial({ quote, name, role, left = false }: { quote: string; name: string; role: string; left?: boolean }) {
  return (
    <figure className={left ? "max-w-2xl" : "text-center max-w-xl mx-auto"}>
      <blockquote className={left ? "font-[family-name:var(--font-lora)] italic text-xl sm:text-2xl text-[#4F46E5] leading-snug" : "text-base sm:text-lg text-slate-700 leading-relaxed italic"}>
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-sm">
        <span className="font-semibold text-slate-900">{name}</span>
        <span className="text-slate-500">, {role}</span>
      </figcaption>
    </figure>
  );
}
