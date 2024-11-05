import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const AppHeader = ({ username, profileImage }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Dobbi</Text>
      <TouchableOpacity onPress={() => router.push('/profile')}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../../images/profile_placeholder.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50, // Añadimos margen superior para separarlo de la barra de notificaciones
    paddingBottom: 10,
    backgroundColor: '#ff6b6b',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    color: '#000000',
    marginRight: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default AppHeader;