import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { apolloClient } from '../lib/apollo-client';

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
