import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ApplyCardScreen() {
  const [selectedCardUsage, setSelectedCardUsage] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [otherPurpose, setOtherPurpose] = useState('');

  const toggleCardUsage = (usage: string) => {
    setSelectedCardUsage((prev) =>
      prev.includes(usage) ? prev.filter((item) => item !== usage) : [...prev, usage]
    );
  };

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose) ? prev.filter((item) => item !== purpose) : [...prev, purpose]
    );
  };

  const handleNext = () => {
    // Handle next step
    console.log('Card Usage:', selectedCardUsage);
    console.log('Purposes:', selectedPurposes);
    console.log('Other Purpose:', otherPurpose);
    // Navigate to next screen or submit
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply for Card</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>BEFORE WE BEGIN</Text>
        <Text style={styles.mainQuestion}>
          Do you want to enable your card for online purchases and/or for overseas use?
        </Text>

        <View style={styles.cardUsageContainer}>
          <TouchableOpacity
            style={[
              styles.cardUsageButton,
              selectedCardUsage.includes('online') && styles.cardUsageButtonSelected,
            ]}
            onPress={() => toggleCardUsage('online')}
            activeOpacity={0.8}>
            <Ionicons
              name="cart"
              size={32}
              color={selectedCardUsage.includes('online') ? '#E91E63' : '#999'}
            />
            <Text
              style={[
                styles.cardUsageText,
                selectedCardUsage.includes('online') && styles.cardUsageTextSelected,
              ]}>
              ONLINE SHOPPING
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cardUsageButton,
              selectedCardUsage.includes('overseas') && styles.cardUsageButtonSelected,
            ]}
            onPress={() => toggleCardUsage('overseas')}
            activeOpacity={0.8}>
            <Ionicons
              name="globe"
              size={32}
              color={selectedCardUsage.includes('overseas') ? '#E91E63' : '#999'}
            />
            <Text
              style={[
                styles.cardUsageText,
                selectedCardUsage.includes('overseas') && styles.cardUsageTextSelected,
              ]}>
              OVERSEAS USE
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Purpose of transaction?</Text>
        <Text style={styles.subText}>You can select more than 1 option</Text>

        <View style={styles.purposeContainer}>
          {[
            'Member Privileges',
            'Payment Card',
            'Product Financing',
            'Business Settlement',
            'Others',
          ].map((purpose) => (
            <TouchableOpacity
              key={purpose}
              style={styles.purposeOption}
              onPress={() => togglePurpose(purpose)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.checkbox,
                  selectedPurposes.includes(purpose) && styles.checkboxSelected,
                ]}>
                {selectedPurposes.includes(purpose) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.purposeText}>{purpose}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedPurposes.includes('Others') && (
          <View style={styles.otherInputContainer}>
            <TextInput
              style={styles.otherInput}
              placeholder="Please Specify"
              placeholderTextColor="#999"
              value={otherPurpose}
              onChangeText={setOtherPurpose}
            />
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}>
          <LinearGradient
            colors={['#FF6B35', '#F7931E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>NEXT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  mainQuestion: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    lineHeight: 28,
  },
  cardUsageContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  cardUsageButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cardUsageButtonSelected: {
    borderColor: '#E91E63',
    backgroundColor: '#FCE4EC',
  },
  cardUsageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  cardUsageTextSelected: {
    color: '#E91E63',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  purposeContainer: {
    gap: 12,
  },
  purposeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  purposeText: {
    fontSize: 16,
    color: '#333',
  },
  otherInputContainer: {
    marginTop: 12,
    marginLeft: 36,
  },
  otherInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

