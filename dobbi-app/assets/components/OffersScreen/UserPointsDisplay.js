import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/marketplace';

export const UserPointsDisplay = ({ userName, points }) => {
    return (
      <View style={styles.userPointsContainer}>
        <Text>
          <Text style={styles.userPointsUsername}>{userName}</Text>
          <Text style={styles.userPointsText}>, tienes </Text>
          <Text style={styles.pointsHighlight}>{points} puntos</Text>
        </Text>
        <View style={styles.pointsIconContainer}>
          <Icon name="star" size={24} color="#B8860B" />
        </View>
      </View>
    );
  };