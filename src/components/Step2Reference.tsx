import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { Garment, ReferencePhoto } from '../types';
import { DEMO_REFERENCE_PHOTO, GUIDE_PHOTOS } from '../data/samples';
import { BodyPhotoGuideModal } from './BodyPhotoGuideModal';

interface Step2ReferenceProps {
  selectedGarment: Garment;
  referencePhoto: ReferencePhoto | null;
  onSelectReferencePhoto: (photo: ReferencePhoto) => void;
  onGenerate: () => void;
}

export const Step2Reference: React.FC<Step2ReferenceProps> = ({
  selectedGarment,
  referencePhoto,
  onSelectReferencePhoto,
  onGenerate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Auto-select demo photo if none selected initially, but allow full customization
  useEffect(() => {
    if (!referencePhoto) {
      onSelectReferencePhoto(DEMO_REFERENCE_PHOTO);
    }
  }, [referencePhoto, onSelectReferencePhoto]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const customPhoto: ReferencePhoto = {
          id: `ref-${Date.now()}`,
          name: file.name,
          imageUrl: event.target?.result as string,
          isDemo: false,
        };
        onSelectReferencePhoto(customPhoto);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
      });
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable, falling back to input', err);
      cameraInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 960;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const photo: ReferencePhoto = {
          id: `camera-snap-${Date.now()}`,
          name: 'Foto tomada en vivo',
          imageUrl: dataUrl,
          isDemo: false,
          isLive: true,
        };
        onSelectReferencePhoto(photo);
        stopCamera();
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 pt-2 pb-8 flex flex-col min-h-[calc(100vh-60px)]">
      {/* Hidden Inputs for Gallery & Direct Camera Capture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Step Indicator & Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#75695E] uppercase mb-1.5">
          <span>Paso 2 de 2 • Tu cuerpo</span>
          <span className="font-sans text-[#7A4655]">100%</span>
        </div>
        <div className="w-full h-1 bg-[#ECE4DA] rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#7A4655] rounded-full" />
        </div>
      </div>

      {/* Garment Ready Status Banner */}
      <div className="bg-[#FAF7F2] border border-[#DCD2C4]/70 rounded-[14px] p-2.5 flex items-center justify-between mb-4 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={selectedGarment.imageUrl}
            alt={selectedGarment.name}
            className="w-11 h-11 rounded-[8px] object-cover border border-[#DCD2C4]"
          />
          <div className="min-w-0">
            <span className="text-[11px] text-[#75695E] uppercase font-semibold tracking-wide block">
              Prenda lista
            </span>
            <p className="text-[14px] font-medium text-[#2B2420] truncate">
              {selectedGarment.name}
            </p>
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-[#8C9B7E]/20 text-[#8C9B7E] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 fill-[#8C9B7E] text-white stroke-[2]" />
        </div>
      </div>

      {/* Headline & Description */}
      <div className="mb-4">
        <h2 className="font-serif text-[26px] font-semibold text-[#2B2420] tracking-tight leading-snug">
          Ahora, tu foto de referencia
        </h2>
        <p className="text-[13.5px] text-[#75695E] mt-1 leading-relaxed">
          Una foto de cuerpo entero para adaptar la prenda a tu silueta real. Podés tomarte una foto ahora o subir una de tu galería.
        </p>
      </div>

      {/* Interactive Body Capture & Upload Card (Same Component Layout & Background as Step 1) */}
      <div
        id="body-capture-card"
        className="bg-[#ECE4DA] rounded-[20px] p-4 sm:p-5 mb-5 border border-transparent shadow-[0_1px_3px_rgba(43,36,32,0.06)] text-center flex flex-col items-center relative overflow-hidden transition-all"
      >
        {isCameraActive ? (
          /* Live Camera View within the Card */
          <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
            <div className="relative w-full aspect-[3/4] max-h-[340px] rounded-[16px] overflow-hidden bg-black mb-3">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-44 h-64 border-2 border-dashed border-white/70 rounded-full opacity-80" />
              </div>
            </div>

            <div className="w-full flex items-center gap-2">
              <button
                onClick={stopCamera}
                className="py-2.5 px-4 rounded-[12px] bg-[#FAF7F2] text-[#75695E] text-[13px] font-medium border border-[#DCD2C4]"
              >
                Cancelar
              </button>
              <button
                onClick={captureCameraSnapshot}
                className="flex-1 py-3 px-4 rounded-[14px] bg-[#7A4655] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#693846] shadow-sm active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Capturar foto</span>
              </button>
            </div>
          </div>
        ) : (
          /* Standard Card View */
          <>
            <div className="w-13 h-13 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#7A4655] shadow-xs mb-2.5">
              <Camera className="w-6 h-6 stroke-[1.8]" />
            </div>

            <h3 className="font-sans font-semibold text-[17px] text-[#2B2420]">
              Capturá tu foto de cuerpo
            </h3>
            <p className="text-[13px] text-[#75695E] mt-1 mb-2 leading-normal max-w-[290px]">
              Nuestra IA adaptará la prenda a tu silueta real, respetando tus proporciones.
            </p>

            {/* Direct Trigger to Open Guide Modal */}
            <button
              id="btn-open-body-tips"
              onClick={() => setIsGuideModalOpen(true)}
              className="inline-flex items-center gap-1 text-[12px] text-[#7A4655] font-semibold hover:underline mb-4 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7A4655]" />
              <span>¿Cómo sacar una buena foto? Ver indicaciones</span>
            </button>

            {/* Main Action Buttons */}
            <div className="w-full space-y-2.5">
              <button
                id="btn-take-photo-body"
                onClick={startLiveCamera}
                className="w-full py-3 px-4 rounded-[14px] bg-[#7A4655] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#693846] active:scale-[0.98] transition-all shadow-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Tomar foto a mi cuerpo</span>
              </button>

              <button
                id="btn-upload-gallery-body"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-[14px] bg-[#FAF7F2] text-[#2B2420] border border-[#DCD2C4] font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-white active:scale-[0.98] transition-all"
              >
                <ImageIcon className="w-4 h-4 text-[#75695E]" />
                <span>Subir de mi galería</span>
              </button>
            </div>

            {/* Synthesized Visual Guidance inside the Card */}
            <div
              id="synthesized-body-guidance"
              className="w-full mt-3.5 pt-3 border-t border-[#DCD2C4]/70 text-left"
            >
              <div className="flex items-center justify-between mb-2 px-0.5">
                <span className="text-[10.5px] font-semibold text-[#75695E] uppercase tracking-wider">
                  Recomendaciones para tu foto:
                </span>
                <button
                  type="button"
                  onClick={() => setIsGuideModalOpen(true)}
                  className="text-[11px] font-medium text-[#7A4655] hover:underline"
                >
                  Ver más detalles
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                {/* Así sí */}
                <div className="bg-[#FAF7F2] rounded-[14px] p-2 border border-[#DCD2C4]/60 flex flex-col shadow-2xs">
                  <div className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden mb-1.5 bg-[#ECE4DA]">
                    <img
                      src={GUIDE_PHOTOS.asiSi.url}
                      alt="Así sí"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#8C9B7E] text-white text-[10px] font-medium flex items-center gap-1 shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>Así sí</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#2B2420] font-semibold leading-snug">
                    De frente y cuerpo entero
                  </p>
                  <span className="text-[9.5px] text-[#75695E] leading-tight mt-0.5">
                    Luz suave y ropa al cuerpo
                  </span>
                </div>

                {/* Así no */}
                <div className="bg-[#FAF7F2] rounded-[14px] p-2 border border-[#DCD2C4]/60 flex flex-col shadow-2xs">
                  <div className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden mb-1.5 bg-[#ECE4DA]">
                    <img
                      src={GUIDE_PHOTOS.asiNo.url}
                      alt="Así no"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#A85A46] text-white text-[10px] font-medium flex items-center gap-1 shadow-xs">
                      <X className="w-2.5 h-2.5 stroke-[3]" />
                      <span>Así no</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#2B2420] font-semibold leading-snug">
                    En espejo o cortada
                  </p>
                  <span className="text-[9.5px] text-[#75695E] leading-tight mt-0.5">
                    Celular tapando o contraluz
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {cameraError && (
        <p className="text-[12px] text-[#A85A46] bg-[#ECE4DA] p-2 rounded-[8px] mb-3 text-center">
          {cameraError}
        </p>
      )}

      {/* Fallback Option to Use Demo Photo if desired */}
      {!referencePhoto?.isDemo && (
        <div className="text-center mb-3">
          <button
            onClick={() => onSelectReferencePhoto(DEMO_REFERENCE_PHOTO)}
            className="text-[12px] text-[#75695E] hover:text-[#2B2420] hover:underline"
          >
            ¿Querés probar rápido? Podés usar la foto de prueba de Camila
          </button>
        </div>
      )}

      {/* Explicit Privacy Banner (Rule 7: direct & reassuring) */}
      <div className="bg-[#D3DAC7]/30 border border-[#8C9B7E]/40 rounded-[14px] p-3 flex items-start gap-2.5 mb-5">
        <div className="w-6 h-6 rounded-full bg-[#8C9B7E]/20 flex items-center justify-center text-[#8C9B7E] shrink-0 mt-0.5">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <p className="text-[12px] text-[#2B2420] leading-snug">
          Esta foto la usamos solo para mostrarte cómo te queda esta prenda. Se borra sola a las 72 horas y nunca se usa para entrenar inteligencia artificial.
        </p>
      </div>

      {/* Primary CTA: Ver cómo te queda */}
      <div className="mt-auto">
        <button
          id="btn-generate-vton"
          onClick={onGenerate}
          disabled={!referencePhoto}
          className="w-full py-3.5 px-4 rounded-[14px] bg-[#7A4655] text-white font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#693846] active:scale-[0.98] transition-all shadow-sm group"
        >
          <Sparkles className="w-4 h-4 text-[#FAF7F2] group-hover:rotate-12 transition-transform" />
          <span>Ver cómo te queda</span>
        </button>
      </div>

      {/* Body Photo Guide Modal */}
      <BodyPhotoGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
};
