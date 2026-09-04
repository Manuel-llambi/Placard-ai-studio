import React from 'react';
import { Camera, X, Check, Sun, Sparkles, Shirt, Maximize2, ShieldCheck } from 'lucide-react';

interface GarmentPhotoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTakePhoto?: () => void;
  onUploadGallery?: () => void;
  onStartLiveCamera?: () => void;
}

export const GarmentPhotoGuideModal: React.FC<GarmentPhotoGuideModalProps> = ({
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
              <Camera className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10.5px] font-semibold text-[#7A4655] uppercase tracking-wider block">
                PRENDA PROPIA · GUÍA DE FOTO
              </span>
              <h3 className="font-serif text-[18px] font-semibold text-[#2B2420] leading-tight">
                Cómo sacar la foto perfecta
              </h3>
            </div>
          </div>

          <button
            id="btn-close-garment-guide"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ECE4DA] text-[#75695E] hover:text-[#2B2420] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <p className="text-[13px] text-[#75695E] leading-relaxed">
            Nuestra IA recortará la prenda y la adaptará a tu silueta. Para que conserve su textura, color y caída natural, seguí estos consejos:
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
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
                  alt="Prenda estirada en percha con buena luz"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
              <p className="text-[11px] text-[#75695E] leading-snug">
                En percha o sobre la cama, estirada y con luz natural suave.
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
                  src="https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=600&auto=format&fit=crop"
                  alt="Prenda arrugada o en desorden"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
              <p className="text-[11px] text-[#75695E] leading-snug">
                Arrugada, doblada en el suelo o con sombra del celular tapándola.
              </p>
            </div>
          </div>

          {/* 4 Core Indications */}
          <div className="bg-[#FAF7F2] rounded-[18px] p-3.5 border border-[#DCD2C4]/70 space-y-3">
            <span className="text-[11px] font-semibold tracking-wider text-[#75695E] uppercase block mb-1">
              4 CLAVES PARA UNA FOTO IMPECABLE:
            </span>

            {/* Point 1 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#ECE4DA] text-[#7A4655] flex items-center justify-center shrink-0 mt-0.5 font-semibold text-[12px]">
                1
              </div>
              <div>
                <h5 className="text-[13px] font-semibold text-[#2B2420] leading-snug">
                  En percha o estirada sobre una superficie plana
                </h5>
                <p className="text-[12px] text-[#75695E] leading-relaxed mt-0.5">
                  Colgala contra una pared lisa o extendela estirada sobre tu cama. Evitá que queden pliegues o mangas dobladas hacia atrás.
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#ECE4DA] text-[#7A4655] flex items-center justify-center shrink-0 mt-0.5 font-semibold text-[12px]">
                2
              </div>
              <div>
                <h5 className="text-[13px] font-semibold text-[#2B2420] leading-snug">
                  Luz natural de día y sin sombras del teléfono
                </h5>
                <p className="text-[12px] text-[#75695E] leading-relaxed mt-0.5">
                  Ubicá la prenda cerca de una ventana. Cuidá tu postura para que la sombra de tu cuerpo o celular no tape la prenda.
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#ECE4DA] text-[#7A4655] flex items-center justify-center shrink-0 mt-0.5 font-semibold text-[12px]">
                3
              </div>
              <div>
                <h5 className="text-[13px] font-semibold text-[#2B2420] leading-snug">
                  Toda la prenda dentro del encuadre
                </h5>
                <p className="text-[12px] text-[#75695E] leading-relaxed mt-0.5">
                  Dejá un pequeño margen de aire alrededor. El cuello, los hombros, los puños y el dobladillo deben verse completos.
                </p>
              </div>
            </div>

            {/* Point 4 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#ECE4DA] text-[#7A4655] flex items-center justify-center shrink-0 mt-0.5 font-semibold text-[12px]">
                4
              </div>
              <div>
                <h5 className="text-[13px] font-semibold text-[#2B2420] leading-snug">
                  Fondo contrastante y liso
                </h5>
                <p className="text-[12px] text-[#75695E] leading-relaxed mt-0.5">
                  Si tu prenda es clara, usá una pared o colcha oscura. Si la prenda es oscura, usá un fondo claro para que el recorte sea perfecto.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy reminder */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-[#D3DAC7]/30 border border-[#8C9B7E]/40 text-[#2B2420] text-[11.5px]">
            <ShieldCheck className="w-4 h-4 text-[#8C9B7E] shrink-0" />
            <span>Tus fotos se procesan de forma privada y segura.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
