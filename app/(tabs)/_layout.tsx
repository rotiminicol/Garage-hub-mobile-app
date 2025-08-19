import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, MessageCircle, User } from 'lucide-react-native';
import { useEffect, useRef } from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ size, color }) => (
            <View />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const activeColor = '#111111';
  const inactiveColor = '#9CA3AF';

  const allowedNames = new Set(['home', 'search', 'add', 'messages', 'profile']);
  const visibleRoutes = state.routes.filter(r => allowedNames.has(r.name));

  const getTabLabel = (name: string) => {
    switch (name) {
      case 'home':
        return 'Home';
      case 'search':
        return 'Search';
      case 'add':
        return 'Host';
      case 'messages':
        return 'Chat';
      case 'profile':
        return 'Profile';
      default:
        return '';
    }
  };

  const iconSourceFor = (name: string) => {
    switch (name) {
      case 'home':
        return require('../../assets/property.png');
      case 'search':
        return require('../../assets/magnifier.png');
      case 'add':
        return require('../../assets/add.png');
      case 'messages':
        return require('../../assets/chat.png');
      case 'profile':
        return require('../../assets/user.png');
      default:
        return require('../../assets/property.png');
    }
  };

  const renderIcon = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === state.routes.indexOf(route);
    const tintColor = isFocused ? activeColor : inactiveColor;
    const source = iconSourceFor(route.name);
    const label = getTabLabel(route.name);

    // Animation for elevation effect
    const scaleAnim = useRef(new Animated.Value(isFocused ? 1.1 : 1)).current;
    const translateYAnim = useRef(new Animated.Value(isFocused ? -12 : 0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: isFocused ? 1.1 : 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: isFocused ? -12 : 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, [isFocused]);

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={() => navigation.navigate(route.name as never)}
        style={[styles.tabItem, isFocused && styles.tabItemActive]}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.iconContainer, {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        }]}>
          <Image source={source} style={[styles.iconImg, { tintColor }]} resizeMode="contain" />
          <Text style={[styles.tabLabel, { color: tintColor }]}>{label}</Text>
          <View style={[styles.dot, isFocused && styles.dotActive]} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.tabContainer]}>
      <View style={styles.tabBarBar}>
        <View style={styles.rowSpace}>{visibleRoutes.map(renderIcon)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: '#FFFFFF',
  },
  tabBarBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    height: 72,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  rowSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabItemActive: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    fontFamily: 'System',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'transparent',
    marginTop: 6,
  },
  dotActive: {
    backgroundColor: '#111111',
  },
});