/* ═══════════════════════════════════════════════════════
   MoodStream — Data Layer
   • EMOTION_CONFIG  : visual theme per emotion
   • CONTENT         : curated movies / music / youtube
   • MOOD_WORDS      : quick-select chips for the form
   • INTENTS         : what the user wants from content
   ═══════════════════════════════════════════════════════ */

// ── Emotion visual config ────────────────────────────────
const EMOTION_CONFIG = {
  happy:    { emoji:'😊', label:'Happy',      color:'#f59e0b', bg:'rgba(245,158,11,0.12)',  gradient:'linear-gradient(135deg,#f59e0b,#ef4444)', orb1:'rgba(245,158,11,0.15)',  orb2:'rgba(251,191,36,0.1)'  },
  sad:      { emoji:'😢', label:'Melancholic', color:'#60a5fa', bg:'rgba(96,165,250,0.12)',  gradient:'linear-gradient(135deg,#3b82f6,#6366f1)', orb1:'rgba(59,130,246,0.15)',  orb2:'rgba(99,102,241,0.1)'  },
  anxious:  { emoji:'😰', label:'Anxious',    color:'#a78bfa', bg:'rgba(167,139,250,0.12)', gradient:'linear-gradient(135deg,#8b5cf6,#ec4899)', orb1:'rgba(139,92,246,0.15)',  orb2:'rgba(236,72,153,0.1)'  },
  excited:  { emoji:'🔥', label:'Excited',    color:'#f97316', bg:'rgba(249,115,22,0.12)',  gradient:'linear-gradient(135deg,#f97316,#ef4444)', orb1:'rgba(249,115,22,0.15)',  orb2:'rgba(239,68,68,0.1)'   },
  calm:     { emoji:'🌊', label:'Calm',        color:'#34d399', bg:'rgba(52,211,153,0.12)',  gradient:'linear-gradient(135deg,#10b981,#06b6d4)', orb1:'rgba(16,185,129,0.15)',  orb2:'rgba(6,182,212,0.1)'   },
  angry:    { emoji:'😤', label:'Frustrated', color:'#f87171', bg:'rgba(248,113,113,0.12)', gradient:'linear-gradient(135deg,#ef4444,#b45309)', orb1:'rgba(239,68,68,0.15)',   orb2:'rgba(180,83,9,0.1)'    },
  romantic: { emoji:'💖', label:'Romantic',   color:'#f472b6', bg:'rgba(244,114,182,0.12)', gradient:'linear-gradient(135deg,#ec4899,#f43f5e)', orb1:'rgba(236,72,153,0.15)',  orb2:'rgba(244,63,94,0.1)'   },
  bored:    { emoji:'😑', label:'Bored',      color:'#94a3b8', bg:'rgba(148,163,184,0.12)', gradient:'linear-gradient(135deg,#6c63ff,#a855f7)', orb1:'rgba(108,99,255,0.15)',  orb2:'rgba(168,85,247,0.1)'  },
};

// ── Mood word chips ──────────────────────────────────────
const MOOD_WORDS = [
  'happy','excited','calm','tired','sad','anxious','bored','romantic',
  'frustrated','hopeful','lost','motivated','melancholy','peaceful','restless','content',
];

// ── Intent options ───────────────────────────────────────
const INTENTS = [
  { id:'escape',   label:'🌍 Escape',   desc:'Take me somewhere else'       },
  { id:'relate',   label:'💬 Relate',   desc:'I want to feel understood'     },
  { id:'energize', label:'⚡ Energize', desc:'Fire me up & motivate me'      },
  { id:'relax',    label:'🌙 Relax',    desc:'Help me slow down & breathe'  },
];

// ── Content database ─────────────────────────────────────
// Structure: CONTENT[emotion].movies | .music | .youtube
// Each item: { title, genre/artist/channel, year*, rating*, desc, tag, color, img }

