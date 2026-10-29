// ============================================================================
// NIVVO DELIVERY PARTNER (RIDER) - ROOT APP CONTAINER
// React Native (Expo) + TypeScript + Zustand + React Query
// ============================================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRiderStore } from './src/store/useRiderStore';
import { lightColors, darkColors } from './src/theme';

// Screens
import { DutyScreen } from './src/screens/DutyScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { EarningsScreen } from './src/screens/EarningsScreen';
import { SupportScreen } from './src/screens/SupportScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

// Navigation & Global Components
import { BottomTabNav } from './src/navigation/BottomTabNav';
import { Toast } from './src/components/Toast';

// Initialize React Query Client for live updates and mutations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 2
    }
  }
});

export default function App() {
  const { activeTab, isDarkMode } = useRiderStore();
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <QueryClientProvider client={queryClient}>
      <View style={[styles.rootContainer, { backgroundColor: colors.background }]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />

        {/* Global Toast Notification System */}
        <Toast />

        {/* Dynamic Screen View according to Active Bottom Tab */}
        <View style={styles.screenWrapper}>
          {activeTab === 'duty' && <DutyScreen />}
          {activeTab === 'orders' && <OrdersScreen />}
          {activeTab === 'earnings' && <EarningsScreen />}
          {activeTab === 'support' && <SupportScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </View>

        {/* 5-Tab Bottom Navigation Bar (Duty · Orders · Earnings · Support · Profile) */}
        <BottomTabNav />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    position: 'relative'
  },
  screenWrapper: {
    flex: 1
  }
});
