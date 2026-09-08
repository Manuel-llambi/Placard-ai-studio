import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  Plus,
  Heart,
  Camera,
  Shirt,
  FolderHeart,
} from 'lucide-react-native';
import { VtonResult } from '../types';
import { SAMPLE_GARMENTS } from '../data/samples';

// Scrim bottom-weighted para que el caption blanco se lea sobre cualquier foto
// (reemplaza el `backgroundImage: linear-gradient(...)` de la versión web, que
// no existe como estilo nativo de View).
const CARD_SCRIM_COLORS = [
  'rgba(43, 36, 32, 0)',
  'rgba(43, 36, 32, 0.2)',
  'rgba(43, 36, 32, 0.75)',
] as const;
const CARD_SCRIM_LOCATIONS = [0, 0.55, 1] as const;

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
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
      {/* Banner: Guest Mode or Registered Account Status */}
      {!isRegisteredUser ? (
        <View style={styles.guestBanner}>
          <View style={styles.guestBannerLeft}>
            <View style={styles.sparkleCircle}>
              <Sparkles size={16} color="#7A4655" />
            </View>
            <View style={styles.guestBannerMeta}>
              <Text style={styles.guestBannerTitle}>
                Modo invitada activa
              </Text>
              <Text style={styles.guestBannerSubtitle} numberOfLines={1}>
                4 de 5 pruebas gratuitas restantes esta semana.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onSignUpModal}
            activeOpacity={0.85}
            style={styles.saveWardrobeBtn}
            accessibilityLabel="Guardar placard, crear cuenta"
            accessibilityRole="button"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.saveWardrobeBtnText}>Guardar placard</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.syncBanner}>
          <View style={styles.syncRow}>
            <View style={styles.greenDot} />
            <Text style={styles.syncText}>
              Cuenta sincronizada con {userAuthMethod || 'Apple'}
            </Text>
          </View>
          <Text style={styles.planText}>Plan Free</Text>
        </View>
      )}

      {/* Screen Title & Tabs */}
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>
          {activeTab === 'looks' ? 'Tus looks' : 'Tu placard'}
        </Text>
        <Text style={styles.countText}>
          {activeTab === 'looks' ? '1 look generado' : '2 prendas'}
        </Text>
      </View>

      {/* Horizontal Filter Chips */}
      {activeTab === 'looks' ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContainer}
        >
          {occasionChips.map((chip) => (
            <TouchableOpacity
              key={chip}
              onPress={() => setSelectedOccasion(chip)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                selectedOccasion === chip ? styles.chipActive : styles.chipInactive,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedOccasion === chip }}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedOccasion === chip ? styles.chipTextActive : styles.chipTextInactive,
                ]}
              >
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContainer}
        >
          {categoryChips.map((chip) => (
            <TouchableOpacity
              key={chip.label}
              onPress={() => setSelectedCategory(chip.label)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                selectedCategory === chip.label ? styles.chipActive : styles.chipInactive,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedCategory === chip.label }}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === chip.label ? styles.chipTextActive : styles.chipTextInactive,
                ]}
              >
                {chip.label} ({chip.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Content Area */}
      {activeTab === 'looks' ? (
        <View style={styles.grid}>
          {/* Newly Generated Look */}
          <View style={styles.cardLook}>
            <View style={styles.cardImageContainer}>
              <Image
                source={{ uri: initialResult.resultImageUrl }}
                accessibilityLabel={initialResult.lookTitle}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <LinearGradient colors={CARD_SCRIM_COLORS} locations={CARD_SCRIM_LOCATIONS} style={styles.cardOverlay} />
              <View style={styles.heartButton}>
                <Heart size={14} color="#7A4655" fill="#7A4655" />
              </View>
              <View style={styles.lookMetaBottom}>
                <Text style={styles.lookOccasion}>
                  {initialResult.occasion}
                </Text>
                <Text style={styles.lookTitle} numberOfLines={1}>
                  {initialResult.lookTitle}
                </Text>
              </View>
            </View>
          </View>

          {/* Add Another Look Prompt Card */}
          <TouchableOpacity
            onPress={onNewVton}
            activeOpacity={0.85}
            style={styles.cardAddPrompt}
          >
            <View style={styles.plusCircle}>
              <Plus size={20} color="#7A4655" />
            </View>
            <Text style={styles.addPromptTitle}>
              Probar otra prenda
            </Text>
            <Text style={styles.addPromptSubtitle}>
              Probá un jean, vestido o camisa en 10 segundos
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.grid}>
          {/* User's primary garment */}
          <View style={styles.cardLook}>
            <View style={styles.cardImageContainer}>
              <Image
                source={{ uri: initialResult.garment.imageUrl }}
                accessibilityLabel={initialResult.garment.name}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <LinearGradient colors={CARD_SCRIM_COLORS} locations={CARD_SCRIM_LOCATIONS} style={styles.cardOverlay} />
              <View style={styles.lookMetaBottom}>
                <Text style={styles.garmentCategory}>
                  {initialResult.garment.category}
                </Text>
                <Text style={styles.lookTitle} numberOfLines={1}>
                  {initialResult.garment.name}
                </Text>
              </View>
            </View>
          </View>

          {/* Secondary sample garment */}
          <View style={styles.cardLook}>
            <View style={styles.cardImageContainer}>
              <Image
                source={{ uri: SAMPLE_GARMENTS[1].imageUrl }}
                accessibilityLabel={SAMPLE_GARMENTS[1].name}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <LinearGradient colors={CARD_SCRIM_COLORS} locations={CARD_SCRIM_LOCATIONS} style={styles.cardOverlay} />
              <View style={styles.lookMetaBottom}>
                <Text style={styles.garmentCategory}>
                  {SAMPLE_GARMENTS[1].category}
                </Text>
                <Text style={styles.lookTitle} numberOfLines={1}>
                  {SAMPLE_GARMENTS[1].name}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Value proposition next step */}
      <View style={styles.nextStepBox}>
        <View style={styles.nextStepHeader}>
          <Text style={styles.nextStepLabel}>
            SIGUIENTE COMBINACIÓN
          </Text>
          <Text style={styles.nextStepHint}>Sin catalogar todo</Text>
        </View>
        <Text style={styles.nextStepTitle}>
          ¿Querés ver cómo combina con un jean vintage?
        </Text>
        <Text style={styles.nextStepDesc}>
          Probá una prenda más y descubrí cómo armar un look completo sin desordenar tu placard.
        </Text>
        <TouchableOpacity
          onPress={onNewVton}
          activeOpacity={0.88}
          style={styles.tryAnotherBtn}
        >
          <Camera size={16} color="#FFFFFF" />
          <Text style={styles.tryAnotherBtnText}>Hacer otra prueba virtual</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => setActiveTab('looks')}
          activeOpacity={0.7}
          style={styles.navItem}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'looks' }}
          accessibilityLabel="Ver tus looks"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <FolderHeart
            size={20}
            color={activeTab === 'looks' ? '#7A4655' : '#A79C8E'}
            strokeWidth={activeTab === 'looks' ? 2.2 : 1.5}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'looks' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Looks
          </Text>
        </TouchableOpacity>

        {/* Elevated Center Camera Button */}
        <TouchableOpacity
          onPress={onNewVton}
          activeOpacity={0.85}
          style={styles.centerFab}
          accessibilityLabel="Nueva prueba virtual"
        >
          <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('placard')}
          activeOpacity={0.7}
          style={styles.navItem}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'placard' }}
          accessibilityLabel="Ver tu placard"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Shirt
            size={20}
            color={activeTab === 'placard' ? '#7A4655' : '#A79C8E'}
            strokeWidth={activeTab === 'placard' ? 2.2 : 1.5}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'placard' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Placard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  container: {
    width: '100%',
    maxWidth: 448,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 96,
    flexDirection: 'column',
    flexGrow: 1,
  },
  guestBanner: {
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#DCD2C4',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  guestBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  sparkleCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(122, 70, 85, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBannerMeta: {
    flex: 1,
  },
  guestBannerTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B2420',
  },
  guestBannerSubtitle: {
    fontSize: 11,
    color: '#75695E',
    marginTop: 2,
  },
  saveWardrobeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: '#7A4655',
  },
  saveWardrobeBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '500',
  },
  syncBanner: {
    backgroundColor: 'rgba(211, 218, 199, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(140, 155, 126, 0.5)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8C9B7E',
  },
  syncText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2B2420',
  },
  planText: {
    fontSize: 11,
    color: '#75695E',
    fontWeight: '500',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'sans-serif',
    fontSize: 24,
    fontWeight: '500',
    color: '#2B2420',
  },
  countText: {
    fontSize: 12,
    color: '#75695E',
  },
  chipsScroll: {
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  chipActive: {
    backgroundColor: '#C6A2AC',
  },
  chipInactive: {
    backgroundColor: '#ECE4DA',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#2B2420',
  },
  chipTextInactive: {
    color: '#75695E',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  cardLook: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ECE4DA',
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.7)',
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: 3 / 4.2,
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  // Bottom-weighted scrim (ver CARD_SCRIM_COLORS/LOCATIONS) para que el caption
  // blanco se lea sobre cualquier foto, en vez de un tinte plano que lava las
  // prendas claras. Solo el tamaño/posición vive acá: los colores del gradiente
  // los pone el componente <LinearGradient>.
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lookMetaBottom: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  lookOccasion: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: 'rgba(250, 247, 242, 0.8)',
  },
  lookTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 2,
  },
  garmentCategory: {
    fontSize: 10,
    color: '#D3DAC7',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  cardAddPrompt: {
    flex: 1,
    aspectRatio: 3 / 4.2,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#DCD2C4',
    backgroundColor: 'rgba(236, 228, 218, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  plusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addPromptTitle: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: '500',
    color: '#2B2420',
    textAlign: 'center',
  },
  addPromptSubtitle: {
    fontSize: 11,
    color: '#75695E',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 15,
  },
  nextStepBox: {
    marginTop: 'auto',
    backgroundColor: '#FAF7F2',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DCD2C4',
  },
  nextStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nextStepLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: '#7A4655',
  },
  nextStepHint: {
    fontSize: 11,
    color: '#75695E',
  },
  nextStepTitle: {
    fontFamily: 'sans-serif',
    fontSize: 15,
    fontWeight: '500',
    color: '#2B2420',
    marginBottom: 4,
  },
  nextStepDesc: {
    fontSize: 12,
    color: '#75695E',
    marginBottom: 12,
    lineHeight: 16,
  },
  tryAnotherBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#7A4655',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tryAnotherBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    backgroundColor: 'rgba(250, 247, 242, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(220, 210, 196, 0.7)',
    maxWidth: 448,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#7A4655',
  },
  navLabelInactive: {
    color: '#A79C8E',
  },
  centerFab: {
    width: 48,
    height: 48,
    marginTop: -20,
    borderRadius: 24,
    backgroundColor: '#7A4655',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
