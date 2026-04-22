/* ═══════════════════════════════════════════════════════
   MoodStream — Main App Component

   Screen flow:
     apikey → home → form (3 steps) → analyzing → results

   State owned here:
   • apiKey       – Groq key (in-memory only)
   • step         – current screen
   • formData     – { text, words[], energy, intent }
   • result       – { emotion, confidence, reason, secondary }
   • analyzeState – progress %, status message
   • UI flags     – showSettings, activeTab, usedFallback, apiError
   ═══════════════════════════════════════════════════════ */

const { useState } = React;

function App() {

  // ── State ──────────────────────────────────────────────
  const [step,          setStep]          = useState('apikey');
  const [apiKey,        setApiKey]        = useState('');
  const [showSettings,  setShowSettings]  = useState(false);
  const [formStep,      setFormStep]      = useState(1);
  const [formData,      setFormData]      = useState({ text:'', words:[], energy:3, intent:'' });
  const [result,        setResult]        = useState(null);
  const [activeTab,     setActiveTab]     = useState('movies');
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [analyzeMsg,    setAnalyzeMsg]    = useState('');
  const [apiError,      setApiError]      = useState(null);
  const [usedFallback,  setUsedFallback]  = useState(false);

  // Convenience shorthand for the current emotion's config
  const ec = result ? EMOTION_CONFIG[result.emotion] : null;

  // ── Form helpers ───────────────────────────────────────
  function handleWordToggle(word) {
    setFormData(fd => {
      const already = fd.words.includes(word);
      const words   = already ? fd.words.filter(w => w !== word) : [...fd.words, word];
      const text    = fd.text.includes(word) ? fd.text : fd.text + (fd.text ? ', ' : '') + word;
      return { ...fd, words, text };
    });
  }

  // ── Analyze ─────────────────────────────────────────────
  async function handleAnalyze() {
    setStep('analyzing');
    setAnalyzeProgress(0);
    setApiError(null);
    setUsedFallback(false);

    const MESSAGES = [
      'Reading your words…',
      'Understanding your feeling…',
      'Detecting emotional patterns…',
      'Matching your mood…',
      'Curating your content…',
    ];
    let msgIdx = 0;
    setAnalyzeMsg(MESSAGES[0]);

    // Animate progress bar while waiting for the LLM
    const timer = setInterval(() => {
      setAnalyzeProgress(p => {
        const next    = p + Math.random() * 12 + 3;
        const capped  = Math.min(next, 85);
        const newIdx  = Math.min(Math.floor(capped / 20), MESSAGES.length - 1);
        if (newIdx !== msgIdx) { msgIdx = newIdx; setAnalyzeMsg(MESSAGES[newIdx]); }
        if (capped >= 85) clearInterval(timer);
        return capped;
      });
    }, 180);

    let detected;
    const isDemoMode = !apiKey || apiKey === 'demo';

    try {
      if (isDemoMode) throw new Error('No API key — using offline mode.');
      detected = await detectEmotionWithGroq(apiKey, formData.text, formData.energy, formData.intent);
    } catch (err) {
      clearInterval(timer);
      setUsedFallback(true);
      setApiError(err.message);
      detected = detectEmotionFallback(formData.text, formData.energy, formData.intent);
    }

    setAnalyzeMsg('All set!');
    setAnalyzeProgress(100);
    setResult(detected);
    setTimeout(() => { setStep('results'); setActiveTab('movies'); }, 500);
  }

  // ── Reset ──────────────────────────────────────────────
  function reset() {
    setStep('home');
    setFormStep(1);
    setFormData({ text:'', words:[], energy:3, intent:'' });
    setResult(null);
    setApiError(null);
    setUsedFallback(false);
  }

  // ── Guards ─────────────────────────────────────────────
  const canAdvance1 = formData.text.trim().length >= 3;
  const canAnalyze  = formData.intent !== '';

  // ══════════════════════════════════════════════════════
  // SCREEN: API KEY SETUP
  // ══════════════════════════════════════════════════════
  if (step === 'apikey') return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative', overflow:'hidden' }}>
      <div className="noise-bg" />
      <div className="orb" style={{ width:500, height:500, top:-100, left:-100, background:'rgba(108,99,255,0.12)' }} />
      <div className="orb" style={{ width:400, height:400, bottom:-80, right:-80, background:'rgba(168,85,247,0.10)' }} />

      <div className="card fade-in" style={{ width:'100%', maxWidth:460, padding:40, position:'relative', zIndex:1 }}>

        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:56, marginBottom:12, animation:'float 3s ease-in-out infinite' }}>🎭</div>
          <h1 style={{ fontSize:26, fontWeight:900, marginBottom:8 }}>
            Welcome to{' '}
            <span style={{ background:'linear-gradient(135deg,#6c63ff,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              MoodStream
            </span>
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:14, lineHeight:1.6 }}>
            Connect your Groq API key to enable AI-powered emotion detection.
            Your key never leaves your browser.
          </p>
        </div>

        {/* How-to box */}
        <div style={{ background:'rgba(108,99,255,0.08)', border:'1px solid rgba(108,99,255,0.2)', borderRadius:12, padding:'14px 18px', marginBottom:24, display:'flex', alignItems:'flex-start', gap:12 }}>
          <span style={{ fontSize:20, marginTop:1 }}>🔑</span>
          <div>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>How to get a free Groq key</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.7 }}>
              1. Go to <span style={{ color:'#a78bfa' }}>console.groq.com</span><br/>
              2. Sign up (free) → API Keys → Create new key<br/>
              3. Paste it below — the free tier gives fast LLM calls
            </div>
          </div>
        </div>

        <label style={{ fontSize:13, color:'var(--text-muted)', display:'block', marginBottom:8 }}>
          Groq API Key
        </label>
        <div className="key-input-wrap" style={{ marginBottom:20 }}>
          <input
            className="form-input"
            type="password"
            placeholder="gsk_..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && apiKey.trim() && setStep('home')}
          />
        </div>

        <button
          className="btn-primary"
          style={{ width:'100%', fontSize:16 }}
          disabled={!apiKey.trim()}
          onClick={() => setStep('home')}
        >
          Start MoodStream →
        </button>

        <button
          style={{ background:'none', border:'none', color:'var(--text-muted)', fontSize:13, marginTop:14, cursor:'pointer', width:'100%', fontFamily:'Inter,sans-serif', textDecoration:'underline' }}
          onClick={() => { setApiKey('demo'); setStep('home'); }}
        >
          Skip for now (use offline keyword detection)
        </button>

      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // SCREEN: HOME
  // ══════════════════════════════════════════════════════
  if (step === 'home') return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative', overflow:'hidden' }}>
      <div className="noise-bg" />
      <div className="orb" style={{ width:500, height:500, top:-100, left:-100, background:'rgba(108,99,255,0.12)' }} />
      <div className="orb" style={{ width:400, height:400, bottom:-80, right:-80, background:'rgba(168,85,247,0.10)' }} />

      {/* Top bar */}
      <div style={{ position:'fixed', top:0, left:0, right:0, padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:10, background:'linear-gradient(to bottom,rgba(10,10,15,0.9),transparent)', backdropFilter:'blur(8px)' }}>
        <span style={{ fontWeight:900, fontSize:18, background:'linear-gradient(135deg,#6c63ff,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          MoodStream
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {apiKey && apiKey !== 'demo'
            ? <span style={{ fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:6 }}><span className="success-dot" /> AI Active</span>
            : <span style={{ fontSize:12, color:'var(--text-muted)' }}>Offline mode</span>}
          <button className="btn-ghost" style={{ padding:'7px 12px', fontSize:13 }} onClick={() => setShowSettings(true)}>
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div className="fade-in" style={{ textAlign:'center', maxWidth:560, position:'relative', zIndex:1 }}>
        <div style={{ fontSize:72, marginBottom:16, animation:'float 3s ease-in-out infinite' }}>🎭</div>
        <h1 style={{ fontSize:'clamp(30px,6vw,50px)', fontWeight:900, lineHeight:1.1, marginBottom:16 }}>
          Watch{' '}
          <span style={{ background:'linear-gradient(135deg,#6c63ff,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            how you feel
          </span>
        </h1>
        <p style={{ fontSize:16, color:'var(--text-muted)', lineHeight:1.7, marginBottom:16 }}>
          Tell us how you're feeling and <strong style={{ color:'var(--text)' }}>MoodStream</strong> uses AI to curate the perfect movies, music, and videos for your mood.
        </p>
        <div style={{ marginBottom:40 }}>
          <span className="llm-badge">✦ Powered by Groq · {GROQ_MODEL}</span>
        </div>

        {/* Emotion pills */}
        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:48 }}>
          {Object.entries(EMOTION_CONFIG).map(([key, cfg]) => (
            <span key={key} style={{ padding:'6px 14px', borderRadius:999, background:cfg.bg, color:cfg.color, fontSize:13, fontWeight:600, border:`1px solid ${cfg.color}33` }}>
              {cfg.emoji} {cfg.label}
            </span>
          ))}
        </div>

        <button className="btn-primary" style={{ fontSize:17, padding:'16px 40px' }} onClick={() => setStep('form')}>
          Discover my mood →
        </button>
        <p style={{ marginTop:16, fontSize:13, color:'var(--text-muted)' }}>
          🔒 Private · No account needed · ~30 seconds
        </p>
      </div>

      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          onSave={k => setApiKey(k || 'demo')}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════
  // SCREEN: MOOD FORM  (3-step wizard)
  // ══════════════════════════════════════════════════════
  if (step === 'form') return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative' }}>
      <div className="noise-bg" />
      <div className="orb" style={{ width:400, height:400, top:-100, right:-100, background:'rgba(108,99,255,0.10)' }} />

      <div className="fade-in" style={{ width:'100%', maxWidth:520, position:'relative', zIndex:1 }}>

        {/* Progress header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
          <button className="btn-ghost" style={{ padding:'8px 12px', fontSize:18 }}
            onClick={() => formStep === 1 ? reset() : setFormStep(f => f - 1)}>
            ←
          </button>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:13, color:'var(--text-muted)' }}>Step {formStep} of 3</span>
              <span style={{ fontSize:13, color:'var(--text-muted)' }}>{Math.round((formStep / 3) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width:`${(formStep / 3) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* ── Step 1: Free-text + word chips ── */}
        {formStep === 1 && (
          <div className="card fade-in" style={{ padding:32 }}>
            <div style={{ fontSize:40, marginBottom:12, textAlign:'center' }}>💭</div>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8, textAlign:'center' }}>
              How are you feeling right now?
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:14, textAlign:'center', marginBottom:24 }}>
              Write anything — a word, a sentence, or just a vibe. The AI will understand.
            </p>

            <textarea
              className="form-input"
              rows={4}
              placeholder="e.g. I'm feeling a bit low today, miss my friends and just want to relax..."
              value={formData.text}
              onChange={e => setFormData(fd => ({ ...fd, text: e.target.value }))}
            />

            <div style={{ marginTop:20 }}>
              <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:10 }}>
                Or pick a word that fits:
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {MOOD_WORDS.map(w => (
                  <button
                    key={w}
                    className={`word-chip ${formData.words.includes(w) ? 'selected' : ''}`}
                    onClick={() => handleWordToggle(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width:'100%', marginTop:24 }}
              disabled={!canAdvance1}
              onClick={() => setFormStep(2)}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── Step 2: Energy slider ── */}
        {formStep === 2 && (
          <div className="card fade-in" style={{ padding:32 }}>
            <div style={{ fontSize:40, marginBottom:12, textAlign:'center' }}>⚡</div>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8, textAlign:'center' }}>
              What's your energy level?
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:14, textAlign:'center', marginBottom:32 }}>
              This helps the AI understand your vibe more accurately.
            </p>

            <div style={{ padding:'0 8px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:13, color:'var(--text-muted)' }}>
                <span>😴 Drained</span>
                <span>😐 Neutral</span>
                <span>⚡ Wired</span>
              </div>
              <input
                type="range" min={1} max={5} step={1}
                value={formData.energy}
                onChange={e => setFormData(fd => ({ ...fd, energy: Number(e.target.value) }))}
              />
              <div style={{ textAlign:'center', marginTop:16 }}>
                <span style={{ fontSize:36 }}>
                  {['','😴','😓','😐','😊','⚡'][formData.energy]}
                </span>
                <div style={{ fontSize:14, color:'var(--text-muted)', marginTop:4 }}>
                  {['','Very Low','Low','Moderate','High','Very High'][formData.energy]}
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:12, marginTop:32 }}>
              <button className="btn-ghost" style={{ flex:1 }} onClick={() => setFormStep(1)}>← Back</button>
              <button className="btn-primary" style={{ flex:2 }} onClick={() => setFormStep(3)}>Continue →</button>
            </div>
          </div>
        )}

        {/* ── Step 3: Intent selector ── */}
        {formStep === 3 && (
          <div className="card fade-in" style={{ padding:32 }}>
            <div style={{ fontSize:40, marginBottom:12, textAlign:'center' }}>🎯</div>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8, textAlign:'center' }}>
              What do you need right now?
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:14, textAlign:'center', marginBottom:24 }}>
              This fine-tunes the AI's emotion analysis.
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {INTENTS.map(intent => (
                <button
                  key={intent.id}
                  className={`option-btn ${formData.intent === intent.id ? 'selected' : ''}`}
                  onClick={() => setFormData(fd => ({ ...fd, intent: intent.id }))}
                >
                  <div style={{ fontWeight:600, fontSize:15 }}>{intent.label}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{intent.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button className="btn-ghost" style={{ flex:1 }} onClick={() => setFormStep(2)}>← Back</button>
              <button
                className="btn-primary"
                style={{ flex:2 }}
                disabled={!canAnalyze}
                onClick={handleAnalyze}
              >
                ✨ Analyse with AI
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // SCREEN: ANALYZING
  // ══════════════════════════════════════════════════════
  if (step === 'analyzing') return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative' }}>
      <div className="noise-bg" />

      <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>

        {/* Pulsing brain icon */}
        <div style={{ position:'relative', width:120, height:120, margin:'0 auto 32px' }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'linear-gradient(135deg,#6c63ff,#a855f7)', animation:'ripple 1.5s ease-out infinite' }} />
          <div style={{ position:'absolute', inset:10, borderRadius:'50%', background:'var(--surface2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>
            🧠
          </div>
        </div>

        <h2 style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>Reading your vibe</h2>
        <p style={{ color:'var(--text-muted)', fontSize:15, marginBottom:6 }}>
          {analyzeMsg}
          <span className="dot" style={{ background:'#6c63ff' }} />
          <span className="dot" style={{ background:'#8b5cf6' }} />
          <span className="dot" style={{ background:'#a855f7' }} />
        </p>
        <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:28 }}>
          Asking <span style={{ color:'#a78bfa' }}>Groq · {GROQ_MODEL}</span>
        </p>

        {/* Progress bar */}
        <div style={{ width:280, margin:'0 auto' }}>
          <div className="progress-bar" style={{ height:6 }}>
            <div className="progress-fill" style={{ width:`${analyzeProgress}%` }} />
          </div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:8, textAlign:'right' }}>
            {Math.round(analyzeProgress)}%
          </div>
        </div>

      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // SCREEN: RESULTS
  // ══════════════════════════════════════════════════════
  if (step === 'results' && ec && result) {
    const data = CONTENT[result.emotion];

    return (
      <div style={{ minHeight:'100vh', position:'relative' }}>
        <div className="noise-bg" />
        <div className="orb" style={{ width:500, height:500, top:-80,  left:-80,  background:ec.orb1 }} />
        <div className="orb" style={{ width:400, height:400, bottom:0, right:-80, background:ec.orb2 }} />

        <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 20px', position:'relative', zIndex:1 }}>

          {/* Top bar */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40 }}>
            <span style={{ fontSize:20, fontWeight:900, background:'linear-gradient(135deg,#6c63ff,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              MoodStream
            </span>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-ghost" style={{ padding:'7px 12px', fontSize:13 }} onClick={() => setShowSettings(true)}>⚙️</button>
              <button className="btn-ghost" onClick={reset}>↩ New mood</button>
            </div>
          </div>

          {/* API error / fallback banner */}
          {usedFallback && apiError && (
            <div className="error-banner fade-in" style={{ marginBottom:32 }}>
              <span>⚠️</span>
              <div>
                <strong>Groq API issue:</strong> {apiError}<br/>
                <span style={{ opacity:0.8 }}>Using offline keyword detection. Results may be less precise.</span>
              </div>
            </div>
          )}

          {/* Emotion headline */}
          <div className="fade-in" style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:80, marginBottom:12, animation:'float 3s ease-in-out infinite' }}>
              {ec.emoji}
            </div>
            <div style={{ marginBottom:10, display:'flex', justifyContent:'center', gap:8, flexWrap:'wrap' }}>
              <span style={{ padding:'6px 16px', borderRadius:999, background:ec.bg, color:ec.color, border:`1px solid ${ec.color}44`, fontWeight:700, fontSize:14 }}>
                ✦ {ec.label}
              </span>
              {result.secondary && EMOTION_CONFIG[result.secondary] && (
                <span style={{ padding:'6px 16px', borderRadius:999, background:'rgba(255,255,255,0.05)', color:'var(--text-muted)', border:'1px solid var(--border)', fontSize:13 }}>
                  also {EMOTION_CONFIG[result.secondary].emoji} {EMOTION_CONFIG[result.secondary].label}
                </span>
              )}
              {!usedFallback && <span className="llm-badge">✦ AI Detected</span>}
            </div>
            <h1 style={{ fontSize:'clamp(24px,5vw,36px)', fontWeight:900, margin:'14px 0 8px' }}>
              You're feeling{' '}
              <span style={{ background:ec.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {ec.label}
              </span>
            </h1>
          </div>

          {/* AI reasoning card */}
          {result.reason && (
            <div className="card fade-in" style={{ padding:'20px 24px', marginBottom:32, display:'flex', gap:16, alignItems:'flex-start', borderColor:ec.color + '33' }}>
              <div style={{ fontSize:28, marginTop:2 }}>🤖</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:ec.color }}>Why the AI thinks this</div>
                  {!usedFallback && (
                    <span className="llm-badge" style={{ fontSize:10 }}>Groq · {GROQ_MODEL}</span>
                  )}
                </div>
                <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.6, marginBottom:14 }}>
                  "{result.reason}"
                </p>
                <ConfidenceBar value={result.confidence} color={ec.color} />
              </div>
            </div>
          )}

          {/* Content tabs */}
          <div style={{ display:'flex', gap:6, background:'var(--surface)', padding:6, borderRadius:14, marginBottom:36, width:'fit-content', margin:'0 auto 36px' }}>
            {[
              { id:'movies',  label:'🎬 Movies'  },
              { id:'music',   label:'🎵 Music'   },
              { id:'youtube', label:'📺 YouTube' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content grid */}
          <div className="fade-in" key={activeTab}>
            {activeTab === 'movies'  && <ContentSection title="Movies for you"        icon="🎬" items={data.movies}  type="movies"  />}
            {activeTab === 'music'   && <ContentSection title="Music for your mood"   icon="🎵" items={data.music}   type="music"   />}
            {activeTab === 'youtube' && <ContentSection title="Videos picked for you" icon="📺" items={data.youtube} type="youtube" />}
          </div>

          {/* Mood summary footer card */}
          <div className="card" style={{ padding:24, marginTop:40, display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:4 }}>Your mood summary</div>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:10 }}>
                {formData.text.slice(0, 90)}{formData.text.length > 90 ? '…' : ''}
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span style={{ fontSize:12, color:'var(--text-muted)', background:'var(--surface2)', padding:'3px 9px', borderRadius:6 }}>
                  Energy: {['','Very Low','Low','Moderate','High','Very High'][formData.energy]}
                </span>
                <span style={{ fontSize:12, color:'var(--text-muted)', background:'var(--surface2)', padding:'3px 9px', borderRadius:6 }}>
                  Seeking: {INTENTS.find(i => i.id === formData.intent)?.label}
                </span>
              </div>
            </div>
            <button className="btn-ghost" onClick={reset}>Try a different mood →</button>
          </div>

          <p style={{ textAlign:'center', fontSize:12, color:'var(--text-muted)', marginTop:32, marginBottom:16 }}>
            MoodStream · Emotion detection by Groq · Your moods are never stored
          </p>

        </div>

        {showSettings && (
          <SettingsModal
            apiKey={apiKey}
            onSave={k => setApiKey(k || 'demo')}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    );
  }

  return null;
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
