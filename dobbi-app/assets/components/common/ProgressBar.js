import React from 'react';
import { View } from 'react-native';
import { styles } from './ProgressBar.styles';

const ProgressBar = ({ 
  progress, 
  height = 10, 
  backgroundColor = '#e0e0e0', 
  progressColor = '#ff6b6b' 
}) => {
  // Asegurar que el progreso esté entre 0 y 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View 
      style={[
        {
          height: height,
          backgroundColor: backgroundColor,
          borderRadius: height / 2,
          overflow: 'hidden',
          width: '100%',
        },
        styles.progressBarContainer
      ]}
    >
      <View
        style={{
          height: '100%',
          width: `${clampedProgress}%`,
          backgroundColor: progressColor,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
};

export default ProgressBar;