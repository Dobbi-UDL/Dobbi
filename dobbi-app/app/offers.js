import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '../config/supabaseClient';
import { OfferCard } from '../assets/components/OffersScreen/OfferCard';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { SearchBar } from '../assets/components/OffersScreen/SearchBar';
import { CategoryFilter } from '../assets/components/OffersScreen/CategoryFilter';
import { UserPointsDisplay } from '../assets/components/OffersScreen/UserPointsDisplay';
import { styles } from '../assets/styles/marketplace';
import Header from '../assets/components/Header/Header';
import { useLanguage } from '@languagecontext';

const OffersScreen = () => {
  const { locale } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);

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

  const handleSearch = (term) => {
    const filtered = offers.filter(offer => 
      offer.title.toLowerCase().includes(term.toLowerCase()) ||
      offer.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOffers(filtered);
  };

  const handleCategorySelect = (selectedCategories) => {
    if (selectedCategories.length === 0) {
      // Si no hay categorías seleccionadas, mostrar todas las ofertas
      setFilteredOffers(offers);
    } else {
      // Filtrar ofertas que coincidan con alguna de las categorías seleccionadas
      const filtered = offers.filter(offer => 
        selectedCategories.some(category => offer.category_id === category.id)
      );
      setFilteredOffers(filtered);
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
      <UserPointsDisplay 
        userName={userName} 
        points={userPoints} 
      />
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter 
          categories={categories} 
          onSelectCategories={handleCategorySelect} 
        />
        <FlatList
          data={filteredOffers}
          renderItem={({ item }) => (
            <OfferCard 
              key={item.id}
              offer={item}
              userPoints={userPoints}
              onRedeem={() => redeemOffer(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.contentContainer}
        />
        <BottomNavBar />
      </View>
    </>
  );
};

export default OffersScreen;