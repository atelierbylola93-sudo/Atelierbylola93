import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import avantAsset from '../assets/blanchiment-avant.webp';
import apresAsset from '../assets/blanchiment-apres.webp';

export default function BlanchimentAvantApres() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(pct);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [updateFromClientX]);

  const startDrag = (clientX: number) => {
    draggingRef.current = true;
    updateFromClientX(clientX);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center space-y-3 mb-8">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#B88F4D] font-bold">
          Résultats visibles
        </span>
        <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-medium">
          Avant / Après une séance
        </h3>
        <p className="text-secondary-gray text-xs md:text-sm italic font-serif">
          Faites glisser le curseur avec votre doigt pour découvrir la transformation
        </p>
      </div>

      <div
        ref={containerRef}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          startDrag(e.clientX);
        }}
        className="relative aspect-[3/2] w-full rounded-[24px] overflow-hidden select-none touch-none cursor-ew-resize border border-[#B88F4D]/15 shadow-lg bg-black"
      >
        {/* AVANT (full background) */}
        <img
          src={avantAsset}
          alt="Avant blanchiment dentaire — L'Atelier Lola"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm text-white text-[10px] md:text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
          Avant
        </div>

        {/* APRÈS (clipped overlay) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={apresAsset}
            alt="Après blanchiment dentaire — L'Atelier Lola"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div
          className="absolute top-4 right-4 z-10 bg-[#B88F4D] text-white text-[10px] md:text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full shadow pointer-events-none"
          style={{ opacity: pos > 15 ? 1 : 0.35 }}
        >
          Après
        </div>


        {/* Handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white z-20 shadow-[0_0_12px_rgba(0,0,0,0.4)] pointer-events-none"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#B88F4D] border-4 border-white shadow-xl flex items-center justify-center text-white">
            <ArrowLeftRight className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
