import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Check,
  X,
  RefreshCw,
  Video,
} from 'lucide-react';
import { Garment, ReferencePhoto } from '../types';
import { DEMO_REFERENCE_PHOTO, GUIDE_PHOTOS } from '../data/samples';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

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
      console.warn('Camera access denied or unavailable, using demo photo', err);
      setCameraError('Permiso de cámara no concedido. Podés subir una foto o usar la de prueba.');
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Step Indicator & Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#75695E] uppercase mb-1.5">
          <span>Paso 2 de 2 • Finalizando</span>
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
          Una foto de cuerpo entero con ropa neutra o entallada. Se procesa de forma totalmente privada y segura.
        </p>
      </div>

      {/* Silhouette & Alignment Viewfinder Card */}
      <div
        id="viewfinder-silhouette-card"
        className="relative bg-[#ECE4DA] rounded-[20px] h-[300px] sm:h-[320px] mb-3 overflow-hidden flex flex-col items-center justify-center border border-[#DCD2C4]/60 shadow-xs"
      >
        {isCameraActive ? (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Overlay Guide Dotted Lines */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-44 h-64 border-2 border-dashed border-white/60 rounded-full opacity-70" />
            </div>

            {/* Live Camera Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-10 px-4">
              <button
                id="btn-cancel-camera"
                onClick={stopCamera}
                className="px-4 py-2 rounded-full bg-black/60 text-white text-[12px] font-medium backdrop-blur-md"
              >
                Cancelar
              </button>
              <button
                id="btn-capture-snapshot"
                onClick={captureCameraSnapshot}
                className="w-14 h-14 rounded-full bg-white border-4 border-[#7A4655] flex items-center justify-center text-[#7A4655] shadow-lg active:scale-95 transition-all"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : referencePhoto ? (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={referencePhoto.imageUrl}
              alt="Foto de referencia"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            {/* Status chip over image */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C9B7E]" />
              <span>{referencePhoto.isDemo ? 'Foto Demo de Camila' : 'Tu foto seleccionada'}</span>
            </div>

            {/* Actions over preview */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                id="btn-retake-photo"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#2B2420] text-[12px] font-medium hover:bg-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#75695E]" />
                <span>Cambiar</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* SVG Silhouette Outline (Stylized body wireframe) */}
            <svg
              className="w-32 h-44 text-[#75695E]/40"
              viewBox="0 0 100 160"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            >
              {/* Head */}
              <circle cx="50" cy="22" r="14" />
              {/* Neck & Shoulders */}
              <path d="M44 36v6c0 2-4 4-8 6l-14 8c-3 2-4 5-3 8l5 24c1 3 3 5 6 4l6-3v67h18v-45h4v45h18V85l6 3c3 1 5-1 6-4l5-24c1-3 0-6-3-8l-14-8c-4-2-8-4-8-6v-6" />
            </svg>

            {/* Alignment Text */}
            <div className="mt-2 text-[10px] tracking-[0.18em] font-semibold text-[#75695E] uppercase">
              ALINEÁ TU CUERPO COMPLETO
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-4 left-0 right-0 px-6 flex items-center justify-between">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#DCD2C4] text-[#75695E] flex items-center justify-center hover:bg-white shadow-xs active:scale-95 transition-all"
                title="Subir archivo"
              >
                <Upload className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSelectReferencePhoto(DEMO_REFERENCE_PHOTO);
                }}
                className="w-14 h-14 rounded-full bg-[#7A4655] text-white flex items-center justify-center shadow-md hover:bg-[#693846] active:scale-95 transition-all"
                title="Tomar foto"
              >
                <Camera className="w-6 h-6 stroke-[2]" />
              </button>

              <button
                onClick={() => onSelectReferencePhoto(DEMO_REFERENCE_PHOTO)}
                className="px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#DCD2C4] text-[#2B2420] text-[12px] font-medium hover:bg-white shadow-xs flex items-center gap-1 active:scale-95 transition-all"
                title="Usar foto demo"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#AD8A56]" />
                <span>Demo</span>
              </button>
            </div>
          </>
        )}
      </div>

      {cameraError && (
        <p className="text-[12px] text-[#A85A46] bg-[#ECE4DA] p-2 rounded-[8px] mb-3 text-center">
          {cameraError}
        </p>
      )}

      {/* Buttons row below viewfinder */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <button
          id="btn-live-camera"
          onClick={startLiveCamera}
          className="py-2.5 px-3 rounded-[12px] bg-[#ECE4DA] text-[#2B2420] text-[13px] font-medium border border-[#DCD2C4]/60 hover:bg-[#E4DACD] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Video className="w-4 h-4 text-[#75695E]" />
          <span>Cámara en vivo</span>
        </button>

        <button
          id="btn-upload-reference"
          onClick={() => fileInputRef.current?.click()}
          className="py-2.5 px-3 rounded-[12px] bg-[#ECE4DA] text-[#2B2420] text-[13px] font-medium border border-[#DCD2C4]/60 hover:bg-[#E4DACD] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4 text-[#75695E]" />
          <span>Subir archivo</span>
        </button>
      </div>

      {/* Comparative Guidance Cards: Así sí vs Así no */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {/* Así sí */}
        <div className="bg-[#FAF7F2] rounded-[14px] p-2.5 border border-[#DCD2C4]/60 shadow-xs flex flex-col">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8C9B7E] mb-2">
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
          <p className="text-[11px] text-[#75695E] leading-snug">
            {GUIDE_PHOTOS.asiSi.description}
          </p>
        </div>

        {/* Así no */}
        <div className="bg-[#FAF7F2] rounded-[14px] p-2.5 border border-[#DCD2C4]/60 shadow-xs flex flex-col">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#A85A46] mb-2">
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
          <p className="text-[11px] text-[#75695E] leading-snug">
            {GUIDE_PHOTOS.asiNo.description}
          </p>
        </div>
      </div>

      {/* Explicit Privacy Banner (PRD F3 & Section 8 requirement) */}
      <div className="bg-[#D3DAC7]/30 border border-[#8C9B7E]/40 rounded-[14px] p-3 flex items-start gap-2.5 mb-5">
        <div className="w-6 h-6 rounded-full bg-[#8C9B7E]/20 flex items-center justify-center text-[#8C9B7E] shrink-0 mt-0.5">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <p className="text-[12px] text-[#2B2420] leading-snug">
          <span className="font-semibold text-[#2B2420]">Privacidad garantizada:</span>{' '}
          Tus fotos son 100% privadas y nunca se usan para entrenar inteligencias artificiales de terceros.
        </p>
      </div>

      {/* Primary CTA: Generar mi prueba virtual */}
      <div className="mt-auto">
        <button
          id="btn-generate-vton"
          onClick={onGenerate}
          disabled={!referencePhoto}
          className="w-full py-3.5 px-4 rounded-[14px] bg-[#7A4655] text-white font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#693846] active:scale-[0.98] transition-all shadow-sm group"
        >
          <Sparkles className="w-4 h-4 text-[#FAF7F2] group-hover:rotate-12 transition-transform" />
          <span>Generar mi prueba virtual</span>
        </button>
        <span className="text-[11.5px] text-[#75695E] text-center block mt-2">
          Tiempo estimado: 8-12 segundos
        </span>
      </div>
    </div>
  );
};
