// ============================================================================
// REUSABLE COMPONENT: STATUS PILL
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { RADIUS, TYPOGRAPHY } from '../theme';

export type StatusPillVariant = 
  | 'online' 
  | 'offline' 
  | 'surge' 
  | 'tryon' 
  | 'verified' 
  | 'warning'
  | 'info';

interface StatusPillProps {
  label: string;
  variant?: StatusPillVariant;
  style?: StyleProp<ViewStyle>;
  showDot?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  variant = 'info',
  style,
  showDot = true
}) => {
  let bg = '#EBF0E6';
  let text = '#1F4230';
  let dot = '#1F4230';

  if (variant === 'online') {
    bg = '#E8F5E9';
    text = '#15803D';
    dot = '#22C55E';
  } else if (variant === 'offline') {
    bg = '#F1F3EE';
    text = '#708075';
    dot = '#9CA3AF';
  } else if (variant === 'surge') {
    bg = '#1F4230';
    text = '#C6F432';
    dot = '#C6F432';
  } else if (variant === 'tryon') {
    bg = '#EEF4EC';
    text = '#1F4230';
    dot = '#C6F432';
  } else if (variant === 'verified') {
    bg = '#E8F5E9';
    text = '#15803D';
    dot = '#16A34A';
  } else if (variant === 'warning') {
    bg = '#FEF3C7';
    text = '#B45309';
    dot = '#F59E0B';
  }

  return (
    <View style={[styles.pill, { backgroundColor: bg }, style]}>
      {showDot && <View style={[styles.dot, { backgroundColor: dot }]} />}
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
    letterSpacing: 0.3
  }
});
