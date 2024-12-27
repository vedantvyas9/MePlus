import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Switch,
  Alert,
  FlatList
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, SignupScreen } from '../screens/LoginScreen';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const QuickAddModal = ({ isVisible, onClose, categories }) => {
  const [activeTab, setActiveTab] = useState('Expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [localCategories, setLocalCategories] = useState([
    { label: 'Food', value: 'food' },
    { label: 'Transport', value: 'transport' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Shopping', value: 'shopping' }
  ]);
  const [category, setCategory] = useState(null); // Add this line
  
  // Task states
  const [taskDescription, setTaskDescription] = useState('');
  const [parentTask, setParentTask] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(false);

  // Skill states
  const [skillDescription, setSkillDescription] = useState('');
  const [isStreak, setIsStreak] = useState(false);
  const [goalHours, setGoalHours] = useState('');
  const [skillDeadline, setSkillDeadline] = useState(new Date());
  const [showSkillDatePicker, setShowSkillDatePicker] = useState(false);
  const [hasSkillDeadline, setHasSkillDeadline] = useState(false);

  // New state for Event
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [eventDetails, setEventDetails] = useState('');
  const [eventColor, setEventColor] = useState('#1E3A8A');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showEventDatePicker, setShowEventDatePicker] = useState(false);
  const [showEventTimePicker, setShowEventTimePicker] = useState(false);

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory(null);
    setTaskDescription('');
    setParentTask('');
    setDeadline(new Date());
    setHasDeadline(false);
    setSkillDescription('');
    setIsStreak(false);
    setGoalHours('');
    setSkillDeadline(new Date());
    setHasSkillDeadline(false);
    setEventName('');
    setEventDate(new Date());
    setEventTime(new Date());
    setEventDetails('');
    setEventColor('#1E3A8A');
    setSelectedSkill(null);
  };

  const handleSubmit = (type) => {
    let message = '';
    let isValid = true;

    switch (type) {
      case 'Expense':
        if (!amount || !description || !category) {
          Alert.alert('Error', 'Please fill all required fields');
          isValid = false;
        }
        message = 'Expense added successfully!';
        break;
      case 'Task':
        if (!taskDescription) {
          Alert.alert('Error', 'Please enter task description');
          isValid = false;
        }
        message = 'Task added successfully!';
        break;
      case 'Skill':
        if (!skillDescription || !goalHours) {
          Alert.alert('Error', 'Please fill required fields');
          isValid = false;
        }
        message = 'Skill added successfully!';
        break;
      case 'Event':
        if (!eventName || !eventDate || !eventTime) {
          Alert.alert('Error', 'Event name, date and time are required');
          isValid = false;
        }
        message = 'Event added successfully!';
        break;
    }

    if (isValid) {
      Alert.alert('Success', message, [
        { 
          text: 'OK', 
          onPress: () => {
            resetForm();
            onClose();
          }
        }
      ]);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Expense':
        return (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Amount *"
              value={amount}
              onChangeText={text => setAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description *"
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor="#9CA3AF"
            />
            <DropDownPicker
              open={open}
              value={category}
              items={categories?.map(cat => ({
                label: cat.name,
                value: cat.name,
                icon: () => <Ionicons name={cat.icon} size={20} color={cat.color} />
              })) || []}
              setOpen={setOpen}
              setValue={setCategory}
              placeholder="Select Category *"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={() => handleSubmit('Expense')}
            >
              <Text style={styles.submitButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Task':
        return (
          <View style={styles.formContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Task Description"
              value={taskDescription}
              onChangeText={setTaskDescription}
              multiline
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Parent Task (Optional)"
              value={parentTask}
              onChangeText={setParentTask}
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.deadlineContainer}>
              <Text style={styles.label}>Set Deadline</Text>
              <Switch
                value={hasDeadline}
                onValueChange={setHasDeadline}
                trackColor={{ false: "#767577", true: "#1E3A8A" }}
              />
            </View>
            {hasDeadline && (
              <>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{deadline.toLocaleDateString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text>{deadline.toLocaleTimeString()}</Text>
                </TouchableOpacity>
              </>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDeadline(selectedDate);
                }}
              />
            )}
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={() => handleSubmit('Task')}
            >
              <Text style={styles.submitButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Skill':
        return (
          <View style={styles.formContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Skill Description"
              value={skillDescription}
              onChangeText={setSkillDescription}
              multiline
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.deadlineContainer}>
              <Text style={styles.label}>Streak Based?</Text>
              <Switch
                value={isStreak}
                onValueChange={setIsStreak}
                trackColor={{ false: "#767577", true: "#1E3A8A" }}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Goal Hours"
              value={goalHours}
              onChangeText={text => setGoalHours(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.deadlineContainer}>
              <Text style={styles.label}>Set Deadline</Text>
              <Switch
                value={hasSkillDeadline}
                onValueChange={setHasSkillDeadline}
                trackColor={{ false: "#767577", true: "#1E3A8A" }}
              />
            </View>
            {hasSkillDeadline && (
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowSkillDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {skillDeadline.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}
            {showSkillDatePicker && (
              <DateTimePicker
                value={skillDeadline}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowSkillDatePicker(false);
                  if (selectedDate) setSkillDeadline(selectedDate);
                }}
              />
            )}
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={() => handleSubmit('Skill')}
            >
              <Text style={styles.submitButtonText}>Add Skill</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Event':
        return (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Event Name *"
              value={eventName}
              onChangeText={setEventName}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEventDatePicker(true)}
            >
              <Text>Date: {eventDate.toLocaleDateString()} *</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEventTimePicker(true)}
            >
              <Text>Time: {eventTime.toLocaleTimeString()} *</Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Event Details"
              value={eventDetails}
              onChangeText={setEventDetails}
              multiline
              placeholderTextColor="#9CA3AF"
            />
            <DropDownPicker
              placeholder="Related Skill (Optional)"
              // ...skill picker props...
            />
            {/* Color picker component */}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.centeredModalContent}>
          <View style={styles.tabsContainer}>
            {['Expense', 'Task', 'Skill', 'Event'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <FlatList
            data={[{ key: 'content' }]}
            renderItem={() => renderTabContent()}
            keyExtractor={item => item.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const QuickActionFAB = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.fabButton}
  >
    <Ionicons name="add" size={30} color="white" />
  </TouchableOpacity>
);

const MainNavigator = () => {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [activeScreen, setActiveScreen] = React.useState('Dashboard');
  const [categories, setCategories] = useState([/* your categories */]);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            height: 60 + insets.bottom,
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            position: 'absolute',
            bottom: 0,
          },
          tabBarActiveTintColor: '#1E3A8A',
          tabBarInactiveTintColor: '#9CA3AF',
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') iconName = 'home-outline';
            else if (route.name === 'Expenses') iconName = 'wallet-outline';
            else if (route.name === 'Calendar') iconName = 'calendar-outline';
            else if (route.name === 'Settings') iconName = 'settings-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          swipeEnabled: true, // Enable swipe navigation
        })}
        screenListeners={{
          state: (e) => {
            setActiveScreen(e.data.state.routeNames[e.data.state.index]);
          },
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Expenses" component={ExpensesScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      
      <QuickActionFAB 
        onPress={() => setIsModalVisible(true)} 
      />
      
      <QuickAddModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        categories={categories}
      />
    </>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  fabButton: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
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
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1E3A8A',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1E3A8A',
    fontWeight: 'bold',
  }, formContainer: {
    gap: 15,
    paddingHorizontal: 5,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginTop: 5,
    zIndex: 1000,
  },
  dropdownContainer: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    zIndex: 1000,
  },
  deadlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
  dateButton: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#1E3A8A',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
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
  required: {
    color: 'red',
    marginLeft: 4,
  }
});

export default AppNavigator;