// assets/components/Header/ProfileSection.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/header';
import i18n from '@i18n';
import { useAuth } from '../../../context/AuthContext';

export const ProfileSection = ({ userData, onClose }) => {
    const router = useRouter();
    const { signOut } = useAuth();

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    const handleEditProfile = () => {
        onClose();
        router.push('/profile');
    };

    const handleLogout = async () => {
        try {
            onClose(); // Close settings panel first
            router.replace('/login'); // Use replace instead of push to prevent going back
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const menuItems = [
        {
            icon: 'cog',
            title: i18n.t('settings'),
            onPress: () => console.log('Settings pressed')
        },
        {
            icon: 'shield-account',
            title: i18n.t('privacy'),
            onPress: () => console.log('Privacy pressed')
        },
        {
            icon: 'file-document',
            title: i18n.t('terms'),
            onPress: () => console.log('Terms pressed')
        },
        {
            icon: 'logout',
            title: i18n.t('logout'),
            onPress: handleLogout,
            danger: true
        }
    ];

    return (
        <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
                <View style={styles.profileSection}>
                    {userData?.avatar_url ? (
                        <Image 
                            source={{ uri: userData.avatar_url }}
                            style={styles.profileAvatar}
                        />
                    ) : (
                        <Image
                            source={userData?.avatar || require('../../../assets/images/profile-placeholder.png')}
                            style={styles.profileAvatar}
                        />
                    )}
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>
                            {userData?.user || 'User'}
                        </Text>
                        <TouchableOpacity onPress={handleEditProfile}>
                            <Text style={styles.editProfileLink}>
                                {i18n.t('editProfile')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={onClose}>
                    <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={item.onPress}
                    >
                        <View style={styles.menuItemContent}>
                            <Icon 
                                name={item.icon} 
                                size={24} 
                                color={item.danger ? '#ff6b6b' : '#333'} 
                            />
                            <Text style={[
                                styles.menuItemText,
                                item.danger && styles.menuItemTextDanger
                            ]}>
                                {item.title}
                            </Text>
                        </View>
                        <Icon name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};