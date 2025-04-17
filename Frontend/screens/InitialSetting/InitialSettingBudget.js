import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TextInput,
  ScrollView,
  FlatList,
  Checkbox,
  Modal,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const standardCategories = [
  { id: '1', name: 'Food', icon: '🍽️' },
  { id: '2', name: 'Transportation', icon: '🚗' },
  { id: '3', name: 'Housing', icon: '🏠' },
  { id: '4', name: 'Utilities', icon: '💡' },
  { id: '5', name: 'Entertainment', icon: '🎮' },
  { id: '6', name: 'Shopping', icon: '🛍️' },
  { id: '7', name: 'Healthcare', icon: '🏥' },
  { id: '8', name: 'Education', icon: '📚' },
];

const InitialSettingBudget = () => {
  const navigation = useNavigation();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [budgets, setBudgets] = useState({});
  const [transactions, setTransactions] = useState({});
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentTransactionIndex, setCurrentTransactionIndex] = useState(0);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(selectedCategories.filter(id => id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category.id]);
    }
  };

  const addCustomCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: `custom-${Date.now()}`,
        name: newCategoryName.trim(),
        icon: '📝'
      };
      setCustomCategories([...customCategories, newCategory]);
      setNewCategoryName('');
    }
  };

  const removeCustomCategory = (categoryId) => {
    setCustomCategories(customCategories.filter(cat => cat.id !== categoryId));
  };

  const updateBudget = (categoryId, amount) => {
    setBudgets({
      ...budgets,
      [categoryId]: amount
    });
  };

  const addTransaction = (categoryId) => {
    const categoryTransactions = transactions[categoryId] || [];
    if (categoryTransactions.length < 1) {
      setTransactions({
        ...transactions,
        [categoryId]: [...categoryTransactions, { date: '', amount: '', note: '' }]
      });
    }
  };

  const updateTransaction = (categoryId, index, field, value) => {
    const categoryTransactions = [...transactions[categoryId]];
    categoryTransactions[index] = {
      ...categoryTransactions[index],
      [field]: value
    };
    setTransactions({
      ...transactions,
      [categoryId]: categoryTransactions
    });
  };

  const isFormComplete = () => {
    return selectedCategories.every(categoryId => {
      const hasBudget = budgets[categoryId] && budgets[categoryId] !== '';
      const hasTransactions = transactions[categoryId] && transactions[categoryId].length === 1;
      return hasBudget && hasTransactions;
    });
  };

  const openDatePicker = (categoryId, index) => {
    setCurrentCategoryId(categoryId);
    setCurrentTransactionIndex(index);
    setTempDate(selectedDate);
    setDatePickerVisible(true);
  };

  const handleDateConfirm = () => {
    setSelectedDate(tempDate);
    const formattedDate = tempDate.toISOString().split('T')[0];
    updateTransaction(currentCategoryId, currentTransactionIndex, 'date', formattedDate);
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Setup</Text>
      </View>

      {datePickerVisible && (
        <Modal
          visible={datePickerVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) {
                    setTempDate(date);
                  }
                }}
                style={styles.datePicker}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setDatePickerVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleDateConfirm}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Standard Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Standard Categories</Text>
            <Text style={styles.sectionSubtitle}>Select your expense categories</Text>
          </View>
          <View style={styles.sectionContent}>
            {standardCategories.map(category => (
              <View key={category.id} style={styles.categoryItem}>
                <TouchableOpacity
                  style={styles.categorySelect}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
                {selectedCategories.includes(category.id) && (
                  <View style={styles.categoryDetails}>
                    <TextInput
                      style={styles.budgetInput}
                      placeholder="Budget amount"
                      keyboardType="numeric"
                      value={budgets[category.id] || ''}
                      onChangeText={(text) => updateBudget(category.id, text)}
                    />
                    <View style={styles.transactionsContainer}>
                      {(transactions[category.id] || []).map((transaction, index) => (
                        <View key={index} style={styles.transactionItem}>
                          <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => openDatePicker(category.id, index)}
                          >
                            <Text style={styles.dateInputText}>
                              {transaction.date || 'Select Date (YYYY-MM-DD)'}
                            </Text>
                          </TouchableOpacity>
                          <TextInput
                            style={styles.transactionInput}
                            placeholder="Amount"
                            keyboardType="numeric"
                            value={transaction.amount}
                            onChangeText={(text) => updateTransaction(category.id, index, 'amount', text)}
                          />
                          <TextInput
                            style={styles.transactionInput}
                            placeholder="Note"
                            value={transaction.note}
                            onChangeText={(text) => updateTransaction(category.id, index, 'note', text)}
                          />
                        </View>
                      ))}
                      {(transactions[category.id] || []).length < 1 && (
                        <TouchableOpacity
                          style={styles.addTransactionButton}
                          onPress={() => addTransaction(category.id)}
                        >
                          <Text style={styles.addTransactionText}>Add Transaction</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Custom Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Custom Categories</Text>
            <Text style={styles.sectionSubtitle}>Add your own categories</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.addCategoryContainer}>
              <TextInput
                style={styles.categoryInput}
                placeholder="New category name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <TouchableOpacity
                style={styles.addCategoryButton}
                onPress={addCustomCategory}
              >
                <Text style={styles.addCategoryText}>Add</Text>
              </TouchableOpacity>
            </View>
            {customCategories.map(category => (
              <View key={category.id} style={styles.categoryItem}>
                <TouchableOpacity
                  style={styles.categorySelect}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeCategoryButton}
                  onPress={() => removeCustomCategory(category.id)}
                >
                  <Text style={styles.removeCategoryText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, !isFormComplete() && styles.buttonDisabled]}
          onPress={() => navigation.navigate('HomeTabs')}
          disabled={!isFormComplete()}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionContent: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  categoryItem: {
    marginBottom: 15,
  },
  categorySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
  categoryDetails: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  budgetInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  transactionsContainer: {
    marginTop: 10,
  },
  transactionItem: {
    marginBottom: 10,
  },
  transactionInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
    backgroundColor: 'white',
  },
  addTransactionButton: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addTransactionText: {
    color: '#333',
    fontSize: 14,
  },
  addCategoryContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  categoryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  addCategoryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  addCategoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeCategoryButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  removeCategoryText: {
    fontSize: 20,
    color: '#666',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
    backgroundColor: 'white',
  },
  dateInputText: {
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePicker: {
    width: '100%',
    height: 200,
  },
});

export default InitialSettingBudget; 