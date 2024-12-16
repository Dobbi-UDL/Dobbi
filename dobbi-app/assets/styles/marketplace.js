import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#FFF5F5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ffd9d9',
  },
  activeTab: {
    borderBottomColor: '#ff6b6b',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#d76567',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1.2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 5,
    borderRadius: 10,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 5,
    borderRadius: 10,
  },
  pointsText: {
    marginLeft: 5,
    color: '#B8860B',
    fontWeight: '500',
  },
  rewardText: {
    marginLeft: 5,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
    maxHeight: 40, // Height for 2 lines
  },
  expandedDescription: {
    maxHeight: 'none', // Remove height limit when expanded
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
  challengeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 5,
    color: '#666666',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#999999',
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
  },
  pointsText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#B8860B',
  },
  codeContainer: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    marginVertical: 12,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
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
  pointsContainerDisabled: {
    backgroundColor: '#F8F8F8',
  },
  pointsTextDisabled: {
    color: '#999999',
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  contentContainer: {
    flex: 1,
    paddingBottom: 64, 
    padding: 16,
  },
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
    borderRadius: 10,
  },
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  assignButton: {
    backgroundColor: '#ff6b6b', // Color azul, ajusta según tu diseño
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  assignButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  categoryFilterContainer: {
    height: 52,
    marginBottom: 16,
  },
  categoryScrollView: {
    flex: 1,
  },
  categoryScrollContent: {
    paddingRight: 16, // Add right padding for last item
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
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  selectedCategoryChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 2,
    marginBottom: 12,
    minHeight: 250, // Increased from 200
    shadowColor: '#d76567',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1.2,
  },
  expandedCard: {
    minHeight: 320, // Minimum height for expanded state
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
    maxHeight: 40, // Height for 2 lines
  },
  expandedDescription: {
    maxHeight: 'none', // Remove height limit when expanded
    marginBottom: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  actionsContainer: {
    marginTop: 12,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 12,
  },
});