import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, Check, Sun, Maximize2, ShieldCheck, User } from 'lucide-react';
import { GUIDE_PHOTOS } from '../data/samples';

interface BodyPhotoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BodyPhotoGuideModal: React.FC<BodyPhotoGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modalCard}>
        {/* Sticky Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <User size={16} color="#7A4655" strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.categoryLabel}>
                FOTO DE REFERENCIA · GUÍA DE CUERPO
              </Text>
              <Text style={styles.title}>
                Cómo sacar la foto perfecta
              </Text>
            </View>
          </View>

          <TouchableOpacity
            id="btn-close-body-guide"
            onPress={onClose}
            activeOpacity={0.7}
            style={styles.closeButton}
            accessibilityLabel="Cerrar guía de foto"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={16} color="#75695E" />
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.innerContent}>
            <Text style={styles.introText}>
              Para que la prenda calce con proporciones y caída natural sobre tu silueta, seguí estos consejos al posar:
            </Text>

            {/* Comparative visual cards: Así sí vs Así no */}
            <View style={styles.comparisonGrid}>
              {/* Así sí */}
              <View style={styles.compareCard}>
                <View style={styles.compareHeader}>
                  <View style={styles.badgeYes}>
                    <Check size={10} color="#8C9B7E" strokeWidth={3} />
                  </View>
                  <Text style={styles.compareTitleYes}>Así sí</Text>
                </View>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: GUIDE_PHOTOS.asiSi.url }}
                    accessibilityLabel={GUIDE_PHOTOS.asiSi.title}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.cardCaptionTitle}>
                  Luz de frente y postura recta
                </Text>
                <Text style={styles.cardCaptionDesc}>
                  {GUIDE_PHOTOS.asiSi.description}
                </Text>
              </View>

              {/* Así no */}
              <View style={styles.compareCard}>
                <View style={styles.compareHeader}>
                  <View style={styles.badgeNo}>
                    <X size={10} color="#A85A46" strokeWidth={3} />
                  </View>
                  <Text style={styles.compareTitleNo}>Así no</Text>
                </View>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: GUIDE_PHOTOS.asiNo.url }}
                    accessibilityLabel={GUIDE_PHOTOS.asiNo.title}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.cardCaptionTitle}>
                  Foto cortada o a oscuras
                </Text>
                <Text style={styles.cardCaptionDesc}>
                  {GUIDE_PHOTOS.asiNo.description}
                </Text>
              </View>
            </View>

            {/* 3 Step-by-step guidance cards */}
            <View style={styles.tipsList}>
              <View style={styles.tipRow}>
                <View style={styles.tipIconBox}>
                  <Maximize2 size={16} color="#7A4655" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>
                    Cuerpo entero de pies a cabeza
                  </Text>
                  <Text style={styles.tipDescription}>
                    Apoyá el teléfono a la altura del pecho o pedile a alguien que te saque la foto a un metro y medio de distancia.
                  </Text>
                </View>
              </View>

              <View style={styles.tipRow}>
                <View style={styles.tipIconBox}>
                  <Sun size={16} color="#AD8A56" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>
                    Luz natural sin sombras duras
                  </Text>
                  <Text style={styles.tipDescription}>
                    Ubicarse cerca de una ventana ayuda a que los contornos y texturas de la ropa se definan con naturalidad.
                  </Text>
                </View>
              </View>

              <View style={styles.tipRow}>
                <View style={styles.tipIconBox}>
                  <User size={16} color="#75695E" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>
                    Ropa base neutra o entallada
                  </Text>
                  <Text style={styles.tipDescription}>
                    Una remera básica o calza deportiva permite al modelo de IA identificar tu silueta sin superponer volúmenes extra.
                  </Text>
                </View>
              </View>
            </View>

            {/* Privacy reminder matching Content System rule 7 */}
            <View style={styles.privacyBanner}>
              <ShieldCheck size={16} color="#8C9B7E" />
              <Text style={styles.privacyText}>
                Esta foto se borra sola a las 72 horas y nunca se usa para entrenar IA.
              </Text>
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: 'rgba(43, 36, 32, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 448,
    backgroundColor: '#F6F1EA',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#DCD2C4',
    maxHeight: '92vh' as any,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#F6F1EA',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(220, 210, 196, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(122, 70, 85, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#7A4655',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    fontWeight: '600',
    color: '#2B2420',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECE4DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  innerContent: {
    padding: 20,
    gap: 16,
  },
  introText: {
    fontSize: 13,
    color: '#75695E',
    lineHeight: 18,
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  compareCard: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.7)',
  },
  compareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  badgeYes: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(140, 155, 126, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareTitleYes: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#8C9B7E',
  },
  badgeNo: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(168, 90, 70, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareTitleNo: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#A85A46',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ECE4DA',
    marginBottom: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardCaptionTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2B2420',
  },
  cardCaptionDesc: {
    fontSize: 10.5,
    color: '#75695E',
    marginTop: 2,
    lineHeight: 14,
  },
  tipsList: {
    gap: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.6)',
  },
  tipIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECE4DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2420',
  },
  tipDescription: {
    fontSize: 12,
    color: '#75695E',
    marginTop: 2,
    lineHeight: 16,
  },
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(211, 218, 199, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(140, 155, 126, 0.4)',
  },
  privacyText: {
    fontSize: 11.5,
    color: '#2B2420',
    flex: 1,
  },
});
