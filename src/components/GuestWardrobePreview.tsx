import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Heart,
  Calendar,
  Lock,
  ArrowRight,
  Camera,
  Shirt,
  FolderHeart,
  ChevronRight,
} from 'lucide-react';
import { Garment, VtonResult } from '../types';
import { SAMPLE_GARMENTS } from '../data/samples';

interface GuestWardrobePreviewProps {
  initialResult: VtonResult;
  isRegisteredUser: boolean;
  userAuthMethod?: 'Apple' | 'Google' | 'Email' | null;
  onNewVton: () => void;
  onSignUpModal: () => void;
}

export const GuestWardrobePreview: React.FC<GuestWardrobePreviewProps> = ({
  initialResult,
  isRegisteredUser,
  userAuthMethod,
  onNewVton,
  onSignUpModal,
}) => {
  const [activeTab, setActiveTab] = useState<'looks' | 'placard'>('looks');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Todo');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todo');

  const occasionChips = ['Todo', 'Trabajo', 'Finde', 'Salida', 'Guardados'];
  const categoryChips = [
    { label: 'Todo', count: 2 },
    { label: 'Blazers', count: 1 },
    { label: 'Pantalones', count: 1 },
    { label: 'Vestidos', count: 0 },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-5 pt-2 pb-24 flex flex-col min-h-[calc(100vh-60px)]">
      {/* Banner: Guest Mode or Registered Account Status */}
      {!isRegisteredUser ? (
        <div className="bg-[#FAF7F2] border border-[#DCD2C4] rounded-[16px] p-3.5 mb-4 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#7A4655]/10 text-[#7A4655] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[12px] font-semibold text-[#2B2420] block">
                Modo invitada activa
              </span>
              <p className="text-[11px] text-[#75695E] truncate">
                4 de 5 pruebas gratuitas restantes esta semana.
              </p>
            </div>
          </div>
          <button
            onClick={onSignUpModal}
            className="px-3 py-1.5 rounded-full bg-[#7A4655] text-white text-[11.5px] font-medium shrink-0 hover:bg-[#693846] transition-all shadow-xs"
          >
            Guardar placard
          </button>
        </div>
      ) : (
        <div className="bg-[#D3DAC7]/40 border border-[#8C9B7E]/50 rounded-[16px] p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8C9B7E]" />
            <span className="text-[12px] font-medium text-[#2B2420]">
              Cuenta sincronizada con {userAuthMethod || 'Apple'}
            </span>
          </div>
          <span className="text-[11px] text-[#75695E] font-medium">Plan Free</span>
        </div>
      )}

      {/* Screen Title & Tabs */}
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-serif text-[24px] font-medium text-[#2B2420]">
          {activeTab === 'looks' ? 'Tus looks' : 'Tu placard'}
        </h2>
        <span className="text-[12px] text-[#75695E]">
          {activeTab === 'looks' ? '1 look generado' : '2 prendas'}
        </span>
      </div>

      {/* Horizontal Filter Chips */}
      {activeTab === 'looks' ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {occasionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setSelectedOccasion(chip)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium shrink-0 transition-all ${
                selectedOccasion === chip
                  ? 'bg-[#C6A2AC] text-[#2B2420]'
                  : 'bg-[#ECE4DA] text-[#75695E] hover:text-[#2B2420]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {categoryChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => setSelectedCategory(chip.label)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium shrink-0 transition-all ${
                selectedCategory === chip.label
                  ? 'bg-[#C6A2AC] text-[#2B2420]'
                  : 'bg-[#ECE4DA] text-[#75695E] hover:text-[#2B2420]'
              }`}
            >
              {chip.label} ({chip.count})
            </button>
          ))}
        </div>
      )}

      {/* Content Area (Masonry Grid as specified in DESIGN.md Section 8.3) */}
      {activeTab === 'looks' ? (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Newly Generated Look */}
          <div className="group relative rounded-[20px] overflow-hidden bg-[#ECE4DA] border border-[#DCD2C4]/70 shadow-xs flex flex-col">
            <div className="aspect-[3/4.2] overflow-hidden relative">
              <img
                src={initialResult.resultImageUrl}
                alt={initialResult.lookTitle}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2420]/60 via-transparent to-transparent" />
              <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                <Heart className="w-3.5 h-3.5 fill-[#7A4655] text-[#7A4655]" />
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#FAF7F2]/80 block">
                  {initialResult.occasion}
                </span>
                <p className="text-[12px] font-medium leading-tight truncate">
                  {initialResult.lookTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Add Another Look Prompt Card */}
          <button
            onClick={onNewVton}
            className="aspect-[3/4.2] rounded-[20px] border-2 border-dashed border-[#DCD2C4] hover:border-[#7A4655] bg-[#ECE4DA]/40 hover:bg-[#ECE4DA]/80 flex flex-col items-center justify-center p-4 text-center group transition-all"
          >
            <div className="w-11 h-11 rounded-full bg-[#FAF7F2] text-[#7A4655] flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-serif text-[14px] font-medium text-[#2B2420] block">
              Probar otra prenda
            </span>
            <span className="text-[11px] text-[#75695E] mt-1 leading-snug">
              Probá un jean, vestido o camisa en 10 segundos
            </span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* User's primary garment */}
          <div className="relative rounded-[20px] overflow-hidden bg-[#ECE4DA] border border-[#DCD2C4]/70 shadow-xs flex flex-col">
            <div className="aspect-[4/5] overflow-hidden relative">
              <img
                src={initialResult.garment.imageUrl}
                alt={initialResult.garment.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2420]/60 to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <span className="text-[10px] text-[#D3DAC7] uppercase font-semibold block">
                  {initialResult.garment.category}
                </span>
                <p className="text-[12px] font-medium leading-tight truncate">
                  {initialResult.garment.name}
                </p>
              </div>
            </div>
          </div>

          {/* Secondary sample garment */}
          <div className="relative rounded-[20px] overflow-hidden bg-[#ECE4DA] border border-[#DCD2C4]/70 shadow-xs flex flex-col">
            <div className="aspect-[4/5] overflow-hidden relative">
              <img
                src={SAMPLE_GARMENTS[1].imageUrl}
                alt={SAMPLE_GARMENTS[1].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2420]/60 to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <span className="text-[10px] text-[#D3DAC7] uppercase font-semibold block">
                  {SAMPLE_GARMENTS[1].category}
                </span>
                <p className="text-[12px] font-medium leading-tight truncate">
                  {SAMPLE_GARMENTS[1].name}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Value proposition next step: Carga incremental */}
      <div className="mt-auto bg-[#FAF7F2] rounded-[18px] p-4 border border-[#DCD2C4] shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold tracking-wider text-[#7A4655] uppercase">
            Siguiente combinación
          </span>
          <span className="text-[11px] text-[#75695E]">Sin catalogar todo</span>
        </div>
        <h4 className="font-serif text-[15px] text-[#2B2420] font-medium mb-1">
          ¿Querés ver cómo combina con un jean vintage?
        </h4>
        <p className="text-[12px] text-[#75695E] mb-3">
          Probá una prenda más y descubrí cómo armar un look completo sin desordenar tu placard.
        </p>
        <button
          onClick={onNewVton}
          className="w-full py-2.5 rounded-[12px] bg-[#7A4655] text-white text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#693846] transition-all shadow-xs"
        >
          <Camera className="w-4 h-4" />
          <span>Hacer otra prueba virtual</span>
        </button>
      </div>

      {/* Bottom Navigation Bar (Specified in DESIGN.md Section 8.3) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#DCD2C4]/70 max-w-md mx-auto flex items-center justify-around py-2.5 px-6 shadow-[0_-2px_10px_rgba(43,36,32,0.05)]">
        <button
          onClick={() => setActiveTab('looks')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'looks' ? 'text-[#7A4655]' : 'text-[#A79C8E]'
          }`}
        >
          <FolderHeart className={`w-5 h-5 ${activeTab === 'looks' ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
          <span className="text-[11px] font-medium">Looks</span>
        </button>

        {/* Elevated Center Camera Button */}
        <button
          onClick={onNewVton}
          className="w-12 h-12 -mt-5 rounded-full bg-[#7A4655] text-white flex items-center justify-center shadow-lg hover:bg-[#693846] active:scale-95 transition-all"
          title="Nueva prueba virtual"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('placard')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'placard' ? 'text-[#7A4655]' : 'text-[#A79C8E]'
          }`}
        >
          <Shirt className={`w-5 h-5 ${activeTab === 'placard' ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
          <span className="text-[11px] font-medium">Placard</span>
        </button>
      </nav>
    </div>
  );
};
