import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingItem = ({ icon, title, description, type, value, onPress, onValueChange }) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={type === 'toggle'}
  >
    <View style={styles.settingIcon}>
      <Ionicons name={icon} size={24} color="#1E3A8A" />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {description && (
        <Text style={styles.settingDescription}>{description}</Text>
      )}
    </View>
    {type === 'toggle' && (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: '#0D9488' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    )}
    {type === 'navigate' && (
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    )}
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    weeklyReport: true,
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: settings.darkMode ? '#111827' : '#FFFFFF' },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Preferences Section */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: settings.darkMode ? '#FFFFFF' : '#1E3A8A' },
          ]}
        >
          Preferences
        </Text>
        <SettingItem
          icon="apps-outline"
          title="Design Preferences"
          description="Customize your dashboard widgets"
          type="navigate"
          onPress={() => {/* Handle navigation */}}
        />
        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          type="toggle"
          value={settings.darkMode}
          onValueChange={(value) => handleSettingChange('darkMode', value)}
        />
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: settings.darkMode ? '#FFFFFF' : '#1E3A8A' },
          ]}
        >
          Notifications
        </Text>
        <SettingItem
          icon="notifications-outline"
          title="Push Notifications"
          type="toggle"
          value={settings.notifications}
          onValueChange={(value) => handleSettingChange('notifications', value)}
        />
        <SettingItem
          icon="document-text-outline"
          title="Weekly Report"
          description="Receive weekly progress summary"
          type="toggle"
          value={settings.weeklyReport}
          onValueChange={(value) => handleSettingChange('weeklyReport', value)}
        />
      </View>

      {/* Data Management Section */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: settings.darkMode ? '#FFFFFF' : '#1E3A8A' },
          ]}
        >
          Data Management
        </Text>
        <SettingItem
          icon="download-outline"
          title="Export Data"
          description="Export your data in different formats"
          type="navigate"
          onPress={() => {
            Alert.alert(
              'Export Data',
              'Choose your export format',
              [
                { text: 'CSV', onPress: () => console.log('Export as CSV') },
                { text: 'PDF', onPress: () => console.log('Export as PDF') },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: settings.darkMode ? '#FFFFFF' : '#1E3A8A' },
          ]}
        >
          About
        </Text>
        <SettingItem
          icon="information-circle-outline"
          title="App Version"
          description="1.0.0"
          type="navigate"
          onPress={() => {/* Handle navigation */}}
        />
        <SettingItem
          icon="document-outline"
          title="Terms of Service"
          type="navigate"
          onPress={() => {/* Handle navigation */}}
        />
        <SettingItem
          icon="shield-outline"
          title="Privacy Policy"
          type="navigate"
          onPress={() => {/* Handle navigation */}}
        />
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[
          styles.signOutButton,
          {
            backgroundColor: settings.darkMode ? '#B91C1C' : '#FEE2E2',
          },
        ]}
        onPress={() => {/* Handle sign out */}}
      >
        <Ionicons name="log-out-outline" size={24} color="#DC2626" />
        <Text
          style={[
            styles.signOutText,
            { color: settings.darkMode ? '#FFFFFF' : '#DC2626' },
          ]}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60, // Increased padding to move Preferences section further down
    paddingBottom: 100, // Increased bottom padding to ensure "Sign Out" button is visible
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 24, // Adjusted margin to ensure visibility
  },
  signOutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
