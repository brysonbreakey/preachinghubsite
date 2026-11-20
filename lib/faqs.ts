import { GUARANTEE_LONG, GUARANTEE_EMAIL } from "@/lib/guarantee";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  link?: { label: string; href: string };
};

export const FAQS: Faq[] = [
  {
    id: "no-write",
    question: "Will this write my sermon for me?",
    answer:
      "No. PreachingHub doesn't write your sermon, generate an outline, or hand you application points. You do the preaching work. The AI reads what you've already written or preached and coaches you on it.",
  },
  {
    id: "ai",
    question: "So how does AI show up here?",
    answer:
      "It analyzes the sermon you've already written or preached and turns it into coaching feedback, built by real preaching coaches. It's a coach looking at your work, not a ghostwriter producing it. The sermon stays yours, and you're still the preacher.",
  },
  {
    id: "application",
    question: "Will it give me illustrations or application points?",
    answer:
      "No. It can tell you your application stayed general, and it asks questions to help you think it through. The answers, and the content, come from you.",
  },
  {
    id: "whose",
    question: "Whose sermon is it?",
    answer:
      "Yours. We don't use your sermon content to write, generate, or draft sermon material for you or anyone else. Our AI coaches and evaluates content you've already written. It doesn't create sermon content.",
    link: { label: "Read our privacy policy", href: "/privacy" },
  },
  {
    id: "not-a-grade",
    question: "Is this a grade?",
    answer:
      "No. We don't give grades. You get what you did well, and practical ways to grow for your next preaching moment.",
  },
  {
    id: "report",
    question: "What's included in my report?",
    answer:
      "Content feedback across 7 categories, delivery feedback, a pacing analysis, volume analysis, and a full transcript.",
  },
  {
    id: "submit",
    question: "What can I submit for feedback?",
    answer:
      "A YouTube link, an audio or video file, or your notes pasted in as text. You can also record live in the app.",
  },
  {
    id: "private",
    question: "Is my sermon private?",
    answer: "Absolutely. We take data security very seriously.",
    link: { label: "Read our privacy policy", href: "/privacy" },
  },
  {
    id: "guarantee",
    question: "What if it doesn't help me grow?",
    answer: `${GUARANTEE_LONG} Just email ${GUARANTEE_EMAIL}.`,
  },
  {
    id: "trial",
    question: "What does the free trial include?",
    answer: "14 days of full access to everything in PreachingHub All-Access. A credit card is required to start, you pay $0 today, and you can cancel anytime.",
  },
  {
    id: "after-trial",
    question: "What happens after the trial?",
    answer:
      "Your subscription starts when the 14 days are up, at $49/month. If it isn't for you, cancel anytime from your account settings before then and you won't be charged.",
  },
  {
    id: "cancel",
    question: "Can I cancel anytime?",
    answer: "Yes, absolutely. You can cancel anytime from your account settings page.",
  },
];

export const HOME_FAQ_IDS = ["no-write", "ai", "whose", "not-a-grade", "submit", "guarantee"];
export const PRICING_FAQ_IDS = ["guarantee", "trial", "after-trial", "cancel", "no-write", "private"];
export const COACHING_FAQ_IDS = ["no-write", "ai", "application", "whose", "report", "submit", "private"];
