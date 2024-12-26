import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format, addDays, subDays, parseISO } from 'date-fns';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const { width, height } = Dimensions.get('window');

const CalendarScreen = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [logs, setLogs] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Sample events and tasks data
  const [events, setEvents] = useState({
    '2024-12-25': [
      { time: '10:00', title: 'Team Meeting', category: 'work', priority: 'high' },
      { time: '14:30', title: 'Client Call', category: 'meeting', priority: 'medium' }
    ]
  });

  const [tasks, setTasks] = useState({
    '2024-12-25': [
      { title: 'Complete Documentation', status: 'pending', priority: 'high' },
      { title: 'Review PRs', status: 'completed', priority: 'medium' }
    ]
  });

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logs;
    
    return Object.entries(logs).reduce((acc, [date, dayLogs]) => {
      const matchingLogs = Object.entries(dayLogs).reduce((hourAcc, [hour, log]) => {
        if (log.toLowerCase().includes(searchQuery.toLowerCase())) {
          hourAcc[hour] = log;
        }
        return hourAcc;
      }, {});
      
      if (Object.keys(matchingLogs).length > 0) {
        acc[date] = matchingLogs;
      }
      return acc;
    }, {});
  }, [logs, searchQuery]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setShowMiniCalendar(false);
  };

  const navigateDay = (direction) => {
    const currentDate = parseISO(selectedDate);
    const newDate = direction === 'prev' 
      ? subDays(currentDate, 1) 
      : addDays(currentDate, 1);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
  };

  const navigateHour = (direction) => {
    if (selectedHour === null) return;
    
    let newHour = direction === 'prev' 
      ? selectedHour - 1 
      : selectedHour + 1;
    
    if (newHour < 0) {
      navigateDay('prev');
      newHour = 23;
    } else if (newHour > 23) {
      navigateDay('next');
      newHour = 0;
    }
    
    setSelectedHour(newHour);
  };

  const updateLog = (hour, text) => {
    const updatedLogs = {
      ...logs,
      [selectedDate]: {
        ...(logs[selectedDate] || {}),
        [hour]: text
      }
    };
    setLogs(updatedLogs);
  };

  const renderLogModal = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalNavButton}
              onPress={() => navigateHour('prev')}
            >
              <Icon name="chevron-left" size={24} color="#1E3A8A" />
            </TouchableOpacity>
            
            <Text style={styles.modalTime}>
              {`${selectedHour?.toString().padStart(2, '0')}:00`}
            </Text>
            
            <TouchableOpacity
              style={styles.modalNavButton}
              onPress={() => navigateHour('next')}
            >
              <Icon name="chevron-right" size={24} color="#1E3A8A" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.modalInput}
            multiline
            value={logs[selectedDate]?.[selectedHour] || ''}
            onChangeText={(text) => updateLog(selectedHour, text)}
            placeholder="Add your log entry..."
          />
          
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCloseText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderCalendarView = () => (
    <ScrollView style={styles.calendarContainer}>
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#1E3A8A' },
          ...Object.keys(events).reduce((acc, date) => ({
            ...acc,
            [date]: { 
              marked: true, 
              dotColor: '#F59E0B',
              dots: events[date].map(event => ({
                color: event.priority === 'high' ? '#EF4444' : '#F59E0B'
              }))
            }
          }), {})
        }}
        markingType="multi-dot"
        theme={{
          arrowColor: '#1E3A8A',
          todayTextColor: '#F59E0B',
          selectedDayBackgroundColor: '#1E3A8A',
          monthTextColor: '#1E3A8A',
          textMonthFontWeight: 'bold',
          textMonthFontSize: 18,
          dayTextColor: '#374151',
          textDayFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
      />

      <View style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>
          Events for {format(parseISO(selectedDate), 'MMMM d, yyyy')}
        </Text>
        {events[selectedDate]?.length > 0 ? (
          events[selectedDate]
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((event, index) => (
              <Pressable 
                key={index} 
                style={[styles.eventItem, { borderLeftColor: event.priority === 'high' ? '#EF4444' : '#F59E0B' }]}
              >
                <View style={styles.eventTimeContainer}>
                  <Text style={styles.eventTime}>{event.time}</Text>
                  <Text style={styles.eventCategory}>{event.category}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
              </Pressable>
            ))
        ) : (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>No events scheduled</Text>
          </View>
        )}
      </View>

      <View style={styles.tasksContainer}>
        <Text style={styles.sectionTitle}>
          Tasks for {format(parseISO(selectedDate), 'MMMM d, yyyy')}
        </Text>
        {tasks[selectedDate]?.length > 0 ? (
          tasks[selectedDate].map((task, index) => (
            <Pressable 
              key={index} 
              style={[styles.taskItem, { borderLeftColor: task.priority === 'high' ? '#EF4444' : '#F59E0B' }]}
            >
              <View style={styles.taskStatusContainer}>
                <Icon 
                  name={task.status === 'completed' ? 'check-circle' : 'radio-button-unchecked'} 
                  size={20} 
                  color={task.status === 'completed' ? '#10B981' : '#6B7280'} 
                />
              </View>
              <Text style={[
                styles.taskTitle,
                task.status === 'completed' && styles.completedTaskTitle
              ]}>
                {task.title}
              </Text>
            </Pressable>
          ))
        ) : (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>No tasks for today</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderDailyLogs = () => (
    <KeyboardAvoidingView 
      style={styles.dailyLogsContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logsHeader}>
        <View style={styles.dateNavigation}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateDay('prev')}
          >
            <Icon name="chevron-left" size={24} color="#1E3A8A" />
          </TouchableOpacity>
          
          <Pressable 
            style={styles.dateSelector} 
            onPress={() => setShowMiniCalendar(!showMiniCalendar)}
          >
            <Text style={styles.selectedDateText}>
              {format(parseISO(selectedDate), 'MMMM d, yyyy')}
            </Text>
            <Icon name="calendar-today" size={20} color="#1E3A8A" />
          </Pressable>

          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateDay('next')}
          >
            <Icon name="chevron-right" size={24} color="#1E3A8A" />
          </TouchableOpacity>
        </View>

        {showMiniCalendar && (
          <View style={styles.miniCalendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={handleDayPress}
              markedDates={{ [selectedDate]: { selected: true, selectedColor: '#1E3A8A' } }}
              style={styles.miniCalendar}
            />
          </View>
        )}

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search logs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery !== '' && (
            <TouchableOpacity 
              style={styles.clearSearch}
              onPress={() => setSearchQuery('')}
            >
              <Icon name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.logsScrollView}
        contentContainerStyle={styles.logsScrollContent}
      >
        {HOURS.map((hour) => {
          const hasEvent = events[selectedDate]?.some(
            event => parseInt(event.time.split(':')[0]) === hour
          );
          
          return (
            <Pressable
              key={hour}
              style={[
                styles.timeLogItem,
                hasEvent && styles.timeLogItemWithEvent
              ]}
              onPress={() => {
                setSelectedHour(hour);
                setModalVisible(true);
              }}
            >
              <Text style={styles.timeLabel}>
                {`${hour.toString().padStart(2, '0')}:00`}
              </Text>
              <View style={styles.logInputContainer}>
                <Text 
                  style={styles.logPreview}
                  numberOfLines={2}
                >
                  {logs[selectedDate]?.[hour] || (hasEvent ? "Event scheduled - Add notes..." : "Add log...")}
                </Text>
                {hasEvent && (
                  <View style={styles.eventIndicator}>
                    <Icon name="event" size={16} color="#F59E0B" />
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {renderLogModal()}
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {['calendar', 'daily logs'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Icon 
                name={tab === 'calendar' ? 'calendar-today' : 'schedule'} 
                size={24} 
                color={activeTab === tab ? '#1E3A8A' : '#6B7280'} 
              />
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {activeTab === 'calendar' ? renderCalendarView() : renderDailyLogs()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#1E3A8A',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  activeTabText: {
    color: '#1E3A8A',
    fontWeight: '600',
  },
  calendarContainer: {
    flex: 1,
  },
  eventsContainer: {
    margin: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tasksContainer: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  eventTimeContainer: {
    width: 80,
  },
  taskStatusContainer: {
    width: 40,
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  eventCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  eventTitle: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  taskTitle: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  noEventsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  noTasksContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  noTasksText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  dailyLogsContainer: {
    flex: 1,
  },
  logsHeader: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  miniCalendarContainer: {
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  miniCalendar: {
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 12,
  },
  searchIcon: {
    paddingLeft: 12,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#374151',
  },
  clearSearch: {
    padding: 8,
  },
  logsScrollView: {
    flex: 1,
  },
  logsScrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding to ensure last item is visible
  },
  timeLogItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  timeLogItemWithEvent: {
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  timeLabel: {
    width: 60,
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: '500',
    paddingTop: 12,
    paddingLeft: 8,
  },
  logInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logPreview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 44,
    fontSize: 14,
    color: '#374151',
  },
  eventIndicator: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#FEF3C7',
    padding: 4,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  modalNavButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  modalCloseButton: {
    backgroundColor: '#1E3A8A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CalendarScreen;