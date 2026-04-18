import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BASE_URL from '../src/api/apiConfig';

import { BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const THEME = {
  bg: '#0F172A',
  surface: '#1E293B',
  card: '#334155',
  primary: '#10B981',
  secondary: '#3B82F6',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  expense: '#EF4444',
  income: '#10B981',
  border: 'rgba(255, 255, 255, 0.06)',
};

const CATEGORY_COLORS = {
  'Housing': '#3B82F6',
  'Food': '#8B5CF6',
  'Salary': '#10B981',
  'Shopping': '#F59E0B',
  'Others': '#94A3B8',
};

export default function ExpenseReports({ onBack }) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const BASE_URL = 'http://192.168.1.113:3000';


  useEffect(() => {
    fetchData();
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/insight`);
      const json = await resp.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const chartData = useMemo(() => {
    if (!data.length) return null;

    // Group by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const expenseTotals = [0, 0, 0, 0, 0, 0];

    data.forEach(item => {
      if (item.type?.toLowerCase() === 'expense') {
        const monthLabel = item.date?.split(' ')[0];
        const monthIdx = months.indexOf(monthLabel);
        if (monthIdx !== -1) {
          expenseTotals[monthIdx] += parseFloat(item.amount);
        }
      }
    });

    return {
      labels: months,
      datasets: [{ data: expenseTotals }]
    };
  }, [data]);

  const categoryData = useMemo(() => {
    const cats = {};
    data.filter(t => t.type?.toLowerCase() === 'expense').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + parseFloat(t.amount);
    });
    return Object.entries(cats).sort((a,b) => b[1] - a[1]);
  }, [data]);

  const totalExpense = data.filter(t => t.type?.toLowerCase() === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Spending Insights</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.primary} />
        }
      >
        
        {/* Main Chart Section */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Monthly Spending Trend</Text>
          <Text style={styles.cardSubtitle}>Total expenses tracked over time</Text>
          
          {!chartData ? (
            <Text style={[styles.emptyText, { marginTop: 20 }]}>No expense data found for the last 6 months.</Text>
          ) : (
            <BarChart
              data={chartData}
              width={width - 50}
              height={220}
              yAxisLabel="Rs "
              chartConfig={{
                backgroundColor: THEME.surface,
                backgroundGradientFrom: THEME.surface,
                backgroundGradientTo: THEME.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "6", strokeWidth: "2", stroke: THEME.primary },
                barPercentage: 0.6,
              }}
              style={styles.chart}
              withInnerLines={false}
              fromZero
              showValuesOnTopOfBars
            />
          )}
        </View>

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, { borderLeftColor: THEME.primary }]}>
            <Text style={styles.statLabel}>Avg. Monthly</Text>
            <Text style={styles.statValue}>PKR {(totalExpense / 4).toLocaleString()}</Text>
          </View>
          <View style={[styles.statItem, { borderLeftColor: THEME.secondary }]}>
            <Text style={styles.statLabel}>Highest Category</Text>
            <Text style={styles.statValue}>{categoryData[0]?.[0] || 'N/A'}</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {categoryData.map(([cat, amt]) => {
          const percentage = ((amt / totalExpense) * 100).toFixed(1);
          const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Others;
          
          return (
            <View key={cat} style={styles.catRow}>
              <View style={styles.catInfo}>
                <View style={[styles.catDot, { backgroundColor: color }]} />
                <Text style={styles.catName}>{cat}</Text>
                <Text style={styles.catPercent}>{percentage}%</Text>
              </View>
              <Text style={styles.catAmt}>PKR {amt.toLocaleString()}</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border },
  title: { color: THEME.text, fontSize: 18, fontWeight: '900' },
  scrollContent: { paddingHorizontal: 20 },

  chartCard: { backgroundColor: THEME.surface, borderRadius: 24, padding: 20, marginTop: 10, borderWidth: 1, borderColor: THEME.border },
  cardTitle: { color: THEME.text, fontSize: 16, fontWeight: '800' },
  cardSubtitle: { color: THEME.textSecondary, fontSize: 12, marginBottom: 20 },
  chart: { marginVertical: 8, borderRadius: 16, marginLeft: -15 },

  statsRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  statItem: { flex: 1, backgroundColor: THEME.surface, padding: 15, borderRadius: 16, borderLeftWidth: 4, borderWidth: 1, borderColor: THEME.border },
  statLabel: { color: THEME.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 5 },
  statValue: { color: THEME.text, fontSize: 15, fontWeight: '900' },

  sectionTitle: { color: THEME.text, fontSize: 18, fontWeight: '900', marginTop: 30, marginBottom: 20 },
  
  catRow: { marginBottom: 20 },
  catInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catName: { color: THEME.text, flex: 1, fontSize: 14, fontWeight: '700' },
  catPercent: { color: THEME.textSecondary, fontSize: 12, fontWeight: '600' },
  catAmt: { color: THEME.text, fontSize: 14, fontWeight: '800', position: 'absolute', right: 0, top: 0 },
  progressBarBg: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  emptyText: { color: THEME.textSecondary, textAlign: 'center', fontSize: 14, fontWeight: '600' },
});
