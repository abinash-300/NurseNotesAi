import React, { useRef, useEffect } from 'react';

export default function AudioWaveform({ active, height = 80 }) {
  const canvasRef  = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let rafId     = null;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize               = 256;
        analyser.smoothingTimeConstant = 0.82;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufLen   = analyser.frequencyBinCount;
        const dataBuf  = new Uint8Array(bufLen);

        cleanupRef.current = () => {
          stream.getTracks().forEach((t) => t.stop());
          audioCtx.close().catch(() => {});
        };

        const draw = () => {
          if (cancelled) return;
          rafId = requestAnimationFrame(draw);

          const canvas = canvasRef.current;
          if (!canvas) return;

          analyser.getByteTimeDomainData(dataBuf);

          const ctx = canvas.getContext('2d');
          const W   = canvas.width;
          const H   = canvas.height;
          ctx.clearRect(0, 0, W, H);

          ctx.lineWidth   = 3;
          ctx.strokeStyle = 'rgba(6,182,212,0.60)';
          ctx.lineJoin    = 'round';
          ctx.lineCap     = 'round';
          ctx.beginPath();

          const step = W / (bufLen - 1);
          for (let i = 0; i < bufLen; i++) {
            const v = dataBuf[i] / 128.0;
            const y = (v * H) / 2;
            if (i === 0) ctx.moveTo(0, y);
            else         ctx.lineTo(i * step, y);
          }
          ctx.stroke();
        };

        draw();
      })
      .catch(() => {
        /* mic already held by speech recognition — silently skip; parent keeps static bars visible */
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={height * 2}
      style={{ width: '100%', height, display: 'block' }}
    />
  );
}
