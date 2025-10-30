import { SampleImage } from '../types';

export const SAMPLE_PERSON_IMAGES: SampleImage[] = [
  {
    id: 'person-1',
    url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    type: 'person',
    description: 'Woman standing front view',
  },
  {
    id: 'person-2',
    url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    type: 'person',
    description: 'Man standing casual',
  },
  {
    id: 'person-3',
    url: 'https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg',
    type: 'person',
    description: 'Woman full body portrait',
  },
];

export const SAMPLE_GARMENT_IMAGES: SampleImage[] = [
  {
    id: 'garment-1',
    url: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg',
    type: 'garment',
    description: 'White t-shirt',
  },
  {
    id: 'garment-2',
    url: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg',
    type: 'garment',
    description: 'Blue denim jacket',
  },
  {
    id: 'garment-3',
    url: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg',
    type: 'garment',
    description: 'Red dress',
  },
];

export const HOW_IT_WORKS = [
  {
    id: '1',
    title: 'Upload Images',
    description: 'Select a photo of yourself and a garment you want to try on',
    icon: 'upload',
  },
  {
    id: '2',
    title: 'AI Processing',
    description: 'Our AI will virtually fit the garment on your photo',
    icon: 'cpu',
  },
  {
    id: '3',
    title: 'View & Share',
    description: 'See the result, save to favorites, or share with friends',
    icon: 'share-2',
  },
];
