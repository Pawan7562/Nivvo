// ============================================================================
// REUSABLE COMPONENT: PROGRESS STEPS (Assigned → Picked up → On route → Delivered)
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRiderStore } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, TYPOGRAPHY } from '../theme';
import { OrderStage } from '../types';
import { ORDER_STAGES } from '../store/orderStateMachine';
import { Ionicons } from '@expo/vector-icons';

interface ProgressStepsProps {
  currentStage: OrderStage;
}

const STEPS = [
  { index: 0, label: 'Assigned' },
  { index: 1, label: 'Picked up' },
  { index: 2, label: 'On route' },
  { index: 3, label: 'Delivered' }
];

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStage }) => {
  const isDarkMode = useRiderStore((state) => state.isDarkMode);
  const colors = isDarkMode ? darkColors : lightColors;
  const currentStepIndex = ORDER_STAGES[currentStage]?.stepIndex ?? 0;

  return (
    <View style={styles.container}>
      {/* Visual connector lines */}
      <View style={styles.lineContainer}>
        {STEPS.slice(0, 3).map((step) => {
          const isComplete = currentStepIndex > step.index;
          return (
            <View
              key={step.index}
              style={[
                styles.lineSegment,
                {
                  backgroundColor: isComplete
                    ? isDarkMode ? '#C6F432' : '#1F4230'
                    : isDarkMode ? '#293B30' : '#E2E7DC'
                }
              ]}
            />
          );
        })}
      </View>

      {/* Step nodes & labels */}
      <View style={styles.stepsRow}>
        {STEPS.map((step) => {
          const isPassed = currentStepIndex > step.index;
          const isCurrent = currentStepIndex === step.index;

          let circleBg = isDarkMode ? '#1F2E24' : '#EAEFE5';
          let textColor = colors.textMuted;
          let content = `${step.index + 1}`;

          if (isPassed) {
            circleBg = isDarkMode ? '#C6F432' : '#1F4230';
            content = '✓';
            textColor = colors.textPrimary;
          } else if (isCurrent) {
            circleBg = '#C6F432';
            textColor = isDarkMode ? '#C6F432' : '#1F4230';
          }

          return (
            <View key={step.index} style={styles.stepNode}>
              <View
                style={[
                  styles.circle,
                  { backgroundColor: circleBg },
                  isCurrent && styles.activeRing
                ]}
              >
                {isPassed ? (
                  <Ionicons 
                    name="checkmark" 
                    size={13} 
                    color={isDarkMode ? '#14281C' : '#FFFFFF'} 
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      color: isCurrent ? '#14281C' : colors.textSecondary
                    }}
                  >
                    {step.index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  {
                    color: textColor,
                    fontWeight: isCurrent ? '800' : '600',
                    marginTop: 4
                  }
                ]}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    position: 'relative'
  },
  lineContainer: {
    position: 'absolute',
    top: 15,
    left: '12%',
    right: '12%',
    flexDirection: 'row',
    gap: 4
  },
  lineSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  stepNode: {
    alignItems: 'center',
    width: 68
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  activeRing: {
    borderWidth: 2,
    borderColor: '#1F4230'
  }
});
