import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
} from 'react-native';
import { X, ShieldCheck, Sparkles } from 'lucide-react';

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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProvider = (provider: 'Apple' | 'Google') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(provider);
      onClose();
    }, 600);
  };

  const handleEmailSubmit = () => {
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess('Email');
      onClose();
    }, 600);
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modalCard} accessibilityViewIsModal={true}>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          style={styles.closeButton}
          accessibilityLabel="Cerrar modal"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={16} color="#2B2420" />
        </TouchableOpacity>

        {/* Hanger icon in ciruela circle */}
        <View style={styles.iconCircle}>
          <Sparkles size={24} color="#FFFFFF" />
        </View>

        <View style={styles.headerBlock}>
          <Text style={styles.title} accessibilityRole="header">
            Guardá tu placard digital
          </Text>
          <Text style={styles.description}>
            Tus fotos y silueta quedan guardadas de forma 100% privada. Accedé a tus looks en cualquier momento.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonStack}>
          <TouchableOpacity
            onPress={() => handleProvider('Apple')}
            disabled={isLoading}
            activeOpacity={0.85}
            style={[styles.appleButton, isLoading && styles.disabledButton]}
            accessibilityRole="button"
            accessibilityLabel="Continuar con Apple"
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
          >
            <svg width="16" height="16" viewBox="0 0 170 170" fill="#FFFFFF" aria-hidden="true">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.89-11.96-14.54-7.25-11.24-12.82-24.16-16.71-38.74-3.89-14.59-5.83-27.91-5.83-39.99 0-14.99 3.59-27.32 10.77-37 7.18-9.69 16.38-14.65 27.6-14.88 4.7 0 10.02 1.25 15.96 3.76 5.94 2.51 9.77 3.82 11.51 3.93 1.9.11 5.92-1.35 12.06-4.38 6.13-3.04 11.45-4.4 15.96-4.08 17.52 1.37 30.68 8.42 39.46 21.17-15.35 9.32-22.92 22.18-22.7 38.58.23 12.84 5.09 23.47 14.59 31.9 4.35 3.91 9.24 6.78 14.68 8.62-3.07 9.1-7.1 18.25-12.09 27.46zM119.22 33.5c0-7.39 2.65-14.58 7.95-21.57 5.3-6.99 11.95-11.45 19.95-13.38.74 7.61-1.63 14.98-7.1 22.1-5.47 7.12-12.4 11.45-20.8 12.85z" />
            </svg>
            <Text style={styles.appleButtonText}>
              {isLoading ? 'Conectando...' : 'Continuar con Apple'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleProvider('Google')}
            disabled={isLoading}
            activeOpacity={0.85}
            style={[styles.googleButton, isLoading && styles.disabledButton]}
            accessibilityRole="button"
            accessibilityLabel="Continuar con Google"
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
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
            <Text style={styles.googleButtonText}>
              {isLoading ? 'Conectando...' : 'Continuar con Google'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o con email</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email form */}
        <View style={styles.emailForm}>
          <Text style={styles.inputLabel}>TU EMAIL</Text>
          <TextInput
            placeholder="camila@ejemplo.com"
            placeholderTextColor="#706459"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
            accessibilityLabel="Correo electrónico"
          />
          <TouchableOpacity
            onPress={handleEmailSubmit}
            disabled={isLoading || !email}
            activeOpacity={0.85}
            style={[
              styles.submitButton,
              (!email || isLoading) && styles.disabledButton,
            ]}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading || !email }}
          >
            <Text style={styles.submitButtonText}>Crear cuenta gratuita</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerNote}>
          <ShieldCheck size={14} color="#8C9B7E" />
          <Text style={styles.footerNoteText}>
            Sin spam · Tus fotos nunca se comparten
          </Text>
        </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    backgroundColor: 'rgba(43, 36, 32, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: '#F6F1EA',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.7)',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECE4DA',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7A4655',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: 20,
    fontWeight: '600',
    color: '#2B2420',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#706459',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonStack: {
    gap: 10,
    marginBottom: 16,
  },
  appleButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#2B2420',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  googleButton: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#DCD2C4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleButtonText: {
    color: '#2B2420',
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DCD2C4',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    color: '#706459',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  emailForm: {
    gap: 8,
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#706459',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  textInput: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ECE4DA',
    borderWidth: 1,
    borderColor: '#DCD2C4',
    fontSize: 13,
    color: '#2B2420',
  },
  submitButton: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#7A4655',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  footerNote: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(220, 210, 196, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#706459',
  },
});
