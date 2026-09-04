import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { OnboardingStep } from '../types';

interface HeaderProps {
  currentStep: OnboardingStep;
  onBack: () => void;
  onReset: () => void;
  subtitle?: string;
  showAvatar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onBack,
  onReset,
  subtitle,
}) => {
  const canGoBack = currentStep !== 'welcome';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-[#F6F1EA]/90 backdrop-blur-md border-b border-[#DCD2C4]/40 transition-colors">
      <div className="w-10 flex items-center">
        {canGoBack ? (
          <button
            id="header-back-button"
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#2B2420] hover:bg-[#ECE4DA] active:scale-95 transition-all"
            aria-label="Volver al paso anterior"
          >
            <ArrowLeft className="w-5 h-5 stroke-[1.75]" />
          </button>
        ) : (
          <button
            id="header-reset-button"
            onClick={onReset}
            title="Reiniciar prueba"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#75695E] hover:bg-[#ECE4DA] hover:text-[#2B2420] active:scale-95 transition-all"
            aria-label="Reiniciar"
          >
            <RotateCcw className="w-4 h-4 stroke-[1.75]" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-[22px] tracking-tight font-medium text-[#2B2420] leading-tight">
          Placard
        </h1>
        {subtitle && (
          <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-[#75695E] mt-0.5">
            {subtitle}
          </span>
        )}
      </div>

      <div className="w-10 flex items-center justify-end">
        <div className="w-9 h-9" />
      </div>
    </header>
  );
};
