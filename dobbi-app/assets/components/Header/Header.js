import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@authcontext';
import { styles } from './Header.styles.js';
import { ProfileSection } from './ProfileSection';
import { Ionicons } from '@expo/vector-icons';
import { useHeader } from '../../../contexts/HeaderContext';
import { useRouter, usePathname } from 'expo-router';

// Add this constant at the top of the file, outside the component
const SKIP_BRAND_ANIMATION = false; // Set to true to always show brand name

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
    const router = useRouter();
    const currentPath = usePathname();

    useEffect(() => {
        if (SKIP_BRAND_ANIMATION) {
            // Always show brand name
            titleOpacity.setValue(0);
            brandOpacity.setValue(1);
            return;
        }

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
            }, 3000);

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

    const renderLeftSection = () => {
        const backButtonRoutes = ['/stats'];
        const showBackButton = backButtonRoutes.includes(currentPath);
        
        return (
            <View style={styles.leftSection}>
                {showBackButton && (
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#EE6567" />
                    </TouchableOpacity>
                )}
                {!showBackButton && (
                    <TouchableOpacity onPress={handleLogoPress}>
                        <Image
                            source={require('../../images/dobbi-heart.png')}
                            style={styles.logo}
                        />
                    </TouchableOpacity>
                )}
                <View style={styles.brandContainer}>
                    <Animated.View style={{ opacity: brandOpacity }}>
                        <Image
                            source={require('../../images/dobbi-brand.png')}
                            style={styles.brandImage}
                        />
                    </Animated.View>
                    {title && (
                        <Animated.View style={{ opacity: titleOpacity, position: 'absolute', top: 0, left: 0 }}>
                            <Text style={styles.brandName}>{title}</Text>
                        </Animated.View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                {renderLeftSection()}
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