import React, { useEffect, useState } from 'react';
import { Sparkles, FastForward } from 'lucide-react';
import { Garment } from '../types';

interface ProcessingModalProps {
  garment: Garment;
  onComplete: () => void;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  garment,
  onComplete,
}) => {
  const [progress, setProgress] = useState(12);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    'Segmentando silueta y recortando fondo...',
    `Conservando texturas y caída de ${garment.name}...`,
    'Mapeando volumen corporal y drapeado textil...',
    'Aplicando luz natural y acabado editorial...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 400);
          return 100;
        }
        const increment = prev < 60 ? 12 : prev < 85 ? 8 : 5;
        const next = Math.min(prev + increment, 100);

        if (next > 75) setCurrentStepIndex(3);
        else if (next > 50) setCurrentStepIndex(2);
        else if (next > 25) setCurrentStepIndex(1);

        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F1EA]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-xs flex flex-col items-center">
        {/* Brand Loader: Animated Textile Hanger */}
        <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
          <div className="animate-hanger-swing text-[#7A4655]">
            <svg
              className="w-20 h-20"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Hook */}
              <path d="M32 14c0-4.418 3.582-8 8-8s8 3.582 8 8c0 3.5-2.2 6.5-5.5 7.5L32 24" />
              {/* Triangle hanger frame */}
              <path d="M32 24L8 42h48L32 24z" />
              {/* Horizontal bottom bar */}
              <line x1="8" y1="42" x2="56" y2="42" />
              {/* Lower garment bar notch */}
              <line x1="20" y1="46" x2="44" y2="46" strokeWidth="1.5" strokeOpacity="0.5" />
            </svg>
          </div>
          <div className="absolute -bottom-1 w-12 h-1 bg-[#2B2420]/10 rounded-full blur-[2px]" />
        </div>

        {/* Status text */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE4DA] text-[#7A4655] text-[12px] font-semibold tracking-wide uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VTON Engine</span>
        </div>

        <h3 className="font-serif text-[22px] font-medium text-[#2B2420] tracking-tight leading-snug mb-2">
          Creando tu primer look
        </h3>

        <p className="text-[13px] text-[#75695E] min-h-[40px] px-2 leading-relaxed transition-all">
          {steps[currentStepIndex]}
        </p>

        {/* Linear progress in Ciruela suave & Ciruela */}
        <div className="w-full bg-[#ECE4DA] h-2 rounded-full overflow-hidden mt-6 mb-2.5">
          <div
            className="h-full bg-[#7A4655] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full flex items-center justify-between text-[11px] font-medium text-[#75695E]">
          <span>Calce orgánico</span>
          <span className="font-semibold text-[#2B2420]">{progress}%</span>
        </div>

        {/* Skip button for quick review */}
        <button
          onClick={onComplete}
          className="mt-8 text-[12px] text-[#75695E] hover:text-[#7A4655] flex items-center gap-1.5 underline decoration-dotted transition-colors"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Acelerar resultado</span>
        </button>
      </div>
    </div>
  );
};
