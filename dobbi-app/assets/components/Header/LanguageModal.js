// assets/components/Header/LanguageModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '@i18n';

export const LanguageModal = ({ isVisible, onClose }) => {
    const [currentLocale, setCurrentLocale] = useState(i18n.locale);

    useEffect(() => {
        setCurrentLocale(i18n.locale);
    }, [isVisible]); // Update when modal opens

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' }
    ];

    const handleLanguageSelect = (langCode) => {
        try {
            i18n.locale = langCode;
            setCurrentLocale(langCode);
            Alert.alert(
                i18n.t('languageChanged'),
                i18n.t('languageChangedMessage', { 
                    language: langCode === 'en' ? 'English' : 'Español' 
                })
            );
            onClose();
        } catch (error) {
            console.error('Error changing language:', error);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{i18n.t('selectLanguage')}</Text>
                    {languages.map((lang) => (
                        <TouchableOpacity
                            key={lang.code}
                            style={[
                                styles.languageOption,
                                currentLocale === lang.code && styles.selectedLanguage
                            ]}
                            onPress={() => handleLanguageSelect(lang.code)}
                        >
                            <Text style={styles.languageText}>{lang.label}</Text>
                            {currentLocale === lang.code && (
                                <Icon name="check" size={20} color="#ff6b6b" />
                            )}
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>{i18n.t('cancel')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedLanguage: {
        backgroundColor: '#fff0f0',
    },
    languageText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#fff0f0',
    },
    closeButtonText: {
        color: '#ff6b6b',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export { styles as languageModalStyles };