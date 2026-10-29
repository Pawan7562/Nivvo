// ============================================================================
// NAVIGATION: BOTTOM TAB BAR (Duty · Orders · Earnings · Support · Profile)
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiderStore, NavTab } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, SPACING, TOUCH_TARGET, TYPOGRAPHY } from '../theme';

interface TabConfig {
  id: NavTab;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  badge?: number | string;
}

export const BottomTabNav: React.FC = () => {
  const { activeTab, setActiveTab, isDarkMode, activeOrder } = useRiderStore();
  const colors = isDarkMode ? darkColors : lightColors;

  const tabs: TabConfig[] = [
    { 
      id: 'duty', 
      label: 'Duty', 
      activeIcon: 'flash', 
      inactiveIcon: 'flash-outline' 
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      activeIcon: 'cube', 
      inactiveIcon: 'cube-outline', 
      badge: activeOrder ? '1' : undefined 
    },
    { 
      id: 'earnings', 
      label: 'Earnings', 
      activeIcon: 'wallet', 
      inactiveIcon: 'wallet-outline' 
    },
    { 
      id: 'support', 
      label: 'Support', 
      activeIcon: 'headset', 
      inactiveIcon: 'headset-outline' 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      activeIcon: 'person', 
      inactiveIcon: 'person-outline' 
    }
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navRow}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const iconColor = isActive 
              ? (isDarkMode ? '#C6F432' : '#1F4230') 
              : colors.textSecondary;

            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
                style={styles.tabButton}
                accessibilityLabel={`${tab.label} tab`}
                accessibilityState={{ selected: isActive }}
              >
                <View style={styles.iconWrap}>
                  <Ionicons 
                    name={isActive ? tab.activeIcon : tab.inactiveIcon} 
                    size={22} 
                    color={iconColor} 
                  />
                  {tab.badge && (
                    <View style={styles.badgeIndicator}>
                      <Text style={{ fontSize: 9, fontWeight: '800', color: '#14281C' }}>
                        {tab.badge}
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive 
                        ? (isDarkMode ? '#C6F432' : '#1F4230') 
                        : colors.textSecondary,
                      fontWeight: isActive ? '800' : '500'
                    }
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6
  },
  safeArea: {
    paddingBottom: Platform.OS === 'ios' ? 0 : 4
  },
  navRow: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs
  },
  iconWrap: {
    position: 'relative',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeIndicator: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#C6F432',
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2
  }
});
