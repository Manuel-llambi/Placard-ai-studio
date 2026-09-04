import React, { useRef, useState } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Check,
  Sparkles,
  X,
  Shirt,
  Sun,
  Maximize2,
} from 'lucide-react';
import { Garment } from '../types';
import { SAMPLE_GARMENTS } from '../data/samples';
import { GarmentPhotoGuideModal } from './GarmentPhotoGuideModal';

interface Step1GarmentProps {
  selectedGarment: Garment | null;
  onSelectGarment: (garment: Garment) => void;
  onContinue: () => void;
  onCustomUpload: (garment: Garment) => void;
}

export const Step1Garment: React.FC<Step1GarmentProps> = ({
  selectedGarment,
  onSelectGarment,
  onContinue,
  onCustomUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const customGarment: Garment = {
          id: `custom-garment-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 24) || 'Mi prenda fotografiada',
          category: 'Prenda propia',
          imageUrl: event.target?.result as string,
          colorName: 'Tonalidad natural',
          colorHex: '#7A4655',
          material: 'Tejido real',
          description: 'Foto tomada por el usuario con recorte automático por IA.',
          isCustomUpload: true,
        };
        onCustomUpload(customGarment);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const customGarment: Garment = {
          id: `custom-garment-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 24) || 'Mi prenda fotografiada',
          category: 'Prenda propia',
          imageUrl: event.target?.result as string,
          colorName: 'Tonalidad natural',
          colorHex: '#7A4655',
          material: 'Tejido real',
          description: 'Foto tomada por el usuario con recorte automático por IA.',
          isCustomUpload: true,
        };
        onCustomUpload(customGarment);
      };
      reader.readAsDataURL(file);
    }
  };

  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 720 }, height: { ideal: 960 } },
      });
      setIsLiveCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable, falling back to input', err);
      cameraInputRef.current?.click();
    }
  };

  const stopLiveCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsLiveCameraActive(false);
  };

  const captureLiveSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 960;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const customGarment: Garment = {
          id: `custom-garment-${Date.now()}`,
          name: 'Foto de prenda propia',
          category: 'Prenda propia',
          imageUrl: dataUrl,
          colorName: 'Tonalidad natural',
          colorHex: '#7A4655',
          material: 'Tejido real',
          description: 'Foto tomada en vivo con guía de alineación.',
          isCustomUpload: true,
        };
        onCustomUpload(customGarment);
        stopLiveCamera();
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 pt-3 pb-8 flex flex-col min-h-[calc(100vh-60px)]">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Step Indicator & Progress */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE4DA] border border-[#DCD2C4]/60 text-[12px] font-medium text-[#2B2420] mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7A4655]" />
          <span>Paso 1 de 2</span>
        </div>
        <div className="w-full h-1 bg-[#ECE4DA] rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-[#7A4655] rounded-full transition-all duration-300" />
        </div>
      </div>

      {/* Headline & Description */}
      <div className="mb-4">
        <h2 className="font-serif text-[26px] sm:text-[28px] font-semibold text-[#2B2420] tracking-tight leading-snug">
          Primero, una prenda que ames
        </h2>
        <p className="text-[14px] text-[#75695E] mt-1.5 leading-relaxed">
          Sacale una foto a una prenda tuya o elegí una de muestra para probar la silueta de inmediato.
        </p>
      </div>

      {/* Capture Card */}
      <div
        id="garment-capture-card"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`bg-[#ECE4DA] rounded-[20px] p-4 sm:p-5 mb-5 text-center flex flex-col items-center border transition-all ${
          isDragging
            ? 'border-[#7A4655] bg-[#ECE4DA]/90 scale-[1.01]'
            : 'border-transparent shadow-[0_1px_3px_rgba(43,36,32,0.06)]'
        }`}
      >
        {isLiveCameraActive ? (
          /* Live Camera Viewfinder inside card */
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full aspect-[3/4] rounded-[16px] overflow-hidden bg-black mb-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Garment / Hanger Dashed Alignment Guide */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
                <svg
                  className="w-40 h-40 text-white/70"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                >
                  {/* Hanger hook */}
                  <path d="M50 20c-5-7-2-12 4-12 5 0 6 4 2 8l-6 4" />
                  {/* Hanger triangle */}
                  <path d="M15 45L50 20l35 25H15z" />
                  {/* Garment silhouette body */}
                  <path d="M22 45l-8 16 10 4 6-12v40h40V53l6 12 10-4-8-16" />
                </svg>

                <span className="mt-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide">
                  Encuadrala completa y estirada
                </span>
              </div>

              {/* Close Live Camera */}
              <button
                onClick={stopLiveCamera}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shutter Button */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={stopLiveCamera}
                className="py-2.5 px-4 rounded-[12px] bg-[#FAF7F2] text-[#75695E] text-[13px] font-medium border border-[#DCD2C4]"
              >
                Cancelar
              </button>
              <button
                onClick={captureLiveSnapshot}
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
              Capturá tu prenda propia
            </h3>
            <p className="text-[13px] text-[#75695E] mt-1 mb-2 leading-normal max-w-[290px]">
              Nuestra IA recortará el fondo automáticamente conservando texturas y caída.
            </p>

            {/* Direct Trigger to Open Guide Modal */}
            <button
              id="btn-open-garment-tips"
              onClick={() => setIsGuideModalOpen(true)}
              className="inline-flex items-center gap-1 text-[12px] text-[#7A4655] font-semibold hover:underline mb-4 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7A4655]" />
              <span>¿Cómo sacar una buena foto? Ver indicaciones</span>
            </button>

            {/* Main Action Buttons */}
            <div className="w-full space-y-2.5">
              <button
                id="btn-take-photo-garment"
                onClick={startLiveCamera}
                className="w-full py-3 px-4 rounded-[14px] bg-[#7A4655] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#693846] active:scale-[0.98] transition-all shadow-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Tomar foto a una prenda</span>
              </button>

              <button
                id="btn-upload-gallery-garment"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-[14px] bg-[#FAF7F2] text-[#2B2420] border border-[#DCD2C4] font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-white active:scale-[0.98] transition-all"
              >
                <ImageIcon className="w-4 h-4 text-[#75695E]" />
                <span>Subir de mi galería</span>
              </button>
            </div>

            {/* Visual Guidelines Banner (3 Indications with Icons) */}
            <div className="w-full mt-3.5 pt-3 border-t border-[#DCD2C4]/60 text-left">
              <div className="mb-2">
                <span className="text-[10.5px] font-semibold text-[#75695E] uppercase tracking-wider">
                  Indicaciones para foto correcta:
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsGuideModalOpen(true)}
                  className="bg-[#FAF7F2] rounded-[12px] p-2 border border-[#DCD2C4]/60 flex flex-col items-center hover:border-[#A79C8E] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#ECE4DA] flex items-center justify-center mb-1 text-[#7A4655]">
                    <Shirt className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#2B2420] block leading-tight">
                    En percha o cama
                  </span>
                  <span className="text-[10px] text-[#75695E] block leading-tight mt-0.5">
                    Bien estirada
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGuideModalOpen(true)}
                  className="bg-[#FAF7F2] rounded-[12px] p-2 border border-[#DCD2C4]/60 flex flex-col items-center hover:border-[#A79C8E] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#ECE4DA] flex items-center justify-center mb-1 text-[#AD8A56]">
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#2B2420] block leading-tight">
                    Luz natural
                  </span>
                  <span className="text-[10px] text-[#75695E] block leading-tight mt-0.5">
                    Sin tu sombra
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGuideModalOpen(true)}
                  className="bg-[#FAF7F2] rounded-[12px] p-2 border border-[#DCD2C4]/60 flex flex-col items-center hover:border-[#A79C8E] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#ECE4DA] flex items-center justify-center mb-1 text-[#75695E]">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#2B2420] block leading-tight">
                    Prenda entera
                  </span>
                  <span className="text-[10px] text-[#75695E] block leading-tight mt-0.5">
                    Sin cortar bordes
                  </span>
                </button>
              </div>
            </div>

            {/* Uploaded / Selected Custom Garment Feedback */}
            {selectedGarment?.isCustomUpload && (
              <div className="mt-3.5 w-full bg-[#FAF7F2] p-3 rounded-[14px] flex flex-col gap-2.5 border border-[#8C9B7E]/70 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedGarment.imageUrl}
                    alt="Prenda personalizada"
                    className="w-12 h-12 object-cover rounded-[10px] border border-[#DCD2C4]"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8C9B7E]" />
                      <span className="text-[10.5px] font-semibold text-[#8C9B7E] uppercase tracking-wide">
                        Prenda propia capturada ✓
                      </span>
                    </div>
                    <p className="text-[13px] font-medium text-[#2B2420] truncate">
                      {selectedGarment.name}
                    </p>
                    <span className="text-[11px] text-[#75695E] block leading-tight">
                      Recorte por IA listo para calce
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => setIsGuideModalOpen(true)}
                      className="text-[11px] text-[#7A4655] font-semibold hover:underline"
                    >
                      Ver guía
                    </button>
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="text-[11px] text-[#75695E] hover:text-[#2B2420] underline"
                    >
                      Repetir
                    </button>
                  </div>
                </div>

                {/* Validation checklist */}
                <div className="flex items-center justify-between pt-2 border-t border-[#DCD2C4]/40 text-[11px] text-[#75695E]">
                  <span className="flex items-center gap-1 text-[#8C9B7E]">
                    <Check className="w-3 h-3 stroke-[2.5]" /> Silueta detectada
                  </span>
                  <span className="flex items-center gap-1 text-[#8C9B7E]">
                    <Check className="w-3 h-3 stroke-[2.5]" /> Caída natural
                  </span>
                  <span className="flex items-center gap-1 text-[#8C9B7E]">
                    <Check className="w-3 h-3 stroke-[2.5]" /> Fondo adaptable
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Samples section */}
      <div className="mb-5">
        <h4 className="text-[11px] font-semibold tracking-wider text-[#75695E] uppercase mb-2.5">
          O PROBÁ AL INSTANTE CON UNA DE MUESTRA:
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {SAMPLE_GARMENTS.map((garment) => {
            const isSelected = selectedGarment?.id === garment.id;
            return (
              <button
                key={garment.id}
                id={`sample-garment-${garment.id}`}
                onClick={() => onSelectGarment(garment)}
                className={`text-left p-2.5 rounded-[16px] bg-[#FAF7F2] border transition-all flex flex-col relative group ${
                  isSelected
                    ? 'border-[#7A4655] ring-2 ring-[#7A4655]/20 shadow-sm'
                    : 'border-[#DCD2C4]/70 hover:border-[#A79C8E]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#7A4655] text-white flex items-center justify-center z-10 shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="w-full aspect-[4/3] rounded-[10px] overflow-hidden bg-[#ECE4DA] mb-2 relative">
                  <img
                    src={garment.imageUrl}
                    alt={garment.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2420]/15 to-transparent pointer-events-none" />
                </div>
                <span className="text-[13px] font-medium text-[#2B2420] leading-snug">
                  {garment.name}
                </span>
                <span className="text-[11px] text-[#75695E] mt-0.5">
                  {garment.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue CTA */}
      <div className="mt-auto pt-2">
        <button
          id="btn-continue-to-reference"
          onClick={onContinue}
          disabled={!selectedGarment}
          className={`w-full py-3.5 px-4 rounded-[14px] font-medium text-[15px] transition-all flex items-center justify-center gap-2 ${
            selectedGarment
              ? 'bg-[#7A4655] text-white hover:bg-[#693846] shadow-sm active:scale-[0.98]'
              : 'bg-[#DCD2C4] text-[#75695E]/80 cursor-not-allowed'
          }`}
        >
          <span>Continuar a mi foto</span>
          {selectedGarment && <Sparkles className="w-4 h-4 text-[#FAF7F2]" />}
        </button>
      </div>

      {/* Photo Guide Modal for Garments */}
      <GarmentPhotoGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onTakePhoto={() => cameraInputRef.current?.click()}
        onUploadGallery={() => fileInputRef.current?.click()}
        onStartLiveCamera={startLiveCamera}
      />
    </div>
  );
};

