{/*import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import api from '../api';
import { LineChart, BarChart } from 'react-native-chart-kit';

export default function DashboardScreen() {
  const [monthly, setMonthly] = useState([]);
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    loadMonthly();
    // load daily for current month
    const now = new Date(); loadDaily(now.getFullYear(), now.getMonth()+1);
  }, []);

  const loadMonthly = async () => {
    const res = await api.get('/dashboard/monthly-totals');
    setMonthly(res.data.monthly || []);
  };

  const loadDaily = async (y,m) => {
    const res = await api.get(`/dashboard/daily-totals/${y}/${m}`);
    setDaily(res.data.daily || []);
  };

  // prepare chart data
  const monthlyLabels = monthly.map(r => `${r.month}/${r.year}`).slice(0,6).reverse();
  const monthlyData = monthly.map(r => Number(r.total)).slice(0,6).reverse();

  const dailyLabels = daily.map(d => (new Date(d.date)).getDate());
  const dailyData = daily.map(d => Number(d.total));

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={{ padding: 12 }}>
      <Text style={{ fontSize:18, fontWeight:'bold' }}>Monthly Expenditure</Text>
      {monthlyData.length ? (
        <BarChart
          data={{ labels: monthlyLabels, datasets: [{ data: monthlyData }] }} 
          width={screenWidth - 24}
          height={220}
          yAxisLabel="R "
          fromZero
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, 
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
            propsForDots: { r: "4" } 
          }}
          style={{ marginVertical: 8, borderRadius: 8 }}
        />

      ) : <Text>No monthly data</Text>}

      <Text style={{ fontSize:18, fontWeight:'bold', marginTop:16 }}>Daily Totals (current month)</Text>
      {dailyData.length ? (
        <LineChart
          data={{ labels: dailyLabels.map(String), datasets: [{ data: dailyData }] }}
          width={screenWidth - 24}
          height={220}
          yAxisLabel="R "
          fromZero
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // <-- must be a function
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{ marginVertical: 8, borderRadius: 8 }}
        />

      ) : <Text>No daily data</Text>}
    </ScrollView>
  );
}*/}
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api';
import { LineChart, BarChart } from 'react-native-chart-kit';

export default function DashboardScreen() {
  const [monthly, setMonthly] = useState([]);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadMonthly();
        const now = new Date();
        await loadDaily(now.getFullYear(), now.getMonth() + 1);
      } catch (error) {
        console.error('Dashboard load error:', error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const loadMonthly = async () => {
    const res = await api.get('/dashboard/monthly-totals');
    setMonthly(res.data.monthly || []);
  };

  const loadDaily = async (y, m) => {
    const res = await api.get(`/dashboard/daily-totals/${y}/${m}`);
    setDaily(res.data.daily || []);
  };

  // prepare chart data
  const monthlyLabels = monthly.map(r => `${r.month}/${r.year}`).slice(0, 6).reverse();
  const monthlyData = monthly.map(r => Number(r.total)).slice(0, 6).reverse();

  const dailyLabels = daily.map(d => new Date(d.date).getDate());
  const dailyData = daily.map(d => Number(d.total));

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 8 }}>Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Dashboard</Text>

        {/* Monthly Expenditure */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Monthly Expenditure</Text>
          {monthlyData.length ? (
            <BarChart
              data={{
                labels: monthlyLabels,
                datasets: [{ data: monthlyData }],
              }}
              width={screenWidth - 32}
              height={220}
              yAxisLabel="R "
              fromZero
              chartConfig={chartConfig('#007bff')}
              style={styles.chart}
            />
          ) : (
            <Text>No monthly data available</Text>
          )}
        </View>

        {/* Daily Totals */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Daily Totals (Current Month)</Text>
          {dailyData.length ? (
            <LineChart
              data={{
                labels: dailyLabels.map(String),
                datasets: [{ data: dailyData }],
              }}
              width={screenWidth - 32}
              height={220}
              yAxisLabel="R "
              fromZero
              chartConfig={chartConfig('#28a745')}
              style={styles.chart}
            />
          ) : (
            <Text>No daily data available</Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// chart configuration helper
const chartConfig = (color) => ({
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: { r: '4' },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  chart: {
    borderRadius: 8,
  },
});

