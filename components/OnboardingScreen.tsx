import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Slide, onboardingSlides } from '../data/onboarding-slides';
import RegisterBottomSheet, { RegisterBottomSheetRef } from './RegisterBottomSheet';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreenProps {
  onRegister?: () => void;
}

export default function OnboardingScreen({ onRegister }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const bottomSheetRef = useRef<RegisterBottomSheetRef>(null);

  const handleRegister = () => {
    bottomSheetRef.current?.open();
  };

  const handleCloseBottomSheet = () => {
    // Called when bottom sheet closes
  };

  const handleYesIHave = () => {
    // Handle "Yes I have" button click
    console.log('User has AEON card/account');
    onRegister?.();
  };

  const handleApplyForCard = () => {
    // Navigate to apply card screen
    router.push('/apply-card');
  };

  const handleRegisterConfirm = () => {
    onRegister?.();
  };

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index || 0);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={onboardingSlides}
        renderItem={({ item }: { item: Slide }) => (
          <View style={styles.slide}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: item.backgroundColor }]}>
                <Ionicons name={item.icon} size={80} color={item.iconColor} />
              </View>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.paginationContainer}>
        {onboardingSlides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === currentSlide && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleRegister}
          activeOpacity={0.8}
          style={styles.registerButtonWrapper}>
          <LinearGradient
            colors={['#E91E63', '#9C27B0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <RegisterBottomSheet
        ref={bottomSheetRef}
        onClose={handleCloseBottomSheet}
        onRegister={handleRegisterConfirm}
        onYesIHave={handleYesIHave}
        onApplyForCard={handleApplyForCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  registerButtonWrapper: {
    width: '100%',
    borderRadius: 12,
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  registerButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});


