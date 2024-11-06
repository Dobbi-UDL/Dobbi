import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#ffffff',
        borderBottomWidth: 0.8,
        borderBottomColor: '#e0e0e0',
        
    },
    brandName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileButton: {
        width: 32,
        height: 32,
        borderRadius: 16,   // Make the image a circle
    },
    touchable: {
        padding: 8,
        margin: -8,
    },
});

export default Header;