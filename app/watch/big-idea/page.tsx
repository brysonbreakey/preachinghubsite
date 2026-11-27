import type { Metadata } from "next";
import Link from "next/link";
import { PHLogo } from "@/components/Logo";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

const TITLE = "Crafting a memorable Big Idea";
const YOUTUBE_ID = "LcTA2GMxYYI";
const ARTICLE_URL = "https://careynieuwhof.com/how-to-craft-a-killer-bottom-line-for-your-next-talk/";

const DISCOVER = [
  "Clarify your sermon by being able to summarize it in one sentence",
  "Craft a sticky main point that people can remember",
  "Use your big idea as a north star to guide your editing process",
];

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | PreachingHub` },
  description: "A short video on finding and sharpening your sermon's big idea.",
  alternates: { canonical: "/watch/big-idea" },
};

// A focused video page: no header or footer, just the logo back to the home page.
export default function Page() {
  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <header className="flex justify-center px-5 py-5">
        <Link href="/" aria-label="PreachingHub home">
          <PHLogo height={30} />
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-5 pt-2 pb-16 text-center sm:px-6">
        <h1 className="mb-4 text-3xl font-extrabold leading-[1.1] text-balance text-[#0f1530] sm:text-4xl">{TITLE}</h1>
        <div className="mx-auto mb-6 max-w-2xl text-left">
          <p className="mb-2 font-bold text-[#0f1530]">In this video, you&apos;ll discover how to…</p>
          <ul className="space-y-1.5 leading-snug text-slate-700">
            {DISCOVER.map((line) => (
              <li key={line} className="flex gap-2.5">
                <span aria-hidden="true" className="font-bold text-[#4F46E5]">✓</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0f1530] shadow-2xl shadow-slate-900/20">
          <YouTubeEmbed id={YOUTUBE_ID} title={TITLE} />
        </div>
        <a
          href={ARTICLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#4F46E5] px-7 py-4 font-bold text-white hover:bg-[#4338CA] sm:w-auto"
        >
          Referenced Article
        </a>
      </main>
    </div>
  );
}
