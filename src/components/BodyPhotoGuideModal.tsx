import React from 'react';
import { Camera, X, Check, Sun, Maximize2, ShieldCheck, User } from 'lucide-react';
import { GUIDE_PHOTOS } from '../data/samples';

interface BodyPhotoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BodyPhotoGuideModal: React.FC<BodyPhotoGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2B2420]/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#F6F1EA] rounded-t-[24px] sm:rounded-[24px] border-t sm:border border-[#DCD2C4] shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#F6F1EA]/95 backdrop-blur-md px-5 pt-4 pb-3 border-b border-[#DCD2C4]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#7A4655]/15 text-[#7A4655] flex items-center justify-center">
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10.5px] font-semibold text-[#7A4655] uppercase tracking-wider block">
                FOTO DE REFERENCIA · GUÍA DE CUERPO
              </span>
              <h3 className="font-serif text-[18px] font-semibold text-[#2B2420] leading-tight">
                Cómo sacar la foto perfecta
              </h3>
            </div>
          </div>

          <button
            id="btn-close-body-guide"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ECE4DA] text-[#75695E] hover:text-[#2B2420] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <p className="text-[13px] text-[#75695E] leading-relaxed">
            Para que la prenda calce con proporciones y caída natural sobre tu silueta, seguí estos consejos al posar:
          </p>

          {/* Comparative visual cards: Así sí vs Así no */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Así sí */}
            <div className="bg-[#FAF7F2] rounded-[16px] p-2.5 border border-[#DCD2C4]/70 shadow-xs flex flex-col">
              <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8C9B7E] mb-2">
                <div className="w-4 h-4 rounded-full bg-[#8C9B7E]/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3] text-[#8C9B7E]" />
                </div>
                <span>Así sí</span>
              </div>
              <div className="w-full aspect-[4/3] rounded-[10px] overflow-hidden bg-[#ECE4DA] mb-2 relative">
                <img
                  src={GUIDE_PHOTOS.asiSi.url}
                  alt={GUIDE_PHOTOS.asiSi.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11.5px] font-medium text-[#2B2420] block">
                Luz de frente y postura recta
              </span>
              <p className="text-[10.5px] text-[#75695E] mt-0.5 leading-snug">
                {GUIDE_PHOTOS.asiSi.description}
              </p>
            </div>

            {/* Así no */}
            <div className="bg-[#FAF7F2] rounded-[16px] p-2.5 border border-[#DCD2C4]/70 shadow-xs flex flex-col">
              <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#A85A46] mb-2">
                <div className="w-4 h-4 rounded-full bg-[#A85A46]/20 flex items-center justify-center">
                  <X className="w-2.5 h-2.5 stroke-[3] text-[#A85A46]" />
                </div>
                <span>Así no</span>
              </div>
              <div className="w-full aspect-[4/3] rounded-[10px] overflow-hidden bg-[#ECE4DA] mb-2 relative">
                <img
                  src={GUIDE_PHOTOS.asiNo.url}
                  alt={GUIDE_PHOTOS.asiNo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11.5px] font-medium text-[#2B2420] block">
                Foto cortada o a oscuras
              </span>
              <p className="text-[10.5px] text-[#75695E] mt-0.5 leading-snug">
                {GUIDE_PHOTOS.asiNo.description}
              </p>
            </div>
          </div>

          {/* 3 Step-by-step guidance cards */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-3 p-3 rounded-[14px] bg-[#FAF7F2] border border-[#DCD2C4]/60">
              <div className="w-8 h-8 rounded-full bg-[#ECE4DA] text-[#7A4655] flex items-center justify-center shrink-0 mt-0.5">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[13px] font-semibold text-[#2B2420] leading-snug">
                  Cuerpo entero de pies a cabeza
                </h5>
                <p className="text-[12px] text-[#75695E] leading-relaxed mt-0.5">
                  Apoyá el teléfono a la altura del pecho o pedile a alguien que te saque la foto a un metro y medio de distancia.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-[14px] bg-[#FAF7F2] border border-[#DCD2C4]/60">
              <div className="w-8 h-8 rounded-full bg-[#ECE4DA] text-[#AD8A56] flex items-center justify-center shrink-0 mt-0.5">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[13px] font-semibold text-[#2B2420] leading-snug">
                  Luz natural sin sombras duras
                </h5>
                <p className="text-[12px] text-[#75695E] leading-relaxed mt-0.5">
                  Ubicarse cerca de una ventana ayuda a que los contornos y texturas de la ropa se definan con naturalidad.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-[14px] bg-[#FAF7F2] border border-[#DCD2C4]/60">
              <div className="w-8 h-8 rounded-full bg-[#ECE4DA] text-[#75695E] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[13px] font-semibold text-[#2B2420] leading-snug">
                  Ropa base neutra o entallada
                </h5>
                <p className="text-[12px] text-[#75695E] leading-relaxed mt-0.5">
                  Una remera básica o calza deportiva permite al modelo de IA identificar tu silueta sin superponer volúmenes extra.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy reminder matching Content System rule 7 */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-[#D3DAC7]/30 border border-[#8C9B7E]/40 text-[#2B2420] text-[11.5px]">
            <ShieldCheck className="w-4 h-4 text-[#8C9B7E] shrink-0" />
            <span>Esta foto se borra sola a las 72 horas y nunca se usa para entrenar IA.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
