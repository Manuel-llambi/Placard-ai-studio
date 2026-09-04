import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { VtonResult } from '../types';

interface CompareModalProps {
  result: VtonResult;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ result, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeTab, setActiveTab] = useState<'slider' | 'sideBySide'>('slider');

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2420]/80 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#F6F1EA] rounded-[24px] overflow-hidden flex flex-col shadow-2xl max-h-[92vh]">
        {/* Header */}
        <div className="p-4 px-5 border-b border-[#DCD2C4]/60 flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <span className="text-[11px] font-semibold text-[#8C9B7E] uppercase tracking-wider block">
              Comparativa de calce virtual
            </span>
            <h3 className="font-serif text-[18px] font-medium text-[#2B2420]">
              {result.lookTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ECE4DA] text-[#2B2420] flex items-center justify-center hover:bg-[#DCD2C4] transition-all"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center justify-center gap-2 p-2 bg-[#ECE4DA]/60 border-b border-[#DCD2C4]/40">
          <button
            onClick={() => setActiveTab('slider')}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
              activeTab === 'slider'
                ? 'bg-[#7A4655] text-white shadow-xs'
                : 'text-[#75695E] hover:text-[#2B2420]'
            }`}
          >
            Deslizador Antes / Después
          </button>
          <button
            onClick={() => setActiveTab('sideBySide')}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
              activeTab === 'sideBySide'
                ? 'bg-[#7A4655] text-white shadow-xs'
                : 'text-[#75695E] hover:text-[#2B2420]'
            }`}
          >
            Lado a lado
          </button>
        </div>

        {/* Content area */}
        <div className="p-4 flex-1 overflow-y-auto flex flex-col items-center justify-center">
          {activeTab === 'slider' ? (
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-[18px] overflow-hidden select-none shadow-md border border-[#DCD2C4]">
              {/* After: VTON Result */}
              <img
                src={result.resultImageUrl}
                alt="Resultado VTON"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Before: Reference Photo clipped */}
              <div
                className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={result.referencePhoto.imageUrl}
                  alt="Referencia original"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                  Foto original
                </span>
              </div>

              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#7A4655]/90 backdrop-blur-xs text-white text-[10px] font-medium">
                VTON Placard
              </span>

              {/* Slider thumb handle */}
              <div
                className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center"
                style={{ left: `calc(${sliderPos}% - 16px)` }}
              >
                <div className="w-8 h-8 rounded-full bg-white text-[#7A4655] shadow-lg flex items-center justify-center border-2 border-[#7A4655]">
                  <Sliders className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* Invisible interactive input */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Deslizar para comparar"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-[#75695E] mb-1 text-center">
                  Tu referencia
                </span>
                <div className="aspect-[3/4] rounded-[14px] overflow-hidden bg-[#ECE4DA] border border-[#DCD2C4]">
                  <img
                    src={result.referencePhoto.imageUrl}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-[#7A4655] mb-1 text-center flex items-center justify-center gap-1">
                  <span>Con {result.garment.name}</span>
                  <Check className="w-3 h-3 text-[#8C9B7E]" />
                </span>
                <div className="aspect-[3/4] rounded-[14px] overflow-hidden bg-[#ECE4DA] border-2 border-[#7A4655]/40 shadow-sm">
                  <img
                    src={result.resultImageUrl}
                    alt="Con prenda"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <span className="text-[12px] text-[#75695E]">
              Calce estimado: <strong className="text-[#2B2420]">{result.fitPercentage}% de concordancia anatómica</strong> con silueta real.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#DCD2C4]/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-[12px] bg-[#7A4655] text-white text-[13px] font-medium hover:bg-[#693846] transition-all"
          >
            Cerrar comparativa
          </button>
        </div>
      </div>
    </div>
  );
};
