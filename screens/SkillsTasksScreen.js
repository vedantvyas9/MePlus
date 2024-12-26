import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Chip, Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const CircularProgress = ({ progress, size = 80, strokeWidth = 10, color = '#0D9488' }) => {
  const radius = size / 2;
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: strokeWidth,
          borderColor: '#E5E7EB',
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: strokeWidth,
          borderColor: color,
          transform: [{ rotate: '-90deg' }],
          borderStyle: 'solid',
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          strokeDasharray: `${circumference} ${circumference}`,
          strokeDashoffset: strokeDashoffset,
        }}
      />
    </View>
  );
};

const SkillsTasksScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Skills');
  const [tasks, setTasks] = useState([
    { id: 1, date: '2024-12-19', description: 'Complete React module', skill: 'Programming', completed: false },
    { id: 2, date: '2024-12-20', description: 'Write journal entry', skill: 'Writing', completed: true },
  ]);
  const [skills, setSkills] = useState([
    { id: 1, name: 'Programming', progress: 0.75, streak: 5, recent: ['React project', 'Leetcode problem'] },
    { id: 2, name: 'Writing', progress: 0.6, streak: 3, recent: ['Blog post', 'Poem'] },
    { id: 3, name: 'Fitness', progress: 0.9, streak: 10, recent: ['Yoga', 'Run'] },
  ]);

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        {['Skills', 'Tasks'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={selectedTab === tab ? styles.selectedTab : styles.tab}
          >
            <Text style={selectedTab === tab ? styles.selectedTabText : styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Skills Tab */}
      {selectedTab === 'Skills' && (
        <ScrollView contentContainerStyle={styles.skillsContainer}>
          {skills.map((skill) => (
            <View key={skill.id} style={styles.skillCard}>
              <CircularProgress
                progress={skill.progress}
                size={80}
                strokeWidth={8}
                color={'#0D9488'}
              />
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.streakCounter}>🔥 {skill.streak}-day streak</Text>
              <View style={styles.recentActivitiesContainer}>
                {skill.recent.map((activity, index) => (
                  <Text key={index} style={styles.activityText}>• {activity}</Text>
                ))}
              </View>
              <TouchableOpacity style={styles.addActivityButton}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.addActivityText}>Add Activity</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Tasks Tab */}
      {selectedTab === 'Tasks' && (
        <ScrollView contentContainerStyle={styles.tasksContainer}>
          <View style={styles.filterChipsContainer}>
            {['All', 'Today', 'Completed', 'Upcoming'].map((filter) => (
              <Chip key={filter} style={styles.filterChip}>{filter}</Chip>
            ))}
          </View>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Checkbox
                  status={task.completed ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === task.id ? { ...t, completed: !t.completed } : t
                      )
                    );
                  }}
                />
                <Text style={styles.taskDescription}>{task.description}</Text>
              </View>
              {task.skill && <Text style={styles.taskSkill}>Skill: {task.skill}</Text>}
            </View>
          ))}
          <TouchableOpacity style={styles.quickAddTaskButton}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.quickAddTaskText}>Quick Add Task</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
  },
  tab: {
    padding: 8,
  },
  selectedTab: {
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#0D9488',
  },
  tabText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E3A8A',
  },
  selectedTabText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#0D9488',
  },
  skillsContainer: {
    padding: 16,
  },
  skillCard: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
  },
  skillName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    textAlign: 'center',
    color: '#1E3A8A',
  },
  streakCounter: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    color: '#0D9488',
    marginVertical: 8,
  },
  recentActivitiesContainer: {
    marginVertical: 8,
  },
  activityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E3A8A',
  },
  addActivityButton: {
    flexDirection: 'row',
    backgroundColor: '#0D9488',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addActivityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  tasksContainer: {
    padding: 16,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E3A8A',
    marginLeft: 8,
  },
  taskSkill: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#0D9488',
    marginTop: 4,
  },
  quickAddTaskButton: {
    flexDirection: 'row',
    backgroundColor: '#0D9488',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  quickAddTaskText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
});

export default SkillsTasksScreen;
