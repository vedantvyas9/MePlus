// // import React from 'react';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { Ionicons } from '@expo/vector-icons';
// // import HomeScreen from './screens/HomeScreen';
// // import FinanceScreen from './screens/FinanceScreen';
// // import AddScreen from './screens/AddScreen';
// // import TimeManagementScreen from './screens/TimeManagementScreen';
// // import ProfileScreen from './screens/ProfileScreen';

// // const Tab = createBottomTabNavigator();

// // export default function App() {
// //   return (
// //     <NavigationContainer>
// //       <Tab.Navigator
// //         screenOptions={({ route }) => ({
// //           tabBarIcon: ({ focused, color, size }) => {
// //             let iconName;

// //             if (route.name === 'Home') {
// //               iconName = focused ? 'home' : 'home-outline';
// //             } else if (route.name === 'Finances') {
// //               iconName = focused ? 'wallet' : 'wallet-outline';
// //             } else if (route.name === 'Add') {
// //               iconName = focused ? 'add-circle' : 'add-circle-outline';
// //             } else if (route.name === 'Time Management') {
// //               iconName = focused ? 'time' : 'time-outline';
// //             } else if (route.name === 'Profile') {
// //               iconName = focused ? 'person' : 'person-outline';
// //             }

// //             return <Ionicons name={iconName} size={size} color={color} />;
// //           },
// //           tabBarActiveTintColor: 'tomato',
// //           tabBarInactiveTintColor: 'gray',
// //         })}
// //       >
// //         <Tab.Screen name="Home" component={HomeScreen} />
// //         <Tab.Screen name="Finances" component={FinanceScreen} />
// //         <Tab.Screen name="Add" component={AddScreen} />
// //         <Tab.Screen name="Time Management" component={TimeManagementScreen} />
// //         <Tab.Screen name="Profile" component={ProfileScreen} />
// //       </Tab.Navigator>
// //     </NavigationContainer>
// //   );
// // }

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import { View, TouchableOpacity, Animated } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// // Import screens (we'll create these next)
// import DashboardScreen from './screens/DashboardScreen';
// import ExpensesScreen from './screens/ExpensesScreen';
// import SkillsTasksScreen from './screens/SkillsTasksScreen';
// import CalendarScreen from './screens/CalendarScreen';
// import SettingsScreen from './screens/SettingsScreen';

// const Tab = createBottomTabNavigator();

// // FAB component for quick actions
// const QuickActionFAB = ({ onPressExpense, onPressTask }) => {
//   const [isExpanded, setIsExpanded] = React.useState(false);
//   const expandAnim = React.useRef(new Animated.Value(0)).current;

//   const toggleExpand = () => {
//     const toValue = isExpanded ? 0 : 1;
//     Animated.spring(expandAnim, {
//       toValue,
//       useNativeDriver: false,
//       friction: 8,
//     }).start();
//     setIsExpanded(!isExpanded);
//   };

//   const width = expandAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['56px', '160px'],
//   });

//   return (
//     <Animated.View
//       style={{
//         position: 'absolute',
//         bottom: 80,
//         alignSelf: 'center',
//         width,
//         height: 56,
//         borderRadius: 28,
//         backgroundColor: '#1E3A8A',
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-around',
//         elevation: 5,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//       }}
//     >
//       {isExpanded ? (
//         <>
//           <TouchableOpacity onPress={onPressExpense}>
//             <Ionicons name="cash-outline" size={24} color="white" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={onPressTask}>
//             <Ionicons name="checkmark" size={24} color="white" />
//           </TouchableOpacity>
//         </>
//       ) : null}
//       <TouchableOpacity
//         onPress={toggleExpand}
//         style={{
//           width: 56,
//           height: 56,
//           borderRadius: 28,
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Ionicons
//           name={isExpanded ? 'close' : 'add'}
//           size={24}
//           color="white"
//         />
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// const AppNavigator = () => {
//   const insets = useSafeAreaInsets();

//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={{
//           tabBarStyle: {
//             height: 60 + insets.bottom,
//             backgroundColor: 'white',
//             borderTopWidth: 0,
//             elevation: 8,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: -2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 3,
//             position: 'absolute',
//             bottom: 0,
//           },
//           tabBarActiveTintColor: '#1E3A8A',
//           tabBarInactiveTintColor: '#9CA3AF',
//           headerShown: false,
//         }}
//       >
//         <Tab.Screen
//           name="Dashboard"
//           component={DashboardScreen}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="home-outline" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Expenses"
//           component={ExpensesScreen}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="wallet-outline" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="SkillsTasks"
//           component={SkillsTasksScreen}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="rocket-outline" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Calendar"
//           component={CalendarScreen}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="calendar-outline" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Settings"
//           component={SettingsScreen}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="settings-outline" size={size} color={color} />
//             ),
//           }}
//         />
//       </Tab.Navigator>
//       <QuickActionFAB
//         onPressExpense={() => {
//           // Handle expense quick add
//         }}
//         onPressTask={() => {
//           // Handle task quick add
//         }}
//       />
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;

import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator /> {/* No need for NavigationContainer here */}
    </SafeAreaProvider>
  );
}

