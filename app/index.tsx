import { useAppSelector } from '@/core/store';
import { useSlides } from '@/features/welcome';
import { IconSymbol, ThemedText, ThemedView } from '@/shared/components';
import { useThemeColor } from '@/shared/hooks';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const tintColor = useThemeColor({}, 'tint');
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { slides, isLoading, error } = useSlides();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentSlide(slideIndex);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  if (error || slides.length === 0) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText style={styles.errorText}>
          {error || 'No slides available'}
        </ThemedText>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: tintColor, marginTop: 20 }]}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}>
          <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
            Continue to Login
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}>
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.slideContent}>
              <View style={[styles.iconContainer, { backgroundColor: tintColor + '20' }]}>
                <IconSymbol
                  name={slide.icon as any}
                  size={64}
                  color={tintColor}
                />
              </View>
              
              <ThemedText type="title" style={styles.slideTitle}>
                {slide.title}
              </ThemedText>
              
              <ThemedText style={styles.slideDescription}>
                {slide.description}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === currentSlide && [styles.paginationDotActive, { backgroundColor: tintColor }],
            ]}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: tintColor }]}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}>
          <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
            Get Started
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}>
          <ThemedText style={styles.secondaryButtonText}>
            Sign In
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  slideTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
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
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 24,
  },
});

