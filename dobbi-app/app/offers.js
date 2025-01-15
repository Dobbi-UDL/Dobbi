import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../config/supabaseClient';
import { OfferCard } from '../assets/components/OffersScreen/OfferCard';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { SearchBar } from '../assets/components/OffersScreen/SearchBar';
import { CategoryFilter } from '../assets/components/OffersScreen/CategoryFilter';
import { UserPointsDisplay } from '../assets/components/OffersScreen/UserPointsDisplay';
import Header from '../assets/components/Header/Header';
import { useLanguage } from '@languagecontext';
import { useLocalSearchParams } from 'expo-router';
import { styles } from '../assets/styles/offers';


const OffersScreen = () => {
  const { locale } = useLanguage();
  const { highlightOffer } = useLocalSearchParams();
  const listRef = useRef(null);
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [expandedOfferId, setExpandedOfferId] = useState(null);
  const [showRedeemed, setShowRedeemed] = useState(true);
  const CARD_HEIGHT = 250; // Update to match new card height
  const HEADER_HEIGHT = 60;
  const USER_POINTS_HEIGHT = 70;
  const SEARCH_BAR_HEIGHT = 50;
  const CATEGORY_FILTER_HEIGHT = 52;
  const CARD_VERTICAL_SPACING = 12;

  useEffect(() => {
    fetchCategories();
    getUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserPoints();
      fetchOffers();
    }
  }, [userId]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('offer_categories')
        .select('*')
        .range(0, 1000); // Aumenta el rango para recuperar más categorías
  
      if (error) throw error;
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
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
        .select('points, username')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) {
        setUserPoints(data.points || 0);
        setUserName(data.username || 'User');
      }
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
          companies:company_id (name),
          offer_interactions(user_id, type_action)
        `);

      if (error) throw error;

      const processedOffers = data.map(offer => ({
        ...offer,
        isRedeemed: offer.offer_interactions.some(
          interaction => interaction.user_id === userId && interaction.type_action === 'redeem'
        ),
        canRedeem: offer.points_required <= userPoints
      }));

      setOffers(processedOffers);
      setFilteredOffers(processedOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const redeemOffer = async (offerId) => {
    try {
      const offer = offers.find(o => o.id === offerId);
      if (userPoints < offer.points_required) {
        throw new Error('Insufficient points');
      }

      const { error } = await supabase.rpc('redeem_offer', {
        p_user_id: userId,
        p_offer_id: offerId,
        p_points_required: offer.points_required
      });

      if (error) throw error;

      await Promise.all([
        fetchUserPoints(),
        fetchOffers()
      ]);

    } catch (error) {
      console.error('Error redeeming offer:', error);
    }
  };

  const applyFilters = (searchTerm = '', selectedCategories = [], includeRedeemed = true) => {
    let filtered = [...offers];
  
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchLower) ||
        offer.description.toLowerCase().includes(searchLower)
      );
    }
  
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(offer =>
        selectedCategories.some(category => offer.category_id === category.id)
      );
    }
  
    // Apply redeemed filter
    if (!includeRedeemed) {
      filtered = filtered.filter(offer => !offer.isRedeemed);
    }
  
    setFilteredOffers(filtered);
  };

  const handleSearch = (term) => {
    applyFilters(term, [], showRedeemed);
  };

  const handleCategorySelect = (selectedCategories) => {
    applyFilters('', selectedCategories, showRedeemed);
  };

  const findOfferIndex = useCallback((title) => {
    return filteredOffers.findIndex(offer => 
      offer.title.toLowerCase() === title.toLowerCase()
    );
  }, [filteredOffers]);

  useEffect(() => {
    if (highlightOffer && listRef.current) {
      const index = findOfferIndex(highlightOffer);
      if (index !== -1) {
        const LIST_PADDING_TOP = 8; // From styles.listContent
        const cardOffset = (index + 1) * (CARD_HEIGHT + CARD_VERTICAL_SPACING) + LIST_PADDING_TOP;
        
        // Small delay to ensure layout is complete
        setTimeout(() => {
          listRef.current.scrollToOffset({
            offset: cardOffset,
            animated: true
          });
          setExpandedOfferId(null);
        }, 100);
      }
    }
  }, [highlightOffer, filteredOffers]);

  useEffect(() => {
    return () => setExpandedOfferId(null);
  }, []);

  const handleScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      if (listRef.current) {
        const LIST_PADDING_TOP = 8;
        const offset = (info.index * (CARD_HEIGHT + CARD_VERTICAL_SPACING)) + LIST_PADDING_TOP;
        
        listRef.current.scrollToOffset({
          offset,
          animated: true
        });
      }
    });
  };

  const handleOfferView = (offerId) => {
    console.log(`Offer ${offerId} viewed`);
    // Add your logic here
  };

  // Move all callbacks to top level and memoize them
  const handleRedeem = useCallback((offerId) => {
    redeemOffer(offerId);
  }, [redeemOffer]);

  const handleToggleExpand = useCallback((id) => {
    setExpandedOfferId(id);
  }, []);

  const renderItem = useCallback(({ item }) => {
    // handleOfferView(item.id); // Call handleOfferView when the offer card is viewed
    return (
      <OfferCard 
        offer={item}
        userPoints={userPoints}
        onRedeem={() => handleRedeem(item.id)}
        isExpanded={expandedOfferId === item.id}
        onToggleExpand={handleToggleExpand}
        userId={userId} // Pass handleOfferClick to OfferCard
      />
    );
  }, [userPoints, expandedOfferId, handleRedeem, handleToggleExpand]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const getItemLayout = useCallback((data, index) => ({
    length: CARD_HEIGHT + CARD_VERTICAL_SPACING,
    offset: (CARD_HEIGHT + CARD_VERTICAL_SPACING) * index,
    index,
  }), [CARD_HEIGHT, CARD_VERTICAL_SPACING]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Marketplace" />
      <View style={styles.mainContainer}>
        <UserPointsDisplay 
          userName={userName} 
          points={userPoints} 
        />
        <SearchBar onSearch={handleSearch} />
        <View style={styles.filterSection}>
          <CategoryFilter 
            categories={categories} 
            onSelectCategories={handleCategorySelect}
          />
        </View>
        <FlatList
          ref={listRef}
          data={filteredOffers}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={5}
          onScrollToIndexFailed={handleScrollToIndexFailed}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <BottomNavBar />
    </View>
  );
};

export default OffersScreen;