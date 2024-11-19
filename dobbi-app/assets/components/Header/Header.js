import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@authcontext';
import { styles } from './Header.styles.js';
import { ProfileSection } from './ProfileSection';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const settingsWidth = screenWidth * 0.8;
    const slideAnim = useState(new Animated.Value(settingsWidth))[0];
    const fadeAnim = useState(new Animated.Value(1))[0];

    const handleLogoPress = () => {
        console.log('Scroll to top');
    }

    const handleMenuPress = () => {
        setIsSettingsOpen(true);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0.5,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }

    const handleCloseSettings = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: settingsWidth,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => setIsSettingsOpen(false));
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
                    <Image
                        source={require('../../images/dobbi-logo.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.brandName}>Dobbi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
                    <Ionicons name="menu" size={24} color="#EE6567" />
                </TouchableOpacity>
            </View>

            {isSettingsOpen && (
                <TouchableOpacity
                    style={styles.backdrop}
                    onPress={handleCloseSettings}
                    activeOpacity={1}
                />
            )}

            <Animated.View
                style={[
                    styles.settingsMenu,
                    { transform: [{ translateX: slideAnim }] }
                ]}
            >
                <ProfileSection
                    userData={user}
                    onClose={handleCloseSettings}
                />
            </Animated.View>
        </View>
    );
};

export default Header;