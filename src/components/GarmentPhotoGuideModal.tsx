import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Camera, X, Check, ShieldCheck } from 'lucide-react';

interface GarmentPhotoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTakePhoto?: () => void;
  onUploadGallery?: () => void;
  onStartLiveCamera?: () => void;
}

export const GarmentPhotoGuideModal: React.FC<GarmentPhotoGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <View style={styles.backdrop}>
      <View style={styles.modalCard}>
        {/* Sticky Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Camera size={16} color="#7A4655" strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.categoryLabel}>
                PRENDA PROPIA · GUÍA DE FOTO
              </Text>
              <Text style={styles.title}>
                Cómo sacar la foto perfecta
              </Text>
            </View>
          </View>

          <TouchableOpacity
            id="btn-close-garment-guide"
            onPress={onClose}
            activeOpacity={0.7}
            style={styles.closeButton}
          >
            <X size={16} color="#75695E" />
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.innerContent}>
            <Text style={styles.introText}>
              Nuestra IA recortará la prenda y la adaptará a tu silueta. Para que conserve su textura, color y caída natural, seguí estos consejos:
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
                    source={{ uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop' }}
                    accessibilityLabel="Prenda estirada en percha con buena luz"
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.cardCaptionDesc}>
                  En percha o sobre la cama, estirada y con luz natural suave.
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
                    source={{ uri: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=600&auto=format&fit=crop' }}
                    accessibilityLabel="Prenda arrugada o en desorden"
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.cardCaptionDesc}>
                  Arrugada, doblada en el suelo o con sombra del celular tapándola.
                </Text>
              </View>
            </View>

            {/* 4 Core Indications */}
            <View style={styles.indicationsBox}>
              <Text style={styles.indicationsHeading}>
                4 CLAVES PARA UNA FOTO IMPECABLE:
              </Text>

              {/* Point 1 */}
              <View style={styles.indicationRow}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.indicationContent}>
                  <Text style={styles.indicationTitle}>
                    En percha o estirada sobre una superficie plana
                  </Text>
                  <Text style={styles.indicationDesc}>
                    Colgala contra una pared lisa o extendela estirada sobre tu cama. Evitá que queden pliegues o mangas dobladas hacia atrás.
                  </Text>
                </View>
              </View>

              {/* Point 2 */}
              <View style={styles.indicationRow}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.indicationContent}>
                  <Text style={styles.indicationTitle}>
                    Luz natural de día y sin sombras del teléfono
                  </Text>
                  <Text style={styles.indicationDesc}>
                    Ubicá la prenda cerca de una ventana. Cuidá tu postura para que la sombra de tu cuerpo o celular no tape la prenda.
                  </Text>
                </View>
              </View>

              {/* Point 3 */}
              <View style={styles.indicationRow}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.indicationContent}>
                  <Text style={styles.indicationTitle}>
                    Toda la prenda dentro del encuadre
                  </Text>
                  <Text style={styles.indicationDesc}>
                    Dejá un pequeño margen de aire alrededor. El cuello, los hombros, los puños y el dobladillo deben verse completos.
                  </Text>
                </View>
              </View>

              {/* Point 4 */}
              <View style={styles.indicationRow}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <View style={styles.indicationContent}>
                  <Text style={styles.indicationTitle}>
                    Fondo contrastante y liso
                  </Text>
                  <Text style={styles.indicationDesc}>
                    Si tu prenda es clara, usá una pared o colcha oscura. Si la prenda es oscura, usá un fondo claro para que el recorte sea perfecto.
                  </Text>
                </View>
              </View>
            </View>

            {/* Privacy reminder */}
            <View style={styles.privacyBanner}>
              <ShieldCheck size={16} color="#8C9B7E" />
              <Text style={styles.privacyText}>
                Tus fotos se procesan de forma privada y segura.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
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
    fontFamily: 'serif',
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
  cardCaptionDesc: {
    fontSize: 11,
    color: '#75695E',
    lineHeight: 15,
  },
  indicationsBox: {
    backgroundColor: '#FAF7F2',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.7)',
    gap: 12,
  },
  indicationsHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#75695E',
    letterSpacing: 0.8,
  },
  indicationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECE4DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A4655',
  },
  indicationContent: {
    flex: 1,
  },
  indicationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2420',
  },
  indicationDesc: {
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
