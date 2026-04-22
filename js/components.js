/* ═══════════════════════════════════════════════════════
   MoodStream — Reusable React Components

   Exports (used in app.js):
   • StarRating       – star display for movie ratings
   • ContentCard      – single movie / music / youtube card
   • ContentSection   – labelled row of ContentCards
   • ConfidenceBar    – animated LLM confidence bar
   • SettingsModal    – Groq API key settings overlay
   ═══════════════════════════════════════════════════════ */

const { useState, useEffect } = React;


// ── StarRating ───────────────────────────────────────────
/**
 * Renders a 5-star row + numeric score from a /10 rating.
 * @param {{ rating: number }} props
 */
function StarRating({ rating }) {
  const full = Math.floor(rating / 2);
  const half = rating % 2 >= 1;
  return (
    <span>
      {[...Array(5)].map((_, i) => (
        <span key={i} className="star">
          {i < full ? '★' : (i === full && half ? '⯨' : '☆')}
        </span>
      ))}
      <span style={{ color:'var(--text-muted)', fontSize:11, marginLeft:4 }}>
        {rating}/10
      </span>
    </span>
  );
}


// ── ContentCard ──────────────────────────────────────────
/**
 * A single recommendation card.
 * @param {{ item: object, type: 'movies'|'music'|'youtube' }} props
 */
function ContentCard({ item, type }) {
  return (
    <div className="content-card" style={{ minWidth:220, maxWidth:240 }}>
      {/* Thumbnail */}
      <div style={{
        height:110, display:'flex', alignItems:'center', justifyContent:'center',
        background:`linear-gradient(135deg,${item.color}22,${item.color}44)`,
        fontSize:48, position:'relative',
      }}>
        <span style={{ animation:'float 3s ease-in-out infinite' }}>{item.img}</span>
        <span className="badge" style={{
          position:'absolute', top:8, right:8,
          background: item.color + '33',
          color:       item.color,
          border:     `1px solid ${item.color}55`,
        }}>
          {item.tag}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding:'14px 16px' }}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:4, lineHeight:1.3 }}>
          {item.title}
        </div>

        {/* Meta row — varies by type */}
        {type === 'movies' && (
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <span style={{ fontSize:11, color:'var(--text-muted)', background:'var(--surface2)', padding:'2px 7px', borderRadius:5 }}>
              {item.genre}
            </span>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>{item.year}</span>
          </div>
        )}
        {type === 'music' && (
          <div style={{ fontSize:12, color:item.color, fontWeight:600, marginBottom:6 }}>
            {item.artist} · {item.genre}
          </div>
        )}
        {type === 'youtube' && (
          <div style={{ fontSize:12, color:item.color, fontWeight:600, marginBottom:6 }}>
            📺 {item.channel}
          </div>
        )}

        {type === 'movies' && <StarRating rating={item.rating} />}

        <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:6, lineHeight:1.5 }}>
          {item.desc}
        </p>

        {/* CTA button */}
        <button style={{
          marginTop:10, width:'100%', padding:'8px 0',
          background: item.color + '22',
          border:    `1px solid ${item.color}44`,
          borderRadius:8, color:item.color,
          fontSize:12, fontWeight:600, cursor:'pointer',
          transition:'background 0.2s', fontFamily:'Inter,sans-serif',
        }}
          onMouseOver={e => e.currentTarget.style.background = item.color + '44'}
          onMouseOut ={e => e.currentTarget.style.background = item.color + '22'}
        >
          {type === 'movies' ? '▶ Watch Trailer'
           : type === 'music' ? '▶ Listen Now'
           : '▶ Watch Now'}
        </button>
      </div>
    </div>
  );
}


// ── ContentSection ───────────────────────────────────────
/**
 * A titled row of ContentCards with a scroll track.
 * @param {{ title, icon, items, type }} props
 */
