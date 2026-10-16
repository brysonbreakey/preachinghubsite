// A single pull-quote. Unboxed on purpose, like the feature promises above the form —
// the form and the dropdown are the boxes on this page.
export function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <figure className="text-center max-w-xl mx-auto">
      <blockquote className="text-base sm:text-lg text-slate-700 leading-relaxed italic">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-sm">
        <span className="font-semibold text-slate-900">{name}</span>
        <span className="text-slate-500">, {role}</span>
      </figcaption>
    </figure>
  );
}
