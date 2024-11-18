
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#ffffff',
        borderBottomWidth: 0.8,
        borderBottomColor: '#e0e0e0',

    },
    brandName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff6b6b',
    },
    profileButton: {
        width: 32,
        height: 32,
        borderRadius: 16,   // Make the image a circle
    },
    touchable: {
        padding: 8,
        margin: -8,
    },
});
