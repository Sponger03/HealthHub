import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  pickerContainer2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#336699',
  },
  picker: {
    height: 40,
    width: '100%',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    marginBottom: 10,
    marginVertical: 10,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  progressBar: {
    marginTop: 10,
    width: '100%',
  },
  faqContainer: {
    marginTop: 20,
  },
  faqHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#388E3C",
  },
  faqText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  faqSubText: {
    fontSize: 14,
    marginBottom: 5,
  },
  lowCalories: {
    color: '#C62828',
  },
  sufficientCalories: {
    color: '#E64A19',
  },
  idealWeightLoss: {
    color: '#1976D2',
  },
  normalWeight: {
    color: '#388E3C',
  },
  idealWeightGain: {
    color: '#7B1FA2',
  },
  highCalories: {
    color: '#D81B60',
  },
  extremeHighCalories: {
    color: '#B71C1C',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
  },
  header2: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  dieta: {
    fontSize: 20,
    marginTop: 30,
  },
  searchingText: {
    marginTop: 20,
    color: 'gray',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  warning: {
    marginTop: 20,
    color: 'orange',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  productList: {
    marginTop: 20,
    width: '100%',
  },
  productItem: {
    backgroundColor: '#fff', 
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: '80%',
    height: 120,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  nutrientColumn: {
    alignItems: 'center',
    flex: 1,
  },
  nutrientLabel: {
    fontWeight: 'bold',
  },
  servingInfo: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '90%',
    marginVertical: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableRowContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: '50%',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rowText: {
    fontSize: 14,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
    maxWidth: 600,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },

  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default Styles;
