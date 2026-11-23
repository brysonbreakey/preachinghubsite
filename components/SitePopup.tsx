"use client";

import { useEffect, useState } from "react";
import EvaluationPopup from "@/components/EvaluationPopup";
import BlackFridayPopup from "@/components/BlackFridayPopup";
import { isBlackFridayNow } from "@/lib/blackFriday";

// One site-wide popup at a time. During the Black Friday window it replaces the free sermon
// evaluation popup; before and after, the evaluation popup is back.
export default function SitePopup() {
  const [bf, setBf] = useState<boolean | null>(null);
  useEffect(() => setBf(isBlackFridayNow()), []);
  if (bf === null) return null;
  return bf ? <BlackFridayPopup /> : <EvaluationPopup />;
}
