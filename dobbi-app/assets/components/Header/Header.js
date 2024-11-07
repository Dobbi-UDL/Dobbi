import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/header';

const handleLogoPress = () => {
    // TODO: Implement the scroll to top functionality
    console.log('Scroll to top');
}

const handleProfilePress = () => {
    // TODO: Implement settings menu toggle
    console.log('Profile button pressed');
}

const Header = () => {
    return (
        <SafeAreaView>
            <View style={styles.header}>
                <TouchableOpacity style={styles.touchable} onPress={handleLogoPress}>
                    <Text style={styles.brandName}>Dobbi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchable} onPress={handleProfilePress}>
                    <Image
                    source={require('../../images/profile-placeholder.png')}
                    style={styles.profileButton}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Header;