import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  footer: {
    height: 100,
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
  card: {
    borderWidth: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryIcon: {
    backgroundColor: '#fff',
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
    marginRight: 12,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '500',
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
    paddingVertical: 12,
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  updateButton: {
    marginTop: 12,
    marginRight: 12,
  },
  addEntryButton: {
    marginTop: 12,
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
  editInput: {
    fontSize: 18, // Increased font size
    height: 50, // Increased height
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  errorBanner: {
    backgroundColor: '#FFB6B6',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorText: {
    color: '#CC0000',
    fontSize: 14,
    flex: 1,
  },
  errorModalContent: {
    paddingVertical: 16,
    width: '95%',
    alignSelf: 'center',
  },
  errorModalDescription: {
    fontSize: 16,
    color: '#333',
  },
  errorEntriesList: {
    marginVertical: 20,
  },
  errorEntry: {},
  errorMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  errorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  errorQuickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  errorQuickButton: {
    padding: 4,
  },
  errorDetails: {
    paddingLeft: 28,
  },
  problemsList: {
    marginBottom: 4,
  },
  availableDataText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  errorDivider: {
    height: 1,
    backgroundColor: '#FFE8E8',
    marginVertical: 16,
  },
  problemsContainer: {
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  problemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CC0000',
    marginBottom: 4,
  },
  problemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  problemText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  reportButton: {
    backgroundColor: '#EE6567',
    flex: 1,
  },
  availableDataContainer: {
    padding: 6,
    gap: 6,
  },
  availableDataTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  errorActionButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  errorActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    gap: 4,
  },
  fixButton: {
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#CC0000',
  },
  fixButtonText: {
    color: '#4A90E2',
    fontSize: 13,
    fontWeight: '500',
  },
  deleteButtonText: {
    color: '#CC0000',
    fontSize: 13,
    fontWeight: '500',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  errorHeaderText: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#CC0000',
  },
  errorContent: {
    paddingTop: 16,
    gap: 16,
  },
  errorActions: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  dismissButton: {
    flex: 1,
  },
  availableDataContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  availableDataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  availableDataList: {
    gap: 4,
  },
  availableDataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableDataLabel: {
    fontSize: 13,
    color: '#666',
    width: 60,
    fontWeight: '500',
  },
  availableDataValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  errorTitleContainer: {
    flex: 1,
  },
  errorTitleMain: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  errorTitleSecondary: {
    fontSize: 13,
    color: '#666',
  },
  errorActions: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  reportButton: {
    backgroundColor: '#EE6567',
    flex: 1,
  },
  dismissButton: {
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  successText: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '500',
  },
  snoozedBanner: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  snoozedText: {
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  issuesButton: {
    padding: 8,
    borderRadius: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#CC0000',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeSnoozed: {
    backgroundColor: '#666',
  },
  snoozeSuccess: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  snoozeSuccessText: {
    color: '#4CAF50',
    fontSize: 14,
    flex: 1,
  },
  snoozeTime: {
    color: '#4CAF50',
    fontWeight: '500',
  },
});