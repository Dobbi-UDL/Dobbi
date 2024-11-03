import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../config/supabaseClient';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { OfferCard } from '../assets/components/OffersScreen/OfferCard';
import { ChallengeCard } from '../assets/components/ChallengesScreen/ChallengeCard';
import { styles } from '../assets/styles/marketplace';

const MarketplaceScreen = () => {
  const [activeTab, setActiveTab] = useState('offers');
  const [offers, setOffers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserPoints();
      fetchOffers();
      fetchChallenges();
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
    }
  };
  

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('saving_goals')
        .select(`
          *,
          companies:company_id (
            name
          )
        `);
      
      if (error) throw error;
      setChallenges(data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
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

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    if (scrollPosition > screenWidth / 2) {
      setActiveTab('challenges');
    } else {
      setActiveTab('offers');
    }
  };

  const scrollToTab = (tab) => {
    setActiveTab(tab);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: tab === 'challenges' ? screenWidth : 0,
        animated: true
      });
    }
  };

  const scrollViewRef = React.createRef();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <View style={styles.pointsDisplay}>
          <Icon name="star" size={20} color="#FFD700" />
          <Text style={styles.pointsText}>{userPoints} points available</Text>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'offers' && styles.activeTab]}
            onPress={() => scrollToTab('offers')}
          >
            <Text style={[styles.tabText, activeTab === 'offers' && styles.activeTabText]}>
              Offers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
            onPress={() => scrollToTab('challenges')}
          >
            <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>
              Challenges
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={[styles.tabContent, { width: screenWidth }]}>
          <ScrollView>
            {offers.map((offer) => (
              <OfferCard 
                key={offer.id} 
                offer={offer}
                userPoints={userPoints}
                onRedeem={() => redeemOffer(offer.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={[styles.tabContent, { width: screenWidth }]}>
          <ScrollView>
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
};

export default MarketplaceScreen;