// assets/components/Header/ProfileSection.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/profile';
import i18n from '@i18n';
import { useAuth } from '../../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ProfileSection = ({ userData, onClose }) => {
    const insets = useSafeAreaInsets();
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
            await signOut(); // Use signOut from AuthContext
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
        <View style={[styles.settingsContainer, { paddingTop: insets.top }]}>
            <View style={styles.settingsHeader}>
                <View style={styles.profileSection}>
                    <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarText}>
                            {getInitials(userData?.username)}
                        </Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>
                            {userData?.username || 'User'}
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
                        onPress={item.onPress}
                        style={styles.menuItem}
                    >
                        <View style={styles.menuItemContent}>
                            <Icon name={item.icon} size={24} color={item.danger ? 'red' : '#000'} />
                            <Text style={item.danger ? styles.menuItemTextDanger : styles.menuItemText}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};