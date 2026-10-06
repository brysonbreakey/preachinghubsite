// Sample report shown in the /try "See a real sermon, fully evaluated" teaser + modal.
// Mirrors the app's first-run welcome screen (app.preachinghub.com/onboarding) — same
// real report for "Our Worry for His Peace". Keep the two in sync if either changes.

export type EvalCategory = { key: string; label: string; strength: string; growth_area?: string }
export type EvalResult = {
  overall_summary: string
  categories: EvalCategory[]
  biggest_wins?: string[]
  top_coaching_priority?: string
  questions_worth_considering?: string[]
}
export type PacingInterval = { time_marker: string; wpm: number; flag: 'rushed' | 'slow' | null }
export type PacingResult = { average_wpm: number; intervals: PacingInterval[] }

export const SAMPLE_TITLE = 'Our Worry for His Peace'

export const SAMPLE_REPORT: EvalResult = {
  overall_summary:
    "This sermon's central pivot — reframing peace from a circumstantial absence of difficulty to a personal presence in difficulty — is the kind of distinction that can genuinely reorient how someone moves through their week, and you gave it time to breathe rather than rushing past it. The AirTag illustration and the 'God doesn't bring the Christian into a life of peace' line are doing the sermon's best work together. The single sharpest growth edge is sequencing: your richest theological content (shalom, the possessive 'my peace,' peace-as-person) arrived after your emotional resolution, which meant the conclusion had to do work that the body of the sermon should have already done. Trust your theological instincts earlier in the structure.",
  categories: [
    {
      key: 'textual_faithfulness',
      label: 'Textual Faithfulness',
      strength:
        "The possessive observation — 'he doesn't give peace, he gives his peace' — is precisely the kind of exegetical move this text rewards, and you resist over-explaining it, letting the logic stand: peace can only be given by someone who possesses it, and Jesus possesses it personally. Connecting 'peace' to the Advocate passage just before it, reading Christ's peace as continuous with the Holy Spirit's presence, is theologically sound and textually honest — it treats verse 27 as a conclusion to verse 26 rather than a standalone sentiment.",
    },
    {
      key: 'big_idea_clarity',
      label: 'Main Idea Clarity',
      strength:
        "The controlling idea — 'God doesn't always bring the Christian into a life of peace, but he always brings peace into the life of a Christian' — is your best line and it functions as a genuine Main Idea because it says something about God's character, not just human behavior. It is memorable, it is antithetical, and it resolves the tension you opened with about why Jesus promises peace in the least peaceful moment of the Gospels.",
      growth_area:
        'That line arrives roughly two-thirds through the sermon, and once it lands, the next several minutes re-establish rather than deepen it. If that sentence is your controlling idea, everything after it should be unfolding its implications rather than re-proving its premise — trust the line to hold weight and spend the back third showing what it produces in a life, not restating why it is true.',
    },
    {
      key: 'introduction_strength',
      label: 'Introduction',
      strength:
        "The statistics open with enough specificity — 138 minutes, Gen Z anxiety rates, AI-as-counselor — that they feel researched rather than generic, and the pivot from 'we all worry' to naming the real things (kids, rent, scholarships) moves the room from data to felt reality quickly. The Google/Claude line gets a laugh and then earns it theologically, which is a harder combination to pull off than it sounds.",
    },
    {
      key: 'movement_structure',
      label: 'Movement & Structure',
      strength:
        "The sermon moves with genuine momentum through its central pivot — from world's peace as absence of hard things to Christ's peace as presence of God — and that pivot lands clearly because you held the problem open long enough before resolving it. The 1 Corinthians reference used to reset the listener's expectation ('God of peace, not God of clarity') is a smart structural move that reorients the room without announcing itself as a structural move.",
      growth_area:
        "The shalom section near the end is the most exegetically rich moment in the sermon, but it arrives after the emotional resolution has already occurred — you've essentially concluded twice, and shalom deserved to be the theological anchor that the application flowed from, not a late addition. Try building the world's-peace-vs.-Christ's-peace distinction on the shalom foundation earlier, so the climax of the sermon and the richest textual insight are the same moment.",
    },
    {
      key: 'illustration_clarity',
      label: 'Illustration Clarity',
      strength:
        "The AirTag story is doing heavy lifting and doing it well — it functions diagnostically rather than decoratively, mirroring the sermon's central argument that the peace we are searching for was already present and available, and the punchline ('did the AirTag not work?') lands the theological point without you having to say it directly. The fail-video quirk in the introduction is a rare moment of genuine self-disclosure that creates warmth without making you the point — it opens the door to the 'we all have a way of dealing with worry' observation without dwelling on your cleverness.",
    },
    {
      key: 'application_design',
      label: 'Application',
      strength:
        "The reframe from 'pray for clarity' to 'pray for trust' is the sharpest application beat in the sermon, and it earns its place because it arrives after the diagnostic work is done — you've already shown why clarity-seeking is the wrong map before you offer the right one. The Moses and Peter examples function as proof-of-pattern rather than inspiration, which keeps the application grounded in Scripture rather than floating as advice.",
      growth_area:
        "The closing altar-call sequence — 'I trust you with my finances, my anxiety, my diagnosis, my marriage' — is the one moment where application slides into a list rather than flowing from the theological move you just made. Consider landing that moment with one specific, textured image of what open-handed trust actually looks like Monday morning, rather than cataloguing every category of worry.",
    },
    {
      key: 'conclusion_strength',
      label: 'Conclusion',
      strength:
        "The dashboard-as-chapel, cubicle-as-cathedral sequence is genuinely imaginative and lands the 'peace is in you, not out there' idea with felt force — it translates a theological claim into sensory, daily geography in a way listeners can carry out the door. The AirTag callback works cleanly as a closing image because you seeded it early enough that the return feels earned rather than mechanical.",
      growth_area:
        "The conclusion introduces the Rooted campaign at the exact moment the theological resolution has just landed, and the shift from 'shalom as wholeness' into 'so sign up on your phone' compresses what should be two separate movements into one. Let the resolution breathe for a beat before pivoting to the programmatic response, or the campaign risks feeling like it is the point rather than the means.",
    },
  ],
  biggest_wins: [
    "The 'God doesn't always bring the Christian into a life of peace, but he always brings peace into the life of a Christian' antithesis is the clearest and most repeatable articulation of your Main Idea — a listener can carry that sentence home.",
    "The AirTag illustration lands with diagnostic precision because the setup is mundane enough to be universal, and the application ('the means of finding it was on your person the whole time') requires no explanation — the room arrives at the point themselves.",
    "Connecting the disciples' real, contextually grounded anxiety — Jesus is about to go to the cross and they have no playbook — to the modern listener's clarity-seeking prayer life is a genuine textual bridge that avoids importing a generic worry sermon onto a passage that is actually about something more specific.",
  ],
  top_coaching_priority:
    "Practice sequencing your richest exegetical insight as the structural load-bearer of the sermon, not a late-arriving supporting detail — before you finalize any outline, identify the single deepest thing the text gives you and ask whether the sermon's central movement is built on top of it or orbiting around it from a distance.",
  questions_worth_considering: [
    "If shalom — wholeness, flourishing, not merely calm — is what Jesus is actually offering, how does that change the shape of the sermon's application from 'receive peace' to something more specific about what a flourishing life looks like in an anxious week?",
    "The sermon diagnoses why we seek clarity instead of peace, but it does not sit very long in why receiving peace feels genuinely difficult or even threatening to us — what is it about trust that we resist, and does the text itself give you language for that resistance?",
  ],
}

// Real per-minute words-per-minute for the sample sermon (0:00–30:00, avg 160),
// flagged with the same ±20% rule computePacing() uses for live reports.
const SAMPLE_WPM = [
  147, 156, 159, 187, 173, 177, 170, 168, 203, 161, 177, 138, 150, 143, 167, 230,
  146, 141, 127, 192, 158, 133, 150, 191, 118, 126, 159, 163, 142, 210, 109,
]
const SAMPLE_AVG_WPM = 160

export const SAMPLE_PACING: PacingResult = {
  average_wpm: SAMPLE_AVG_WPM,
  intervals: SAMPLE_WPM.map((wpm, i) => ({
    time_marker: `${i}:00`,
    wpm,
    flag: wpm > SAMPLE_AVG_WPM * 1.2 ? 'rushed' : wpm < SAMPLE_AVG_WPM * 0.8 ? 'slow' : null,
  })),
}
