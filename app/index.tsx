import OnboardingScreen from '../components/OnboardingScreen';

export default function Index() {
  const handleRegister = () => {
    // Navigate to registration or main app
    console.log('Register pressed');
  };

  return <OnboardingScreen onRegister={handleRegister} />;
}

