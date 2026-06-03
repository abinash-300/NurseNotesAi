# NurseNote AI — Complete Feature List

## Core Flow
- **State machine**: Idle → Recording → Processing → Result (with demo shortcut)
- **Session numbering**: Auto-incrementing from #1001
- **In-memory session storage**: Last 5 sessions, cleared on page refresh

---

## Screen 1 — Home (Idle)
- Large title "NurseNote" 34px that shrinks on scroll (IntersectionObserver)
- Circular mic orb — tap to start recording
- **Specialty selector**: 6 options — General, ICU, ER, Med-Surg, Pediatrics, Cardiac
- **Note length selector**: Brief / Standard / Detailed (segmented control)
- **Recent Notes list**: Shows last 5 sessions with 7-word subjective preview + timestamp + word count
- **Profile icon** (top-right) opens bottom sheet:
  - "Try Demo Patient" — loads a pre-built cardiac transcript
  - "About NurseNote" — version + privacy info
- Privacy footer: Lock icon, "End-to-end encrypted · Nothing stored"
- **iOS install banner**: Shown once on iPhone Safari non-standalone, bouncing arrow, dismissible
- **PWA install prompt**: Shows browser's beforeinstallprompt on Android/desktop, dismissible per session

---

## Screen 2 — Recording
- **Live speech recognition** (Web Speech API, continuous, interim results, en-US)
- MM:SS timer updating every 250ms
- Pulsing red dot status label
- **Real-time audio waveform**: Web Audio API canvas visualizer (AnalyserNode, 60fps, cyan wave)
- **Live transcript**: Sentence-split display with cyan cursor `▍`
- Word count chip (live)
- Scroll fade on transcript overflow
- Primary action: tap the red orb to stop
- Secondary: grey "Stop & generate" button
- Cancel returns to home
- Auto-restart recognition if it cuts out
- Error display if mic unavailable

---

## Screen 3 — Processing (AI)
- **Groq API call**: `llama-3.1-8b-instant`, max 1000 tokens
- **Dynamic system prompt** — specialty and length addons injected
- **Skeleton loader cards**: 4 SOAP placeholders with shimmer animation
- Each skeleton transitions to "Synthesized ✓" as step progresses (550ms stagger)
- Elapsed timer (0.1s precision)
- Groq live chip (cyan)
- Validates transcript ≥ 5 words before calling API
- Minimum display time: last step + 200ms to avoid flash

---

## Screen 4 — Result (SOAP Note)
- **4 SOAP cards** — Subjective, Objective, Assessment, Plan
  - Color-tinted backgrounds (orange / cyan / purple / green at 5% opacity)
  - 24px bold section letter
  - Word count per section
  - **Edit mode**: tap edit icon → textarea with color-coded border → Save / Cancel
  - **Copy section**: clipboard with 1.6s ✓ feedback
  - **Flag for review**: amber toggle, "Needs Review" chip, `[NEEDS REVIEW]` prefix on copy
- **Copy full note**: copies all 4 sections concatenated
- **Flag warning modal**: if any section flagged, shows "X sections flagged — Copy anyway / Review first"
- **Share**: native Web Share API, clipboard fallback
- **Auto-clear timer**: 5-minute countdown, 3px color bar draining at top (green → orange → red)
- Session auto-deleted and navigates home when timer hits 0
- **Meta panel grid**: Generated in Xs, Model, Confidence, Words in/out
- Back / New session buttons

---

## AI Prompt System

### Specialty-Specific Behaviors
| Specialty | Extra Focus |
|---|---|
| General | Base prompt only |
| ICU | Ventilator settings, vasoactive drips, GCS, hourly outputs |
| ER | Triage acuity, time-sensitive interventions, disposition |
| Med-Surg | ADL, fall risk, wound care, discharge planning |
| Pediatrics | Weight-based dosing, developmental assessment, guardian education |
| Cardiac | Rhythm, ejection fraction, chest pain characteristics, cardiac enzymes |

### Note-Length Behaviors
| Length | Behavior |
|---|---|
| Brief | 1–2 sentences max, bullet points okay |
| Standard | Default clinical paragraphs |
| Detailed | 4–6 sentences, clinical reasoning, differentials |

---

## Onboarding & Gates
- **Disclaimer modal**: 2-screen (summary + full legal), must accept to proceed, persists via localStorage
- **Onboarding carousel**: 3 slides with swipe gestures, skip button, progress dots, persists via localStorage

---

## Browser APIs & Integrations

### Speech Recognition
- SpeechRecognition or webkitSpeechRecognition
- Continuous mode, interim results enabled
- Language: en-US
- Auto-restart if interrupted
- Graceful error handling and user feedback

### Clipboard API
- Copy individual SOAP sections
- Copy full note with optional flag prefixes
- Silent fallback if unavailable

### Vibration API
- 50ms pulse on recording start
- 100ms pulse on processing complete
- [100, 50, 100] pattern on error

### Media Devices
- getUserMedia({ audio: true }) for waveform visualization
- Graceful degradation if unavailable

### Web Audio API
- AudioContext, AnalyserNode
- FFT size: 256, smoothing: 0.82
- Real-time frequency analysis for canvas waveform
- Cleanup on unmount

### Web Share API
- Native share sheet integration
- Fallback to clipboard copy

### Service Worker
- Cache-first strategy for static assets (.js, .css, .html, .woff, .woff2, .png, .svg, .ico, .json)
- Network-only for Groq API calls
- Pre-caches app shell on install
- Clears old cache versions on activate
- Navigation fallback to / for SPA routing

### PWA Manifest
- display: standalone
- orientation: portrait
- Theme color: #06B6D4
- Icons: 192x192, 512x512 (maskable)
- Start URL: /

