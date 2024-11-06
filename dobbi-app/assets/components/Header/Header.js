import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const Header = () => {
    return (
        <SafeAreaView>
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <Text style={styles.brandName}>Dobbi</Text>
                <Image
                source={require('../../images/profile-placeholder.png')}
                style={styles.profilePic}
                />
            </View>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    brandName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});

export default Header;