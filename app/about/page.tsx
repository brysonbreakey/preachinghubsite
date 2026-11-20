import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Cta, Eyebrow, Accent, H, INDIGO } from "@/components/FeatureBits";

export const metadata: Metadata = {
  title: "About — PreachingHub",
  description:
    "PreachingHub is built on one conviction: the sermon belongs to the preacher, and the fastest way to grow is quality feedback and expert coaching.",
};

const BELIEFS = [
  { title: "The sermon belongs to the preacher.", body: "PreachingHub won't write your sermon, generate your outline, or hand you application points. The work, and the calling, are yours." },
  { title: "Growth comes from honest feedback.", body: "There are no shortcuts to becoming a better preacher. The fastest path is quality feedback and expert coaching, again and again." },
  { title: "Coaching should be specific.", body: "Built by real preaching coaches, PreachingHub looks at structure, introduction, clarity, application, gospel, and more, so you know exactly what to work on." },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      <section className="pt-32 pb-16 sm:pb-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <Eyebrow>About PreachingHub</Eyebrow>
          <h1 className={`${H} text-[clamp(2.5rem,7vw,4.25rem)] leading-[1.05] text-slate-900 mb-6`}>
            Built for preachers, <Accent>by preachers.</Accent>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Most sermon software either writes the sermon for you or just helps you stay organized. Neither builds a better preacher. PreachingHub was built to do something different: coach you into the best preacher you can be.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-10`}>
            What we <Accent>believe.</Accent>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {BELIEFS.map(({ title, body }) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-7">
                <h3 className="font-[family-name:var(--font-inter)] font-extrabold tracking-[-0.03em] text-xl text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50 w-full max-w-sm mx-auto" style={{ aspectRatio: "4/5" }}>
            <Image src="/images/founder/founder-blazer.jpg" alt="Bryson Breakey preaching" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: INDIGO }}>The founder</p>
            <h2 className={`${H} text-3xl sm:text-4xl leading-[1.08] text-slate-900 mb-1`}>Bryson Breakey</h2>
            <p className="text-slate-500 mb-5">Founder, PreachingHub</p>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              Bryson is a pastor and preaching coach. He built PreachingHub because preachers deserve the same kind of honest, specific coaching that other crafts take for granted.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Questions? Email <a href="mailto:support@preachinghub.com" className="font-semibold hover:underline" style={{ color: INDIGO }}>support@preachinghub.com</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-4`}>
            See what coaching can do for <Accent>your preaching.</Accent>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">Try it free and get feedback on your next sermon.</p>
          <Cta />
        </div>
      </section>

      <Footer />
    </main>
  );
}
