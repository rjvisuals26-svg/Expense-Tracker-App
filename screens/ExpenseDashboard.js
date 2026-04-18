import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BASE_URL from '../src/api/apiConfig';



// LayoutAnimation initialization removed for New Architecture support

const { width } = Dimensions.get('window');

// ─── THEME DEFINITION (Emerald Slate) ──────────────────────────
const THEME = {
  bg: '#0F172A', // Deep Slate
  surface: '#1E293B',
  card: '#334155',
  primary: '#10B981', // Emerald Green
  secondary: '#3B82F6', // Financial Blue
  accent: '#F59E0B', 
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  income: '#10B981',
  expense: '#EF4444',
  border: 'rgba(255, 255, 255, 0.06)',
};

const CATEGORY_ICONS = {
  'Salary': { icon: 'wallet-outline', color: '#10B981' },
  'Rent': { icon: 'home-outline', color: '#3B82F6' },
  'Shopping': { icon: 'cart-outline', color: '#F59E0B' },
  'Travel': { icon: 'car-outline', color: '#EF4444' },
  'Food': { icon: 'fast-food-outline', color: '#8B5CF6' },
  'Groceries': { icon: 'basket-outline', color: '#EC4899' },
  'Bills': { icon: 'receipt-outline', color: '#6366F1' },
  'Others': { icon: 'apps-outline', color: '#94A3B8' }
};

// ─── MINI COMPONENTS ───────────────────────────────────────────

const SummaryCard = ({ label, value, type, icon }) => (
  <View style={styles.summaryCard}>
    <View style={[styles.sumIconWrap, { backgroundColor: type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
      <Ionicons name={icon} size={18} color={type === 'income' ? THEME.income : THEME.expense} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.sumLabel}>{label}</Text>
      <Text style={[styles.sumValue, { color: type === 'income' ? THEME.income : THEME.expense }]} numberOfLines={1} adjustsFontSizeToFit>
        PKR {value.toLocaleString()}
      </Text>
    </View>
  </View>
);

const TransactionItem = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 50, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, [item.id]);

  const cat = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.Others;
  const isIncome = item.type === 'income';

  return (
    <Animated.View style={[styles.transCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={[styles.transIconBox, { backgroundColor: cat.color + '15' }]}>
        <Ionicons name={cat.icon} size={24} color={cat.color} />
      </View>
      <View style={styles.transMain}>
        <Text style={styles.transTitle}>{item.title}</Text>
        <Text style={styles.transDate}>{new Date(item.created_at || Date.now()).toLocaleDateString()}</Text>
      </View>
      <View style={styles.transRight}>
        <Text style={[styles.transAmt, { color: isIncome ? THEME.income : THEME.expense }]}>
          {isIncome ? '+' : '-'} {item.amount.toLocaleString()}
        </Text>
        <View style={styles.catBadge}>
          <Text style={[styles.catText, { color: cat.color }]}>{item.category}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function ExpenseDashboard({ goBack, onOpenReports }) {
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/transactions`);
      const data = await resp.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const stats = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      const amt = parseFloat(curr.amount);
      if (curr.type === 'income') acc.income += amt;
      else acc.expense += amt;
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions]);

  const filteredData = useMemo(() => {
    if (filter === 'All') return transactions;
    return transactions.filter(t => t.type === filter.toLowerCase());
  }, [transactions, filter]);

  const handleFilterChange = (newFilter) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilter(newFilter);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backCircle} onPress={goBack}>
          <Ionicons name="chevron-back" size={24} color={THEME.text} />
        </TouchableOpacity>
        <View style={styles.greetingBox}>
          <Text style={styles.greetingText}>Good Afternoon,</Text>
          <Text style={styles.userName}>Rukhsar</Text>
        </View>
        <TouchableOpacity style={[styles.backCircle, { marginRight: 15 }]} onPress={onOpenReports}>
          <Ionicons name="stats-chart-outline" size={20} color={THEME.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarWrap}>
          <LinearGradient colors={[THEME.primary, THEME.secondary]} style={styles.avatar}>
            <Text style={styles.avatarLetter}>R</Text>
          </LinearGradient>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Main Balance Card */}
      <View style={styles.balanceContainer}>
        <LinearGradient
          colors={[THEME.primary, '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceVal}>PKR {(stats.income - stats.expense).toLocaleString()}</Text>
        </LinearGradient>
      </View>

      <TouchableOpacity style={styles.insightButton} onPress={onOpenReports}>
        <Feather name="bar-chart-2" size={16} color={THEME.primary} />
        <Text style={styles.insightText}>View Detailed Insights</Text>
        <Ionicons name="chevron-forward" size={14} color={THEME.textMuted} />
      </TouchableOpacity>

      {/* Income/Expense Summary */}
      <View style={styles.summaryRow}>
        <SummaryCard label="Income" value={stats.income} type="income" icon="arrow-down" />
        <SummaryCard label="Expense" value={stats.expense} type="expense" icon="arrow-up" />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {['All', 'Income', 'Expense'].map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => handleFilterChange(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={THEME.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item, index }) => <TransactionItem item={item} index={index} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.primary} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions found for this category.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  listContent: { paddingBottom: 40 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { padding: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  backCircle: { width: 44, height: 44, borderRadius: 12, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border },
  greetingBox: { flex: 1, marginLeft: 15 },
  greetingText: { color: THEME.textSecondary, fontSize: 13, fontWeight: '500' },
  userName: { color: THEME.text, fontSize: 22, fontWeight: '900' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  notificationDot: { position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: THEME.expense, borderWidth: 2, borderColor: THEME.bg },

  balanceContainer: { marginBottom: 20 },
  balanceCard: { borderRadius: 24, padding: 25, elevation: 15, shadowColor: THEME.primary, shadowOpacity: 0.3, shadowRadius: 20 },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  balanceVal: { color: '#FFF', fontSize: 36, fontWeight: '900', marginVertical: 10 },
  balanceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },

  summaryRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  summaryCard: { flex: 1, backgroundColor: THEME.surface, padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: THEME.border },
  sumIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sumLabel: { color: THEME.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 2 },
  sumValue: { fontSize: 14, fontWeight: '900' },

  filterContainer: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border },
  filterChipActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  filterText: { color: THEME.textSecondary, fontSize: 14, fontWeight: '700' },
  filterTextActive: { color: '#FFF', fontWeight: '900' },

  sectionTitle: { color: THEME.text, fontSize: 20, fontWeight: '900', marginBottom: 20 },
  emptyText: { color: THEME.textSecondary, textAlign: 'center', marginTop: 40, fontSize: 15 },

  transCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: THEME.border },
  transIconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  transMain: { flex: 1, marginLeft: 15 },
  transTitle: { color: THEME.text, fontSize: 15, fontWeight: '800', marginBottom: 4 },
  transDate: { color: THEME.textMuted, fontSize: 13, fontWeight: '600' },
  transRight: { alignItems: 'flex-end' },
  transAmt: { fontSize: 16, fontWeight: '900', marginBottom: 6 },
  catBadge: { backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  catText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  insightButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, padding: 15, borderRadius: 16, marginBottom: 25, marginHorizontal: 20, borderWidth: 1, borderColor: THEME.border, gap: 10 },
  insightText: { color: THEME.text, flex: 1, fontSize: 13, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 35, right: 25, width: 68, height: 68, borderRadius: 34, elevation: 20, shadowColor: THEME.primary, shadowOpacity: 0.6, shadowRadius: 25, shadowOffset: { width: 0, height: 10 } },
  fabGrad: { flex: 1, borderRadius: 34, justifyContent: 'center', alignItems: 'center' },
});
