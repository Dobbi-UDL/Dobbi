import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
} from 'react-native';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

export const MonthYearPickerModal = ({ visible, onClose, onSelect, initialDate }) => {
    const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());

    const yearListRef = useRef(null);
    const monthListRef = useRef(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 101 }, (_, i) => currentYear - 80 + i);
    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(2000, i, 1);
        return date.toLocaleString('default', { month: 'long' });
    });

    // Create circular months array by repeating months
    const getCircularMonths = () => {
        const baseMonths = months;
        // Add 12 months before and after to create smoother circular effect
        return [...baseMonths, ...baseMonths, ...baseMonths];
    };

    const circularMonths = getCircularMonths();
    const initialMonthIndex = selectedMonth + 12; // Offset by 12 due to our prefix months

    useEffect(() => {
        if (visible) {
            yearListRef.current?.scrollToIndex({
                index: years.indexOf(selectedYear),
                animated: false,
            });
            monthListRef.current?.scrollToIndex({
                index: initialMonthIndex,
                animated: false,
            });
        }
    }, [visible]);

    const handleConfirm = () => {
        onSelect(new Date(selectedYear, selectedMonth, 1));
        onClose();
    };

    const handleMonthScroll = (e) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        let index = Math.round(offsetY / ITEM_HEIGHT);
        
        // Handle circular scrolling
        if (index < 12) {
            // User scrolled to prefix months, jump to the middle set
            index = index + 12;
            monthListRef.current?.scrollToIndex({
                index,
                animated: false,
            });
        } else if (index >= 24) {
            // User scrolled to suffix months, jump to the middle set
            index = index - 12;
            monthListRef.current?.scrollToIndex({
                index,
                animated: false,
            });
        }
        
        // Convert the index to actual month (0-11)
        const actualMonthIndex = ((index - 12) % 12 + 12) % 12;
        setSelectedMonth(actualMonthIndex);
    };

    const handleYearScroll = (e) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        setSelectedYear(years[index]);
        
        // Ensure the year snaps to center properly
        yearListRef.current?.scrollToOffset({
            offset: index * ITEM_HEIGHT,
            animated: true
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Select Date</Text>
                        <TouchableOpacity onPress={handleConfirm}>
                            <Text style={styles.doneButton}>Done</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pickerContainer}>
                        <View style={styles.selectionBand} pointerEvents="none" />
                        
                        <FlatList
                            ref={monthListRef}
                            data={circularMonths}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={ITEM_HEIGHT}
                            decelerationRate="fast"
                            getItemLayout={(_, index) => ({
                                length: ITEM_HEIGHT,
                                offset: ITEM_HEIGHT * index,
                                index,
                            })}
                            initialScrollIndex={initialMonthIndex}
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            onMomentumScrollEnd={handleMonthScroll}
                        />
                        <FlatList
                            ref={yearListRef}
                            data={years}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.toString()}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={ITEM_HEIGHT}
                            decelerationRate="fast"
                            getItemLayout={(_, index) => ({
                                length: ITEM_HEIGHT,
                                offset: ITEM_HEIGHT * index,
                                index,
                            })}
                            initialScrollIndex={years.indexOf(selectedYear)}
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            onMomentumScrollEnd={handleYearScroll}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF5F5',  // Match your app's background color
        borderTopLeftRadius: 12,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        backgroundColor: 'white',  // White header like your other modals
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1C1C1E',  // Match your app's text color
    },
    cancelButton: {
        fontSize: 17,
        color: '#666666',  // Match your cancel button color
    },
    doneButton: {
        fontSize: 17,
        color: '#EE6567',  // Match your primary color
        fontWeight: '600',
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        backgroundColor: 'white',
        position: 'relative',
    },
    selectionBand: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: ITEM_HEIGHT,
        backgroundColor: '#F8F8F8',
        top: ITEM_HEIGHT * 2,  // Position at the middle item (VISIBLE_ITEMS = 5, so middle is at 2)
        zIndex: 1,
    },
    list: {
        flex: 1,
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        zIndex: 2,
    },
    listContent: {
        paddingVertical: ITEM_HEIGHT * 2,  // Keep this padding to allow scrolling to first/last items
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 17,
        color: '#1C1C1E',
        opacity: 0.5,
    },
    selectedItem: {
        fontSize: 20,
        color: '#EE6567',
        opacity: 1,
        fontWeight: '600',
    },
});
