import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
}) => {
  return (
    <View style={styles.container}>
      {/* Main Title & Value Prop */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Descubrí cómo te queda lo que ya tenés
        </Text>
        <Text style={styles.subtitle}>
          Probate combinaciones con tus prendas reales sin desordenar tu placard y sin necesidad de cargar 100 prendas para empezar.
        </Text>
      </View>

      {/* Hero Visual Card showing the VTON Concept */}
      <View style={styles.heroCard}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop' }}
            accessibilityLabel="Placard de prendas en lino y luz natural"
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.gradientOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.garmentBadge}>
              <View style={styles.garmentThumb}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop' }}
                  accessibilityLabel="Prenda"
                  style={styles.thumbImage}
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text style={styles.badgeTitle}>Prenda + Tu silueta</Text>
                <Text style={styles.badgeSubtitle}>Calce virtual orgánico</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* "Lo que vas a hacer a continuación" Steps Section */}
      <View style={styles.stepsCard}>
        <Text style={styles.stepsSectionTitle}>
          ¿CÓMO FUNCIONA ESTA PRUEBA? (EN 3 PASOS):
        </Text>

        <View style={styles.stepsList}>
          {/* Step 1 item */}
          <View style={styles.stepItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Elegí una prenda que ames</Text>
              <Text style={styles.stepDescription}>
                Subí una foto de tu ropa (la recortamos sola) o elegí una de muestra ya preparada.
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.stepDivider} />

          {/* Step 2 item */}
          <View style={styles.stepItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Subí tu foto de referencia</Text>
              <Text style={styles.stepDescription}>
                Una foto de cuerpo entero o usá el demo de Camila para ver el resultado de inmediato.
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.stepDivider} />

          {/* Step 3 (Outcome) */}
          <View style={styles.stepItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Mirá tu look puesto en 10 segundos</Text>
              <Text style={styles.stepDescription}>
                Visualizá el calce orgánico y guardalo en tu placard digital si te gusta.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Trust & Privacy Guarantee Banner */}
      <View style={styles.privacyCard}>
        <View style={styles.privacyIconWrap}>
          <ShieldCheck size={16} color="#8C9B7E" />
        </View>
        <Text style={styles.privacyText}>
          <Text style={styles.privacyBold}>Privacidad garantizada: </Text>
          Tus fotos no son públicas ni se comparten con terceros.
        </Text>
      </View>

      {/* Primary CTA Button */}
      <View style={styles.ctaWrapper}>
        <TouchableOpacity
          id="btn-welcome-start"
          onPress={onStart}
          activeOpacity={0.88}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Comenzar mi primera prueba</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 448,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    flexDirection: 'column',
    minHeight: 'calc(100vh - 60px)' as any,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '600',
    color: '#2B2420',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#75695E',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 340,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ECE4DA',
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.6)',
    marginBottom: 20,
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(43, 36, 32, 0.35)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  garmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  garmentThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  badgeTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  badgeSubtitle: {
    color: 'rgba(250, 247, 242, 0.8)',
    fontSize: 10,
    lineHeight: 14,
  },
  stepsCard: {
    backgroundColor: 'rgba(236, 228, 218, 0.7)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.6)',
    marginBottom: 16,
  },
  stepsSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#75695E',
    marginBottom: 12,
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7A4655',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#2B2420',
    lineHeight: 18,
  },
  stepDescription: {
    fontSize: 12,
    color: '#75695E',
    lineHeight: 17,
    marginTop: 2,
  },
  stepDivider: {
    marginLeft: 11,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(220, 210, 196, 0.8)',
    height: 6,
  },
  privacyCard: {
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.8)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  privacyIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(140, 155, 126, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    color: '#2B2420',
    lineHeight: 17,
  },
  privacyBold: {
    fontWeight: '600',
    color: '#2B2420',
  },
  ctaWrapper: {
    marginTop: 'auto',
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#7A4655',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});

