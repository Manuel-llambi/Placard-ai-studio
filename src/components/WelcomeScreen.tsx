import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ArrowRight, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { SAMPLE_GARMENTS, DEMO_REFERENCE_PHOTO, SAMPLE_VTON_RESULTS } from '../data/samples';

interface WelcomeScreenProps {
  onStart: () => void;
}

// Reference assets for the "how it works" concept diagram below —
// same mock dataset the rest of the flow uses, not new imagery.
const conceptGarment = SAMPLE_GARMENTS[0];
const conceptResult = SAMPLE_VTON_RESULTS['blazer-arena'];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
}) => {
  return (
    <View style={styles.container}>
      {/* Main Title & Value Prop */}
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Descubrí cómo te queda lo que ya tenés
        </Text>
        <Text style={styles.subtitle}>
          Probate combinaciones con tus prendas reales sin desordenar tu placard y sin necesidad de cargar 100 prendas para empezar.
        </Text>
      </View>

      {/* Hero Visual Card: a literal "garment + your photo = your look" diagram,
          so the AI concept reads instantly instead of relying on a single mood photo. */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>PRENDA + FOTO = TU LOOK</Text>

        <View style={styles.conceptRow}>
          <View style={styles.conceptItem}>
            <Image
              source={{ uri: conceptGarment.imageUrl }}
              accessibilityLabel="Foto de la prenda que subís"
              style={styles.conceptImage}
              resizeMode="cover"
            />
            <Text style={styles.conceptCaption}>Tu prenda</Text>
          </View>

          <View style={styles.operatorWrap}>
            <Plus size={16} color="#706459" strokeWidth={2.5} />
          </View>

          <View style={styles.conceptItem}>
            <Image
              source={{ uri: DEMO_REFERENCE_PHOTO.imageUrl }}
              accessibilityLabel="Foto de referencia de cuerpo entero"
              style={styles.conceptImage}
              resizeMode="cover"
            />
            <Text style={styles.conceptCaption}>Tu foto</Text>
          </View>

          <View style={styles.operatorWrap}>
            <Text style={styles.operatorEquals}>=</Text>
          </View>

          <View style={styles.conceptItem}>
            <View style={styles.resultImageWrap}>
              <Image
                source={{ uri: conceptResult.resultImageUrl }}
                accessibilityLabel="Resultado generado combinando ambas fotos"
                style={styles.conceptImage}
                resizeMode="cover"
              />
              <View style={styles.sparkleBadge}>
                <Sparkles size={10} color="#FFFFFF" />
              </View>
            </View>
            <Text style={[styles.conceptCaption, styles.conceptCaptionAccent]}>Tu look</Text>
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
          accessibilityRole="button"
          accessibilityLabel="Comenzar mi primera prueba"
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
    fontFamily: 'sans-serif',
    fontSize: 28,
    fontWeight: '600',
    color: '#2B2420',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#706459',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 340,
  },
  heroCard: {
    borderRadius: 20,
    backgroundColor: '#ECE4DA',
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.6)',
    marginBottom: 20,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#706459',
    marginBottom: 16,
    textAlign: 'center',
  },
  conceptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
  },
  conceptItem: {
    alignItems: 'center',
    width: 78,
  },
  conceptImage: {
    width: 78,
    height: 78,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.8)',
  },
  operatorWrap: {
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  operatorEquals: {
    fontSize: 20,
    fontWeight: '700',
    color: '#706459',
  },
  resultImageWrap: {
    position: 'relative',
  },
  sparkleBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7A4655',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ECE4DA',
  },
  conceptCaption: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#706459',
    marginTop: 6,
  },
  conceptCaptionAccent: {
    color: '#7A4655',
    fontWeight: '700',
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
    color: '#706459',
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
    color: '#706459',
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

