/* ═══════════════════════════════════════════════════════
   MoodStream — Emotion Detection Engine

   Two strategies:
   1. PRIMARY  : Groq LLM (llama-3.3-70b-versatile)
                 → Accurate, nuanced, returns confidence + reason
   2. FALLBACK : Keyword matching
                 → Offline, instant, less accurate
   ═══════════════════════════════════════════════════════ */

// ── Groq config ──────────────────────────────────────────
const GROQ_MODEL    = 'llama-3.3-70b-versatile';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const VALID_EMOTIONS = ['happy','sad','anxious','excited','calm','angry','romantic','bored'];

// ── System prompt for the LLM ────────────────────────────
const SYSTEM_PROMPT = `You are an expert emotion detection AI for MoodStream, a personalised streaming platform. Your only job is to analyse a user's mood description and classify it into exactly one emotion category.

The 8 categories are: happy, sad, anxious, excited, calm, angry, romantic, bored.

Guidelines:
- "happy"    → joy, elation, gratitude, contentment with positive energy
- "sad"      → grief, loneliness, heartbreak, nostalgia, feeling low
- "anxious"  → stress, worry, overwhelm, nervousness, panic
- "excited"  → hype, motivation, anticipation, adrenaline, feeling pumped
- "calm"     → peace, serenity, chill, relaxation, quietness
- "angry"    → frustration, irritation, rage, resentment, being fed up
- "romantic" → love, longing, tenderness, being in love, missing someone romantically
- "bored"    → restlessness, numbness, indifference, needing stimulation

You MUST respond with ONLY a valid JSON object. No markdown, no extra text outside the JSON.

Response format:
{
  "emotion": "<one of the 8 categories>",
  "confidence": <integer 0–100>,
  "reason": "<one warm sentence directed at the user explaining why>",
  "secondary": "<optional second emotion if strongly present, or null>"
}`;

/**
 * detectEmotionWithGroq
 * Sends the user's mood data to Groq and returns a structured result.
 *
 * @param {string} apiKey  - Groq API key (gsk_...)
 * @param {string} text    - User's mood description
 * @param {number} energy  - 1–5 energy slider value
 * @param {string} intent  - 'escape' | 'relate' | 'energize' | 'relax'
 * @returns {Promise<{ emotion, confidence, reason, secondary }>}
 */
async function detectEmotionWithGroq(apiKey, text, energy, intent) {
  const energyLabel = ['','very drained','a bit low on energy','moderate energy','fairly energetic','very wired and energetic'][energy];
  const intentLabel = { escape:'escape reality', relate:'feel understood', energize:'get motivated', relax:'slow down and rest' }[intent] || intent;

  const userMessage =
    `How I'm feeling: "${text}"\n` +
    `My energy level: ${energyLabel} (${energy}/5)\n` +
    `What I want from content right now: ${intentLabel}\n\n` +
    `Please detect my emotion.`;

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage   },
      ],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq returned HTTP ${response.status}`);
  }

  const data   = await response.json();
  const raw    = data.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);

  if (!VALID_EMOTIONS.includes(parsed.emotion)) {
    throw new Error(`Unexpected emotion value from LLM: "${parsed.emotion}"`);
  }

  return {
    emotion:    parsed.emotion,
    confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 75)),
    reason:     parsed.reason     || 'Your mood has been detected.',
    secondary:  VALID_EMOTIONS.includes(parsed.secondary) ? parsed.secondary : null,
  };
}


// ── Keyword fallback ─────────────────────────────────────
// Used when: no API key, API error, or user skips setup.

const EMOTION_KEYWORDS = {
  happy:    ['happy','great','good','wonderful','joyful','amazing','fantastic','cheerful','elated','thrilled','glad','awesome','blessed','grateful','ecstatic'],
  sad:      ['sad','down','depressed','unhappy','crying','cry','lonely','miss','hurt','heartbroken','grief','lost','empty','hopeless','melancholy','blue','miserable'],
  anxious:  ['anxious','stressed','worried','nervous','overwhelmed','panic','anxiety','fear','scared','tense','pressure','burden','overthinking','restless'],
  excited:  ['excited','pumped','thrilled','hyped','energized','ready','motivated','fired','alive','electric','stoked','adrenaline'],
  calm:     ['calm','peaceful','relaxed','quiet','serene','chill','tranquil','content','still','zen','mellow','easy','gentle','soft','cozy'],
  angry:    ['angry','mad','frustrated','annoyed','irritated','furious','rage','upset','bitter','hate','resentful'],
  romantic: ['romantic','love','crush','date','miss','longing','affection','heart','soulmate','feelings','warm','tender','intimate'],
  bored:    ['bored','nothing','meh','blah','listless','uninterested','monotonous','dull','flat','numb','indifferent'],
};

/**
 * detectEmotionFallback
 * Simple keyword scoring, adjusted by energy + intent signals.
 * Returns the same shape as detectEmotionWithGroq so callers
 * don't need separate handling.
 *
 * @param {string} text
 * @param {number} energy  1–5
 * @param {string} intent
 * @returns {{ emotion, confidence, reason, secondary }}
 */
function detectEmotionFallback(text, energy, intent) {
  const lower  = text.toLowerCase();
  const scores = {};

  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    scores[emotion] = keywords.filter(k => lower.includes(k)).length;
  }

  // Bias from energy level
  if (energy >= 4) { scores.excited = (scores.excited || 0) + 1.5; scores.happy = (scores.happy || 0) + 0.5; }
  if (energy <= 2) { scores.calm    = (scores.calm    || 0) + 1.0; scores.sad   = (scores.sad   || 0) + 0.5; }

  // Bias from intent
  if (intent === 'energize') scores.excited = (scores.excited || 0) + 1;
  if (intent === 'relax')    scores.calm    = (scores.calm    || 0) + 1;
  if (intent === 'relate')   scores.sad     = (scores.sad     || 0) + 0.5;
  if (intent === 'escape')   scores.anxious = (scores.anxious || 0) + 0.5;

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topEmotion  = sorted[0][1] > 0 ? sorted[0][0] : 'calm';
  const secondScore = sorted[1]?.[1] > 0 ? sorted[1][0] : null;

  return {
    emotion:    topEmotion,
    confidence: 60,
    reason:     'Detected using offline keyword analysis (AI not connected).',
    secondary:  secondScore,
  };
}
