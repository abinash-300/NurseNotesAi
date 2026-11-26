import React, { useState } from 'react';

const SPECIALTIES = [
  { id: 'general', label: 'General' },
  { id: 'icu', label: 'ICU' },
  { id: 'er', label: 'ER' },
  { id: 'medsurg', label: 'Med-Surg' },
  { id: 'pediatrics', label: 'Pediatrics' },
  { id: 'cardiac', label: 'Cardiac' },
];

const LENGTHS = [
  { id: 'brief', label: 'Brief' },
  { id: 'standard', label: 'Standard' },
  { id: 'detailed', label: 'Detailed' },
];

export default function ScreenIdle({
  onStart,
  onDemo,
  sessions = [],
  onOpenSession,
  specialty = 'general',
  onSpecialtyChange,
  noteLength = 'standard',
  onNoteLengthChange,
  onSettings,
  onAbout,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeSpecialtyLabel =
    SPECIALTIES.find((s) => s.id === specialty)?.label || 'General';
  const activeLengthLabel =
    LENGTHS.find((l) => l.id === noteLength)?.label || 'Standard';

  return (
    <div className="studio-canvas relative h-full w-full overflow-y-auto flex flex-col justify-between p-5 sm:p-8 lg:p-11">
      {/* TOP SWISS GRID CORNERS */}
      <div className="relative z-30 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        {/* Top-Left: Real Clinical Capabilities */}
        <ul className="space-y-1 text-xs sm:text-[13px] leading-snug text-[#D4D4D8] font-medium tracking-tight">
          <li>Voice-to-SOAP charting</li>
          <li>Specialty prompts: General, ICU, ER, Med-Surg, Pediatrics, Cardiac</li>
          <li>Editable Subjective, Objective, Assessment, Plan</li>
          <li>Session review flags and clipboard export</li>
        </ul>

        {/* Top-Right: Architecture & Privacy */}
        <div className="sm:text-right text-xs sm:text-[13px] leading-snug text-[#D4D4D8] font-medium tracking-tight">
          <p className="text-[#F5F5F7] font-semibold">Web Speech API and Groq synthesis</p>
          <p>In-memory session state only</p>
          <p className="text-[#9E9EA6]">Auto-clears 5 minutes after generation</p>
        </div>
      </div>

      {/* CENTER STAGE: MONUMENTAL EDGE-TO-EDGE TYPE + FLOATING DEVICE CUTOUT */}
      <div className="relative my-auto py-12 sm:py-16 flex items-center justify-center w-full">
        <h1 className="monumental-headline relative z-10 w-full text-center text-[13.4vw] sm:text-[12.4vw] lg:text-[11.8vw]">
          <span className="block">NURSENOTE</span>
          <span className="block">AI</span>
        </h1>

        {/* Studio-Lit Titanium Clinical Cutout */}
        <div className="hero-device-cutout pointer-events-none select-none" aria-hidden="true">
          <div className="relative w-[230px] sm:w-[285px] md:w-[325px] aspect-[9/16] rounded-[34px] overflow-hidden border border-white/25 bg-[#121215] p-2.5">
            <div className="studio-bevel-sweep z-30" />

            <div className="relative w-full h-full rounded-[26px] bg-[#0B0B0D] border border-white/10 overflow-hidden flex flex-col justify-between p-4 sm:p-5">
              <div>
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#9E9EA6] pb-3 border-b border-white/10">
                  <span className="text-[#F5F5F7]">NurseNote AI</span>
                  <span>{activeSpecialtyLabel}</span>
                </div>

                <div className="pt-3 pb-2.5 border-b border-white/10">
                  <p className="text-xs sm:text-sm font-bold text-[#F5F5F7] tracking-tight">
                    Shift SOAP Chart
                  </p>
                  <p className="text-[10px] text-[#9E9EA6] mt-0.5">
                    {activeLengthLabel} clinical format
                  </p>
                </div>
              </div>

              <div className="my-auto space-y-2.5 py-2 text-left">
                <div className="pb-2 border-b border-white/10">
                  <p className="text-[10px] font-bold text-[#F5F5F7]">Subjective</p>
                  <p className="text-[10px] sm:text-[11px] leading-snug text-[#A1A1AA] mt-0.5">
                    Patient reports chest tightness 6/10 radiating to left arm for 2 hours.
                  </p>
                </div>

                <div className="pb-2 border-b border-white/10">
                  <p className="text-[10px] font-bold text-[#F5F5F7]">Objective</p>
                  <p className="text-[10px] sm:text-[11px] leading-snug text-[#A1A1AA] mt-0.5">
                    BP 158/94, HR 88, RR 20, SpO2 96% on room air, lungs clear bilaterally.
                  </p>
                </div>

                <div className="pb-2 border-b border-white/10">
                  <p className="text-[10px] font-bold text-[#F5F5F7]">Assessment</p>
                  <p className="text-[10px] sm:text-[11px] leading-snug text-[#A1A1AA] mt-0.5">
                    Acute anginal symptoms in setting of hypertension and type 2 diabetes.
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-[#F5F5F7]">Plan</p>
                  <p className="text-[10px] sm:text-[11px] leading-snug text-[#A1A1AA] mt-0.5">
                    12-lead EKG, troponin panel, continuous telemetry, 2L O2 nasal cannula.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-[10px] text-[#9E9EA6] mb-2">
                  <span className="font-semibold text-[#F5F5F7]">Voice capture ready</span>
                  <span>en-US</span>
                </div>
                <svg viewBox="0 0 240 22" className="w-full h-4 block">
                  <g fill="#F5F5F7" opacity="0.85">
                    <rect x="4" y="8" width="2.5" height="6" rx="1.25" />
                    <rect x="14" y="4" width="2.5" height="14" rx="1.25" />
                    <rect x="24" y="2" width="2.5" height="18" rx="1.25" />
                    <rect x="34" y="6" width="2.5" height="10" rx="1.25" />
                    <rect x="44" y="3" width="2.5" height="16" rx="1.25" />
                    <rect x="54" y="7" width="2.5" height="8" rx="1.25" />
                    <rect x="64" y="1" width="2.5" height="20" rx="1.25" />
                    <rect x="74" y="5" width="2.5" height="12" rx="1.25" />
                    <rect x="84" y="3" width="2.5" height="16" rx="1.25" />
                    <rect x="94" y="8" width="2.5" height="6" rx="1.25" />
                    <rect x="104" y="2" width="2.5" height="18" rx="1.25" />
                    <rect x="114" y="5" width="2.5" height="12" rx="1.25" />
                    <rect x="124" y="4" width="2.5" height="14" rx="1.25" />
                    <rect x="134" y="7" width="2.5" height="8" rx="1.25" />
                    <rect x="144" y="2" width="2.5" height="18" rx="1.25" />
                    <rect x="154" y="6" width="2.5" height="10" rx="1.25" />
                    <rect x="164" y="3" width="2.5" height="16" rx="1.25" />
                    <rect x="174" y="5" width="2.5" height="12" rx="1.25" />
                    <rect x="184" y="8" width="2.5" height="6" rx="1.25" />
                    <rect x="194" y="4" width="2.5" height="14" rx="1.25" />
                    <rect x="204" y="6" width="2.5" height="10" rx="1.25" />
                    <rect x="214" y="8" width="2.5" height="6" rx="1.25" />
                    <rect x="224" y="9" width="2.5" height="4" rx="1.25" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SWISS GRID CORNERS */}
      <div className="relative z-30 pb-20 sm:pb-16 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
        {/* Bottom-Left: Input & Shortcut Details */}
        <div className="text-xs sm:text-[13px] leading-snug text-[#D4D4D8] font-medium tracking-tight">
          <p className="text-[#F5F5F7] font-semibold">Live microphone transcription</p>
          <p className="text-[#9E9EA6]">Press Space to begin or stop bedside dictation</p>
        </div>

        {/* Bottom-Right: Active Profile & Recent Session Count */}
        <div className="sm:text-right text-xs sm:text-[13px] leading-snug text-[#D4D4D8] font-medium tracking-tight">
          <p className="text-[#F5F5F7] font-semibold">
            {activeSpecialtyLabel} — {activeLengthLabel}
          </p>
          <p className="text-[#9E9EA6]">
            {sessions.length > 0
              ? `${sessions.length} active session${sessions.length === 1 ? '' : 's'} in memory`
              : 'Ready for shift charting'}
          </p>
        </div>
      </div>

      {/* LIQUID GLASS DOCK: THREE PRIMARY ACTIONS ONLY */}
      <nav
        aria-label="Charting actions"
        className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md sm:max-w-lg"
      >
        <div className="liquid-dock rounded-full p-1.5 flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={onStart}
            className="flex-1 rounded-full py-2.5 sm:py-3 px-3 sm:px-5 text-xs sm:text-[13px] font-bold tracking-tight bg-[#F5F5F7] text-[#09090B] hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Start recording
          </button>

          <button
            type="button"
            onClick={onDemo}
            className="flex-1 rounded-full py-2.5 sm:py-3 px-3 sm:px-5 text-xs sm:text-[13px] font-semibold tracking-tight text-[#E4E4E7] hover:bg-white/10 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Demo patient
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex-1 rounded-full py-2.5 sm:py-3 px-3 sm:px-5 text-xs sm:text-[13px] font-semibold tracking-tight text-[#E4E4E7] hover:bg-white/10 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Configure
          </button>
        </div>
      </nav>

      {/* CONFIGURATION & RECENT SESSIONS DRAWER */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#111114] border border-white/15 p-6 space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-[#F5F5F7]">Clinical configuration</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-semibold text-[#9E9EA6] hover:text-white px-2 py-1 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Specialty Selector */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#9E9EA6]">Clinical specialty</p>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSpecialtyChange?.(item.id)}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      specialty === item.id
                        ? 'bg-[#F5F5F7] text-[#09090B]'
                        : 'bg-white/5 text-[#D4D4D8] hover:bg-white/15'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Length Selector */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#9E9EA6]">SOAP note length</p>
              <div className="grid grid-cols-3 gap-2">
                {LENGTHS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNoteLengthChange?.(item.id)}
                    className={`py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      noteLength === item.id
                        ? 'bg-[#F5F5F7] text-[#09090B]'
                        : 'bg-white/5 text-[#D4D4D8] hover:bg-white/15'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent In-Memory Sessions */}
            {sessions.length > 0 && (
              <div className="space-y-2.5 border-t border-white/10 pt-4">
                <p className="text-xs font-semibold text-[#9E9EA6]">Recent sessions</p>
                <div className="divide-y divide-white/10">
                  {sessions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        onOpenSession?.(s);
                      }}
                      className="w-full py-2.5 flex items-center justify-between text-left hover:text-white text-[#D4D4D8] cursor-pointer"
                    >
                      <span className="text-xs font-semibold">Session #{s.id}</span>
                      <span className="text-xs text-[#9E9EA6] truncate max-w-[220px]">
                        {s.soap?.subjective || 'Open SOAP note'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Utility Links to Existing Settings / About Screens */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-semibold text-[#9E9EA6]">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onSettings?.();
                }}
                className="hover:text-white cursor-pointer"
              >
                Full settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onAbout?.();
                }}
                className="hover:text-white cursor-pointer"
              >
                About NurseNote AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
