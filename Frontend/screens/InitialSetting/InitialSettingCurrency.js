import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TextInput,
  FlatList,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const InitialSettingCurrency = () => {
  const navigation = useNavigation();
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mainCurrency, setMainCurrency] = useState(null);
  const [additionalCurrencies, setAdditionalCurrencies] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        const currencyList = Object.keys(data.rates).map(code => ({
          code,
          name: code
        }));
        
        setCurrencies(currencyList);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const filteredCurrencies = currencies.filter(currency => 
    currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCurrencyItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.currencyItem}
      onPress={() => {
        if (!mainCurrency) {
          setMainCurrency(item);
        } else if (!additionalCurrencies.includes(item)) {
          setAdditionalCurrencies([...additionalCurrencies, item]);
        }
      }}
    >
      <Text style={styles.currencyCode}>{item.code}</Text>
      <Text style={styles.currencyName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleNext = () => {
    if (mainCurrency) {
      // 선택된 통화 정보를 저장하고 다음 화면으로 이동
      navigation.navigate('InitialSettingBudget', {
        mainCurrency: mainCurrency,
        additionalCurrencies: additionalCurrencies
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading currency information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>An error occurred: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Currency Selection</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Main Currency Selection Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Main Currency</Text>
            <Text style={styles.sectionSubtitle}>Select your primary currency</Text>
          </View>
          <View style={styles.sectionContent}>
            {mainCurrency ? (
              <View style={styles.selectedCurrency}>
                <Text style={styles.selectedCurrencyText}>{mainCurrency.code}</Text>
                <TouchableOpacity onPress={() => setMainCurrency(null)}>
                  <Text style={styles.removeButton}>×</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Select main currency</Text>
            )}
          </View>
        </View>

        {/* Additional Currency Selection Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Additional Currencies</Text>
            <Text style={styles.sectionSubtitle}>Select currencies of interest</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.selectedCurrenciesContainer}>
              {additionalCurrencies.map((currency, index) => (
                <View key={index} style={styles.selectedCurrency}>
                  <Text style={styles.selectedCurrencyText}>{currency.code}</Text>
                  <TouchableOpacity onPress={() => {
                    setAdditionalCurrencies(additionalCurrencies.filter((_, i) => i !== index));
                  }}>
                    <Text style={styles.removeButton}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Search and Currency List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Currency Search</Text>
            <Text style={styles.sectionSubtitle}>Search by currency code</Text>
          </View>
          <View style={styles.sectionContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search currency"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View style={styles.currencyListContainer}>
              <FlatList
                data={filteredCurrencies}
                renderItem={renderCurrencyItem}
                keyExtractor={item => item.code}
                style={styles.currencyList}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, (!mainCurrency || additionalCurrencies.length === 0) && styles.buttonDisabled]}
          onPress={() => navigation.navigate('InitialSettingBudget')}
          disabled={!mainCurrency || additionalCurrencies.length === 0}
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F8F8F8',
  },
  currencyListContainer: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  currencyList: {
    backgroundColor: 'white',
  },
  currencyItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  currencyName: {
    fontSize: 16,
    color: '#666',
  },
  selectedCurrency: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCurrencyText: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  removeButton: {
    fontSize: 20,
    color: '#666',
  },
  selectedCurrenciesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  placeholderText: {
    color: '#666',
    fontStyle: 'italic',
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default InitialSettingCurrency;