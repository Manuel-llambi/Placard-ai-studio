export interface Garment {
  id: string;
  name: string;
  category: 'Blazers' | 'Pantalones' | 'Vestidos' | 'Camisas' | 'Remeras' | 'Prenda propia';
  imageUrl: string;
  colorName: string;
  colorHex: string;
  material: string;
  description: string;
  isCustomUpload?: boolean;
}

export interface ReferencePhoto {
  id: string;
  name: string;
  imageUrl: string;
  isDemo?: boolean;
  isLive?: boolean;
}

export interface VtonResult {
  id: string;
  garment: Garment;
  referencePhoto: ReferencePhoto;
  resultImageUrl: string;
  lookTitle: string;
  lookNumber: string;
  stylingDescription: string;
  fitPercentage: number;
  size: string;
  date: string;
  isFavorite: boolean;
  occasion: 'Trabajo' | 'Salida' | 'Casual' | 'Finde';
}

export type OnboardingStep =
  | 'welcome'
  | 'step1_garment'
  | 'step2_reference'
  | 'processing'
  | 'step3_result'
  | 'guest_wardrobe';
