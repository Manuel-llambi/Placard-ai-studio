import { Garment, ReferencePhoto, VtonResult } from '../types';

export const SAMPLE_GARMENTS: Garment[] = [
  {
    id: 'blazer-arena',
    name: 'Blazer sastre arena',
    category: 'Blazers',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    colorName: 'Arena / Lino',
    colorHex: '#DCD2C4',
    material: 'Lino & Algodón estructurado',
    description: 'Blazer entallado clásico con solapa muesca y caída natural.',
  },
  {
    id: 'jean-wide-leg',
    name: 'Jean wide leg vintage',
    category: 'Pantalones',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
    colorName: 'Denim medio lavado',
    colorHex: '#647D94',
    material: '100% Denim rígido',
    description: 'Corte amplio tiro alto con terminación relajada.',
  },
];

export const DEMO_REFERENCE_PHOTO: ReferencePhoto = {
  id: 'demo-camila',
  name: 'Camila (Referencia neutra)',
  // Full body woman in neutral pants and white tee in daylight matching "Así sí"
  imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
  isDemo: true,
};

export const GUIDE_PHOTOS = {
  asiSi: {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    title: 'Así sí',
    description: 'Luz frontal suave, ropa neutra y fondo limpio.',
  },
  asiNo: {
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
    title: 'Así no',
    description: 'Espejos sucios, celular tapando o ropa muy holgada.',
  },
};

export const SAMPLE_VTON_RESULTS: Record<string, VtonResult> = {
  'blazer-arena': {
    id: 'vton-blazer-01',
    garment: SAMPLE_GARMENTS[0],
    referencePhoto: DEMO_REFERENCE_PHOTO,
    // Editorial photo matching Screenshot 3: woman wearing tailored sand blazer, ivory pants, belt, loafers in warm daylight
    resultImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    lookTitle: 'Look Diario #01 · Lino & Sastre',
    lookNumber: '#01',
    stylingDescription: 'Combinado con pantalón sastre marfil y calzado mocasín',
    fitPercentage: 98,
    size: 'Talle S',
    date: 'Hoy, 12:45 PM',
    isFavorite: false,
    occasion: 'Trabajo',
  },
  'jean-wide-leg': {
    id: 'vton-jean-01',
    garment: SAMPLE_GARMENTS[1],
    referencePhoto: DEMO_REFERENCE_PHOTO,
    resultImageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1200&auto=format&fit=crop',
    lookTitle: 'Look Finde #02 · Denim & Neutros',
    lookNumber: '#02',
    stylingDescription: 'Combinado con tank top canelé blanco y sobrecamisa fluida',
    fitPercentage: 96,
    size: 'Talle 28',
    date: 'Hoy, 12:48 PM',
    isFavorite: false,
    occasion: 'Casual',
  },
};
