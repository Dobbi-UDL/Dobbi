import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5F5',
    },
    scrollView: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    overviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    overviewItem: {
        flex: 1,
        alignItems: 'center',
    },
    overviewLabel: {
        fontSize: 14,
        color: '#666666',
        marginTop: 8,
    },
    overviewAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 4,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 8,
    },
    expenseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    expenseName: {
        fontSize: 16,
        color: '#333333',
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: '500',
        color: '#EE6567',
    }
});