const CONTENT = {

  // ── HAPPY ──────────────────────────────────────────────
  happy: {
    movies: [
      { title:'The Grand Budapest Hotel', genre:'Comedy',   year:2014, rating:8.1, desc:'A quirky, colorful adventure through the whimsical world of a legendary European hotel.',  tag:'Whimsical', color:'#f59e0b', img:'🏨' },
      { title:'Paddington 2',             genre:'Family',   year:2017, rating:7.8, desc:'The lovable bear returns in a heartwarming, joyful adventure through London.',              tag:'Feel-Good', color:'#10b981', img:'🐻' },
      { title:'Sing Street',              genre:'Music',    year:2016, rating:7.9, desc:'An infectious coming-of-age story about a boy who forms a band to impress a girl.',         tag:'Uplifting', color:'#6c63ff', img:'🎸' },
      { title:'La La Land',               genre:'Musical',  year:2016, rating:8.0, desc:'A modern love story wrapped in jazz, dreams, and dazzling musical numbers.',                tag:'Dreamy',    color:'#ec4899', img:'🎷' },
      { title:'About Time',               genre:'Romance',  year:2013, rating:7.8, desc:'A heartfelt film about finding joy in everyday moments using the gift of time travel.',      tag:'Touching',  color:'#f97316', img:'⏰' },
    ],
    music: [
      { title:'Happy',          artist:'Pharrell Williams',  genre:'Pop',      desc:'The ultimate feel-good anthem — impossible to listen to without smiling.',             tag:'Anthem',     color:'#f59e0b', img:'🎵' },
      { title:'Uptown Funk',    artist:'Bruno Mars & Ronson',genre:'Funk',     desc:'Infectious grooves and an irresistible beat that gets everyone moving.',               tag:'Dance',      color:'#ef4444', img:'🎶' },
      { title:'Good as Hell',   artist:'Lizzo',              genre:'Pop/R&B',  desc:'An empowering, joyful track that makes you feel unstoppable.',                         tag:'Empowering', color:'#8b5cf6', img:'🎤' },
      { title:'Shake It Off',   artist:'Taylor Swift',       genre:'Pop',      desc:'Breezy, carefree pop perfection for when you just need to let loose.',                 tag:'Carefree',   color:'#f59e0b', img:'🎼' },
      { title:'Levitating',     artist:'Dua Lipa',           genre:'Disco Pop',desc:'Cosmic disco-pop guaranteed to lift your spirits and your feet.',                      tag:'Groovy',     color:'#06b6d4', img:'🎧' },
    ],
    youtube: [
      { title:'Best Stand-Up Comedy Moments',    channel:'Comedy Central', desc:'The funniest stand-up clips curated to keep you laughing.',               tag:'Comedy',    color:'#f59e0b', img:'😂' },
      { title:'Wholesome Animal Compilations',   channel:'The Dodo',       desc:'Heartwarming rescues, cute animals, and feel-good stories worldwide.',    tag:'Wholesome', color:'#10b981', img:'🐾' },
      { title:'Street Food Around the World',    channel:'Mark Wiens',     desc:'Vibrant food adventures through the world\'s most exciting street scenes.',tag:'Food',      color:'#f97316', img:'🍜' },
      { title:'Best Travel Bloopers of All Time',channel:'Kara and Nate',  desc:'Hilarious travel mishaps that remind you it\'s the journey that matters.',tag:'Travel',    color:'#ec4899', img:'✈️' },
    ],
  },

  // ── SAD ────────────────────────────────────────────────
  sad: {
    movies: [
      { title:'Good Will Hunting',        genre:'Drama',        year:1997, rating:8.3, desc:'A touching story about a genius janitor confronting his past with the help of a therapist.',       tag:'Profound',  color:'#60a5fa', img:'🧠' },
      { title:'The Pursuit of Happyness', genre:'Drama',        year:2006, rating:8.0, desc:'An inspiring true story of a man\'s determination to rise from homelessness.',                    tag:'Inspiring', color:'#34d399', img:'💼' },
      { title:'Eternal Sunshine',         genre:'Sci-Fi',       year:2004, rating:8.3, desc:'A poetic meditation on love, memory, and the beauty of impermanence.',                            tag:'Poetic',    color:'#818cf8', img:'🧩' },
      { title:'The Shawshank Redemption', genre:'Drama',        year:1994, rating:9.3, desc:'An enduring story of hope, friendship, and the indomitable human spirit.',                        tag:'Timeless',  color:'#f59e0b', img:'🔑' },
      { title:'Little Miss Sunshine',     genre:'Comedy-Drama', year:2006, rating:7.8, desc:'A chaotic family road trip that turns into a beautiful ode to imperfection.',                     tag:'Heartfelt', color:'#fb923c', img:'☀️' },
    ],
    music: [
      { title:'Skinny Love',             artist:'Bon Iver',             genre:'Indie Folk', desc:'Raw, trembling vocals over sparse guitar — cathartic and deeply moving.',         tag:'Cathartic', color:'#60a5fa', img:'🎵' },
      { title:'Motion Sickness',         artist:'Phoebe Bridgers',      genre:'Indie',      desc:'Achingly honest songwriting that makes you feel seen in your sadness.',           tag:'Relatable', color:'#a78bfa', img:'🎶' },
      { title:'Casimir Pulaski Day',     artist:'Sufjan Stevens',       genre:'Folk',       desc:'A devastatingly beautiful meditation on loss and the questions it leaves behind.', tag:'Profound',  color:'#93c5fd', img:'🎤' },
      { title:'Video Games',             artist:'Lana Del Rey',         genre:'Dream Pop',  desc:'Nostalgic, cinematic, and dripping in bittersweet longing.',                      tag:'Nostalgic', color:'#c4b5fd', img:'🎼' },
      { title:'The Night Will Always Win',artist:'Manchester Orchestra',genre:'Indie Rock', desc:'A powerful, slow-building anthem for those dark, quiet moments.',                 tag:'Powerful',  color:'#64748b', img:'🎸' },
    ],
    youtube: [
      { title:'Beautiful Short Films',        channel:'Short of the Week', desc:'Emotionally resonant short films exploring the full range of human feeling.',  tag:'Cinema',  color:'#60a5fa', img:'🎬' },
      { title:'Letters to Lost People',       channel:'StoryCorps',        desc:'Real people sharing intimate stories of love, loss, and connection.',          tag:'Stories', color:'#818cf8', img:'📝' },
      { title:'Comfort Food: Easy Recipes',   channel:'Joshua Weissman',   desc:'Warm, nostalgic recipes that feel like a hug in food form.',                   tag:'Comfort', color:'#f97316', img:'🍲' },
      { title:'Beautiful Piano Performances', channel:'WQXR',              desc:'Live piano performances of pieces that speak where words cannot.',             tag:'Music',   color:'#a78bfa', img:'🎹' },
    ],
  },

  // ── ANXIOUS ────────────────────────────────────────────
  anxious: {
    movies: [
      { title:'Spirited Away',                   genre:'Animation', year:2001, rating:8.6, desc:'A magical coming-of-age journey that soothes the mind with wonder and beauty.',      tag:'Enchanting',  color:'#a78bfa', img:'✨' },
      { title:'Chef',                            genre:'Drama',     year:2014, rating:7.3, desc:'A calming, delicious film about rediscovering passion and simplicity in life.',       tag:'Comforting',  color:'#f97316', img:'👨‍🍳' },
      { title:'The Secret Life of Walter Mitty', genre:'Adventure', year:2013, rating:7.3, desc:'A breathtaking journey that celebrates leaving your comfort zone.',                  tag:'Adventurous', color:'#06b6d4', img:'🌄' },
      { title:'Amélie',                          genre:'Romance',   year:2001, rating:8.3, desc:'A whimsical, quietly joyful film that restores faith in the magic of small things.', tag:'Whimsical',   color:'#10b981', img:'🌸' },
      { title:'Her',                             genre:'Sci-Fi',    year:2013, rating:8.0, desc:'A tender story about connection, loneliness, and what it means to feel.',            tag:'Thoughtful',  color:'#f43f5e', img:'💬' },
    ],
    music: [
      { title:'Music for Airports', artist:'Brian Eno',      genre:'Ambient',              desc:'The gold standard of ambient music — designed to calm and float the mind.', tag:'Ambient',   color:'#7dd3fc', img:'🎵' },
      { title:'Felt',               artist:'Nils Frahm',     genre:'Neo-Classical',        desc:'Intimate piano with felt-muffled keys — pure tranquility.',                 tag:'Tranquil',  color:'#a5f3fc', img:'🎼' },
      { title:'Island Songs',       artist:'Ólafur Arnalds', genre:'Electronic',           desc:'Ethereal Icelandic soundscapes that wrap you in serene calm.',              tag:'Ethereal',  color:'#6ee7b7', img:'🌙' },
      { title:'Takk...',            artist:'Sigur Rós',      genre:'Post-Rock',            desc:'Glacial, otherworldly music that makes the world feel enormous and peaceful.',tag:'Cinematic', color:'#c4b5fd', img:'🎧' },
      { title:'Sleep',              artist:'Max Richter',    genre:'Contemporary Classical',desc:'An 8-hour composition designed for rest — even a few minutes helps.',       tag:'Rest',      color:'#93c5fd', img:'🎶' },
    ],
    youtube: [
      { title:'10-Min Guided Breathing',     channel:'Headspace',         desc:'A simple, effective breathing session to settle an anxious mind.',                tag:'Wellness', color:'#a78bfa', img:'🧘' },
      { title:'ASMR: Rainy Library Reading', channel:'Gentle Whispering', desc:'Ultra-relaxing sounds of rain and turning pages — deeply calming.',              tag:'ASMR',     color:'#6ee7b7', img:'📚' },
      { title:'Planet Earth: Ocean Depths',  channel:'BBC',               desc:'Stunning underwater cinematography narrated by Sir David Attenborough.',         tag:'Nature',   color:'#0ea5e9', img:'🌊' },
      { title:'Bob Ross: Happy Little Trees',channel:'Bob Ross',          desc:'The most calming painting show ever made. Guaranteed to slow your heart rate.', tag:'Art',      color:'#34d399', img:'🌳' },
    ],
  },

  // ── EXCITED ────────────────────────────────────────────
  excited: {
    movies: [
      { title:'Mad Max: Fury Road', genre:'Action',    year:2015, rating:8.1, desc:'Two hours of relentless, brilliant, high-octane fury — cinema as pure adrenaline.',  tag:'Adrenaline',   color:'#f97316', img:'🚗' },
      { title:'Top Gun: Maverick',  genre:'Action',    year:2022, rating:8.3, desc:'An exhilarating throwback blockbuster that reminds you why movies are magic.',       tag:'Epic',         color:'#3b82f6', img:'✈️' },
      { title:'John Wick',          genre:'Action',    year:2014, rating:7.4, desc:'Breathtakingly choreographed action that never lets up — pure kinetic energy.',      tag:'Intense',      color:'#f43f5e', img:'🔫' },
      { title:'Interstellar',       genre:'Sci-Fi',    year:2014, rating:8.7, desc:'A mind-bending cosmic odyssey that channels your excitement into the infinite.',     tag:'Mind-Blowing', color:'#8b5cf6', img:'🚀' },
      { title:'The Dark Knight',    genre:'Superhero', year:2008, rating:9.0, desc:'The definitive superhero film — thrilling, complex, and endlessly rewatchable.',     tag:'Legendary',    color:'#475569', img:'🦇' },
    ],
    music: [
      { title:'Get Lucky',           artist:'Daft Punk',     genre:'Electronic', desc:'An irresistible, euphoric dance track that channels pure momentum and joy.',         tag:'Euphoric',     color:'#f97316', img:'🎵' },
      { title:'Blinding Lights',     artist:'The Weeknd',    genre:'Synth-Pop',  desc:'Neon-drenched, pulse-racing synth-pop that makes you feel like you\'re in a movie.', tag:'Drive',        color:'#ec4899', img:'🎶' },
      { title:'Summer',              artist:'Calvin Harris', genre:'Dance',      desc:'The ultimate summer anthem — made for open roads and big feelings.',                 tag:'Festival',     color:'#fbbf24', img:'🔊' },
      { title:'HUMBLE.',             artist:'Kendrick Lamar',genre:'Hip-Hop',    desc:'A sharp, powerful banger with production that hits like a freight train.',           tag:'Powerful',     color:'#ef4444', img:'🎤' },
      { title:'Killing in the Name', artist:'RATM',          genre:'Rock',       desc:'One of the most electrifying rock tracks ever recorded — pure unleashed energy.',    tag:'Electrifying', color:'#dc2626', img:'🎸' },
    ],
    youtube: [
      { title:'Best Sporting Moments 2024',  channel:'ESPN',              desc:'The most jaw-dropping, heart-stopping athletic feats from the past year.',     tag:'Sports',    color:'#f97316', img:'🏆' },
      { title:'Free Solo: Extreme Climbing', channel:'National Geographic',desc:'Breathtaking footage of climbers conquering impossible peaks without ropes.',  tag:'Extreme',   color:'#ef4444', img:'🧗' },
      { title:'Most Inspiring TED Talks',    channel:'TED',               desc:'Ideas worth spreading — talks that fire up your ambition and imagination.',     tag:'Inspiring', color:'#3b82f6', img:'💡' },
      { title:'Epic Car Chase Compilation',  channel:'Top Gear',          desc:'The most incredible driving sequences ever put on film.',                       tag:'Adrenaline',color:'#f59e0b', img:'🏎️' },
    ],
  },

  // ── CALM ───────────────────────────────────────────────
  calm: {
    movies: [
      { title:'My Neighbor Totoro', genre:'Animation', year:1988, rating:8.2, desc:'A gentle, timeless Ghibli classic that is pure warmth and childlike wonder.',          tag:'Gentle',        color:'#34d399', img:'🌿' },
      { title:'Julie & Julia',      genre:'Drama',     year:2009, rating:7.0, desc:'A warm, nourishing story about passion, food, and finding your purpose.',              tag:'Warm',          color:'#f59e0b', img:'👩‍🍳' },
      { title:'Moonrise Kingdom',   genre:'Comedy',    year:2012, rating:7.8, desc:'Wes Anderson\'s most tender film — a quiet, beautiful love story for dreamers.',       tag:'Dreamy',        color:'#f97316', img:'🏕️' },
      { title:'Columbus',           genre:'Drama',     year:2017, rating:7.5, desc:'A quiet, contemplative film where architecture and emotion intertwine perfectly.',      tag:'Contemplative', color:'#94a3b8', img:'🏛️' },
      { title:'Paterson',           genre:'Drama',     year:2016, rating:7.4, desc:'A week in the life of a bus driver who writes poetry — pure, mindful cinema.',         tag:'Mindful',       color:'#60a5fa', img:'📝' },
    ],
    music: [
      { title:'Pink Moon',                   artist:'Nick Drake',           genre:'Folk',       desc:'Sparse, intimate guitar and vocals — like a quiet evening by the window.',   tag:'Intimate',    color:'#34d399', img:'🌙' },
      { title:'In Our Nature',               artist:'José González',        genre:'Acoustic',   desc:'Fingerpicked guitar that feels like a cool breeze on a warm afternoon.',     tag:'Acoustic',    color:'#86efac', img:'🎸' },
      { title:'The Creek Drank the Cradle',  artist:'Iron & Wine',          genre:'Folk',       desc:'Whispered folk songs that feel like home — unhurried and deeply peaceful.',  tag:'Folk',        color:'#a16207', img:'🎵' },
      { title:'Take Care Take Care',         artist:'Explosions in the Sky',genre:'Post-Rock',  desc:'Instrumental waves of guitar that wash over you like a slow tide.',          tag:'Instrumental',color:'#0ea5e9', img:'🎶' },
      { title:'Interstellar OST',            artist:'Hans Zimmer',          genre:'Orchestral', desc:'Majestic, sweeping organ and strings that expand your sense of self.',        tag:'Orchestral',  color:'#8b5cf6', img:'🎼' },
    ],
    youtube: [
      { title:'Slow TV: Bergen to Oslo Train', channel:'NRK',                   desc:'Seven hours of Norwegian scenery from a train window — meditative and beautiful.', tag:'Slow TV', color:'#34d399', img:'🚂' },
      { title:'Bob Ross: Season 1 Marathon',   channel:'Bob Ross Inc',          desc:'Happy little trees and total serenity — the original mindfulness content.',       tag:'Art',     color:'#86efac', img:'🎨' },
      { title:'Aquarium 4K Livestream',        channel:'Monterey Bay Aquarium', desc:'Live deep-sea creatures drifting by in 4K. Deeply, profoundly calming.',         tag:'Nature',  color:'#0ea5e9', img:'🐠' },
      { title:'Peaceful Japanese Forest Walk', channel:'Ambience Walks',        desc:'A 2-hour first-person walk through a tranquil Japanese forest.',                  tag:'Walk',    color:'#4ade80', img:'🌲' },
    ],
  },

  // ── ANGRY ──────────────────────────────────────────────
  angry: {
    movies: [
      { title:'Whiplash',          genre:'Drama',  year:2014, rating:8.5, desc:'An intense, electrifying film about obsession, ambition, and pushing your limits.',          tag:'Intense',   color:'#f87171', img:'🥁' },
      { title:'Fight Club',        genre:'Drama',  year:1999, rating:8.8, desc:'A savage, cathartic deconstruction of modern masculinity and consumer culture.',             tag:'Cathartic', color:'#ef4444', img:'👊' },
      { title:'Joker',             genre:'Drama',  year:2019, rating:8.4, desc:'A raw, provocative portrait of what happens when society ignores its most vulnerable.',       tag:'Raw',       color:'#dc2626', img:'🃏' },
      { title:'Network',           genre:'Drama',  year:1976, rating:8.1, desc:'The original "mad as hell" film — savage satire that still cuts deep today.',               tag:'Satire',    color:'#f97316', img:'📺' },
      { title:'Mad Max: Fury Road',genre:'Action', year:2015, rating:8.1, desc:'Channel your energy into two hours of cinematic fury and brilliant chaos.',                 tag:'Release',   color:'#b45309', img:'🔥' },
    ],
    music: [
      { title:'B.Y.O.B.',               artist:'System of a Down', genre:'Metal',     desc:'Explosive, politically charged metal that turns frustration into cathartic release.', tag:'Release',    color:'#f87171', img:'🎸' },
      { title:'Numb',                   artist:'Linkin Park',      genre:'Nu-Metal',   desc:'A generation-defining anthem for feeling misunderstood and unheard.',               tag:'Anthem',     color:'#64748b', img:'🎵' },
      { title:'Closer',                 artist:'Nine Inch Nails',  genre:'Industrial', desc:'Raw, industrial aggression transformed into a sonic experience.',                   tag:'Industrial', color:'#78716c', img:'🎶' },
      { title:'POWER',                  artist:'Kanye West',       genre:'Hip-Hop',    desc:'Bombastic, symphonic hip-hop that makes you feel invincible and righteous.',        tag:'Power',      color:'#dc2626', img:'🎤' },
      { title:'How Much a Dollar Cost', artist:'Kendrick Lamar',   genre:'Hip-Hop',    desc:'Profound and furious — hip-hop that forces uncomfortable truths.',                  tag:'Profound',   color:'#f43f5e', img:'🎼' },
    ],
    youtube: [
      { title:'Most Satisfying Fails',          channel:'FailArmy',     desc:'Watching things go hilariously wrong — strangely therapeutic.',                    tag:'Satisfying', color:'#f87171', img:'😅' },
      { title:'Best Roasts & Comeback Moments', channel:'Comedy Central',desc:'Legendary clap-backs and roasts that channel frustration into laughter.',          tag:'Comedy',     color:'#f97316', img:'🔥' },
      { title:'Workout Motivation: Beast Mode',  channel:'ATHLEAN-X',   desc:'Turn that energy into fuel — intense workout motivation to channel anger.',        tag:'Fitness',    color:'#ef4444', img:'💪' },
      { title:'The Most Satisfying Videos',     channel:'SatisfyingVideo',desc:'Perfect cuts, clean lines, and things fitting together exactly as they should.', tag:'Satisfying', color:'#34d399', img:'✅' },
    ],
  },

  // ── ROMANTIC ───────────────────────────────────────────
  romantic: {
    movies: [
      { title:'Before Sunrise',             genre:'Romance', year:1995, rating:8.1, desc:'Two strangers talk through the night in Vienna — the most romantic conversation film ever made.', tag:'Timeless', color:'#f472b6', img:'🌅' },
      { title:'When Harry Met Sally',       genre:'Romance', year:1989, rating:7.6, desc:'The definitive romantic comedy — warm, witty, and endlessly quotable.',                          tag:'Classic',  color:'#ec4899', img:'🥂' },
      { title:'Crazy, Stupid, Love',        genre:'Romance', year:2011, rating:7.4, desc:'A funny, charming, heartfelt look at love in all its complicated, beautiful forms.',             tag:'Charming', color:'#f43f5e', img:'💋' },
      { title:'Notting Hill',               genre:'Romance', year:1999, rating:7.1, desc:'A sweet, endearing love story between a bookshop owner and a Hollywood star.',                   tag:'Sweet',    color:'#fb7185', img:'📚' },
      { title:'Portrait of a Lady on Fire', genre:'Drama',   year:2019, rating:8.1, desc:'A visually stunning, emotionally charged love story told with rare intimacy.',                   tag:'Intimate', color:'#f97316', img:'🎨' },
    ],
    music: [
      { title:'The Way You Look Tonight',artist:'Frank Sinatra', genre:'Jazz',     desc:'Timeless, velvet-voiced romance — the song that never gets old.',                  tag:'Timeless',  color:'#f472b6', img:'🎵' },
      { title:'Come Away with Me',       artist:'Norah Jones',   genre:'Jazz Pop', desc:'Warm, intimate piano and vocals that feel like a slow dance in candlelight.',      tag:'Intimate',  color:'#fbbf24', img:'🕯️' },
      { title:'Gravity',                 artist:'John Mayer',    genre:'Blues',    desc:'Silky guitar and tender vocals — a love letter in musical form.',                  tag:'Tender',    color:'#6366f1', img:'🎸' },
      { title:'Someone Like You',        artist:'Adele',         genre:'Pop',      desc:'One of the most emotionally powerful love songs of the modern era.',               tag:'Powerful',  color:'#94a3b8', img:'🎤' },
      { title:'Perfect',                 artist:'Ed Sheeran',    genre:'Pop',      desc:'A beautifully written, earnest love song that captures the feeling perfectly.',    tag:'Beautiful', color:'#f87171', img:'🎶' },
    ],
    youtube: [
      { title:'World\'s Most Romantic Destinations', channel:'Expedia',           desc:'Dreamy destinations perfect for couples — Paris, Kyoto, Santorini.',             tag:'Travel',     color:'#f472b6', img:'🗺️' },
      { title:'Best Restaurant Date Night Ideas',    channel:'Bon Appétit',       desc:'Romantic recipes and restaurant ideas to make any evening special.',             tag:'Date Night', color:'#f97316', img:'🍷' },
      { title:'Sunset Timelapses Around the World',  channel:'Nature Relaxation', desc:'Golden hour skies from the most beautiful corners of the planet.',               tag:'Sunset',     color:'#f59e0b', img:'🌇' },
      { title:'Classic Movie Romance Scenes',        channel:'Movieclips',        desc:'The most iconic romantic moments in cinema history, compiled for your heart.',   tag:'Cinema',     color:'#ec4899', img:'🎬' },
    ],
  },

  // ── BORED ──────────────────────────────────────────────
  bored: {
    movies: [
      { title:'Everything Everywhere All at Once', genre:'Sci-Fi',      year:2022, rating:7.8, desc:'A wildly inventive multiverse adventure that will completely rearrange your brain.',         tag:'Mind-Bending', color:'#a855f7', img:'🌀' },
      { title:'The Big Short',                    genre:'Comedy-Drama', year:2015, rating:7.8, desc:'A brilliantly entertaining explanation of the 2008 financial crisis — infuriating and fun.',tag:'Educational',  color:'#f59e0b', img:'💰' },
      { title:'Knives Out',                       genre:'Mystery',      year:2019, rating:7.9, desc:'A deliciously twisty whodunit that subverts every expectation you have.',                   tag:'Twisty',       color:'#06b6d4', img:'🔪' },
      { title:'Parasite',                         genre:'Thriller',     year:2019, rating:8.5, desc:'A perfectly constructed genre-defying masterpiece that grips you to the last frame.',       tag:'Masterpiece',  color:'#10b981', img:'🏠' },
      { title:'The Social Network',               genre:'Drama',        year:2010, rating:7.8, desc:'Aaron Sorkin\'s razor-sharp script makes founding Facebook one of cinema\'s most riveting stories.',tag:'Riveting',color:'#3b82f6', img:'💻' },
    ],
    music: [
      { title:'Currents',            artist:'Tame Impala',    genre:'Psychedelic',   desc:'Dreamy psychedelic pop that takes you somewhere unexpected and new.',             tag:'Explore',      color:'#a855f7', img:'🎵' },
      { title:'Sound of Silver',     artist:'LCD Soundsystem',genre:'Electronic',    desc:'Witty, danceable, and deeply original — the coolest record of the 2000s.',       tag:'Cool',         color:'#64748b', img:'🎶' },
      { title:'OK Computer',         artist:'Radiohead',      genre:'Alt Rock',      desc:'A landmark album that rewards every listen with something new to discover.',      tag:'Landmark',     color:'#475569', img:'🎸' },
      { title:'The Suburbs',         artist:'Arcade Fire',    genre:'Indie Rock',    desc:'A grand, sprawling indie epic about nostalgia, time, and what we leave behind.', tag:'Epic',         color:'#f97316', img:'🏘️' },
      { title:'Oracular Spectacular',artist:'MGMT',           genre:'Psychedelic Pop',desc:'Weird, wonderful, and impossible to categorize — perfect for jolting yourself.',tag:'Weird & Great',color:'#06b6d4', img:'🎤' },
    ],
    youtube: [
      { title:'50 Things About Space',              channel:'Kurzgesagt',     desc:'Mind-expanding facts about the universe with stunning animation.',              tag:'Mind-Blowing',color:'#8b5cf6', img:'🚀' },
      { title:'Most Mysterious Unsolved Cases',     channel:'Bright Side',    desc:'Strange, compelling mysteries that will occupy your brain for days.',           tag:'Mystery',     color:'#475569', img:'🔍' },
      { title:'Incredible Science Experiments',     channel:'Mark Rober',     desc:'Engineering genius + creative chaos = hours of genuinely impressive content.', tag:'Science',     color:'#06b6d4', img:'🧪' },
      { title:'Ranking Every Country\'s Food',      channel:'Joshua Weissman',desc:'A hilarious, mouth-watering deep dive into global cuisine.',                   tag:'Food',        color:'#f97316', img:'🌍' },
    ],
  },

};
