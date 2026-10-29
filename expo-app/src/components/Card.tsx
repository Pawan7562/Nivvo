// ============================================================================
// REUSABLE COMPONENT: CARD (20px Rounded, Theme Aware)
// ============================================================================

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, StyleProp } from 'react-native';
import { useRiderStore } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, SPACING } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'subtle' | 'forest';
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  noPadding = false
}) => {
  const isDarkMode = useRiderStore((state) => state.isDarkMode);
  const colors = isDarkMode ? darkColors : lightColors;

  let backgroundColor = colors.card;
  let borderColor = colors.cardBorder;

  if (variant === 'subtle') {
    backgroundColor = colors.surfaceSubtle;
  } else if (variant === 'forest') {
    backgroundColor = '#1F4230';
    borderColor = '#2B5740';
  }

  const containerStyle: ViewStyle = {
    backgroundColor,
    borderRadius: RADIUS.card,
    borderColor,
    borderWidth: variant === 'forest' ? 0 : 1,
    padding: noPadding ? 0 : SPACING.lg,
    overflow: 'hidden'
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[containerStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
};
