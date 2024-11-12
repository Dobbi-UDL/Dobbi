import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../../config/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/header';
import { ProfileSection } from './ProfileSection';

const Header = () => {
    const insets = useSafeAreaInsets();
    const { user: authUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const settingsWidth = screenWidth * 0.8;
    const slideAnim = useState(new Animated.Value(settingsWidth))[0];
    const fadeAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        if (authUser?.id) {
            getUserData(authUser.id);
        }
    }, [authUser]);

    const getUserData = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('username')
                .eq('id', userId)
                .single();

            if (error) throw error;
            if (data) {
                setUserData({
                    ...data,
                    avatar: require('../../images/profile-placeholder.png')
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleLogoPress = () => {
        console.log('Scroll to top');
    }

    const handleProfilePress = () => {
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
                    userData={userData}
                    onClose={handleCloseSettings}
                />
            </Animated.View>
        </View>
    );
};

export default Header;