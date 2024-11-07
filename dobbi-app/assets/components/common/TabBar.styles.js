import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF5F6',
        height: 48,
        paddingHorizontal: 16,
        shadowRadius: 2,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        position: 'relative',
        borderBottomWidth: 2,
        borderBottomColor: '#ffd9d9',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#EE6567',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#F2B1B1',
        letterSpacing: 0.2,
    },
    activeTabText: {
        color: '#EE6567',
        fontWeight: '600',
    },
});