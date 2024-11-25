import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E8F0FE',
  },
  card: {
    marginBottom: 24,
    borderRadius: 12,
    elevation: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryIcon: {
    borderRadius: 20,
    padding: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
    color: '#2C3E50',
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
    color: '#2C3E50',
  },
  entriesContainer: {
    marginTop: 12,
    paddingLeft: 40,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  entryName: {
    fontSize: 16,
    color: '#34495E',
    flex: 1,
  },
  entryAmount: {
    fontSize: 16,
    color: '#34495E',
    fontWeight: '500',
  },
  editButton: {
    marginLeft: 12,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});

