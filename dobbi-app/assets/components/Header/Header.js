import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@authcontext';
import { styles } from './Header.styles.js';
import { ProfileSection } from './ProfileSection';
import { Ionicons } from '@expo/vector-icons';
import { useHeader } from '../../../contexts/HeaderContext';

const Header = ({ title }) => {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { hasShownBrand, setHasShownBrand } = useHeader();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const settingsWidth = screenWidth * 0.8;
    const slideAnim = useState(new Animated.Value(settingsWidth))[0];
    const fadeAnim = useState(new Animated.Value(1))[0];
    const titleOpacity = useState(new Animated.Value(0))[0];
    const brandOpacity = useState(new Animated.Value(1))[0];
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (!hasShownBrand && title) {
            // Only show Dobbi -> screen name transition on first app render
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(titleOpacity, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(brandOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();
                setHasShownBrand(true);
            }, 2000);

            return () => clearTimeout(timer);
        } else if (hasShownBrand && title) {
            // Subsequent screen changes: directly show screen name
            titleOpacity.setValue(1);
            brandOpacity.setValue(0);
        }
    }, [title]);

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
                    <Animated.View style={{ opacity: brandOpacity, position: 'absolute', left: 40 }}>
                        <Text style={styles.brandName}>Dobbi</Text>
                    </Animated.View>
                    {title && (
                        <Animated.View style={{ opacity: titleOpacity, position: 'absolute', left: 40 }}>
                            <Text style={styles.brandName}>{title}</Text>
                        </Animated.View>
                    )}
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