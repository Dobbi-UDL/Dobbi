import React from 'react';
import { View } from 'react-native';
import { HomeHeader } from '../assets/components/HomeScreen/HomeHeader';
import { HomeContent } from '../assets/components/HomeScreen/HomeContent';
import { styles } from '../assets/styles/home';

const HomeScreen = () => {
  // Este valor vendría de tu sistema de autenticación
  const username = "John Doe"; 

  return (
    <View style={styles.container}>
      <HomeHeader />
      <HomeContent username={username} />
    </View>
  );
};

export default HomeScreen;