import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/marketplace';
import i18n from '../../../i18n';

export const UserPointsDisplay = ({ userName, points }) => {
    return (
      <View style={styles.userPointsContainer}>
        <Text>
          <Text style={styles.userPointsUsername}>{userName}</Text>
          <Text style={styles.userPointsText}>{i18n.t("you_have")} </Text>
          <Text style={styles.pointsHighlight}>{points} {i18n.t("pts")}</Text>
        </Text>
        <View style={styles.pointsIconContainer}>
          <Icon name="star" size={24} color="#B8860B" />
        </View>
      </View>
    );
  };