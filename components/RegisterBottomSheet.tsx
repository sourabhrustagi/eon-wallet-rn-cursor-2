import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface RegisterBottomSheetProps {
  onClose: () => void;
  onRegister: () => void;
  onYesIHave?: () => void;
  onApplyForCard?: () => void;
}

export interface RegisterBottomSheetRef {
  open: () => void;
  close: () => void;
}

const RegisterBottomSheet = React.forwardRef<RegisterBottomSheetRef, RegisterBottomSheetProps>(
  ({ onClose, onRegister, onYesIHave, onApplyForCard }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%'], []);

    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.expand();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    const handleYesIHave = () => {
      if (onYesIHave) {
        onYesIHave();
      } else {
        onRegister();
      }
      bottomSheetRef.current?.close();
    };

    const handleApplyForCard = () => {
      if (onApplyForCard) {
        onApplyForCard();
      } else {
        onRegister();
      }
      bottomSheetRef.current?.close();
    };

    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
        onClose();
      }
    }, [onClose]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}>
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="card" size={48} color="#E91E63" />
            </View>
            <Text style={styles.question}>
              Do you have any AEON credit card, prepaid card or financing account?
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleYesIHave}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#E91E63', '#9C27B0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.optionGradient}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.optionText}>Yes I have</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButtonSecondary}
              onPress={handleApplyForCard}
              activeOpacity={0.8}>
              <Ionicons name="card-outline" size={20} color="#E91E63" />
              <Text style={styles.optionTextSecondary}>Apply for AEON Member Plus Card</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

RegisterBottomSheet.displayName = 'RegisterBottomSheet';

export default RegisterBottomSheet;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  optionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E91E63',
    gap: 12,
  },
  optionTextSecondary: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: '600',
  },
});

