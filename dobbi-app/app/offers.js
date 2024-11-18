import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { supabase } from '../config/supabaseClient';
import { OfferCard } from '../assets/components/OffersScreen/OfferCard';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { styles } from '../assets/styles/marketplace';
import Header from '../assets/components/Header/Header';

const OffersScreen = () => {
  const [offers, setOffers] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserPoints();
      fetchOffers();
    }
  }, [userId]);

  const getUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('points')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) setUserPoints(data.points || 0);
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          companies:company_id (
            name
          ),
          offer_interactions(user_id)
        `)
        .eq('offer_interactions.user_id', userId);
  
      if (error) throw error;
  
      const processedOffers = data.map(offer => ({
        ...offer,
        isRedeemed: offer.offer_interactions?.length > 0
      }));
  
      setOffers(processedOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const redeemOffer = async (offerId) => {
    try {
      // Primero verificamos que el usuario tenga suficientes puntos
      const offer = offers.find(o => o.id === offerId);
      if (userPoints < offer.points_required) {
        throw new Error('Insufficient points');
      }

      // Iniciamos una transacción para redimir la oferta y actualizar los puntos
      const { error } = await supabase.rpc('redeem_offer', {
        p_user_id: userId,
        p_offer_id: offerId,
        p_points_required: offer.points_required
      });

      if (error) throw error;

      // Actualizamos el estado local
      await Promise.all([
        fetchUserPoints(),
        fetchOffers()
      ]);

    } catch (error) {
      console.error('Error redeeming offer:', error);
      // Aquí deberías mostrar un mensaje de error al usuario
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
    <Header />
    <View style={[styles.container, styles.flexContainer]}>
      <ScrollView style={styles.contentContainer}>
        {offers.map((offer) => (
          <OfferCard 
            key={offer.id} 
            offer={offer}
            userPoints={userPoints}
            onRedeem={() => redeemOffer(offer.id)}
          />
        ))}
      </ScrollView>
      <BottomNavBar />
    </View>
    </>
  );
};

export default OffersScreen;