import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store, persistor } from '@/core/store';
import { apiClient, setupMockInterceptor } from '@/core/api';
import { loadAuthFromStorage } from '@/features/auth';

// Initialize mock interceptor
setupMockInterceptor(apiClient);

// Component to load auth from secure storage on app start
function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuthFromStorage() as any);
  }, [dispatch]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthLoader />
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
