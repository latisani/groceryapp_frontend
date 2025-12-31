{/*import React, { useEffect, useState } from 'react';
import { Text, View, TextInput,TouchableOpacity, FlatList, Button, Alert } from 'react-native';
import api from '../api';
import {useIsFocused, useScrollToTop} from '@react-navigation/native';

export default function MonthScreen ({navigation})  {
    const [lists, setLists] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() +1);
    const [title, setTitle] = useState('');
    const isFocused = useIsFocused();

    const load = async () =>{
        const res = await api.get('/lists/lists');
        setLists(res.data.lists);
    };

    useEffect(()=>{if (isFocused) load();}, [isFocused]);

    const create = async () => {
        try {
            const res = await api.post('/lists/list',{year, month, title});
            Alert.alert('List created');
            load();
        } catch (err) {
            Alert.alert('Error Adding List', err.response?.data?.message || err.message);
        }
    }

  return (
    <View style={{padding: 16}}>
        <Text> Create / open monthly list</Text>
        <TextInput keyboardType="number-pad" value={String(year)} onChangeText={t => setYear(Number(t))} style={{borderWidth:1, marginBottom: 8, padding: 8}} />
        <TextInput keyboardType="number-pad" value={String(month)} onChangeText={t => setMonth(Number(t))} style={{borderWidth:1, marginBottom: 8, padding: 8}} />
        <TextInput placeholder="Title (Optional)" value={title} onChangeText={setTitle} style={{borderWidth:1, marginBottom:8, padding: 8}}/>
        <Button title="Creat/Open List" onPress={create}/>

        <FlatList data={lists} keyExtractor={item =>String(item.id)} style={{marginTop: 20}}
         
         renderItem={({item}) =>(
            <TouchableOpacity onPress={() => navigation.navigate('Items', {listID: item.id, title:`${item.month}/${item.year}`})}>
                <View style={{padding: 12, borderBottomWidth: 1}}>
                    <Text>{item.title || `${item.month}/${item.year}`}</Text>
                </View>
            </TouchableOpacity>
         )}
        
        />
    </View>
  );
}
*/}
{/*
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import api from '../api';

export default function MonthScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [title, setTitle] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const isFocused = useIsFocused();

  const load = async () => {
    try {
      const res = await api.get('/lists/lists');
      setLists(res.data.lists);
    } catch (err) {
      Alert.alert('Error', 'Failed to load lists');
    }
  };

  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener(state =>{
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(!!online);
      if(online) syncOfflineLists()
    })
  })

  useEffect(() => {    
    if (isFocused) load();
  }, [isFocused]);

  const create = async () => {
    if (!year || !month) {
      return Alert.alert('Validation', 'Please enter a valid year and month.');
    }

    try {
      await api.post('/lists/list', { year, month, title });
      Alert.alert('Success', 'List created successfully!');
      setTitle('');
      load();
    } catch (err) {
      Alert.alert('Error Adding List', err.response?.data?.message || err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={lists}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={styles.header}>Create / Open Monthly List</Text>

              <TextInput
                keyboardType="number-pad"
                value={String(year)}
                onChangeText={t => setYear(Number(t))}
                style={styles.input}
                placeholder="Year (e.g. 2025)"
              />

              <TextInput
                keyboardType="number-pad"
                value={String(month)}
                onChangeText={t => setMonth(Number(t))}
                style={styles.input}
                placeholder="Month (1-12)"
              />

              <TextInput
                placeholder="Title (Optional)"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />

              <TouchableOpacity style={styles.button} onPress={create}>
                <Text style={styles.buttonText}>Create / Open List</Text>
              </TouchableOpacity>

              <Text style={styles.subHeader}>Your Lists</Text>
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Items', {
                  listID: item.id,
                  title: item.title || `${item.month}/${item.year}`,
                })
              }
            >
              <View style={styles.listItem}>
                <Text style={styles.listTitle}>
                  {item.title || `${item.month}/${item.year}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No lists yet. Create one above.</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 10,
    color: '#333',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
  },
});
*/}
/*
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';

export default function MonthScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [title, setTitle] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(!!online);
      if (online) syncOfflineLists();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isFocused) load();
  }, [isFocused]);

  const load = async () => {
    try {
      if (isOnline) {
        const res = await api.get('/lists/lists');
        setLists(res.data.lists);
        await AsyncStorage.setItem('lists_cache', JSON.stringify(res.data.lists));
      } else {
        const cached = await AsyncStorage.getItem('lists_cache');
        if (cached) setLists(JSON.parse(cached));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load lists');
    }
  };

  const create = async () => {
    if (!year || !month) {
      return Alert.alert('Validation', 'Please enter a valid year and month.');
    }

    const newList = { id: Date.now(), year, month, title, offline: !isOnline };

    if (isOnline) {
      try {
        await api.post('/lists/list', { year, month, title });
        Alert.alert('Success', 'List created successfully!');
        load();
      } catch (err) {
        Alert.alert('Error Adding List', err.response?.data?.message || err.message);
      }
    } else {
      Alert.alert('Offline', 'List saved locally and will sync when online.');
      const cached = JSON.parse((await AsyncStorage.getItem('lists_cache')) || '[]');
      const updated = [...cached, newList];
      await AsyncStorage.setItem('lists_cache', JSON.stringify(updated));
      setLists(updated);

      // store in offline queue
      const queue = JSON.parse((await AsyncStorage.getItem('offline_queue')) || '[]');
      queue.push(newList);
      await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
    }

    setTitle('');
  };

  const syncOfflineLists = async () => {
  try {
    const queue = JSON.parse((await AsyncStorage.getItem('offline_queue')) || '[]');
    if (queue.length === 0) return;

    let successCount = 0;
    for (const item of queue) {
      // ✅ Skip invalid entries
      if (!item.year || !item.month) continue;

      try {
        await api.post('/lists/list', {
          year: Number(item.year),
          month: Number(item.month),
          title: item.title || '',
        });
        successCount++;
      } catch (err) {
        console.log('Failed to sync one list:', err.response?.data || err.message);
      }
    }

    if (successCount > 0) {
      await AsyncStorage.removeItem('offline_queue');
      Alert.alert('Sync Complete', `${successCount} lists synced successfully.`);
      load();
    }
  } catch (err) {
    console.log('Sync failed:', err.message);
  }
};

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={lists}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={styles.header}>Create / Open Monthly List</Text>
              {!isOnline && <Text style={styles.offlineText}>Offline Mode: changes will sync later</Text>}

              <TextInput
                keyboardType="number-pad"
                value={String(year)}
                onChangeText={t => setYear(Number(t))}
                style={styles.input}
                placeholder="Year (e.g. 2025)"
              />

              <TextInput
                keyboardType="number-pad"
                value={String(month)}
                onChangeText={t => setMonth(Number(t))}
                style={styles.input}
                placeholder="Month (1-12)"
              />

              <TextInput
                placeholder="Title (Optional)"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />

              <TouchableOpacity style={styles.button} onPress={create}>
                <Text style={styles.buttonText}>Create / Open List</Text>
              </TouchableOpacity>

              <Text style={styles.subHeader}>Your Lists</Text>
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Items', {
                  listID: item.id,
                  title: item.title || `${item.month}/${item.year}`,
                })
              }
            >
              <View style={styles.listItem}>
                <Text style={styles.listTitle}>
                  {item.title || `${item.month}/${item.year}`}
                  {item.offline && <Text style={{ color: 'orange' }}> (Offline)</Text>}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No lists yet. Create one above.</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  offlineText: {
    color: 'red',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 10,
    color: '#333',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
  },
});
*/
/*
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';

export default function MonthScreen({ navigation }) {

  const [lists, setLists] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState("");      // ⭐ NEW BUDGET FIELD
  const [isOnline, setIsOnline] = useState(true);

  const isFocused = useIsFocused();

  // ------------------------------------
  // NETWORK LISTENER
  // ------------------------------------
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(!!online);
      if (online) syncOfflineLists();
    });
    return () => unsubscribe();
  }, []);

  // ------------------------------------
  // LOAD LISTS
  // ------------------------------------
  useEffect(() => {
    if (isFocused) load();
  }, [isFocused]);

  const load = async () => {
    try {
      if (isOnline) {
        const res = await api.get('/lists/lists');
        setLists(res.data.lists);
        await AsyncStorage.setItem('lists_cache', JSON.stringify(res.data.lists));
      } else {
        const cached = await AsyncStorage.getItem('lists_cache');
        if (cached) setLists(JSON.parse(cached));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load lists');
    }
  };

  // ------------------------------------
  // CREATE LIST (ONLINE & OFFLINE)
  // ------------------------------------
  const create = async () => {
    if (!year || !month) {
      return Alert.alert('Validation', 'Please enter a valid year and month.');
    }

    const newList = {
      id: Date.now(),
      year,
      month,
      title,
      budget: Number(budget) || 0,  // ⭐ Include budget
      offline: !isOnline
    };

    if (isOnline) {
      try {
        await api.post('/lists/list', {
          year,
          month,
          title,
          budget: Number(budget) || 0,  // ⭐ include budget in API
        });
        Alert.alert('Success', 'List created successfully!');
        load();
      } catch (err) {
        Alert.alert('Error Adding List', err.response?.data?.message || err.message);
      }
    } else {
      Alert.alert('Offline', 'List saved locally and will sync when online.');
      const cached = JSON.parse((await AsyncStorage.getItem('lists_cache')) || '[]');
      const updated = [...cached, newList];
      await AsyncStorage.setItem('lists_cache', JSON.stringify(updated));
      setLists(updated);

      const queue = JSON.parse((await AsyncStorage.getItem('offline_queue')) || '[]');
      queue.push(newList);
      await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
    }

    setTitle('');
    setBudget(""); // reset budget input
  };

  // ------------------------------------
  // SYNC OFFLINE LISTS TO SERVER
  // ------------------------------------
  const syncOfflineLists = async () => {
    try {
      const queue = JSON.parse((await AsyncStorage.getItem('offline_queue')) || '[]');
      if (queue.length === 0) return;

      let successCount = 0;
      for (const item of queue) {
        if (!item.year || !item.month) continue;

        try {
          await api.post('/lists/list', {
            year: Number(item.year),
            month: Number(item.month),
            title: item.title || "",
            budget: item.budget || 0, // ⭐ sync budget also
          });
          successCount++;
        } catch (err) {
          console.log('Failed to sync one list:', err.response?.data || err.message);
        }
      }

      if (successCount > 0) {
        await AsyncStorage.removeItem('offline_queue');
        Alert.alert('Sync Complete', `${successCount} lists synced successfully.`);
        load();
      }
    } catch (err) {
      console.log('Sync failed:', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={lists}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={styles.header}>Create / Open Monthly List</Text>
              {!isOnline && <Text style={styles.offlineText}>Offline Mode: changes will sync later</Text>}

              <TextInput
                keyboardType="number-pad"
                value={String(year)}
                onChangeText={t => setYear(Number(t))}
                style={styles.input}
                placeholder="Year (e.g. 2025)"
              />

              <TextInput
                keyboardType="number-pad"
                value={String(month)}
                onChangeText={t => setMonth(Number(t))}
                style={styles.input}
                placeholder="Month (1-12)"
              />

              <TextInput
                placeholder="Title (Optional)"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />

              {/* ⭐ NEW BUDGET INPUT }
              <TextInput
                keyboardType="numeric"
                placeholder="Monthly Budget (Optional)"
                value={budget}
                onChangeText={setBudget}
                style={styles.input}
              />

              <TouchableOpacity style={styles.button} onPress={create}>
                <Text style={styles.buttonText}>Create / Open List</Text>
              </TouchableOpacity>

              <Text style={styles.subHeader}>Your Lists</Text>
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Items', {
                  listID: item.id,
                  title: item.title || `${item.month}/${item.year}`,
                  budget: item.budget || 0, // pass budget to next screen
                })
              }
            >
              <View style={styles.listItem}>
                <Text style={styles.listTitle}>
                  {item.title || `${item.month}/${item.year}`}
                </Text>
                {item.budget > 0 && (
                  <Text style={{ color: "#28a745" }}>
                    Budget: R{item.budget.toFixed(2)}
                  </Text>
                )}
                {item.offline && <Text style={{ color: 'orange' }}> (Offline)</Text>}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No lists yet. Create one above.</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  offlineText: {
    color: 'red', fontWeight: '600', textAlign: 'center', marginBottom: 10,
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 10, backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff', borderRadius: 50,
    paddingVertical: 14, alignItems: 'center', marginVertical: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  subHeader: {
    fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 10, color: '#333',
  },
  listItem: {
    backgroundColor: '#fff', padding: 14, borderRadius: 10,
    marginBottom: 8, borderWidth: 1, borderColor: '#eee',
  },
  listTitle: { fontSize: 16, fontWeight: '500', color: '#222' },
  emptyText: { textAlign: 'center', marginTop: 16, color: '#666' },
});
*/
/*import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';

export default function MonthScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');

  const [isBudgetModal, setIsBudgetModal] = useState(false);

  const [isOnline, setIsOnline] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(!!online);
      if (online) syncOfflineLists();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isFocused) load();
  }, [isFocused]);

  const load = async () => {
    try {
      if (isOnline) {
        const res = await api.get('/lists/lists');
        setLists(res.data.lists);
        await AsyncStorage.setItem('lists_cache', JSON.stringify(res.data.lists));
      } else {
        const cached = await AsyncStorage.getItem('lists_cache');
        if (cached) setLists(JSON.parse(cached));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load lists');
    }
  };

  // ---------------------------
  // CREATE LIST → Opens Budget Modal
  // ---------------------------
  const openBudgetModal = () => {
    if (!year || !month) {
      return Alert.alert('Validation', 'Please enter a valid year and month.');
    }
    setIsBudgetModal(true);
  };

  // ---------------------------
  // SAVE LIST WITH BUDGET
  // ---------------------------
  const createList = async () => {
    if (!budget) {
      return Alert.alert('Validation', 'Please enter your monthly budget.');
    }

    const newList = {
      id: Date.now(),
      year,
      month,
      title,
      budget: Number(budget),
      spent: 0,
      offline: !isOnline,
    };

    if (isOnline) {
      try {
        await api.post('/lists/list', {
          year,
          month,
          title,
          budget: Number(budget),
        });

        Alert.alert('Success', 'List created successfully!');
        load();
      } catch (err) {
        Alert.alert('Error Adding List', err.response?.data?.message || err.message);
      }
    } else {
      Alert.alert('Offline', 'List saved locally and will sync when online.');

      const cached = JSON.parse((await AsyncStorage.getItem('lists_cache')) || '[]');
      const updated = [...cached, newList];

      await AsyncStorage.setItem('lists_cache', JSON.stringify(updated));
      setLists(updated);

      // Save to queue
      const queue = JSON.parse((await AsyncStorage.getItem('offline_queue')) || '[]');
      queue.push(newList);
      await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
    }

    setIsBudgetModal(false);
    setBudget('');
    setTitle('');
  };

  // ---------------------------
  // OFFLINE SYNC
  // ---------------------------
  const syncOfflineLists = async () => {
    try {
      const queue = JSON.parse((await AsyncStorage.getItem('offline_queue')) || '[]');
      if (queue.length === 0) return;

      let successCount = 0;

      for (const item of queue) {
        if (!item.year || !item.month) continue;
        try {
          await api.post('/lists/list', {
            year: Number(item.year),
            month: Number(item.month),
            title: item.title || '',
            budget: item.budget || 0,
          });
          successCount++;
        } catch (err) {}
      }

      if (successCount > 0) {
        await AsyncStorage.removeItem('offline_queue');
        Alert.alert('Sync Complete', `${successCount} lists synced successfully.`);
        load();
      }
    } catch (err) {}
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={lists}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={styles.header}>Create / Open Monthly List</Text>

              {!isOnline && (
                <Text style={styles.offlineText}>Offline Mode: changes will sync later</Text>
              )}

              <TextInput
                keyboardType="number-pad"
                value={String(year)}
                onChangeText={t => setYear(Number(t))}
                style={styles.input}
                placeholder="Year (e.g. 2025)"
              />

              <TextInput
                keyboardType="number-pad"
                value={String(month)}
                onChangeText={t => setMonth(Number(t))}
                style={styles.input}
                placeholder="Month (1-12)"
              />

              <TextInput
                placeholder="Title (Optional)"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />

              <TouchableOpacity style={styles.button} onPress={openBudgetModal}>
                <Text style={styles.buttonText}>Set Budget & Create List</Text>
              </TouchableOpacity>

              <Text style={styles.subHeader}>Your Lists</Text>
            </>
          }
          renderItem={({ item }) => {
            const remaining = (item.budget || 0) - (item.spent || 0);

            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Items', {
                    listID: item.id,
                    title: item.title || `${item.month}/${item.year}`,
                    budget: item.budget,
                  })
                }
              >
                <View style={styles.listItem}>
                  <Text style={styles.listTitle}>
                    {item.title || `${item.month}/${item.year}`}
                    {item.offline && <Text style={{ color: 'orange' }}> (Offline)</Text>}
                  </Text>

                  <Text style={styles.budgetText}>
                    Budget: R{item.budget || 0}
                  </Text>
                  <Text style={styles.remainingText}>
                    Remaining: R{remaining}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No lists yet. Create one above.</Text>
          }
        />
      </KeyboardAvoidingView>

      {/* -------------------------
          BUDGET MODAL
      -------------------------- }
      <Modal visible={isBudgetModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter Monthly Budget</Text>

            <TextInput
              placeholder="Budget Amount (R)"
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
              style={styles.modalInput}
            />

            <TouchableOpacity style={styles.modalButton} onPress={createList}>
              <Text style={styles.modalButtonText}>Save & Create</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsBudgetModal(false)}
              style={styles.modalCancel}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: '700', marginBottom:16, textAlign:'center' },
  offlineText: { color:'red', textAlign:'center', marginBottom:10 },
  input: { borderWidth:1, borderRadius:8, padding:12, marginBottom:10, backgroundColor:'#fff' },
  button: { backgroundColor:'#007bff', padding:14, borderRadius:50, alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'bold' },
  subHeader: { fontSize:18, fontWeight:'600', marginTop:24, marginBottom:10 },
  listItem: { backgroundColor:'#fff', padding:14, borderRadius:10, marginBottom:8, borderWidth:1, borderColor:'#eee' },
  listTitle: { fontSize:16, fontWeight:'500' },
  budgetText: { fontSize:14, color:'#007bff', marginTop:6 },
  remainingText: { fontSize:14, color:'green', fontWeight:'600' },
  emptyText: { textAlign:'center', color:'#777', marginTop:20 },

  modalOverlay: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.4)' },
  modalBox: { width:'85%', backgroundColor:'#fff', padding:20, borderRadius:15 },
  modalTitle: { fontSize:18, fontWeight:'700', marginBottom:10, textAlign:'center' },
  modalInput: { borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:12, marginBottom:20 },
  modalButton: { backgroundColor:'#007bff', padding:12, borderRadius:8, alignItems:'center' },
  modalButtonText: { color:'#fff', fontWeight:'bold' },
  modalCancel: { marginTop:10, alignItems:'center' },
  modalCancelText: { color:'red', fontWeight:'600' }
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import api from "../api";

export default function ItemsScreen({ route }) {
  const { listID, title } = route.params;
  const [items, setItems] = useState([]);
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);

  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
  const [tempBudget, setTempBudget] = useState("");

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(!!online);
      if (online) syncOfflineChanges();
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      if (isOnline) {
        const res = await api.get(`/lists/${listID}/items`);
        setItems(res.data.items || []);
        setBudget(res.data.budget || 0);

        await AsyncStorage.setItem(
          `items_${listID}`,
          JSON.stringify(res.data.items || [])
        );
        await AsyncStorage.setItem(`budget_${listID}`, String(res.data.budget || 0));
      } else {
        const cachedItems = await AsyncStorage.getItem(`items_${listID}`);
        const cachedBudget = await AsyncStorage.getItem(`budget_${listID}`);

        if (cachedItems) setItems(JSON.parse(cachedItems));
        if (cachedBudget) setBudget(Number(cachedBudget));
      }

      calculateSpent();
    } catch (err) {
      Alert.alert("Error", "Failed to load list items");
    }
  };

  const calculateSpent = () => {
    const total = items.filter(i => i.bought).reduce((sum, i) => sum + (i.price || 0), 0);
    setSpent(total);
  };

  const updateBudget = async () => {
    const newBudget = Number(tempBudget);
    if (!newBudget || newBudget < 1) {
      return Alert.alert("Invalid", "Please enter a valid budget amount.");
    }

    if (isOnline) {
      try {
        await api.put(`/lists/${listID}/budget`, { budget: newBudget });
      } catch (err) {
        Alert.alert("Error", "Failed to update budget on server");
      }
    } else {
      const queue = JSON.parse(
        (await AsyncStorage.getItem("offline_queue_budget")) || "[]"
      );
      queue.push({ listID, budget: newBudget });
      await AsyncStorage.setItem("offline_queue_budget", JSON.stringify(queue));

      Alert.alert("Offline", "Budget change saved and will sync later.");
    }

    setBudget(newBudget);
    await AsyncStorage.setItem(`budget_${listID}`, String(newBudget));

    setBudgetModalVisible(false);
  };

  const syncOfflineChanges = async () => {
    try {
      const queue = JSON.parse(
        (await AsyncStorage.getItem("offline_queue_budget")) || "[]"
      );
      if (queue.length === 0) return;

      for (const entry of queue) {
        try {
          await api.put(`/lists/${entry.listID}/budget`, { budget: entry.budget });
        } catch (err) {
          console.log("Failed to sync budget:", err.message);
        }
      }

      await AsyncStorage.removeItem("offline_queue_budget");
      load();
    } catch (err) {
      console.log("Sync failed:", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      <View style={styles.budgetBox}>
        <Text style={styles.budgetText}>Budget: R{budget}</Text>
        <Text style={styles.remainingText}>
          Remaining: R{budget - spent}
        </Text>

        <TouchableOpacity
          style={styles.editBudgetBtn}
          onPress={() => {
            setTempBudget(String(budget));
            setBudgetModalVisible(true);
          }}
        >
          <Text style={styles.editBudgetText}>Edit Budget</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.name}  {item.bought ? `(R${item.price})` : ""}
            </Text>
          </View>
        )}
      />

      {/* BUDGET MODAL }
      <Modal visible={isBudgetModalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Budget</Text>

            <TextInput
              placeholder="Enter new budget"
              keyboardType="numeric"
              value={tempBudget}
              onChangeText={setTempBudget}
              style={styles.modalInput}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={updateBudget}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setBudgetModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f8f8" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  budgetBox: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee"
  },
  budgetText: { fontSize: 18, fontWeight: "600" },
  remainingText: { fontSize: 16, color: "green", marginTop: 4 },
  editBudgetBtn: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    width: 120
  },
  editBudgetText: { color: "#fff", textAlign: "center" },

  item: {
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee"
  },
  itemText: { fontSize: 16 },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16
  },
  saveBtn: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  saveBtnText: { color: "#fff", textAlign: "center", fontSize: 16 },
  cancelBtn: { padding: 12 },
  cancelBtnText: { textAlign: "center", fontSize: 16, color: "#444" }
});

*/
/*
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';

export default function MonthScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [title, setTitle] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const isFocused = useIsFocused();

  // Budget modal states
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [budgetValue, setBudgetValue] = useState('');
  const [selectedListId, setSelectedListId] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(!!online);
      if (online) syncOfflineLists();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isFocused) load();
  }, [isFocused]);

  const load = async () => {
    try {
      if (isOnline) {
        const res = await api.get('/lists/lists');
        setLists(res.data.lists);
        await AsyncStorage.setItem('lists_cache', JSON.stringify(res.data.lists));
      } else {
        const cached = await AsyncStorage.getItem('lists_cache');
        if (cached) setLists(JSON.parse(cached));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load lists');
    }
  };

  const create = async () => {
    if (!year || !month)
      return Alert.alert('Validation', 'Please enter a valid year & month');

    try {
      if (isOnline) {
        await api.post('/lists/list', { year, month, title });
        Alert.alert('Success', 'List created successfully');
        load();
      } else {
        const newList = {
          id: Date.now(),
          year,
          month,
          title,
          offline: true,
        };

        const cached = JSON.parse((await AsyncStorage.getItem('lists_cache')) || '[]');
        const updated = [...cached, newList];
        await AsyncStorage.setItem('lists_cache', JSON.stringify(updated));
        setLists(updated);

        const queue = JSON.parse((await AsyncStorage.getItem('offline_queue')) || '[]');
        queue.push(newList);
        await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));

        Alert.alert('Offline', 'List saved offline & will sync later.');
      }
    } catch (err) {
      Alert.alert('Error Creating List', err.response?.data?.message || err.message);
    }

    setTitle('');
  };

  const syncOfflineLists = async () => {
    try {
      const queue = JSON.parse((await AsyncStorage.getItem('offline_queue')) || '[]');
      if (queue.length === 0) return;

      let successCount = 0;

      for (const item of queue) {
        if (!item.year || !item.month) continue;

        try {
          await api.post('/lists/list', {
            year: Number(item.year),
            month: Number(item.month),
            title: item.title || '',
          });
          successCount++;
        } catch (err) {}
      }

      if (successCount > 0) {
        await AsyncStorage.removeItem('offline_queue');
        load();
      }
    } catch (err) {}
  };

  // -----------------------------
  // OPEN BUDGET MODAL
  // -----------------------------
  const openBudgetModal = (id, currentBudget) => {
    setSelectedListId(id);
    setBudgetValue(currentBudget ? String(currentBudget) : '');
    setBudgetModalVisible(true);
  };

  // -----------------------------
  // SAVE / EDIT BUDGET
  // -----------------------------
  const saveBudget = async () => {
    if (!budgetValue.trim()) return Alert.alert('Enter a valid budget amount');

    try {
      await api.post('/lists/update-budget', {
        listId: selectedListId,
        budget: Number(budgetValue),
      });

      setBudgetModalVisible(false);
      setBudgetValue('');
      load();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={lists}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <>
              <Text style={styles.header}>Create / Open Monthly List</Text>

              <TextInput
                keyboardType="number-pad"
                value={String(year)}
                onChangeText={(t) => setYear(Number(t))}
                style={styles.input}
                placeholder="Year"
              />

              <TextInput
                keyboardType="number-pad"
                value={String(month)}
                onChangeText={(t) => setMonth(Number(t))}
                style={styles.input}
                placeholder="Month"
              />

              <TextInput
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholder="Optional Title"
              />

              <TouchableOpacity style={styles.button} onPress={create}>
                <Text style={styles.buttonText}>Create / Open</Text>
              </TouchableOpacity>

              <Text style={styles.subHeader}>Your Lists</Text>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Items', {
                    listId: item.id,  // <--- FIXED: use listId everywhere
                    title: item.title || `${item.month}/${item.year}`,
                    budget: item.budget
                  })
                }
                style={{ flex: 1 }}
              >
                <Text style={styles.listTitle}>
                  {item.title || `${item.month}/${item.year}`}
                </Text>

                {item.budget && (
                  <Text style={{ color: 'green', marginTop: 4 }}>
                    Budget: R {item.budget}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.budgetBtn}
                onPress={() => openBudgetModal(item.id, item.budget)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {item.budget ? 'Edit Budget' : 'Add Budget'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>

      {/* ---------- BUDGET MODAL ---------- }
      <Modal visible={budgetModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set Budget</Text>

            <TextInput
              keyboardType="numeric"
              value={budgetValue}
              onChangeText={setBudgetValue}
              style={styles.input}
              placeholder="Enter budget amount"
            />

            <TouchableOpacity style={styles.button} onPress={saveBudget}>
              <Text style={styles.buttonText}>Save Budget</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'gray' }]}
              onPress={() => setBudgetModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ------------------ STYLES ------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  budgetBtn: {
    backgroundColor: '#28a745',
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
});*/
// src/screens/MonthScreen.js
/*
import React, { useEffect, useState } from 'react';
import {
  Text, View, TextInput, TouchableOpacity, FlatList, Alert,
  KeyboardAvoidingView, Platform, Modal, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';

export default function MonthScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [title, setTitle] = useState('');
  const [budgetInput, setBudgetInput] = useState('');
  const [isBudgetModal, setIsBudgetModal] = useState(false);

  const [isOnline, setIsOnline] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      const online = !!(state.isConnected && state.isInternetReachable);
      setIsOnline(online);
      if (online) syncOfflineLists();
    });
    return () => unsub();
  }, []);

  useEffect(() => { if (isFocused) load(); }, [isFocused, isOnline]);

  const LISTS_CACHE_KEY = 'lists_cache';
  const OFFLINE_QUEUE_KEY = 'offline_queue';

  async function load() {
    try {
      if (isOnline) {
        const res = await api.get('/lists/lists');
        const fetched = res.data?.lists || [];
        setLists(fetched);
        await AsyncStorage.setItem(LISTS_CACHE_KEY, JSON.stringify(fetched));
      } else {
        const cached = await AsyncStorage.getItem(LISTS_CACHE_KEY);
        if (cached) setLists(JSON.parse(cached));
      }
    } catch (err) {
      console.warn('Failed to fetch lists, falling back to cache', err.message);
      const cached = await AsyncStorage.getItem(LISTS_CACHE_KEY);
      if (cached) setLists(JSON.parse(cached));
    }
  }

  const openCreateBudgetModal = () => {
    if (!year || !month) return Alert.alert('Validation', 'Enter year and month');
    setBudgetInput('');
    setIsBudgetModal(true);
  };

  // create list (online first, otherwise queue)
  const createList = async () => {
    const budget = Number(budgetInput) || 0;
    const newList = {
      id: Date.now(), // temporary id for client
      year,
      month,
      title,
      budget,
      spent: 0,
      offline: !isOnline
    };

    if (isOnline) {
      try {
        await api.post('/lists/list', { year, month, title, budget });
        Alert.alert('Success', 'List created');
        setIsBudgetModal(false);
        setTitle('');
        setBudgetInput('');
        load();
      } catch (err) {
        // If backend returns 404 or other error, queue as offline
        console.warn('Create list failed - queueing', err.response?.status, err.message);
        await queueAction({ type: 'CREATE_LIST', payload: newList });
        await saveLocalList(newList);
        setIsBudgetModal(false);
        setTitle('');
        setBudgetInput('');
        Alert.alert('Saved Locally', 'List saved locally and will sync later.');
      }
    } else {
      await queueAction({ type: 'CREATE_LIST', payload: newList });
      await saveLocalList(newList);
      setIsBudgetModal(false);
      setTitle('');
      setBudgetInput('');
      Alert.alert('Offline', 'List saved locally and will sync later.');
    }
  };

  const saveLocalList = async (listObj) => {
    const cached = JSON.parse((await AsyncStorage.getItem(LISTS_CACHE_KEY)) || '[]');
    const updated = [...cached, listObj];
    await AsyncStorage.setItem(LISTS_CACHE_KEY, JSON.stringify(updated));
    setLists(updated);
  };

  const queueAction = async (action) => {
    const queue = JSON.parse((await AsyncStorage.getItem(OFFLINE_QUEUE_KEY)) || '[]');
    queue.push(action);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  };

  const syncOfflineLists = async () => {
    try {
      const queue = JSON.parse((await AsyncStorage.getItem(OFFLINE_QUEUE_KEY)) || '[]');
      if (!queue.length) return;

      const remaining = [];
      for (const action of queue) {
        try {
          if (action.type === 'CREATE_LIST') {
            await api.post('/lists/list', {
              year: action.payload.year,
              month: action.payload.month,
              title: action.payload.title,
              budget: action.payload.budget || 0
            });
          } else {
            // other types might be handled elsewhere
          }
        } catch (err) {
          // if fails keep in remaining queue
          remaining.push(action);
        }
      }
      if (remaining.length === 0) {
        await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
      } else {
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
      }
      await load();
      if (queue.length - remaining.length > 0) {
        Alert.alert('Sync', `${queue.length - remaining.length} offline actions synced`);
      }
    } catch (err) {
      console.warn('syncOfflineLists failed', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
        <FlatList
          data={lists}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <>
              <Text style={styles.header}>Create / Open Monthly List</Text>
              {!isOnline && <Text style={styles.offlineText}>Offline Mode</Text>}

              <TextInput keyboardType="number-pad" value={String(year)} onChangeText={t => setYear(Number(t))} style={styles.input} placeholder="Year (e.g. 2025)" />
              <TextInput keyboardType="number-pad" value={String(month)} onChangeText={t => setMonth(Number(t))} style={styles.input} placeholder="Month (1-12)" />
              <TextInput placeholder="Title (Optional)" value={title} onChangeText={setTitle} style={styles.input} />

              <TouchableOpacity style={styles.button} onPress={openCreateBudgetModal}>
                <Text style={styles.buttonText}>Set Budget & Create List</Text>
              </TouchableOpacity>

              <Text style={styles.subHeader}>Your Lists</Text>
            </>
          }
          renderItem={({item}) => {
            const remaining = (item.budget || 0) - (item.spent || 0);
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('Items', {
                  listID: item.id,
                  title: item.title || `${item.month}/${item.year}`,
                  budget: item.budget || 0
                })}
              >
                <View style={styles.listItem}>
                  <Text style={styles.listTitle}>{item.title || `${item.month}/${item.year}`}{item.offline && <Text style={{color:'orange'}}> (Offline)</Text>}</Text>
                  <Text style={styles.budgetText}>Budget: R{(Number(item.budget || 0).toFixed(2))}</Text>
                  <Text style={[styles.remainingText, remaining < 0 ? {color:'red'} : {}]}>Remaining: R{remaining.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            )
          }}
          ListEmptyComponent={<Text style={styles.emptyText}>No lists yet. Create one above.</Text>}
        />
      </KeyboardAvoidingView>

      {/* Budget modal *}
      <Modal visible={isBudgetModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Monthly Budget (R)</Text>
            <TextInput keyboardType="numeric" placeholder="Enter budget" value={budgetInput} onChangeText={setBudgetInput} style={styles.modalInput} />
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:12}}>
              <TouchableOpacity style={[styles.modalBtn, {backgroundColor:'#ccc'}]} onPress={() => setIsBudgetModal(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, {backgroundColor:'#007bff'}]} onPress={createList}>
                <Text style={{color:'#fff'}}>Save & Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea:{flex:1, backgroundColor:'#f9f9f9'},
  container:{padding:16},
  header:{fontSize:22,fontWeight:'700',textAlign:'center',marginBottom:16},
  offlineText:{color:'red', textAlign:'center', marginBottom:8},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:12,marginBottom:10,backgroundColor:'#fff'},
  button:{backgroundColor:'#007bff',padding:14,borderRadius:50,alignItems:'center',marginVertical:10},
  buttonText:{color:'#fff', fontWeight:'bold'},
  subHeader:{fontSize:18,fontWeight:'600',marginTop:24,marginBottom:10},
  listItem:{backgroundColor:'#fff',padding:14,borderRadius:10,marginBottom:8,borderWidth:1,borderColor:'#eee'},
  listTitle:{fontSize:16,fontWeight:'500'},
  budgetText:{color:'#007bff', marginTop:6},
  remainingText:{color:'green', fontWeight:'600', marginTop:4},
  emptyText:{textAlign:'center', color:'#666', marginTop:16},
  modalOverlay:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.4)'},
  modalBox:{width:'85%',backgroundColor:'#fff',padding:16,borderRadius:12},
  modalTitle:{fontSize:18,fontWeight:'700',textAlign:'center',marginBottom:10},
  modalInput:{borderWidth:1,borderColor:'#ccc',padding:10,borderRadius:8,backgroundColor:'#fff'},
  modalBtn:{padding:12,borderRadius:8,minWidth:100,alignItems:'center'}
});
*/

