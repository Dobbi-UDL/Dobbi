import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/marketplace';
import Card from '../common/Card';
import i18n from '../../../i18n';
import { supabase } from '../../../config/supabaseClient';

export const OfferCard = memo(({ offer, userPoints, onRedeem, isExpanded, onToggleExpand, userId}) => {
  const [showCode, setShowCode] = useState(offer.isRedeemed);
  const canRedeem = userPoints >= offer.points_required;
  const [numberOfLines, setNumberOfLines] = useState(0);

  // Reset expansion when leaving screen
  useEffect(() => {
    return () => onToggleExpand?.(null);
  }, []);

  const handleLayout = (event) => {
    const height = event.nativeEvent.layout.height;
    const lineHeight = 20; // Approximate line height
    setNumberOfLines(Math.floor(height / lineHeight));
  };

  const handleOfferClick = () => {
    supabase
      .from('offer_interactions')
      .select('*')
      .eq('user_id', userId)
      .eq('offer_id', offer.id)
      .eq('type_action', 'click')
      .then(({ data, error }) => {
      if (error) {
        console.error('Error checking interaction:', error);
      } else if (data.length === 0) {
        supabase
        .from('offer_interactions')
        .insert([{ user_id: userId, type_action: 'click', offer_id: offer.id }])
        .then(({ error }) => {
          if (error) {
          console.error('Error inserting interaction:', error);
          }
        });
      }
      });
  }

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
    <TouchableOpacity onPress={() => {
      handleOfferClick();
    }}>
      <Card style={[
        styles.cardContainer,
        isExpanded && styles.expandedCard,
        offer.isRedeemed && styles.redeemedCard
      ]}>
        <View style={styles.cardContent}>
          {/* Header Section */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.companyName}>{offer.companies.name}</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {offer.title}
              </Text>
            </View>
            <View style={[
              styles.pointsContainer,
              !canRedeem && styles.pointsContainerDisabled
            ]}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={[
                styles.pointsText,
                !canRedeem && styles.pointsTextDisabled
              ]}>
                {offer.points_required}
              </Text>
            </View>
          </View>

          {/* Description Section */}
          <Text 
            style={[
              styles.cardDescription,
              isExpanded && styles.expandedDescription
            ]}
            numberOfLines={isExpanded ? undefined : 2}
            onLayout={handleLayout}
          >
            {offer.description}
          </Text>
          
          {numberOfLines > 2 && (
            <TouchableOpacity 
              style={styles.seeMoreButton}
              onPress={() => onToggleExpand(isExpanded ? null : offer.id)}
            >
              <Text style={styles.seeMoreText}>
                {isExpanded ? i18n.t('see_less') : i18n.t('see_more')}
              </Text>
            </TouchableOpacity>
          )}

          {/* Actions Section */}
          <View style={styles.actionsContainer}>
            {showCode ? (
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>{i18n.t('discount_code')}:</Text>
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
                  {canRedeem ? i18n.t('redeem_offer') : i18n.t('insufficient_points')}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.validUntil}>
              {i18n.t('valid_until')} {new Date(offer.end_date).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.userPoints === nextProps.userPoints &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.offer.id === nextProps.offer.id &&
    prevProps.offer.isRedeemed === nextProps.offer.isRedeemed &&
    prevProps.offer.points_required === nextProps.offer.points_required
  );
});
