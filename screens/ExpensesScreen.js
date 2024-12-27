import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  RefreshControl,
  Platform,
  KeyboardAvoidingView,
  Alert,
  FlatList,
  Switch,
  Animated,
} from 'react-native';
import { Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categoryList = [
  { name: 'Food', icon: 'fast-food', color: '#3B82F6' },
  { name: 'Transport', icon: 'car', color: '#4ECDC4' },
  { name: 'Shopping', icon: 'cart', color: '#45B7D1' },
  { name: 'Party', icon: 'beer', color: '#FFD700' },
  { name: 'Leisure Spending', icon: 'game-controller', color: '#7C4DFF' },
  { name: 'Rent', icon: 'home', color: '#1E88E5' },
  { name: 'Entertainment', icon: 'musical-notes', color: '#10B981' },
  { name: 'Healthcare', icon: 'medkit', color: '#4CAF50' },
  { name: 'Subscriptions', icon: 'document', color: '#03A9F4' },
];

const ExpensesScreen = () => {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '', color: '' });
  const [categories, setCategories] = useState([
    { id: '1', name: 'Food', amount: 120, total: 300, color: '#FF6B6B', icon: 'fast-food' },
    { id: '2', name: 'Transport', amount: 80, total: 150, color: '#4ECDC4', icon: 'car' },
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editDeleteModalVisible, setEditDeleteModalVisible] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetPeriod, setBudgetPeriod] = useState('monthly');
  const [budgetAmount, setBudgetAmount] = useState({ daily: '', weekly: '', monthly: '' });
  const [selectedCategoryExpenses, setSelectedCategoryExpenses] = useState(null);
  const [expenseSort, setExpenseSort] = useState('weekly');
  const [showExpenseList, setShowExpenseList] = useState(false);
  const [activeDashboardPeriod, setActiveDashboardPeriod] = useState('monthly');
  const [modalAnimation] = useState(new Animated.Value(0));
  const [unorganizedExpenses, setUnorganizedExpenses] = useState([
    { id: '1', amount: 30, description: 'Miscellaneous purchase', date: new Date() },
    { id: '2', amount: 45, description: 'Unknown expense', date: new Date(Date.now() - 86400000) },
  ]);

  const budget = 1000;
  const totalExpenses = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const currentDate = new Date().toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const [expenses, setExpenses] = useState([
    { id: '1', category: 'Food', amount: 30, description: 'Lunch', date: new Date() },
    { id: '2', category: 'Food', amount: 45, description: 'Dinner', date: new Date(Date.now() - 86400000) },
  ]);

  const animateModalIn = () => {
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const animateModalOut = (onComplete) => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(onComplete);
  };

  const handleModalClose = (setModalVisible) => {
    animateModalOut(() => setModalVisible(false));
  };

  const modalScale = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const modalOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.icon || !newCategory.color) {
      Alert.alert('Error', 'Please select a category.');
      return;
    }
    const categoryExists = categories.some(cat => cat.name === newCategory.name);
    if (categoryExists) {
      Alert.alert('Error', `${newCategory.name} is already added.`);
      return;
    }
    setCategories((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        name: newCategory.name,
        amount: 0,
        total: 200,
        color: newCategory.color,
        icon: newCategory.icon,
      },
    ]);
    setNewCategory({ name: '', icon: '', color: '' });
    handleModalClose(setIsModalVisible);
  };

  const handleLongPress = (category) => {
    setSelectedCategory(category);
    setEditDeleteModalVisible(true);
  };

  const handleEditCategory = () => {
    setEditDeleteModalVisible(false);
    Alert.alert('Edit Category', `Edit category: ${selectedCategory.name}`);
  };

  const handleDeleteCategory = () => {
    setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
    setEditDeleteModalVisible(false);
    setSelectedCategory(null);
    Alert.alert('Delete Category', `Deleted category: ${selectedCategory.name}`);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getSelectedPeriodDisplay = () => {
    const today = new Date();
    if (selectedPeriod === 'Monthly') {
      return today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    } else if (selectedPeriod === 'Daily') {
      return today.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    } else if (selectedPeriod === 'Weekly') {
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    }
    return '';
  };

  const handleCategoryPress = (category) => {
    const categoryExpenses = expenses.filter(exp => exp.category === category.name);
    setSelectedCategoryExpenses({
      ...category,
      expenses: sortExpenses(categoryExpenses, expenseSort)
    });
    setShowExpenseList(true);
  };

  const sortExpenses = (expenseList, sortType) => {
    switch(sortType) {
      case 'weekly':
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return expenseList.filter(exp => exp.date >= weekStart);
      case 'monthly':
        const monthStart = new Date();
        monthStart.setDate(1);
        return expenseList.filter(exp => exp.date >= monthStart);
      case 'highToLow':
        return [...expenseList].sort((a, b) => b.amount - a.amount);
      case 'lowToHigh':
        return [...expenseList].sort((a, b) => a.amount - b.amount);
      default:
        return expenseList;
    }
  };

  const handleBudgetSave = () => {
    handleModalClose(setShowBudgetModal);
  };

  const ExpenseListModal = () => (
    <Modal
      visible={showExpenseList}
      transparent
      animationType="none"
      onShow={animateModalIn}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.centeredModalContent,
            {
              opacity: modalOpacity,
              transform: [{ scale: modalScale }],
            },
          ]}
        >
          <Text style={styles.modalTitle}>
            {selectedCategoryExpenses?.name} Expenses
          </Text>

          <FlatList
            data={selectedCategoryExpenses?.expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.expenseItem}>
                <View>
                  <Text style={styles.expenseDescription}>{item.description}</Text>
                  <Text style={styles.expenseDate}>
                    {item.date.toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.expenseAmount}>${item.amount}</Text>
              </TouchableOpacity>
            )}
            style={styles.expensesList}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleModalClose(setShowExpenseList)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const BudgetModal = () => {
    const renderTabContent = () => (
      <View style={styles.allTabsContainer}>
        <View style={[
          styles.tabPanel,
          { display: budgetPeriod === 'daily' ? 'flex' : 'none' }
        ]}>
          <TextInput
            style={styles.input}
            placeholder="Enter your daily budget"
            placeholderTextColor="#1E3A8A"
            value={budgetAmount.daily}
            onChangeText={(text) => setBudgetAmount({ ...budgetAmount, daily: text })}
            keyboardType="numeric"
          />
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Display on Dashboard</Text>
            <Switch
              value={activeDashboardPeriod === budgetPeriod}
              onValueChange={(value) => {
                if (value) setActiveDashboardPeriod(budgetPeriod);
              }}
              trackColor={{ false: "#767577", true: "#0D9488" }}
            />
          </View>
        </View>

        <View style={[
          styles.tabPanel,
          { display: budgetPeriod === 'weekly' ? 'flex' : 'none' }
        ]}>
          <TextInput
            style={styles.input}
            placeholder="Enter your weekly budget"
            placeholderTextColor="#1E3A8A"
            value={budgetAmount.weekly}
            onChangeText={(text) => setBudgetAmount({ ...budgetAmount, weekly: text })}
            keyboardType="numeric"
          />
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Display on Dashboard</Text>
            <Switch
              value={activeDashboardPeriod === budgetPeriod}
              onValueChange={(value) => {
                if (value) setActiveDashboardPeriod(budgetPeriod);
              }}
              trackColor={{ false: "#767577", true: "#0D9488" }}
            />
          </View>
        </View>

        <View style={[
          styles.tabPanel,
          { display: budgetPeriod === 'monthly' ? 'flex' : 'none' }
        ]}>
          <TextInput
            style={styles.input}
            placeholder="Enter your monthly budget"
            placeholderTextColor="#1E3A8A"
            value={budgetAmount.monthly}
            onChangeText={(text) => setBudgetAmount({ ...budgetAmount, monthly: text })}
            keyboardType="numeric"
          />
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Display on Dashboard</Text>
            <Switch
              value={activeDashboardPeriod === budgetPeriod}
              onValueChange={(value) => {
                if (value) setActiveDashboardPeriod(budgetPeriod);
              }}
              trackColor={{ false: "#767577", true: "#0D9488" }}
            />
          </View>
        </View>
      </View>
    );

    return (
      <Modal
        visible={showBudgetModal}
        transparent
        animationType="none"
        onShow={animateModalIn}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <Animated.View
            style={[
              styles.centeredModalContent,
              {
                opacity: modalOpacity,
                transform: [{ scale: modalScale }],
              },
            ]}
          >
            <Text style={styles.modalTitle}>Set Budget</Text>
            
            <View style={styles.tabsContainer}>
              {['daily', 'weekly', 'monthly'].map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setBudgetPeriod(period)}
                  style={[styles.tab, budgetPeriod === period && styles.activeTab]}
                >
                  <Text style={[styles.tabText, budgetPeriod === period && styles.activeTabText]}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {renderTabContent()}

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleBudgetSave}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => handleModalClose(setShowBudgetModal)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const AddCategoryModal = () => (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      onShow={animateModalIn}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <Animated.View
          style={[
            styles.centeredModalContent,
            {
              opacity: modalOpacity,
              transform: [{ scale: modalScale }],
            },
          ]}
        >
          <Text style={styles.modalTitle}>Add New Category</Text>
          <ScrollView
            style={styles.categoryList}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {categoryList.map((category) => {
              const isCategoryAdded = categories.some(cat => cat.name === category.name);
              return (
                <TouchableOpacity
                  key={category.name}
                  style={[
                    styles.categoryOption,
                    isCategoryAdded
                      ? styles.categoryOptionDisabled
                      : newCategory.name === category.name && styles.categoryOptionSelected,
                  ]}
                  onPress={() => {
                    if (!isCategoryAdded) {
                      setNewCategory(category);
                    }
                  }}
                >
                  <Ionicons name={category.icon} size={24} color={category.color} />
                  <Text style={styles.categoryOptionText}>{category.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleAddCategory}>
              <Text style={styles.modalButtonText}>Add Category</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleModalClose(setIsModalVisible)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const EditDeleteModal = () => (
    <Modal
      visible={editDeleteModalVisible}
      transparent
      animationType="none"
      onShow={animateModalIn}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.centeredModalContent,
            {
              opacity: modalOpacity,
              transform: [{ scale: modalScale }],
            },
          ]}
        >
          <Text style={styles.modalTitle}>Edit or Delete Category</Text>
          <TouchableOpacity style={styles.modalButton} onPress={handleEditCategory}>
            <Text style={styles.modalButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={handleDeleteCategory}>
            <Text style={styles.modalButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => handleModalClose(setEditDeleteModalVisible)}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <Text style={styles.headerTitle}>Expenses</Text>
          <Text style={styles.headerDate}>{currentDate}</Text>
        </View>
        <TouchableOpacity 
          style={styles.setBudgetButton} 
          onPress={() => setShowBudgetModal(true)}
        >
          <Text style={styles.setBudgetButtonText}>Set Budget</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <CircularProgress
          value={(totalExpenses / budget) * 100}
          radius={60}
          duration={2000}
          progressValueColor={'#1E3A8A'}
          maxValue={100}
          title={'of budget'}
          titleColor={'#64748B'}
          titleStyle={{ fontSize: 14 }}
          activeStrokeColor={'#0D9488'}
          inActiveStrokeColor={'#E2E8F0'}
        />
        <View style={styles.budgetInfo}>
          <Text style={styles.budgetTitle}>Monthly Budget</Text>
          <Text style={styles.budgetAmount}>${budget}</Text>
          <Text style={styles.budgetRemaining}>
            ${budget - totalExpenses} remaining
          </Text>
        </View>
      </View>

      <View style={styles.periodSelector}>
        {['Daily', 'Weekly', 'Monthly'].map((period) => (
          <Chip
            key={period}
            selected={selectedPeriod === period}
            onPress={() => setSelectedPeriod(period)}
            style={selectedPeriod === period ? styles.selectedChip : styles.chip}
          >
            {period}
          </Chip>
        ))}
      </View>

      <Text style={styles.selectedPeriodText}>
        {getSelectedPeriodDisplay()}
      </Text>

      <Text style={styles.sectionTitle}>Categories</Text>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryCard}
          onLongPress={() => handleLongPress(category)}
          onPress={() => handleCategoryPress(category)}
        >
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIcon}>
              <Ionicons name={category.icon} size={24} color={category.color} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryAmount}>${category.amount}</Text>
            </View>
            <CircularProgress
              value={(category.amount / category.total) * 100}
              radius={20}
              duration={1000}
              progressValueColor={category.color}
              titleColor={category.color}
              maxValue={100}
              activeStrokeColor={category.color}
              inActiveStrokeColor={'#E2E8F0'}
            />
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(category.amount / category.total) * 100}%`,
                  backgroundColor: category.color,
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="add-circle" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Category</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Unorganized Expenses</Text>
      {unorganizedExpenses.map((expense) => (
        <View key={expense.id} style={styles.unorganizedExpenseCard}>
          <View>
            <Text style={styles.expenseDescription}>{expense.description}</Text>
            <Text style={styles.expenseDate}>
              {expense.date.toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.expenseAmount}>${expense.amount}</Text>
        </View>
      ))}

      <AddCategoryModal />
      <BudgetModal />
      <ExpenseListModal />
      <EditDeleteModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  headerDate: {
    fontSize: 16,
    color: '#64748B',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetInfo: {
    marginLeft: 16,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  budgetRemaining: {
    fontSize: 14,
    color: '#64748B',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  chip: {
    marginHorizontal: 8,
    backgroundColor: '#E2E8F0',
  },
  selectedChip: {
    marginHorizontal: 8,
    backgroundColor: '#0D9488',
  },
  selectedPeriodText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  categoryAmount: {
    fontSize: 14,
    color: '#64748B',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D9488',
    borderRadius: 24,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Changed from 'center'
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%', // Changed from '95%'
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  budgetInputContainer: {
    width: '100%',
    marginTop: 16,
  },
  budgetInputLabel: {
    fontSize: 16,
    color: '#1E3A8A',
    marginBottom: 8,
  },
  budgetInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryOptionSelected: {
    backgroundColor: '#0D9488',
  },
  categoryOptionDisabled: {
    opacity: 0.5,
  },
  categoryOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1E3A8A',
  },
  modalButton: {
    backgroundColor: '#0D9488',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
    width: '100%',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  setBudgetButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  setBudgetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0D9488',
  },
  tabText: {
    fontSize: 16,
    color: '#64748B',
  },
  activeTabText: {
    color: '#0D9488',
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,  // Reduced from 16
    marginBottom: 4, // Reduced from 16
  },
  label: {
    fontSize: 16,
    color: '#1E3A8A',
  },
  unorganizedExpenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  expenseDescription: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 14,
    color: '#64748B',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#0D9488',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  sortChip: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredModalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    transform: [{ translateY: 0 }], // Add this to prevent flickering
  },
  allTabsContainer: {
    width: '100%',
    minHeight: 150, // Reduced from 200
    position: 'relative',
  },
  tabPanel: {
    width: '100%',
    position: 'relative',  // Changed from absolute to relative
    top: 0,
    left: 0,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#0D9488',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  closeButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ExpensesScreen;