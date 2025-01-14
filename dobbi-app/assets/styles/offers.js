
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // OfferCard Styles
  cardContainer: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  redeemedCard: {
    opacity: 0.8,
    backgroundColor: '#f5f5f5',
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  companyName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  expandedDescription: {
    maxHeight: 'none',
    marginBottom: 8,
  },
  seeMoreButton: {
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  seeMoreText: {
    color: '#EE6567',
    fontSize: 13,
    fontWeight: '500',
  },

  // Points and Redeem Styles
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 8,
    borderRadius: 12,
  },
  pointsContainerDisabled: {
    backgroundColor: '#F8F8F8',
  },
  pointsText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#B8860B',
  },
  pointsTextDisabled: {
    color: '#999',
  },
  redeemButton: {
    backgroundColor: '#ff6b6b',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 12,
  },
  redeemButtonDisabled: {
    backgroundColor: '#ffcdcd',
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  redeemButtonTextDisabled: {
    color: '#666666',
  },

  // Category Filter Styles
  categoryFilterContainer: {
    height: 52,
    marginBottom: 16,
  },
  categoryScrollView: {
    flex: 1,
  },
  categoryScrollContent: {
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#d76567',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1.2,
  },
  selectedCategoryChip: {
    backgroundColor: '#EE6567',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedCategoryChipText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    height: 50,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    shadowColor: '#d76567',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1.2,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    backgroundColor: '#FFF9E6',
    borderRadius: 25,
  },

  // User Points Display Styles
  userPointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#d76567',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1.2,
  },
  userPointsText: {
    fontSize: 16,
    color: '#333333',
  },
  userPointsUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  pointsHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B8860B',
  },
  pointsIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Screen Container Styles
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterSection: {
    position: 'relative',
    zIndex: 1,
    marginTop: 4,
  },
});