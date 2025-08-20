import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function Help() {
  const [message, setMessage] = React.useState('');
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/profile')}>
          <ChevronLeft size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.title}>Help</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Help Center</Text>
        <Text style={styles.sectionDescription}>
          Browse FAQs or send us a message. We'll get back within 24h.
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact support</Text>
          <TextInput style={styles.textArea} placeholder="Describe your issue..." placeholderTextColor="#9CA3AF" multiline numberOfLines={6} value={message} onChangeText={setMessage} />
          <TouchableOpacity style={styles.sendBtn}><View style={styles.sendBtnInner}><Text style={styles.sendText}>Send</Text></View></TouchableOpacity>
        </View>
      </ScrollView>
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
    gap: 16,
  },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111111', marginBottom: 8 },
  textArea: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, minHeight: 120, color: '#111827' },
  sendBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 12 },
  sendBtnInner: { backgroundColor: '#111111', alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  sendText: { color: '#FFFFFF', fontWeight: '700' },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
});