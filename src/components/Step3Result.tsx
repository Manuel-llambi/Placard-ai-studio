import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import {
  Maximize2,
  Heart,
  Check,
  ArrowRight,
  Share2,
  CheckCircle,
  Pencil,
} from 'lucide-react';
import { VtonResult } from '../types';
import { CompareModal } from './CompareModal';

interface Step3ResultProps {
  result: VtonResult;
  onExploreGuest: () => void;
  onAuthSuccess: (provider: 'Apple' | 'Google') => void;
}

export const Step3Result: React.FC<Step3ResultProps> = ({
  result,
  onExploreGuest,
  onAuthSuccess,
}) => {
  const [isFavorite, setIsFavorite] = useState(result.isFavorite);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [lookTitle, setLookTitle] = useState('Look #01');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: 'Mi primer look en Placard VTON',
          text: `Mirá cómo me queda el ${result.garment.name} en mi probador virtual Placard.`,
          url: typeof window !== 'undefined' ? window.location.href : '',
        })
        .catch(() => {});
    } else {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen Title */}
      <View style={styles.titleWrapper}>
        <Text style={styles.mainTitle} accessibilityRole="header">
          ¡Tu primer look está listo!
        </Text>
      </View>

      {/* Hero Card with Virtual Try-On Image */}
      <View id="vton-hero-card" style={styles.heroCard}>
        <Image
          source={{ uri: result.resultImageUrl }}
          accessibilityLabel={result.lookTitle}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Floating Scrim for readability */}
        <View style={styles.scrimOverlay} />

        {/* Top-Left: Garment Indicator Chip */}
        <View style={styles.garmentChip}>
          <Image
            source={{ uri: result.garment.imageUrl }}
            accessibilityLabel={result.garment.name}
            style={styles.garmentChipThumb}
          />
          <View>
            <Text style={styles.garmentChipLabel}>TU PRENDA</Text>
            <Text style={styles.garmentChipName}>{result.garment.name}</Text>
          </View>
          <View style={styles.garmentCheckBadge}>
            <Check size={10} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        {/* Top-Right: Expand / Compare Button */}
        <TouchableOpacity
          id="btn-expand-compare"
          onPress={() => setIsCompareOpen(true)}
          activeOpacity={0.8}
          style={styles.topRightButton}
          accessibilityLabel="Ver comparativa antes / después"
          accessibilityRole="button"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Maximize2 size={16} color="#2B2420" />
        </TouchableOpacity>

        {/* Bottom-Right: Share & Favorite Buttons */}
        <View style={styles.bottomActionsRow}>
          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.8}
            style={styles.actionCircleButton}
            accessibilityLabel="Compartir look"
            accessibilityRole="button"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Share2 size={16} color="#706459" />
          </TouchableOpacity>
          <TouchableOpacity
            id="btn-favorite-look"
            onPress={() => setIsFavorite(!isFavorite)}
            activeOpacity={0.8}
            style={[
              styles.actionCircleButton,
              isFavorite && styles.favoriteActiveButton,
            ]}
            accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            accessibilityRole="button"
            accessibilityState={{ selected: isFavorite }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Heart
              size={16}
              color={isFavorite ? '#FFFFFF' : '#2B2420'}
              fill={isFavorite ? '#FFFFFF' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {shareSuccess && (
        <View style={styles.shareBanner}>
          <CheckCircle size={16} color="#8C9B7E" />
          <Text style={styles.shareBannerText}>¡Enlace del look copiado al portapapeles!</Text>
        </View>
      )}

      {/* Look Metadata & Description */}
      <View style={styles.metadataWrapper}>
        <View style={styles.titleRow}>
          {isEditingTitle ? (
            <View style={styles.editTitleRow}>
              <TextInput
                value={lookTitle}
                onChangeText={setLookTitle}
                autoFocus
                onBlur={() => setIsEditingTitle(false)}
                onSubmitEditing={() => setIsEditingTitle(false)}
                style={styles.titleInput}
                accessibilityLabel="Nombre del look"
              />
              <TouchableOpacity
                onPress={() => setIsEditingTitle(false)}
                activeOpacity={0.8}
                style={styles.saveTitleButton}
                accessibilityLabel="Guardar nombre del look"
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayTitleRow}>
              <Text style={styles.lookTitleText}>
                {lookTitle}
              </Text>
              <TouchableOpacity
                id="btn-edit-look-title"
                onPress={() => setIsEditingTitle(true)}
                activeOpacity={0.7}
                style={styles.editIconButton}
                accessibilityLabel="Editar nombre del look"
                accessibilityRole="button"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Pencil size={14} color="#706459" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.stylingDescription}>
          {result.stylingDescription}
        </Text>
      </View>

      {/* Value Proposition & Conversion Card (The Core Goal) */}
      <View id="value-proposition-conversion-card" style={styles.conversionCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.hangerBadge}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 4a3 3 0 0 1 3 3c0 .88-.38 1.67-1 2.22V10l7 6H3l7-6v-.78A3 3 0 0 1 12 4z" />
              <line x1="3" y1="16" x2="21" y2="16" />
            </svg>
          </View>

          <View style={styles.cardHeaderText}>
            <Text style={styles.cardHeaderTitle}>
              Guardá este look y sumá todo tu placard
            </Text>
            <Text style={styles.cardHeaderDesc}>
              Tu prenda y silueta ya están procesadas. Creá tu acceso gratis para conservarlas y armar conjuntos ilimitados.
            </Text>
          </View>
        </View>

        {/* Auth Action Buttons */}
        <View style={styles.authButtonsStack}>
          <TouchableOpacity
            id="btn-auth-apple"
            onPress={() => onAuthSuccess('Apple')}
            activeOpacity={0.88}
            style={styles.appleButton}
            accessibilityRole="button"
            accessibilityLabel="Continuar con Apple"
          >
            <svg width="16" height="16" viewBox="0 0 170 170" fill="#FFFFFF" aria-hidden="true">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.89-11.96-14.54-7.25-11.24-12.82-24.16-16.71-38.74-3.89-14.59-5.83-27.91-5.83-39.99 0-14.99 3.59-27.32 10.77-37 7.18-9.69 16.38-14.65 27.6-14.88 4.7 0 10.02 1.25 15.96 3.76 5.94 2.51 9.77 3.82 11.51 3.93 1.9.11 5.92-1.35 12.06-4.38 6.13-3.04 11.45-4.4 15.96-4.08 17.52 1.37 30.68 8.42 39.46 21.17-15.35 9.32-22.92 22.18-22.7 38.58.23 12.84 5.09 23.47 14.59 31.9 4.35 3.91 9.24 6.78 14.68 8.62-3.07 9.1-7.1 18.25-12.09 27.46zM119.22 33.5c0-7.39 2.65-14.58 7.95-21.57 5.3-6.99 11.95-11.45 19.95-13.38.74 7.61-1.63 14.98-7.1 22.1-5.47 7.12-12.4 11.45-20.8 12.85z" />
            </svg>
            <Text style={styles.appleButtonText}>Continuar con Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            id="btn-auth-google"
            onPress={() => onAuthSuccess('Google')}
            activeOpacity={0.88}
            style={styles.googleButton}
            accessibilityRole="button"
            accessibilityLabel="Continuar con Google"
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
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>
        </View>

        {/* Guest Mode Link */}
        <View style={styles.guestLinkWrap}>
          <TouchableOpacity
            id="btn-explore-as-guest"
            onPress={onExploreGuest}
            activeOpacity={0.7}
            style={styles.guestButton}
            accessibilityRole="button"
          >
            <Text style={styles.guestButtonText}>Explorar la app como invitada</Text>
            <ArrowRight size={14} color="#706459" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Before / After Fullscreen Modal */}
      {isCompareOpen && (
        <CompareModal
          result={result}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 448,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    flexDirection: 'column',
    minHeight: 'calc(100vh - 60px)' as any,
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: 'sans-serif',
    fontSize: 27,
    fontWeight: '600',
    color: '#2B2420',
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  heroCard: {
    width: '100%',
    aspectRatio: 3 / 4.2,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ECE4DA',
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.4)',
    marginBottom: 16,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  scrimOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 112,
    backgroundColor: 'rgba(43, 36, 32, 0.35)',
  },
  garmentChip: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(250, 247, 242, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  garmentChipThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCD2C4',
  },
  garmentChipLabel: {
    color: '#706459',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  garmentChipName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2B2420',
    lineHeight: 13,
  },
  garmentCheckBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8C9B7E',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  topRightButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(250, 247, 242, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActionsRow: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionCircleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(250, 247, 242, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteActiveButton: {
    backgroundColor: '#7A4655',
  },
  shareBanner: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#8C9B7E',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareBannerText: {
    fontSize: 12,
    color: '#2B2420',
  },
  metadataWrapper: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  titleInput: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    fontWeight: '500',
    color: '#2B2420',
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#7A4655',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    flex: 1,
  },
  saveTitleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8C9B7E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lookTitleText: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    fontWeight: '500',
    color: '#2B2420',
  },
  editIconButton: {
    padding: 4,
    borderRadius: 12,
  },
  stylingDescription: {
    fontSize: 13,
    color: '#706459',
    marginTop: 4,
    lineHeight: 18,
  },
  conversionCard: {
    backgroundColor: '#ECE4DA',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.6)',
    flexDirection: 'column',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
  hangerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7A4655',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardHeaderTitle: {
    fontFamily: 'sans-serif',
    fontSize: 17,
    fontWeight: '500',
    color: '#2B2420',
    lineHeight: 22,
  },
  cardHeaderDesc: {
    fontSize: 12.5,
    color: '#706459',
    marginTop: 4,
    lineHeight: 18,
  },
  authButtonsStack: {
    gap: 10,
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
  guestLinkWrap: {
    alignItems: 'center',
    marginTop: 14,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  guestButtonText: {
    fontSize: 13,
    color: '#706459',
    fontWeight: '600',
  },
});

