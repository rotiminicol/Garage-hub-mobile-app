import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { router } from 'expo-router';

export default function Notifications() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/profile')}>
          <ChevronLeft size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Bell size={18} color="#111111" />
          <Text style={styles.sectionTitle}>Your Notifications</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Manage your notification preferences and view recent alerts here.
        </Text>
        {/* Add notifications list and settings here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  placeholder: {
    width: 32,
  },
  content: {
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
});
