import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UIProvider } from '@/contexts/UIProvider';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <UIProvider>
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </UIProvider>
      <StatusBar style="auto" />
    </>
  );
}
