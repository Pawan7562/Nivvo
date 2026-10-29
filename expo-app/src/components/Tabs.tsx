// ============================================================================
// REUSABLE COMPONENT: TABS (Segmented Pill Switcher)
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useRiderStore } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, TOUCH_TARGET, TYPOGRAPHY } from '../theme';

interface TabItem<T extends string> {
  id: T;
  label: string;
  badge?: string | number;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onSelectTab: (tabId: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onSelectTab,
  style
}: TabsProps<T>) {
  const isDarkMode = useRiderStore((state) => state.isDarkMode);
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#17221A' : '#E8EDE2',
          borderColor: colors.cardBorder
        },
        style
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.8}
            style={[
              styles.tabButton,
              isActive && {
                backgroundColor: isDarkMode ? '#C6F432' : '#1F4230',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 1
              }
            ]}
          >
            <Text
              style={[
                TYPOGRAPHY.subtext,
                {
                  fontWeight: isActive ? '800' : '600',
                  color: isActive
                    ? isDarkMode
                      ? '#14281C'
                      : '#FFFFFF'
                    : colors.textSecondary
                }
              ]}
            >
              {tab.label}
            </Text>
            {tab.badge !== undefined && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isActive
                      ? isDarkMode
                        ? '#14281C'
                        : '#C6F432'
                      : isDarkMode
                      ? '#2A3B30'
                      : '#D4DEC9'
                  }
                ]}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '800',
                    color: isActive
                      ? isDarkMode
                        ? '#C6F432'
                        : '#14281C'
                      : colors.textPrimary
                  }}
                >
                  {tab.badge}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: RADIUS.pill,
    padding: 3,
    borderWidth: 1
  },
  tabButton: {
    flex: 1,
    minHeight: TOUCH_TARGET - 6,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 8
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.pill
  }
});