---

## Animations & Interactions
- `pulse-dot` — 1.4s pulsing recording / status dots
- `rise-in` — 300ms SOAP cards fade-slide in staggered
- `mic-breathe` — 2.5s idle orb ring breathing effect
- `slow-spin` — 8s rotation (processing screen brain)
- `slide-up` — 260ms profile sheet entrance
- `shimmer` — 1.5s skeleton loader animation
- `mic-glow` — 2.5s orb box-shadow pulsing effect
- `wave-bar` — waveform bar bounce (CSS keyframe)
- Universal **tap-scale**: 0.97 on all interactive elements (80ms transition)

---

## Design System

### Color Palette
- **Background**: #F2F2F7 (system gray-6)
- **Surface**: #FFFFFF (white)
- **Primary Label**: #000000 (black)
- **Secondary Label**: #8E8E93 (system gray-2)
- **Tertiary Label**: #C7C7CC (system gray-3)
- **Separator**: #C6C6C8 (system gray-4)
- **Brand/Accent**: #06B6D4 (cyan)
- **Error**: #FF3B30 (red)
- **Success**: #34C759 (green)
- **Warning**: #FF9F0A (orange)
- **Flagged**: #F59E0B (amber)

### Typography
- **Font stack**: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif
- **Mono**: "SF Mono", "DM Mono", ui-monospace, monospace
- **Large title**: 34px, weight 800
- **Heading**: 17px–24px, weight 700
- **Body**: 14px–15px, weight 400–500
- **Caption**: 11px–13px, weight 500–600

### Component Styles
- **Cards**: 20px border-radius, shadow 0 1px 3px rgba(0,0,0,0.06) + 0 4px 12px rgba(0,0,0,0.04)
- **Buttons**:
  - Primary: cyan (#06B6D4), white text, 600 weight, scale(0.97) on press
  - Ghost: grey background, black text, scale(0.97) on press
  - Icon: 36px circle, white background, shadow
- **Chips**: 11px, rounded-full, various color schemes
- **List separator**: 0.5px #C6C6C8

---

## Persistence & Storage

### LocalStorage (Survives page reload)
| Key | Purpose |
|---|---|
| `nursenote_disclaimer_accepted` | Skips disclaimer on return |
| `nursenote_onboarded` | Skips onboarding on return |
| `nursenote_ios_install_dismissed` | Never shows iOS banner again |

### SessionStorage (Cleared on tab close)
| Key | Purpose |
|---|---|
| `pwa_prompt_dismissed` | Hides install prompt for session |

### In-Memory State (Session-only)
- Up to 5 recent notes
- Current SOAP note being edited
- Specialty and note-length preferences
- Session counter (1001+)

---

## Accessibility & Safety

### Haptic Feedback
- Recording start: 50ms vibration
- Processing complete: 100ms vibration
- Errors: [100, 50, 100] pattern

### Error Handling
- Voice unavailable: clear message with browser/OS instructions
- Empty transcript: "No speech detected" prompt
- Transcript too short: "Please record at least a few words"
- API errors: user-facing message without technical jargon
- JSON parse error: graceful fallback message
- Mic unavailable: silent failure, waveform not shown

### Privacy Features
- **Zero backend**: All processing on Groq cloud, no database
- **Auto-clear**: Session deleted after 5 minutes
- **No tracking**: No analytics, no cookies
- **Encryption**: TLS in transit, Groq handles processing
- **Offline capable**: Service worker, PWA installable
- **No storage**: Notes only in memory, cleared on refresh

---

## Development & Performance

### Build
- Vite 5.4 bundler
- React 18 with hooks
- TailwindCSS 3.4 with custom extensions
- Lucide React icons (optimized SVG)
- gzip size: ~62KB

### API Endpoints
- Groq: `https://api.groq.com/openai/v1/chat/completions`
- Authentication: Bearer token via `VITE_GROQ_API_KEY`
- Model: llama-3.1-8b-instant
- Max tokens per request: 1000

### Browser Support
- Chrome/Edge (full support, Speech Recognition native)
- Safari (limited, no Speech Recognition — fallback UI shown)
- Firefox (full support with -webkit- prefixes)
- iOS: Chrome recommended (native Safari no speech)

---

## Utility Functions

### Text Processing
- **timeAgo()**: "Just now", "Xs ago", "Xm ago", "Xh ago"
- **fmtTime()**: MM:SS format with padded minutes/seconds
- **fmtCountdown()**: M:SS format for countdown timers
- **subjectivePreview()**: First 7 words + ellipsis from transcript
- **Sentence splitting**: Regex lookahead `(?<=[.!?])\s+`
- **Word counting**: Split on `\s+`, trim whitespace

### Metadata Calculation
- Elapsed time: milliseconds → seconds with 1 decimal
- Words in: transcript word count
- Words out: SOAP output word count
- Session number: auto-increment from 1001
- Confidence: hardcoded "High · 94%"
- Model display: "llama-3.1-8b"

---

## Known Limitations
- Session data in-memory only (not persisted to server)
- Speech Recognition not available in Safari (iOS native browser)
- Clipboard copy requires user interaction (browser security)
- Web Share API not available on all browsers (fallback to clipboard)
- Service Worker requires HTTPS or localhost
- Max 5 recent sessions kept in memory
- Groq API key must be provided via environment variable

---

## Future Expansion Points
- Database integration for persistent session history
- User authentication and cloud backup
- Specialty/length preference persistence
- Integration with EHR systems
- Multi-language support
- Voice tone/style customization
- Batch note generation
- Template library for common scenarios
- Real-time collaboration
