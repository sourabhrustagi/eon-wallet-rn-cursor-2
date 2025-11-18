import { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Welcome Back
          </ThemedText>
          {user && (
            <ThemedText style={styles.subtitle}>
              {user.name || user.email}
            </ThemedText>
          )}
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Your Wallet</ThemedText>
          <ThemedText style={styles.cardDescription}>
            Manage your crypto assets and transactions
          </ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Quick Actions</ThemedText>
          <ThemedText style={styles.cardDescription}>
            Send, receive, and swap cryptocurrencies
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: tintColor }]}
          onPress={handleLogout}
          activeOpacity={0.8}>
          <ThemedText style={[styles.logoutButtonText, { color: tintColor }]}>
            Logout
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 32,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

