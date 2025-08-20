import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function EditProfile() {
  const [fullName, setFullName] = React.useState('Sarah Cunningham');
  const [email, setEmail] = React.useState('sarah@example.com');
  const [phone, setPhone] = React.useState('+1 555 0100');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/profile')}>
          <ChevronLeft size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <Image source={require('../../assets/garage.png')} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Profile</Text>
              <Text style={styles.cardSub}>Update your personal information</Text>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full name</Text>
            <View style={styles.inputWrap}>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputWrap}>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>
          </View>
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.9}>
            <View style={styles.saveBtnInner}><Text style={styles.saveText}>Save changes</Text></View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>
          <Text style={styles.cardSub}>Manage password and 2FA</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.itemText}>Password</Text>
            <TouchableOpacity><Text style={styles.link}>Change</Text></TouchableOpacity>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.itemText}>Two-factor authentication</Text>
            <TouchableOpacity><Text style={styles.link}>Set up</Text></TouchableOpacity>
          </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 10 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111111' },
  cardSub: { fontSize: 13, color: '#6B7280', marginTop: 2, marginBottom: 8 },
  inputGroup: { marginTop: 8 },
  label: { fontSize: 13, color: '#6B7280', marginBottom: 6, marginLeft: 4, fontWeight: '600' },
  inputWrap: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
    backgroundColor: '#FFFFFF'
  },
  input: { paddingHorizontal: 12, paddingVertical: 12, color: '#111827', fontSize: 16 },
  saveBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 16 },
  saveBtnInner: { backgroundColor: '#111111', alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  itemText: { color: '#111827', fontSize: 15 },
  link: { color: '#111111', fontWeight: '700' },
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