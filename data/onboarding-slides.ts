import { Ionicons } from '@expo/vector-icons';

export interface Slide {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}

export const onboardingSlides: Slide[] = [
  {
    id: 1,
    title: 'Manage Your AEON Caards',
    description: 'Explore the benefits of AEON Member Plus Visa Card and keep track of your day-to-day wallet expenses.',
    icon: 'card',
    iconColor: '#E91E63',
    backgroundColor: '#FCE4EC',
  },
  {
    id: 2,
    title: 'Earn Points',
    description: 'Collect and convert your points to make your cash back explode! Show your membership barcode upon checkouts at any AEON retail now.',
    icon: 'gift',
    iconColor: '#FF6B35',
    backgroundColor: '#FFF3E0',
  },
  {
    id: 3,
    title: 'QR Payment',
    description: 'Paying with the app has never been easier! Launch the app, scan the QR code at the cashier and you\'re set!',
    icon: 'qr-code',
    iconColor: '#E91E63',
    backgroundColor: '#FCE4EC',
  },
  {
    id: 4,
    title: 'Instant Top Up',
    description: 'Leave your membership card at home and enjoy rapid top up processes, anywhere and anytime, with no additional fees.',
    icon: 'flash',
    iconColor: '#E91E63',
    backgroundColor: '#FCE4EC',
  },
];


