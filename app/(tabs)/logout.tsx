import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function Logout() {
  const handleLogout = () => {
    // TODO: Clear auth/session here if applicable
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/profile')}>
          <ChevronLeft size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.title}>Logout</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Image
          source={require('../../assets/logout.png')}
          style={styles.logoutImage}
          resizeMode="contain"
        />
        <Text style={styles.sectionTitle}>Are you sure you want to log out?</Text>
        <Text style={styles.sectionDescription}>
          You will need to log in again to access your account.
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
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
    flex: 1,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#111111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});