import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  scrollView: {
    padding: 16,
},  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  statsButton: {
    padding: 8,
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
  },
  categoryIcon: {
    backgroundColor: '#333333',
    borderRadius: 20,
    padding: 8,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
    color: '#333333',
  },
  categoryAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
    color: '#333333',
  },
  entriesContainer: {
    marginTop: 12,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  entryName: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 12,
    width: 190,
  },
  entryAmount: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
    marginRight: 12,
  },
  touchable: {
    marginBottom: 12,
  },
  editButton: {
    marginLeft: 12,
  },
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EE6567',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        fontWeight: 'bold',
    },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default styles;