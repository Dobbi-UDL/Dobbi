import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/marketplace';
import Card from '../common/Card';

export const OfferCard = ({ offer, userPoints, onRedeem }) => {
  const [showCode, setShowCode] = useState(offer.isRedeemed);
  const canRedeem = userPoints >= offer.points_required;

  const handleRedeem = () => {
    if (!canRedeem) {
      Alert.alert(
        "Insufficient Points",
        `You need ${offer.points_required - userPoints} more points to redeem this offer.`,
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Redeem Offer",
      `Are you sure you want to redeem this offer for ${offer.points_required} points?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Redeem",
          onPress: async () => {
            try {
              await onRedeem();
              setShowCode(true);
            } catch (error) {
              Alert.alert("Error", "Failed to redeem offer. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity>
      <Card>
      <View style={styles.cardHeader}>
        <Text style={styles.companyName}>{offer.companies.name}</Text>
        <View style={[
          styles.pointsContainer,
          !canRedeem && styles.pointsContainerDisabled
        ]}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={[
            styles.pointsText,
            !canRedeem && styles.pointsTextDisabled
          ]}>
            {offer.points_required} points
          </Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{offer.title}</Text>
      <Text style={styles.cardDescription}>{offer.description}</Text>

      {showCode ? (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Discount Code:</Text>
          <Text style={styles.codeText}>{offer.discount_code}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.redeemButton,
            !canRedeem && styles.redeemButtonDisabled
          ]}
          onPress={handleRedeem}
          disabled={!canRedeem}
        >
          <Text style={[
            styles.redeemButtonText,
            !canRedeem && styles.redeemButtonTextDisabled
          ]}>
            {canRedeem ? 'Redeem Offer' : 'Insufficient Points'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>
          Valid: {new Date(offer.start_date).toLocaleDateString()} - {new Date(offer.end_date).toLocaleDateString()}
        </Text>
      </View>
      </Card>
    </TouchableOpacity>
  );
};