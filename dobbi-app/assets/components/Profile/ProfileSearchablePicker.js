import React, { useState, useRef, useEffect } from 'react';
import { 
    View, 
    TextInput, 
    FlatList, 
    TouchableOpacity, 
    Text, 
    StyleSheet, 
    Modal,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    Animated,
    Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const ProfileSearchablePicker = ({ 
    placeholder,
    value,
    items,
    onSearch,
    onSelect,
    isLoading,
    icon,
    disabled
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setFilteredItems(items);
    }, [items]);

    const animateIn = () => {
        if (disabled) return;
        setIsOpen(true);
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();
    };

    const animateOut = () => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: SCREEN_HEIGHT,
                useNativeDriver: true,
                tension: 65,
                friction: 11
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            })
        ]).start(() => {
            setIsOpen(false);
            setSearchText('');
        });
    };

    const handleSearch = async (text) => {
        setSearchText(text);
        if (onSearch) {
            // Let the parent handle the search if provided
            await onSearch(text);
        } else {
            // Local filtering if no search handler provided
            const filtered = items.filter(item => 
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredItems(filtered);
        }
    };

    const handleSelect = (item) => {
        onSelect(item);
        animateOut();
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginLeft: 12,
        },
        header: {
            height: 50,
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#FFE5E5',
            justifyContent: 'center',
            opacity: disabled ? 0.5 : 1,
        },
        headerSelected: {
            backgroundColor: '#FFFFFF', // Remove highlight, keep it consistent
        },
        headerContent: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
        },
        headerIcon: {
            marginRight: 12,
        },
        headerText: {
            flex: 1,
            fontSize: 15,
            color: '#333', // Consistent text color
            marginRight: 6,
        },
        placeholder: {
            color: '#999999',
        },
        value: {
            color: '#333', // Keep selected value color consistent
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            minHeight: SCREEN_HEIGHT * 0.5,
            maxHeight: SCREEN_HEIGHT * 0.9,
            paddingBottom: 20,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: -3,
            },
            shadowOpacity: 0.15,
            shadowRadius: 5,
            elevation: 5,
        },
        modalContainer: {
            flex: 1,
        },
        modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#FFE5E5',
        },
        closeButton: {
            padding: 4,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#333',
            marginLeft: 12,
            flex: 1,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#FFE5E5',
            backgroundColor: '#FFF5F5',
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            marginLeft: 8,
            padding: 8,
            color: '#333',
        },
        list: {
            flex: 1,
        },
        item: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#FFE5E5',
        },
        itemSelected: {
            backgroundColor: '#FFF5F5', // Lighter highlight for selected item
        },
        itemText: {
            fontSize: 15,
            color: '#333333',
        },
        itemTextSelected: {
            color: '#333333', // Keep text color consistent
            fontWeight: '500', // Just slightly bolder for selected
        },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={[styles.header]}
                onPress={animateIn}
                disabled={disabled}
            >
                <View style={styles.headerContent}>
                    {icon && (
                        <MaterialIcons
                            name={icon}
                            size={20}
                            color="#666666" // Consistent icon color
                            style={styles.headerIcon}
                        />
                    )}
                    <Text 
                        style={[
                            styles.headerText, 
                            !value && styles.placeholder
                        ]}
                        numberOfLines={1}
                    >
                        {value || placeholder}
                    </Text>
                    <MaterialIcons 
                        name="arrow-drop-down"
                        size={24} 
                        color="#666"
                    />
                </View>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                animationType="none"
                transparent={true}
                onRequestClose={animateOut}
            >
                <TouchableWithoutFeedback onPress={animateOut}>
                    <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <Animated.View 
                                style={[
                                    styles.modalContent,
                                    { transform: [{ translateY: slideAnim }] }
                                ]}
                            >
                                <SafeAreaView style={styles.modalContainer}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>{placeholder}</Text>
                                        <TouchableOpacity 
                                            onPress={animateOut}
                                            style={styles.closeButton}
                                        >
                                            <MaterialIcons name="close" size={24} color="#333" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.searchContainer}>
                                        <MaterialIcons name="search" size={20} color="#666" />
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder="Search..."
                                            value={searchText}
                                            onChangeText={handleSearch}
                                            autoFocus={true}
                                        />
                                    </View>

                                    <FlatList
                                        data={filteredItems}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity 
                                                style={[
                                                    styles.item,
                                                    value === item.name && styles.itemSelected
                                                ]}
                                                onPress={() => handleSelect(item)}
                                            >
                                                <Text 
                                                    style={[
                                                        styles.itemText,
                                                        value === item.name && styles.itemTextSelected
                                                    ]}
                                                >
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        style={styles.list}
                                        keyboardShouldPersistTaps="handled"
                                    />
                                </SafeAreaView>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};
