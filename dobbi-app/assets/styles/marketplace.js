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
    borderRadius: 15,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
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
    paddingTop: 10,
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
    marginVertical: 10,
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
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
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
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginRight: 10,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    backgroundColor: '#FFF9E6',
    borderRadius: 10,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    maxWidth: '100%', // Asegura que ocupe todo el ancho
    width: '100%',
    marginBottom: 15,
    flexGrow: 0, // Impide que el ScrollView crezca
    alignSelf: 'flex-start', // Mantiene el tamaño ajustado al contenido
  },
  categoryItem: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    marginBottom: 10,
  },
  selectedCategoryItem: {
    backgroundColor: '#ff6b6b',
  },
  categoryText: {
    color: '#666666',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoryScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'row', // Hace que los elementos se distribuyan horizontalmente
    flexWrap: 'wrap', // Permite que los elementos pasen a la siguiente línea si no caben
  },
  userPointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 15,
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
  userPointsText: {
    fontSize: 16,
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
}); 