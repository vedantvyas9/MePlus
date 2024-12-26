import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CircularProgress from 'react-native-circular-progress-indicator';

const DashboardScreen = () => {
  const insets = useSafeAreaInsets();

  const userName = 'Vedant'; // Replace with dynamic user name if available
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const tasks = [
    { id: '1', name: 'Complete UI Design', skill: 'Design', completed: false },
    { id: '2', name: 'React Hooks Practice', skill: 'Coding', completed: false },
    { id: '3', name: 'Read Design Patterns', skill: 'Architecture', completed: true },
  ];

  const skills = [
    { name: 'Design', progress: 70, streak: 12 },
    { name: 'Coding', progress: 50, streak: 8 },
    { name: 'Leadership', progress: 30, streak: 5 },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingBottom: insets.bottom + 40 }, // Adjusted padding for visibility
      ]}
      style={styles.container}
    >
      {/* Header Section */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/36' }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.welcomeMessage}>Welcome, {userName}</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      {/* Financial Goals Module */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Financial Goals</Text>
        <CircularProgress
          value={65}
          radius={50}
          maxValue={100}
          activeStrokeColor="#F59E0B"
          inActiveStrokeColor="#F3F4F6"
          textColor="#1E3A8A"
          titleFontSize={12}
          titleColor="#9CA3AF"
          title="65%"
        />
        <Text style={styles.cardSubtitle}>Weekly Goal</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            // Navigate to ExpensesScreen.js
            console.log('Navigating to Expenses Screen');
          }}
        >
          <Text style={styles.toggleButtonText}>View More</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Tasks Module */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Tasks</Text>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <TouchableOpacity style={styles.checkbox}>
              {task.completed && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <View>
              <Text style={styles.taskName}>{task.name}</Text>
              <Text style={styles.taskSkill}>{task.skill}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.addTaskButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addTaskText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Skills Progress Module */}
      <Text style={styles.sectionTitle}>Skills Progress</Text>
      <View style={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <View key={index} style={styles.skillCard}>
            <Text style={styles.skillName}>{skill.name}</Text>
            <CircularProgress
              value={skill.progress}
              radius={40}
              maxValue={100}
              activeStrokeColor="#0D9488"
              inActiveStrokeColor="#F3F4F6"
              textColor="#1E3A8A"
              title={`${skill.progress}%`}
            />
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={16} color="#F59E0B" />
              <Text style={styles.streakText}>{skill.streak} days</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  welcomeMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  date: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  toggleButton: {
    marginTop: 8,
    backgroundColor: '#0D9488',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  taskSkill: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    padding: 12,
    borderRadius: 20,
    marginTop: 16,
  },
  addTaskText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  skillCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  skillName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  streakText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
});

export default DashboardScreen;
