import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import Logo from '../../components/Logo';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';
import { Camera, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Import your custom icons
const UserEdit = require('../../assets/user-edit.png');
const Airplane = require('../../assets/airplane-around-earth.png');
const Feedback = require('../../assets/feedback.png');
const Notification = require('../../assets/notification.png');
const Settings = require('../../assets/settings.png');
const Event = require('../../assets/event.png');
const Paper = require('../../assets/paper.png');
const Peace = require('../../assets/peace.png');
const Logout = require('../../assets/logouticon.png');

// Local black-star layer on white background
function StarDot({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const opacity = useSharedValue(0.2 + Math.random() * 0.5);
  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1600 + Math.random() * 1400 }), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#000000',
        },
        style,
      ]}
    />
  );
}

function StarsLayer({ count = 80 }: { count?: number }) {
  const stars = React.useMemo(
    () =>
      new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (2.2 - 1) + 1,
        delay: Math.random() * 1500,
      })),
    [count]
  );
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {stars.map((s, i) => (
        <StarDot key={i} {...s} />
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const profile = {
    name: 'Sarah Cunningham',
    location: 'Vancouver',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  const borderAnimation = useSharedValue(0);
  const animatedBorderStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${borderAnimation.value}deg` }],
    opacity: 0.5,
    borderColor: '#FBBF24',
  }));

  React.useEffect(() => {
    // Slow continuous rotation for a subtle "snake chasing its tail" effect
    borderAnimation.value = withRepeat(
      withTiming(360, { duration: 12000 }),
      -1,
      false
    );
  }, []);

  const items = [
    { icon: UserEdit, label: 'Edit Profile', route: '/editProfile' },
    { icon: Airplane, label: 'Travel Credits', route: '/travelsCredit' },
    { icon: Feedback, label: 'Reviews', route: '/review' },
    { icon: Notification, label: 'Notifications', route: '/notifications' },
    { icon: Settings, label: 'Settings', route: '/settings' },
    { icon: Event, label: 'Become Host', route: '/becomeAhost' },
    { icon: Paper, label: 'Cancellation Policy', route: '/cancellation' },
    { icon: Peace, label: 'Help', route: '/help' },
    { icon: Logout, label: 'Logout', route: '/logout' },
  ];

  const handlePress = (route: string) => {
    if (route) {
      router.push(route);
    }
  };

  return (
    <View style={styles.container}>
      <StarsLayer />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSpacer} />
        
        <View style={styles.unifiedContainer}>
          <View style={styles.headerCard}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profile.avatar }} style={styles.headerAvatar} />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.location}>{profile.location}</Text>
            </View>
          </View>

          <View style={styles.listCard}>
            {items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.row}
                onPress={() => handlePress(item.route)}
              >
                <Animated.View style={[styles.borderGlow, animatedBorderStyle]} />
                <View style={styles.iconWrap}>
                  <Image source={item.icon} style={styles.iconImage} />
                </View>
                <Text style={styles.rowText}>{item.label}</Text>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.footer}>
          <Logo size={18} style={{ marginRight: 8 }} />
          <Text style={styles.footerText}>GarageHub · Privacy · Terms</Text>
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  topSpacer: {
    height: 24,
  },
  bottomSpacer: {
    height: 40,
  },
  unifiedContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 24,
  },
  headerCard: {
    width: '100%',
    padding: 24,
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  headerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  listCard: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  borderGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderWidth: 2,
    borderRadius: 14,
    opacity: 0.4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  rowText: {
    flex: 1,
    color: '#111111',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 13,
  },
});