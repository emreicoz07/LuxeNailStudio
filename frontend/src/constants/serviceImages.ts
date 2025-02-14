import { ServiceCategory } from '../types/schema';

export const serviceImages = {
  [ServiceCategory.MANICURE]: {
    default: 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg',
    services: {
      'basic-manicure': 'https://images.pexels.com/photos/4210784/pexels-photo-4210784.jpeg',
      'gel-manicure': 'https://images.pexels.com/photos/3997385/pexels-photo-3997385.jpeg',
      'spa-manicure': 'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg',
      'french-manicure': 'https://images.pexels.com/photos/4210799/pexels-photo-4210799.jpeg',
    }
  },
  [ServiceCategory.PEDICURE]: {
    default: 'https://images.pexels.com/photos/3997304/pexels-photo-3997304.jpeg',
    services: {
      'basic-pedicure': 'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg',
      'spa-pedicure': 'https://images.pexels.com/photos/3997397/pexels-photo-3997397.jpeg',
      'gel-pedicure': 'https://images.pexels.com/photos/3997388/pexels-photo-3997388.jpeg',
      'luxury-pedicure': 'https://images.pexels.com/photos/3997392/pexels-photo-3997392.jpeg',
    }
  },
  addons: {
    'french-tips': 'https://images.pexels.com/photos/4210805/pexels-photo-4210805.jpeg',
    'nail-art': 'https://images.pexels.com/photos/3997381/pexels-photo-3997381.jpeg',
    'paraffin-treatment': 'https://images.pexels.com/photos/3997382/pexels-photo-3997382.jpeg',
    'gel-polish': 'https://images.pexels.com/photos/4210813/pexels-photo-4210813.jpeg',
  },
  fallback: 'https://images.pexels.com/photos/3997378/pexels-photo-3997378.jpeg'
}; 