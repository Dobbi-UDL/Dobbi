import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.progress, 
          { width: `${(currentStep / totalSteps) * 100}%` }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 4,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});

export default ProgressBar;
