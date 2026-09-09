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

// `source` usa require() (resuelto por Metro en build time) en vez de una URL de
// string tipo "/assets/...": esa ruta absoluta la servía el dev server de Vite
// desde `public/`, algo que no existe en el runtime nativo de Expo. Con require(),
// Metro empaqueta la imagen y funciona igual en Expo Go, en un build nativo y en web.
export const GUIDE_PHOTOS = {
  asiSi: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    source: require('../../public/assets/guide-photos/asi-si-cuerpo-entero.jpg'),
    title: 'Así sí',
    description: 'Cuerpo entero de pies a cabeza, luz pareja y ropa entallada.',
  },
  asiNo: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    source: require('../../public/assets/guide-photos/asi-no-selfie-espejo.jpg'),
    title: 'Así no',
    description: 'Selfie de espejo con el flash tapando la cara y foto cortada.',
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
