import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f0',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff0f0',
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
  },
});