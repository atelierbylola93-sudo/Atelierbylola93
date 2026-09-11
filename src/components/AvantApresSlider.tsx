import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { BEFORE_AFTER_ITEMS } from '../data';
import { motion } from 'motion/react';
import { ArrowLeftRight } from 'lucide-react';

export default function AvantApresSlider() {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0-100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const activeItem = BEFORE_AFTER_ITEMS[activeItemIndex];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (e.buttons === 1 || isDraggingRef.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div id="avant-apres-slider" className="w-full max-w-4xl mx-auto rounded-[24px] overflow-hidden bg-white p-6 border border-[#B88F4D]/15 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#B88F4D] font-semibold">Preuves Réelles</span>
          <h3 className="font-serif text-3xl font-medium text-charcoal mt-1">Résultats Avant / Après</h3>
          <p className="text-secondary-gray text-sm mt-1">Glissez le curseur pour contempler la transformation instantanée.</p>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {BEFORE_AFTER_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItemIndex(idx);
                setSliderPosition(50);
              }}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-[24px] font-medium transition-all duration-300 ${
                activeItemIndex === idx
                  ? 'bg-[#B88F4D] text-white'
                  : 'bg-[#EFE7D2] text-secondary-gray hover:bg-[#A3A485]/10 hover:text-[#1E1E1E]'
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Slider Area */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onMouseLeave={handlePointerUp}
        className="relative h-[320px] md:h-[450px] w-full rounded-[24px] overflow-hidden select-none cursor-ew-resize border border-[#EFE7D2] shadow-inner"
      >
        {/* BEFORE IMAGE (Full-sized background) */}
        <img
          src={activeItem.beforeUrl}
          alt="Avant l'Atelier Lola"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
        <div className="absolute top-4 left-4 z-10 glass-dark text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-[24px]">
          Avant
        </div>

        {/* AFTER IMAGE (Clipped overlay) */}
        <div
          className="absolute inset-0 h-full overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={activeItem.afterUrl}
            alt="Après l'Atelier Lola"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-[320px] md:h-[450px] w-full max-w-none object-cover"
            style={{ width: containerRef.current?.getBoundingClientRect().width || '100vw' }}
          />
          <div className="absolute top-4 left-4 z-10 bg-[#B88F4D] text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-[24px]">
            Après
          </div>
        </div>

        {/* DRAG HANDLE BAR */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-[#B88F4D] border-4 border-white shadow-lg flex items-center justify-center text-white">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <h4 className="font-serif italic font-medium text-base text-charcoal">{activeItem.title}</h4>
      </div>
    </div>
  );
}
