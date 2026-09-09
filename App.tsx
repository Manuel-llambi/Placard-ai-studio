import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './src/App';
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Entry point for Expo (registered by node_modules/expo/AppEntry.js, see
// package.json "main"). Equivalent to the old src/main.tsx for Vite: wraps
// the actual app (src/App.tsx) with the error boundary and provides safe
// area insets so the header/footer respect notches and system bars on
// real devices.
export default function Root() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
