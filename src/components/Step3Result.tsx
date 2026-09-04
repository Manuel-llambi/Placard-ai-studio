import React, { useState } from 'react';
import {
  Sparkles,
  Maximize2,
  Heart,
  Check,
  ArrowRight,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { VtonResult } from '../types';
import { CompareModal } from './CompareModal';

interface Step3ResultProps {
  result: VtonResult;
  onExploreGuest: () => void;
  onAuthSuccess: (provider: 'Apple' | 'Google') => void;
}

export const Step3Result: React.FC<Step3ResultProps> = ({
  result,
  onExploreGuest,
  onAuthSuccess,
}) => {
  const [isFavorite, setIsFavorite] = useState(result.isFavorite);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Mi primer look en Placard VTON',
          text: `Mirá cómo me queda el ${result.garment.name} en mi probador virtual Placard.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 pt-2 pb-10 flex flex-col min-h-[calc(100vh-60px)]">
      {/* VTON Ready Pill Badge */}
      <div className="flex justify-center mb-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3DAC7] text-[#2B2420] text-[11px] font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#7A4655]" />
          <span>VTON READY · CALCE {result.fitPercentage}%</span>
        </div>
      </div>

      {/* Screen Title & Subtitle */}
      <div className="text-center mb-4">
        <h2 className="font-serif text-[27px] font-semibold text-[#2B2420] tracking-tight leading-snug">
          ¡Tu primer look está listo!
        </h2>
        <p className="text-[13.5px] text-[#75695E] mt-1 leading-normal">
          Previsualización con tu silueta y caída orgánica
        </p>
      </div>

      {/* Hero Card with Virtual Try-On Image */}
      <div
        id="vton-hero-card"
        className="relative w-full aspect-[3/4.2] rounded-[20px] overflow-hidden bg-[#ECE4DA] shadow-[0_4px_16px_rgba(43,36,32,0.12)] border border-[#DCD2C4]/40 mb-4 group"
      >
        <img
          src={result.resultImageUrl}
          alt={result.lookTitle}
          className="w-full h-full object-cover select-none"
        />

        {/* Floating Scrim for readability */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#2B2420]/50 to-transparent pointer-events-none" />

        {/* Top-Left: Garment Indicator Chip */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 bg-[#FAF7F2]/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-sm border border-white/40">
          <img
            src={result.garment.imageUrl}
            alt={result.garment.name}
            className="w-5 h-5 rounded-full object-cover border border-[#DCD2C4]"
          />
          <span className="text-[11px] font-medium text-[#2B2420]">
            <span className="text-[#75695E] text-[9.5px] uppercase tracking-wider block leading-none">
              TU PRENDA
            </span>
            {result.garment.name}
          </span>
          <div className="w-4 h-4 rounded-full bg-[#8C9B7E] text-white flex items-center justify-center ml-0.5">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        </div>

        {/* Top-Right: Expand / Compare Button */}
        <button
          id="btn-expand-compare"
          onClick={() => setIsCompareOpen(true)}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md text-[#2B2420] flex items-center justify-center shadow-sm hover:bg-white active:scale-95 transition-all"
          title="Ver comparativa antes / después"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Bottom-Left: AI Styling Pill */}
        <div className="absolute bottom-3.5 left-3.5 px-3 py-1 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md text-[#2B2420] text-[11px] font-medium shadow-xs flex items-center gap-1.5">
          <span className="text-[10px] text-[#7A4655]">‹</span>
          <span>Estilismo generado por IA</span>
        </div>

        {/* Bottom-Right: Favorite Heart Button */}
        <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md text-[#2B2420] flex items-center justify-center shadow-xs hover:bg-white active:scale-95 transition-all"
            title="Compartir look"
          >
            <Share2 className="w-4 h-4 text-[#75695E]" />
          </button>
          <button
            id="btn-favorite-look"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs active:scale-95 transition-all ${
              isFavorite
                ? 'bg-[#7A4655] text-white'
                : 'bg-[#FAF7F2]/90 text-[#2B2420] hover:bg-white'
            }`}
            title="Guardar en favoritos"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-white stroke-white' : 'stroke-[2]'
              }`}
            />
          </button>
        </div>
      </div>

      {shareSuccess && (
        <div className="mb-3 px-3 py-2 bg-[#FAF7F2] border border-[#8C9B7E] rounded-[10px] text-[12px] text-[#2B2420] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#8C9B7E]" />
          <span>¡Enlace del look copiado al portapapeles!</span>
        </div>
      )}

      {/* Look Metadata & Description */}
      <div className="mb-5 px-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-serif text-[18px] sm:text-[19px] font-medium text-[#2B2420]">
            {result.lookTitle}
          </h3>
          <span className="shrink-0 px-2.5 py-0.5 rounded-[8px] bg-[#ECE4DA] text-[#2B2420] text-[11px] font-medium border border-[#DCD2C4]/70 flex items-center gap-1">
            <Check className="w-2.5 h-2.5 text-[#8C9B7E]" />
            <span>{result.size}</span>
          </span>
        </div>
        <p className="text-[13px] text-[#75695E] mt-1 leading-snug">
          {result.stylingDescription}
        </p>
      </div>

      {/* Value Proposition & Conversion Card (The Core Goal) */}
      <div
        id="value-proposition-conversion-card"
        className="bg-[#ECE4DA] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(43,36,32,0.06)] border border-[#DCD2C4]/60 flex flex-col"
      >
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#7A4655] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4a3 3 0 0 1 3 3c0 .88-.38 1.67-1 2.22V10l7 6H3l7-6v-.78A3 3 0 0 1 12 4z" />
              <line x1="3" y1="16" x2="21" y2="16" />
            </svg>
          </div>

          <div>
            <h4 className="font-serif text-[17px] font-medium text-[#2B2420] leading-snug">
              Guardá este look y sumá todo tu placard
            </h4>
            <p className="text-[12.5px] text-[#75695E] mt-1 leading-relaxed">
              Tu prenda y silueta ya están procesadas. Creá tu acceso gratis para conservarlas y armar conjuntos ilimitados.
            </p>
          </div>
        </div>

        {/* Auth Action Buttons */}
        <div className="space-y-2.5">
          <button
            id="btn-auth-apple"
            onClick={() => onAuthSuccess('Apple')}
            className="w-full py-3 px-4 rounded-[14px] bg-[#2B2420] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#1e1b15] active:scale-[0.98] transition-all shadow-xs"
          >
            {/* Apple Logo SVG */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.89-11.96-14.54-7.25-11.24-12.82-24.16-16.71-38.74-3.89-14.59-5.83-27.91-5.83-39.99 0-14.99 3.59-27.32 10.77-37 7.18-9.69 16.38-14.65 27.6-14.88 4.7 0 10.02 1.25 15.96 3.76 5.94 2.51 9.77 3.82 11.51 3.93 1.9.11 5.92-1.35 12.06-4.38 6.13-3.04 11.45-4.4 15.96-4.08 17.52 1.37 30.68 8.42 39.46 21.17-15.35 9.32-22.92 22.18-22.7 38.58.23 12.84 5.09 23.47 14.59 31.9 4.35 3.91 9.24 6.78 14.68 8.62-3.07 9.1-7.1 18.25-12.09 27.46zM119.22 33.5c0-7.39 2.65-14.58 7.95-21.57 5.3-6.99 11.95-11.45 19.95-13.38.74 7.61-1.63 14.98-7.1 22.1-5.47 7.12-12.4 11.45-20.8 12.85z" />
            </svg>
            <span>Continuar con Apple</span>
          </button>

          <button
            id="btn-auth-google"
            onClick={() => onAuthSuccess('Google')}
            className="w-full py-2.5 px-4 rounded-[14px] bg-[#FAF7F2] text-[#2B2420] border border-[#DCD2C4] font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-white active:scale-[0.98] transition-all shadow-xs"
          >
            {/* Google Logo SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>
        </div>

        {/* Guest Mode Link */}
        <div className="text-center mt-3.5">
          <button
            id="btn-explore-as-guest"
            onClick={onExploreGuest}
            className="text-[13px] text-[#75695E] hover:text-[#2B2420] font-medium inline-flex items-center gap-1 group py-1"
          >
            <span>Explorar la app como invitada</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Before / After Fullscreen Modal */}
      {isCompareOpen && (
        <CompareModal
          result={result}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </div>
  );
};
