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
  Alert,
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

  const budget = 1000;
  const totalExpenses = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const currentDate = new Date().toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.icon || !newCategory.color) {
      Alert.alert('Error', 'Please select a category.');
      return;
    }
    const categoryExists = categories.some((cat) => cat.name === newCategory.name);
    if (categoryExists) {
      Alert.alert('Error', `${newCategory.name} is already added.`);
      return;
    }
    setCategories((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,  // Ensuring unique IDs
        name: newCategory.name,
        amount: 0,
        total: 200, // Default total value
        color: newCategory.color,
        icon: newCategory.icon,
      },
    ]);
    setNewCategory({ name: '', icon: '', color: '' });
    setIsModalVisible(false);
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
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    }
    return '';
  };

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
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.profileImage}
          />
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
          key={category.id}  // Ensure unique key per category
          style={styles.categoryCard}
          onLongPress={() => handleLongPress(category)}
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

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>
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
            <TouchableOpacity style={styles.modalButton} onPress={handleAddCategory}>
              <Text style={styles.modalButtonText}>Add Category</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {editDeleteModalVisible && (
        <Modal visible={editDeleteModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit or Delete Category</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleEditCategory}>
                <Text style={styles.modalButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleDeleteCategory}>
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setEditDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    color: '#FFFFFF',
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
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
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
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalCancelButton: {
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 14,
    color: '#64748B',
  },
});

export default ExpensesScreen;
