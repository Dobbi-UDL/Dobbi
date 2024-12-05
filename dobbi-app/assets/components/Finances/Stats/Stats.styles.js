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
    },
    footer: {
        height: 160,
    },
    segmentedControl: {
        margin: 10,
        marginTop: 20,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#ECECEC',
        borderRadius: 8,
        padding: 3,
        marginHorizontal: 16,
        marginTop: 8,
    },
    segmentedButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    segmentedButtonActive: {
        backgroundColor: '#fff',
    },
    segmentedButtonText: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500',
    },
    segmentedButtonTextActive: {
    },
    downloadContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    downloadButtonText: {
        color: '#EE6567',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
    chipsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
    }
});