//*******Working Code */
/*import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';

export default function MonthScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [editBudgetId, setEditBudgetId] = useState(null);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  const [isOnline, setIsOnline] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(!!online);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isFocused) loadLists();
  }, [isFocused]);

  const loadLists = async () => {
    try {
      if (isOnline) {
        const res = await api.get('/lists/lists');
        setLists(res.data.lists || []);
      } else {
        const cached = await AsyncStorage.getItem('lists_cache');
        if (cached) setLists(JSON.parse(cached));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load lists');
    }
  };

  // Create new list
  const createList = async () => {
    if (!year || !month) return Alert.alert('Validation', 'Enter year & month');
    try {
      const res = await api.post('/lists/list', {
        year: Number(year),
        month: Number(month),
        title,
      });

      const newListId = res.data.list.id;

      // Save budget if entered
      if (budget) {
        await api.post(`/lists/list/${newListId}/budget`, { budget: Number(budget) });
      }

      Alert.alert('Success', 'List created successfully');
      setTitle(''); setBudget('');
      loadLists();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  // Open modal to edit budget
  const openBudgetModal = (listId, currentBudget) => {
    setEditBudgetId(listId);
    setBudget(currentBudget?.toString() || '');
    setBudgetModalVisible(true);
  };

  // Save edited budget
  const saveBudget = async () => {
    if (!editBudgetId) return;
    try {
      await api.post(`/lists/list/${editBudgetId}/budget`, { budget: Number(budget) });
      setBudgetModalVisible(false);
      setEditBudgetId(null);
      setBudget('');
      loadLists();
      Alert.alert('Success', 'Budget updated');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={lists}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={
            <>
              <Text style={styles.header}>Create / Open Monthly List</Text>

              <TextInput
                keyboardType="number-pad"
                value={String(year)}
                onChangeText={t => setYear(Number(t))}
                style={styles.input}
                placeholder="Year (e.g. 2025)"
              />

              <TextInput
                keyboardType="number-pad"
                value={String(month)}
                onChangeText={t => setMonth(Number(t))}
                style={styles.input}
                placeholder="Month (1-12)"
              />

              <TextInput
                placeholder="Title (Optional)"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />

              <TextInput
                keyboardType="decimal-pad"
                placeholder="Budget (Optional)"
                value={budget}
                onChangeText={setBudget}
                style={styles.input}
              />

              <TouchableOpacity style={styles.button} onPress={createList}>
                <Text style={styles.buttonText}>Create / Open List</Text>
              </TouchableOpacity>

              <Text style={styles.subHeader}>Your Lists</Text>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Items', {
                    listID: item.id,
                    title: item.title || `${item.month}/${item.year}`,
                  })
                }
              >
                <Text style={styles.listTitle}>
                  {item.title || `${item.month}/${item.year}`}
                </Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text>Budget: R{Number(item.budget || 0).toFixed(2)}</Text>
                <TouchableOpacity onPress={() => openBudgetModal(item.id, item.budget)}>
                  <Text style={{ color: 'blue' }}>Edit Budget</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Budget modal *}
        <Modal visible={budgetModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Edit Budget</Text>
              <TextInput
                keyboardType="decimal-pad"
                placeholder="Enter budget"
                value={budget}
                onChangeText={setBudget}
                style={styles.input}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <TouchableOpacity onPress={() => setBudgetModalVisible(false)}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveBudget}>
                  <Text style={{ color: 'green', fontWeight: 'bold' }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: '700', marginBottom: 16, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 10, backgroundColor: '#fff' },
  button: { backgroundColor: '#007bff', borderRadius: 50, paddingVertical: 14, alignItems: 'center', marginVertical: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  subHeader: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 10, color: '#333' },
  listItem: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  listTitle: { fontSize: 16, fontWeight: '500', color: '#222' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 16, borderRadius: 8 },
});*/


