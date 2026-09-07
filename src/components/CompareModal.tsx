import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { X, Sliders, Check } from 'lucide-react';
import { VtonResult } from '../types';

interface CompareModalProps {
  result: VtonResult;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ result, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeTab, setActiveTab] = useState<'slider' | 'sideBySide'>('slider');

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>
              Comparativa de calce virtual
            </Text>
            <Text style={styles.headerTitle}>
              {result.lookTitle}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={styles.closeButton}
            accessibilityLabel="Cerrar modal"
          >
            <X size={16} color="#2B2420" />
          </TouchableOpacity>
        </View>

        {/* View mode toggle */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => setActiveTab('slider')}
            activeOpacity={0.7}
            style={[
              styles.tabButton,
              activeTab === 'slider' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'slider' && styles.tabButtonTextActive,
              ]}
            >
              Deslizador Antes / Después
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('sideBySide')}
            activeOpacity={0.7}
            style={[
              styles.tabButton,
              activeTab === 'sideBySide' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'sideBySide' && styles.tabButtonTextActive,
              ]}
            >
              Lado a lado
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content area */}
        <View style={styles.contentArea}>
          {activeTab === 'slider' ? (
            <View style={styles.sliderContainer}>
              {/* After: VTON Result */}
              <Image
                source={{ uri: result.resultImageUrl }}
                accessibilityLabel="Resultado VTON"
                style={styles.absoluteImage}
                resizeMode="cover"
              />

              {/* Before: Reference Photo clipped */}
              <View
                style={[
                  styles.beforeClippedView,
                  { width: `${sliderPos}%` },
                ]}
              >
                <Image
                  source={{ uri: result.referencePhoto.imageUrl }}
                  accessibilityLabel="Referencia original"
                  style={styles.absoluteImage}
                  resizeMode="cover"
                />
                <View style={styles.badgeLeft}>
                  <Text style={styles.badgeText}>Foto original</Text>
                </View>
              </View>

              <View style={styles.badgeRight}>
                <Text style={styles.badgeText}>VTON Placard</Text>
              </View>

              {/* Slider thumb handle */}
              <View
                style={[
                  styles.sliderThumbTrack,
                  { left: `calc(${sliderPos}% - 16px)` as any },
                ]}
              >
                <View style={styles.sliderThumb}>
                  <Sliders size={16} color="#7A4655" />
                </View>
              </View>

              {/* Interactive range input */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'ew-resize',
                  zIndex: 20,
                }}
                aria-label="Deslizar para comparar"
              />
            </View>
          ) : (
            <View style={styles.sideBySideRow}>
              <View style={styles.sideBySideCol}>
                <Text style={styles.colTitle}>Tu referencia</Text>
                <View style={styles.sideCard}>
                  <Image
                    source={{ uri: result.referencePhoto.imageUrl }}
                    accessibilityLabel="Original"
                    style={styles.fullSizeImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
              <View style={styles.sideBySideCol}>
                <View style={styles.colTitleRow}>
                  <Text style={styles.colTitleColored}>Con {result.garment.name}</Text>
                  <Check size={12} color="#8C9B7E" />
                </View>
                <View style={[styles.sideCard, styles.sideCardHighlighted]}>
                  <Image
                    source={{ uri: result.resultImageUrl }}
                    accessibilityLabel="Con prenda"
                    style={styles.fullSizeImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.fitNote}>
            <Text style={styles.fitNoteText}>
              Calce estimado: {result.fitPercentage}% de concordancia anatómica con silueta real.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            style={styles.footerButton}
          >
            <Text style={styles.footerButtonText}>Cerrar comparativa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed' as any,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(43, 36, 32, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 512,
    backgroundColor: '#F6F1EA',
    borderRadius: 24,
    overflow: 'hidden',
    maxHeight: '92vh' as any,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(220, 210, 196, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF7F2',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C9B7E',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    fontWeight: '500',
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
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: 'rgba(236, 228, 218, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(220, 210, 196, 0.4)',
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  tabButtonActive: {
    backgroundColor: '#7A4655',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#75695E',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  contentArea: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 340,
    aspectRatio: 3 / 4,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DCD2C4',
  },
  absoluteImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  beforeClippedView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRightWidth: 2,
    borderRightColor: '#FFFFFF',
  },
  badgeLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  badgeRight: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: 'rgba(122, 70, 85, 0.9)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  sliderThumbTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#7A4655',
  },
  sideBySideRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  sideBySideCol: {
    flex: 1,
    flexDirection: 'column',
  },
  colTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#75695E',
    marginBottom: 4,
    textAlign: 'center',
  },
  colTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 4,
  },
  colTitleColored: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A4655',
  },
  sideCard: {
    aspectRatio: 3 / 4,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#ECE4DA',
    borderWidth: 1,
    borderColor: '#DCD2C4',
  },
  sideCardHighlighted: {
    borderWidth: 2,
    borderColor: 'rgba(122, 70, 85, 0.4)',
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
  },
  fitNote: {
    marginTop: 16,
    alignItems: 'center',
  },
  fitNoteText: {
    fontSize: 12,
    color: '#75695E',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FAF7F2',
    borderTopWidth: 1,
    borderTopColor: 'rgba(220, 210, 196, 0.6)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#7A4655',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
});

