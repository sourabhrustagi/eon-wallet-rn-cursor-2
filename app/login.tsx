import { useState, useCallback } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedText, ThemedView } from '@/shared/components';
import { useThemeColor } from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@/core/store';
import { loginAsync } from '@/features/auth';
import { validateEmail, validatePassword, validateLoginForm } from '@/shared/utils/validation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const errorColor = '#D32F2F';

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    setGeneralError('');
    
    if (touched.email) {
      const validation = validateEmail(text);
      setEmailError(validation.isValid ? '' : validation.error || '');
    }
  }, [touched.email]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    setGeneralError('');
    
    if (touched.password) {
      const validation = validatePassword(text);
      setPasswordError(validation.isValid ? '' : validation.error || '');
    }
  }, [touched.password]);

  const handleEmailBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, email: true }));
    const validation = validateEmail(email);
    setEmailError(validation.isValid ? '' : validation.error || '');
  }, [email]);

  const handlePasswordBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, password: true }));
    const validation = validatePassword(password);
    setPasswordError(validation.isValid ? '' : validation.error || '');
  }, [password]);

  const handleLogin = async () => {
    // Mark all fields as touched
    setTouched({ email: true, password: true });
    
    // Clear previous errors
    setGeneralError('');
    setEmailError('');
    setPasswordError('');

    // Validate form
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      // Validate individual fields to show specific errors
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password);
      
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.error || '');
      }
      if (!passwordValidation.isValid) {
        setPasswordError(passwordValidation.error || '');
      }
      
      setGeneralError(validation.error || 'Please fix the errors above');
      return;
    }

    try {
      await dispatch(loginAsync({ email: email.trim(), password })).unwrap();
      router.replace('/home');
    } catch (err: any) {
      // Handle different error types
      let errorMessage = 'Login failed. Please try again.';
      
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.payload) {
        errorMessage = err.payload;
      }

      // Set appropriate error
      if (errorMessage.toLowerCase().includes('email')) {
        setEmailError(errorMessage);
      } else if (errorMessage.toLowerCase().includes('password')) {
        setPasswordError(errorMessage);
      } else {
        setGeneralError(errorMessage);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Welcome Back
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Sign in to continue to your wallet
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <ThemedText style={styles.label}>Email</ThemedText>
                {emailError ? <ThemedText style={styles.required}> *</ThemedText> : null}
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor: emailError ? errorColor : textColor + '30',
                    backgroundColor: backgroundColor,
                    borderWidth: emailError ? 2 : 1,
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={textColor + '60'}
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                editable={!isLoading}
              />
              {emailError ? (
                <ThemedText style={styles.fieldError}>{emailError}</ThemedText>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <ThemedText style={styles.label}>Password</ThemedText>
                {passwordError ? <ThemedText style={styles.required}> *</ThemedText> : null}
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor: passwordError ? errorColor : textColor + '30',
                    backgroundColor: backgroundColor,
                    borderWidth: passwordError ? 2 : 1,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={textColor + '60'}
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={handlePasswordBlur}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                editable={!isLoading}
              />
              {passwordError ? (
                <ThemedText style={styles.fieldError}>{passwordError}</ThemedText>
              ) : null}
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              disabled={isLoading}
              activeOpacity={0.7}>
              <ThemedText type="link" style={styles.forgotPasswordText}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            {generalError ? (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{generalError}</ThemedText>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: tintColor },
                (isLoading || !!emailError || !!passwordError) && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading || !!emailError || !!passwordError}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={[styles.loginButtonText, { color: '#fff' }]}>
                  Sign In
                </ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <ThemedText style={styles.signUpText}>Don't have an account? </ThemedText>
              <TouchableOpacity onPress={() => {/* TODO: Navigate to sign up */}}>
                <ThemedText type="link" style={styles.signUpLink}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  required: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  fieldError: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFE5E5',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
});

