import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (provider: 'Apple' | 'Google' | 'Email') => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleProvider = (provider: 'Apple' | 'Google') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(provider);
      onClose();
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess('Email');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2420]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#F6F1EA] rounded-[24px] overflow-hidden p-6 shadow-2xl border border-[#DCD2C4]/70 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#ECE4DA] text-[#2B2420] flex items-center justify-center hover:bg-[#DCD2C4] transition-all"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hanger icon in ciruela circle */}
        <div className="w-12 h-12 rounded-full bg-[#7A4655] text-white flex items-center justify-center mx-auto mb-3.5 shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="text-center mb-5">
          <h3 className="font-serif text-[20px] font-medium text-[#2B2420] leading-tight">
            Guardá tu placard digital
          </h3>
          <p className="text-[13px] text-[#75695E] mt-1.5 leading-relaxed">
            Tus fotos y silueta quedan guardadas de forma 100% privada. Accedé a tus looks en cualquier momento.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 mb-4">
          <button
            onClick={() => handleProvider('Apple')}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-[14px] bg-[#2B2420] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-black active:scale-[0.98] transition-all shadow-xs disabled:opacity-60"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.89-11.96-14.54-7.25-11.24-12.82-24.16-16.71-38.74-3.89-14.59-5.83-27.91-5.83-39.99 0-14.99 3.59-27.32 10.77-37 7.18-9.69 16.38-14.65 27.6-14.88 4.7 0 10.02 1.25 15.96 3.76 5.94 2.51 9.77 3.82 11.51 3.93 1.9.11 5.92-1.35 12.06-4.38 6.13-3.04 11.45-4.4 15.96-4.08 17.52 1.37 30.68 8.42 39.46 21.17-15.35 9.32-22.92 22.18-22.7 38.58.23 12.84 5.09 23.47 14.59 31.9 4.35 3.91 9.24 6.78 14.68 8.62-3.07 9.1-7.1 18.25-12.09 27.46zM119.22 33.5c0-7.39 2.65-14.58 7.95-21.57 5.3-6.99 11.95-11.45 19.95-13.38.74 7.61-1.63 14.98-7.1 22.1-5.47 7.12-12.4 11.45-20.8 12.85z" />
            </svg>
            <span>{isLoading ? 'Conectando...' : 'Continuar con Apple'}</span>
          </button>

          <button
            onClick={() => handleProvider('Google')}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-[14px] bg-[#FAF7F2] text-[#2B2420] border border-[#DCD2C4] font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-white active:scale-[0.98] transition-all shadow-xs disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isLoading ? 'Conectando...' : 'Continuar con Google'}</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#DCD2C4]" />
          <span className="flex-shrink mx-3 text-[11px] text-[#75695E] uppercase tracking-wider">
            o con email
          </span>
          <div className="flex-grow border-t border-[#DCD2C4]" />
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-2 mt-1">
          <input
            type="email"
            placeholder="camila@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#ECE4DA] border border-[#DCD2C4] text-[13px] text-[#2B2420] placeholder:text-[#A79C8E] focus:outline-none focus:ring-1 focus:ring-[#7A4655]"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-[12px] bg-[#7A4655] text-white text-[13px] font-medium hover:bg-[#693846] transition-all"
          >
            Crear cuenta gratuita
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-[#DCD2C4]/60 flex items-center justify-center gap-1.5 text-[11px] text-[#75695E]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8C9B7E]" />
          <span>Sin spam · Tus fotos nunca se comparten</span>
        </div>
      </div>
    </div>
  );
};
