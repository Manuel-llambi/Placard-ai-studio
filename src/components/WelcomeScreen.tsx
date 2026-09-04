import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-5 pt-3 pb-8 flex flex-col min-h-[calc(100vh-60px)]">
      {/* Main Title & Value Prop */}
      <div className="text-center mb-4 pt-2">
        <h2 className="font-serif text-[28px] sm:text-[30px] font-semibold text-[#2B2420] tracking-tight leading-tight">
          Descubrí cómo te queda lo que ya tenés
        </h2>
        <p className="text-[14px] text-[#75695E] mt-2 leading-relaxed max-w-[340px] mx-auto">
          Probate combinaciones con tus prendas reales sin desordenar tu placard y sin necesidad de cargar 100 prendas para empezar.
        </p>
      </div>

      {/* Hero Visual Card showing the VTON Concept */}
      <div className="relative rounded-[20px] overflow-hidden bg-[#ECE4DA] border border-[#DCD2C4]/60 shadow-[0_2px_12px_rgba(43,36,32,0.08)] mb-5">
        <div className="aspect-[16/10] w-full overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop"
            alt="Placard de prendas en lino y luz natural"
            className="w-full h-full object-cover select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2420]/75 via-[#2B2420]/20 to-transparent" />

          <div className="absolute bottom-3 left-3 right-3 flex items-center text-white">
            <div className="flex items-center gap-2">
              {/* Garment mini thumb */}
              <div className="w-8 h-8 rounded-full border border-white/60 overflow-hidden bg-white/20 backdrop-blur-xs">
                <img
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop"
                  alt="Prenda"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[12px] font-medium leading-tight">
                Prenda + Tu silueta
                <span className="block text-[10px] text-[#FAF7F2]/75">
                  Calce virtual orgánico
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* "Lo que vas a hacer a continuación" Steps Section */}
      <div className="bg-[#ECE4DA]/70 rounded-[18px] p-4 border border-[#DCD2C4]/60 mb-4">
        <span className="text-[11px] font-semibold tracking-wider text-[#75695E] uppercase block mb-3">
          ¿CÓMO FUNCIONA ESTA PRUEBA? (EN 3 PASOS):
        </span>

        <div className="space-y-3">
          {/* Step 1 item */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#7A4655] text-white text-[12px] font-semibold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              1
            </div>
            <div className="flex-1">
              <h4 className="text-[13.5px] font-semibold text-[#2B2420] leading-snug">
                Elegí una prenda que ames
              </h4>
              <p className="text-[12px] text-[#75695E] leading-normal mt-0.5">
                Subí una foto de tu ropa (la recortamos sola) o elegí una de muestra ya preparada.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="ml-3 pl-3 border-l border-[#DCD2C4]/80 -my-1 h-2" />

          {/* Step 2 item */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#7A4655] text-white text-[12px] font-semibold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              2
            </div>
            <div className="flex-1">
              <h4 className="text-[13.5px] font-semibold text-[#2B2420] leading-snug">
                Subí tu foto de referencia
              </h4>
              <p className="text-[12px] text-[#75695E] leading-normal mt-0.5">
                Una foto de cuerpo entero o usá el demo de Camila para ver el resultado de inmediato.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="ml-3 pl-3 border-l border-[#DCD2C4]/80 -my-1 h-2" />

          {/* Step 3 (Outcome) */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#7A4655] text-white text-[12px] font-semibold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              3
            </div>
            <div className="flex-1">
              <h4 className="text-[13.5px] font-semibold text-[#2B2420] leading-snug">
                Mirá tu look puesto en 10 segundos
              </h4>
              <p className="text-[12px] text-[#75695E] leading-normal mt-0.5">
                Visualizá el calce orgánico y guardalo en tu placard digital si te gusta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Privacy Guarantee Banner */}
      <div className="bg-[#FAF7F2] border border-[#DCD2C4]/80 rounded-[14px] p-3 flex items-center gap-2.5 mb-5 shadow-xs">
        <div className="w-7 h-7 rounded-full bg-[#8C9B7E]/15 text-[#8C9B7E] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <p className="text-[12px] text-[#2B2420] leading-snug">
          <strong className="font-semibold text-[#2B2420]">Privacidad garantizada:</strong> Tus fotos no son públicas ni se comparten con terceros.
        </p>
      </div>

      {/* Primary CTA Button */}
      <div className="mt-auto">
        <button
          id="btn-welcome-start"
          onClick={onStart}
          className="w-full py-3.5 px-4 rounded-[14px] bg-[#7A4655] text-white font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#693846] active:scale-[0.98] transition-all shadow-sm group"
        >
          <span>Comenzar mi primera prueba</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