function ContentSection({ title, icon, items, type }) {
  return (
    <div style={{ marginBottom:32 }}>
      {/* Section header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <span style={{ fontSize:22 }}>{icon}</span>
        <h3 style={{ fontSize:18, fontWeight:700 }}>{title}</h3>
        <span style={{ fontSize:13, color:'var(--text-muted)', marginLeft:4 }}>
          {items.length} picks
        </span>
      </div>

      {/* Scrollable cards */}
      <div className="scroll-row">
        {items.map((item, i) => (
          <div key={i} style={{ animation:`slideIn 0.4s ease ${i * 0.08}s forwards`, opacity:0 }}>
            <ContentCard item={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
}


// ── ConfidenceBar ────────────────────────────────────────
/**
 * Animated horizontal bar showing LLM confidence %.
 * @param {{ value: number, color: string }} props
 */
function ConfidenceBar({ value, color }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:12, color:'var(--text-muted)' }}>
        <span>AI Confidence</span>
        <span style={{ color, fontWeight:700 }}>{value}%</span>
      </div>
      <div className="conf-bar-track">
        <div
          className="conf-bar-fill"
          style={{ width:`${width}%`, background:`linear-gradient(90deg,${color}99,${color})` }}
        />
      </div>
    </div>
  );
}


// ── SettingsModal ────────────────────────────────────────
/**
 * Overlay for updating the Groq API key.
 * Includes a live test-connection button.
 * @param {{ apiKey, onSave, onClose }} props
 */
function SettingsModal({ apiKey, onSave, onClose }) {
  const [val,        setVal]        = useState(apiKey || '');
  const [showKey,    setShowKey]    = useState(false);
  const [testing,    setTesting]    = useState(false);
  const [testResult, setTestResult] = useState(null);

  async function handleTest() {
    if (!val.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await detectEmotionWithGroq(
        val.trim(),
        'I feel happy and excited today',
        4,
        'energize',
      );
      setTestResult({ ok:true, msg:`✓ Connected! Test result: ${res.emotion} (${res.confidence}% confidence)` });
    } catch (e) {
      setTestResult({ ok:false, msg:`✗ ${e.message}` });
    }
    setTesting(false);
  }

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="overlay" onClick={handleBackdrop}>
      <div className="card fade-in" style={{ width:'100%', maxWidth:460, padding:32 }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h2 style={{ fontSize:20, fontWeight:800 }}>⚙️ Groq API Settings</h2>
          <button className="btn-ghost" style={{ padding:'6px 12px' }} onClick={onClose}>✕</button>
        </div>

        {/* Info */}
        <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:20, lineHeight:1.6 }}>
          MoodStream uses{' '}
          <strong style={{ color:'var(--text)' }}>Groq · {GROQ_MODEL}</strong>{' '}
          to detect your emotion with nuance and confidence scoring.
          Your key is stored in memory only — never sent anywhere except directly to Groq.
        </p>

        {/* How to get key */}
        <div style={{ background:'rgba(108,99,255,0.08)', border:'1px solid rgba(108,99,255,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:13, color:'var(--text-muted)', lineHeight:1.7 }}>
          🔑 <strong style={{ color:'var(--text)' }}>Get a free key:</strong>{' '}
          <span style={{ color:'#a78bfa' }}>console.groq.com</span> → API Keys → Create new key
        </div>

        {/* Input */}
        <label style={{ fontSize:13, color:'var(--text-muted)', display:'block', marginBottom:8 }}>
          Groq API Key
        </label>
        <div className="key-input-wrap" style={{ marginBottom:16 }}>
          <input
            className="form-input"
            type={showKey ? 'text' : 'password'}
            placeholder="gsk_..."
            value={val}
            onChange={e => { setVal(e.target.value); setTestResult(null); }}
            style={{ paddingRight:44 }}
          />
          <button className="toggle-eye" onClick={() => setShowKey(s => !s)}>
            {showKey ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Test result */}
        {testResult && (
          <div style={{
            padding:'10px 14px', borderRadius:10, marginBottom:16,
            fontSize:13, fontWeight:500,
            background: testResult.ok ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
            border:    `1px solid ${testResult.ok ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color:      testResult.ok ? '#34d399' : '#f87171',
          }}>
            {testResult.msg}
          </div>
        )}

        {/* Actions */}
        <div style={{ display:'flex', gap:10 }}>
          <button
            className="btn-ghost"
            style={{ flex:1 }}
            onClick={handleTest}
            disabled={!val.trim() || testing}
          >
            {testing ? '⏳ Testing…' : '🧪 Test Key'}
          </button>
          <button
            className="btn-primary"
            style={{ flex:2 }}
            disabled={!val.trim()}
            onClick={() => { onSave(val.trim()); onClose(); }}
          >
            Save &amp; Continue →
          </button>
        </div>

      </div>
    </div>
  );
}
