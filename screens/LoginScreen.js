// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
// import { SignInWithAppleButton } from '@invertase/react-native-apple-authentication';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     // Handle login logic here
//   };

//   const handleGoogleLogin = () => {
//     // Handle Google login logic here
//   };

//   const handleAppleLogin = () => {
//     // Handle Apple login logic here
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.welcomeMessage}>Welcome Back</Text>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Login to your account</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />

//           <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//             <Text style={styles.loginButtonText}>Log In</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//             <Text style={styles.cardSubtitle}>Don't have an account? Sign up</Text>
//           </TouchableOpacity>

//           <View style={styles.socialLogin}>
//             <GoogleSigninButton style={styles.googleButton} onPress={handleGoogleLogin} />
//             <SignInWithAppleButton
//               style={styles.appleButton}
//               onPress={handleAppleLogin}
//             />
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const SignupScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSignup = () => {
//     // Handle signup logic here
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.welcomeMessage}>Create an Account</Text>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Sign up to get started</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />

//           <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
//             <Text style={styles.loginButtonText}>Sign Up</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//             <Text style={styles.cardSubtitle}>Already have an account? Log in</Text>
//           </TouchableOpacity>

//           <View style={styles.socialLogin}>
//             <GoogleSigninButton style={styles.googleButton} />
//             <SignInWithAppleButton style={styles.appleButton} />
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     paddingTop: 40,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 24,
//     paddingHorizontal: 16,
//   },
//   welcomeMessage: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1E3A8A',
//   },
//   card: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     marginHorizontal: 16,
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1E3A8A',
//     marginBottom: 8,
//   },
//   cardSubtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginTop: 8,
//   },
//   input: {
//     width: '100%',
//     padding: 12,
//     marginVertical: 8,
//     borderRadius: 10,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     fontSize: 14,
//     color: '#1E3A8A',
//   },
//   loginButton: {
//     backgroundColor: '#0D9488',
//     paddingVertical: 12,
//     width: '100%',
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   socialLogin: {
//     width: '100%',
//     marginTop: 16,
//   },
//   googleButton: {
//     marginVertical: 8,
//     height: 48,
//     borderRadius: 10,
//   },
//   appleButton: {
//     marginVertical: 8,
//     height: 48,
//     borderRadius: 10,
//   },
// });

// export { LoginScreen, SignupScreen };

import React from 'react';
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
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const QuickAddModal = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = React.useState('Expense');
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState([
    { label: 'Food', value: 'food' },
    { label: 'Transport', value: 'transport' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Shopping', value: 'shopping' },
  ]);

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory(null);
  };

  const handleSubmit = () => {
    if (!amount || !description || !category) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    Alert.alert('Success', 'Expense added successfully!', [
      {
        text: 'OK',
        onPress: () => {
          resetForm();
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Expense</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#888"
            multiline
            maxLength={200}
          />
          <DropDownPicker
            open={open}
            value={category}
            items={categories}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setCategories}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholder="Select Category"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const QuickActionFAB = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.fab}>
    <Ionicons name="add" size={30} color="#fff" />
  </TouchableOpacity>
);

const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Dashboard: 'home-outline',
              Expenses: 'wallet-outline',
              Calendar: 'calendar-outline',
              Settings: 'settings-outline',
            };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
          tabBarStyle: {
            height: 60 + insets.bottom,
            backgroundColor: '#fff',
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          tabBarActiveTintColor: '#1E3A8A',
          tabBarInactiveTintColor: '#9CA3AF',
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Expenses" component={ExpensesScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <QuickActionFAB onPress={() => setIsModalVisible(true)} />
      <QuickAddModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
  },
  dropdown: {
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#ddd',
  },
  dropdownContainer: {
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#888',
  },
});

export default AppNavigator;
