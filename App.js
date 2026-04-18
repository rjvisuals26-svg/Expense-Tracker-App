import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ExpenseDashboard from './screens/ExpenseDashboard';
import ExpenseReports from './screens/ExpenseReports';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Dashboard');

  const navigateToReports = () => setCurrentScreen('Reports');
  const navigateToDashboard = () => setCurrentScreen('Dashboard');

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {currentScreen === 'Dashboard' ? (
        <ExpenseDashboard onOpenReports={navigateToReports} />
      ) : (
        <ExpenseReports onBack={navigateToDashboard} />
      )}
    </SafeAreaProvider>
  );
}
