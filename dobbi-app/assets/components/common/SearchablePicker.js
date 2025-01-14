import React, { useState, useRef } from 'react';
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

export const SearchablePicker = ({ 
    placeholder,
    value,
    items,
    onSearch,
    onSelect,
    isLoading,
    icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const animateIn = () => {
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
        });
    };

    const handleSearch = (text) => {
        setSearchText(text);
        onSearch(text);
    };

    const handleSelect = (item) => {
        onSelect(item);
        setIsOpen(false);
        setSearchText('');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={[
                    styles.header,
                    value && styles.headerSelected
                ]}
                onPress={animateIn}
            >
                <View style={styles.headerContent}>
                    {icon && (
                        <MaterialIcons
                            name={icon}
                            size={20}
                            color={value ? '#EE6567' : '#666666'}
                            style={styles.headerIcon}
                        />
                    )}
                    <Text 
                        style={[styles.headerText, value ? styles.value : styles.placeholder]}
                        numberOfLines={1}
                    >
                        {value || placeholder}
                    </Text>
                    <MaterialIcons 
                        name={isOpen ? "arrow-drop-up" : "arrow-drop-down"} 
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
                                        <TouchableOpacity 
                                            onPress={animateOut}
                                            style={styles.closeButton}
                                        >
                                            <MaterialIcons name="close" size={24} color="#333" />
                                        </TouchableOpacity>
                                        <Text style={styles.modalTitle}>{placeholder}</Text>
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
                                        data={items}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity 
                                                style={[
                                                    styles.item,
                                                    value === item.name && styles.itemSelected
                                                ]}
                                                onPress={() => handleSelect(item)}
                                            >
                                                <Text style={[styles.itemText, value === item.name && styles.itemTextSelected]}>{item.name}</Text>
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

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        // Remove the container border
    },
    header: {
        height: 50, // Match Picker height
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E5E5',
    },
    headerSelected: {
        borderColor: '#EE6567',
        backgroundColor: '#FFF5F5',
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
        fontSize: 16,
        paddingVertical: 12,
        marginRight: 6,
    },
    iconContainer: {
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    placeholder: {
        color: '#999999',
    },
    value: {
        color: '#EE6567',
        fontWeight: '600',
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
        // Add shadow for iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        // Add elevation for Android
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
        borderBottomColor: '#E5E5E5',
    },
    closeButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: '#F5F5F5',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 8,
        padding: 8,
    },
    list: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    itemSelected: {
        backgroundColor: '#FFF5F5',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#EE6567',
        borderRadius: 0,
    },
    itemText: {
        fontSize: 16,
        color: '#333333',
    },
    itemTextSelected: {
        color: '#EE6567',
        fontWeight: '600',
    },
});