import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';
import { Ionicons } from '@expo/vector-icons'; // Import icons for delete button

export default function MonthScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [editBudgetId, setEditBudgetId] = useState(null);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  const [isOnline, setIsOnline] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(!!online);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isFocused) loadLists();
  }, [isFocused]);

  const loadLists = async () => {
    try {
      if (isOnline) {
        const res = await api.get('/lists/lists');
        setLists(res.data.lists || []);
      } else {
        const cached = await AsyncStorage.getItem('lists_cache');
        if (cached) setLists(JSON.parse(cached));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load lists');
    }
  };

  // Create new list
  const createList = async () => {
    if (!year || !month) return Alert.alert('Validation', 'Enter year & month');
    try {
      const res = await api.post('/lists/list', {
        year: Number(year),
        month: Number(month),
        title,
      });

      const newListId = res.data.list.id;

      // Save budget if entered
      if (budget) {
        await api.post(`/lists/list/${newListId}/budget`, { budget: Number(budget) });
      }

      Alert.alert('Success', 'List created successfully');
      setTitle(''); setBudget('');
      loadLists();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  // Open modal to edit budget
  const openBudgetModal = (listId, currentBudget) => {
    setEditBudgetId(listId);
    setBudget(currentBudget?.toString() || '');
    setBudgetModalVisible(true);
  };

  // Save edited budget
  const saveBudget = async () => {
    if (!editBudgetId) return;
    try {
      await api.post(`/lists/list/${editBudgetId}/budget`, { budget: Number(budget) });
      setBudgetModalVisible(false);
      setEditBudgetId(null);
      setBudget('');
      loadLists();
      Alert.alert('Success', 'Budget updated');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  // Confirm delete list
  const confirmDeleteList = (listId, listTitle) => {
    setListToDelete({ id: listId, title: listTitle });
    setDeleteConfirmModal(true);
  };

  // Delete list
  const deleteList = async () => {
    if (!listToDelete) return;
    
    try {
      await api.delete(`/lists/list/${listToDelete.id}`);
      
      // Remove from local state
      setLists(lists.filter(list => list.id !== listToDelete.id));
      
      // Update cache if offline
      if (!isOnline) {
        const cachedLists = lists.filter(list => list.id !== listToDelete.id);
        await AsyncStorage.setItem('lists_cache', JSON.stringify(cachedLists));
      }
      
      Alert.alert('Success', 'List deleted successfully');
      setDeleteConfirmModal(false);
      setListToDelete(null);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to delete list');
      setDeleteConfirmModal(false);
      setListToDelete(null);
    }
  };

  // Render list item
  const renderListItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemHeader}>
        <TouchableOpacity
          style={styles.listTitleContainer}
          onPress={() =>
            navigation.navigate('Items', {
              listID: item.id,
              title: item.title || `${item.month}/${item.year}`,
            })
          }
        >
          <Text style={styles.listTitle}>
            {item.title || `${item.month}/${item.year}`}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => confirmDeleteList(item.id, item.title || `${item.month}/${item.year}`)}
        >
          <Ionicons name="trash-outline" size={22} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.listItemDetails}>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>Budget:</Text>
          <Text style={styles.budgetAmount}>R{Number(item.budget || 0).toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.editBudgetButton}
          onPress={() => openBudgetModal(item.id, item.budget)}
        >
          <Text style={styles.editBudgetText}>Edit Budget</Text>
        </TouchableOpacity>
      </View>
      
      {item.created_at && (
        <Text style={styles.createdDate}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={lists}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.header}>Monthly Shopping Lists</Text>
                <Text style={styles.subtitle}>Create and manage your monthly lists</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.formRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Year</Text>
                    <TextInput
                      keyboardType="number-pad"
                      value={String(year)}
                      onChangeText={t => setYear(Number(t))}
                      style={styles.input}
                      placeholder="2025"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Month</Text>
                    <TextInput
                      keyboardType="number-pad"
                      value={String(month)}
                      onChangeText={t => setMonth(Number(t))}
                      style={styles.input}
                      placeholder="1-12"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Title (Optional)</Text>
                  <TextInput
                    placeholder="e.g., Groceries for April"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Budget (Optional)</Text>
                  <TextInput
                    keyboardType="decimal-pad"
                    placeholder="e.g., 5000"
                    value={budget}
                    onChangeText={setBudget}
                    style={styles.input}
                  />
                </View>

                <TouchableOpacity style={styles.createButton} onPress={createList}>
                  <Text style={styles.createButtonText}>Create / Open List</Text>
                  <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>

              {lists.length > 0 ? (
                <View style={styles.listsHeader}>
                  <Text style={styles.listsTitle}>Your Lists ({lists.length})</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="document-text-outline" size={60} color="#ccc" />
                  <Text style={styles.emptyText}>No lists yet</Text>
                  <Text style={styles.emptySubText}>Create your first monthly list above</Text>
                </View>
              )}
            </>
          }
          renderItem={renderListItem}
          ListFooterComponent={<View style={{ height: 30 }} />}
        />

        {/* Budget Edit Modal */}
        <Modal visible={budgetModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Budget</Text>
              <TextInput
                keyboardType="decimal-pad"
                placeholder="Enter budget amount"
                value={budget}
                onChangeText={setBudget}
                style={styles.modalInput}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setBudgetModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={saveBudget}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal visible={deleteConfirmModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.deleteIconContainer}>
                <Ionicons name="warning" size={50} color="#ff4444" />
              </View>
              <Text style={styles.deleteModalTitle}>Delete List</Text>
              <Text style={styles.deleteModalText}>
                Are you sure you want to delete "{listToDelete?.title}"?
              </Text>
              <Text style={styles.deleteWarningText}>
                This action cannot be undone. All items in this list will be permanently deleted.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => {
                    setDeleteConfirmModal(false);
                    setListToDelete(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.deleteConfirmButton]} 
                  onPress={deleteList}
                >
                  <Text style={styles.deleteConfirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  listContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    marginBottom: 16,
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listsHeader: {
    marginBottom: 16,
  },
  listsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitleContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
  },
  listItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 6,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  editBudgetButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  editBudgetText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
  createdDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 12,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteWarningText: {
    fontSize: 14,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  deleteConfirmButton: {
    backgroundColor: '#ff4444',
  },
  deleteConfirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});