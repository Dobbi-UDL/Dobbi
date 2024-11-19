import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        padding: 15,
    },
    chartContainer: {
        alignItems: 'center',
    },
    legendContainer: {
        marginTop: 20,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 10,
    },
    legendText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    legendLabel: {
        fontSize: 14,
        color: '#2D3436',
        fontWeight: '500',
    },
    legendValue: {
        fontSize: 14,
        color: '#636E72',
    },
});