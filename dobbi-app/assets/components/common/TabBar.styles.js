import { StyleSheet } from 'react-native';

/*  Note:
    If you need to modify the styles, create a new object with the custom styles and pass it as a prop to the TabView component. 
    
    Use the same keys as the defaultTabBarStyles object and only modify the styles you need.

    Don't modify the existing styles! It will affect all other components that use the TabBar.
*/

export const defaultTabBarStyles = StyleSheet.create({
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
        textAlign: 'center',
    },
    activeTabText: {
        color: '#EE6567',
        fontWeight: '600',
    },
});