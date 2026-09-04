import React, { useState } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Step1Garment } from './components/Step1Garment';
import { Step2Reference } from './components/Step2Reference';
import { ProcessingModal } from './components/ProcessingModal';
import { Step3Result } from './components/Step3Result';
import { GuestWardrobePreview } from './components/GuestWardrobePreview';
import { SignUpModal } from './components/SignUpModal';
import { OnboardingStep, Garment, ReferencePhoto, VtonResult } from './types';
import {
  SAMPLE_GARMENTS,
  DEMO_REFERENCE_PHOTO,
  SAMPLE_VTON_RESULTS,
} from './data/samples';

export default function App() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(SAMPLE_GARMENTS[0]);
  const [referencePhoto, setReferencePhoto] = useState<ReferencePhoto | null>(DEMO_REFERENCE_PHOTO);
  const [activeResult, setActiveResult] = useState<VtonResult>(SAMPLE_VTON_RESULTS['blazer-arena']);
  const [isRegisteredUser, setIsRegisteredUser] = useState(false);
  const [userAuthMethod, setUserAuthMethod] = useState<'Apple' | 'Google' | 'Email' | null>(null);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBack = () => {
    if (currentStep === 'step1_garment') {
      setCurrentStep('welcome');
    } else if (currentStep === 'step2_reference') {
      setCurrentStep('step1_garment');
    } else if (currentStep === 'step3_result') {
      setCurrentStep('step2_reference');
    } else if (currentStep === 'guest_wardrobe') {
      setCurrentStep('step3_result');
    }
  };

  const handleReset = () => {
    setSelectedGarment(SAMPLE_GARMENTS[0]);
    setReferencePhoto(DEMO_REFERENCE_PHOTO);
    setActiveResult(SAMPLE_VTON_RESULTS['blazer-arena']);
    setCurrentStep('welcome');
    showToast('Flujo reiniciado');
  };

  const handleCustomUpload = (garment: Garment) => {
    setSelectedGarment(garment);
    showToast(`Prenda agregada: ${garment.name}`);
  };

  const handleStartGeneration = () => {
    setCurrentStep('processing');
  };

  const handleProcessingComplete = () => {
    // Determine result based on garment
    if (selectedGarment && SAMPLE_VTON_RESULTS[selectedGarment.id]) {
      setActiveResult(SAMPLE_VTON_RESULTS[selectedGarment.id]);
    } else if (selectedGarment) {
      // Generated dynamic result for custom uploads
      const customResult: VtonResult = {
        id: `vton-custom-${Date.now()}`,
        garment: selectedGarment,
        referencePhoto: referencePhoto || DEMO_REFERENCE_PHOTO,
        resultImageUrl: selectedGarment.imageUrl,
        lookTitle: `Look Diario · ${selectedGarment.name}`,
        lookNumber: '#01',
        stylingDescription: 'Calce personalizado adaptado a tu silueta con caída natural',
        fitPercentage: 97,
        size: 'Talle S',
        date: 'Hoy',
        isFavorite: false,
        occasion: 'Casual',
      };
      setActiveResult(customResult);
    }
    setCurrentStep('step3_result');
  };

  const handleAuthSuccess = (provider: 'Apple' | 'Google' | 'Email') => {
    setIsRegisteredUser(true);
    setUserAuthMethod(provider);
    showToast(`¡Bienvenida! Cuenta vinculada con ${provider}`);
    setCurrentStep('guest_wardrobe');
  };

  const getHeaderSubtitle = () => {
    switch (currentStep) {
      case 'welcome':
        return undefined;
      case 'step1_garment':
        return 'PASO 1 · TU PRENDA';
      case 'step2_reference':
        return 'PASO 2 · TU FOTO';
      case 'step3_result':
        return 'TU LOOK GENERADO';
      case 'guest_wardrobe':
        return 'PLACARD DIGITAL';
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] text-[#2B2420] flex flex-col items-center selection:bg-[#C6A2AC] selection:text-[#2B2420]">
      {/* Phone container wrapper for responsive desktop/tablet presentation */}
      <div className="w-full max-w-md min-h-screen bg-[#F6F1EA] shadow-lg flex flex-col relative border-x border-[#DCD2C4]/30">
        {/* Header */}
        <Header
          currentStep={currentStep}
          onBack={handleBack}
          onReset={handleReset}
          subtitle={getHeaderSubtitle()}
          showAvatar={currentStep !== 'welcome' && currentStep !== 'step1_garment'}
        />

        {/* Step Views */}
        <main className="flex-1 flex flex-col">
          {currentStep === 'welcome' && (
            <WelcomeScreen
              onStart={() => setCurrentStep('step1_garment')}
              onTrySampleDirectly={() => {
                setSelectedGarment(SAMPLE_GARMENTS[0]);
                setCurrentStep('step1_garment');
              }}
            />
          )}

          {currentStep === 'step1_garment' && (
            <Step1Garment
              selectedGarment={selectedGarment}
              onSelectGarment={(garment) => setSelectedGarment(garment)}
              onContinue={() => setCurrentStep('step2_reference')}
              onCustomUpload={handleCustomUpload}
            />
          )}

          {currentStep === 'step2_reference' && selectedGarment && (
            <Step2Reference
              selectedGarment={selectedGarment}
              referencePhoto={referencePhoto}
              onSelectReferencePhoto={(photo) => setReferencePhoto(photo)}
              onGenerate={handleStartGeneration}
            />
          )}

          {currentStep === 'step3_result' && (
            <Step3Result
              result={activeResult}
              onExploreGuest={() => setCurrentStep('guest_wardrobe')}
              onAuthSuccess={handleAuthSuccess}
            />
          )}

          {currentStep === 'guest_wardrobe' && (
            <GuestWardrobePreview
              initialResult={activeResult}
              isRegisteredUser={isRegisteredUser}
              userAuthMethod={userAuthMethod}
              onNewVton={() => setCurrentStep('step1_garment')}
              onSignUpModal={() => setIsSignUpModalOpen(true)}
            />
          )}
        </main>

        {/* Processing Modal during generation */}
        {currentStep === 'processing' && selectedGarment && (
          <ProcessingModal
            garment={selectedGarment}
            onComplete={handleProcessingComplete}
          />
        )}

        {/* Authentication Modal */}
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />

        {/* Toast notifications */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2B2420] text-[#F6F1EA] px-4 py-2 rounded-full text-[12.5px] font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
