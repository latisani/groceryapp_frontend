/*import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import api from '../api';

export default function ItemListScreen ({route, navigation}) {

    const {listID} = route.params;
    const [items, setItems] =useState([]);
    const [itemName,setItemName] = useState('');
    const [qty, setQty] = useState('1');

    const load = async () =>{
        const res = await api.get(`/lists/list/${listID}/items`);
        setItems(res.data.items);
    };

    useEffect(()=>{load();}, []);
    const addItem = async () =>{
        try {
            await api.post(`/lists/list/${listID}/item`, {itemName, qty: Number(qty)});
            setItemName(''); setQty('1');
            load();
        } catch (err) {
            Alert.alert('Error Adding Item', err.response?.data?.message || err.message);
        }
    };

    const buyItem = async (itemID) =>{
        const price = prompt("Enter item price");
        if(!price) return;
        try {
            await api.post(`/lists/item/${itemID}/buy`, {price: Number(price), date_bought: new Date()});
            load();
        } catch (err) {
            Alert.alert('Error adding price', err.response?.data?.message || err.message);
        }
    }

  return (
    <View style={{padding: 12}}>
        <Text>Add Item</Text>
        <TextInput value={itemName} onChangeText={setItemName} placeholder="Tastic Rice" style={{borderWidth: 1, padding: 8, marginBottom: 8}}/>
        <TextInput value={qty} onChangeText={setQty} keyboardType="number-pad" style={{borderWidth: 1, padding: 8, marginBottom: 8}}/>
        <Button title="Add" onPress={addItem}/>

        <FlatList data={items} keyExtractor={i=>String(i.id)} renderItem={({item})=>(
            <View style={{padding: 12, borderBottomWidth: 1}}>
                <Text>{item.itemName} x{item.qty}</Text>
                <Text>Bought: {item.bought ? 'Yes' : 'No'} {item.bought && `Price: ${item.price}`}</Text>
                {!item.bought && <Button title="Mark bought" onPress={() => buyItem(item.id)}/>}
            </View>

        )}/>
    </View>
  );
}*/
/*
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import api from '../api';

export default function ItemListScreen({ route, navigation }) {
  const { listID } = route.params;
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');

  const loadItems = async () => {
    try {
      const res = await api.get(`/lists/list/${listID}/items`);
      setItems(res.data.items || []);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const addItem = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter an item name.');
      return;
    }

    try {
      await api.post(`/lists/list/${listID}/item`, {
        name,
        quantity: Number(quantity),
      });
      setName('');
      setQuantity('1');
      loadItems();
    } catch (err) {
      Alert.alert('Error Adding Item', err.response?.data?.message || err.message);
    }
  };

  const buyItem = async (itemID) => {
    const price = prompt('Enter item price');
    if (!price) return;

    try {
      await api.post(`/lists/item/${itemID}/buy`, {
        price: Number(price),
        date_bought: new Date(),
      });
      loadItems();
    } catch (err) {
      Alert.alert('Error adding price', err.response?.data?.message || err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>
        {item.name} x{item.quantity}
      </Text>
      <Text style={{ marginVertical: 4 }}>
        Bought: {item.bought ? '✅ Yes' : '❌ No'}
        {item.bought && ` | Price: R${item.price}`}
      </Text>
      {!item.bought && <Button title="Mark as Bought" onPress={() => buyItem(item.id)} />}
    </View>
  );

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Add Item</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Tastic Rice"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 4 }}
      />
      <TextInput
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 4 }}
      />
      <Button title="Add Item" onPress={addItem} />

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ marginTop: 20, textAlign: 'center' }}>No items yet.</Text>}
      />
    </View>
  );
}*/

// src/screens/ItemListScreen.js
{/*
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity, Modal, StyleSheet
} from 'react-native';
import api from '../api';

export default function ItemListScreen({ route, navigation }) {
  const { listID, title } = route.params;
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const loadItems = async () => {
    try {
      const res = await api.get(`/lists/list/${listID}/items`);
      setItems(res.data.items || []);
    } catch (err) {
      console.error('Load items error:', err);
      Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to load items');
    }
  };

  useEffect(() => { loadItems(); }, []);

  const addItem = async () => {
    if (!name.trim()) { Alert.alert('Validation', 'Please enter an item name'); return; }
    try {
      await api.post(`/lists/list/${listID}/item`, { name, quantity: Number(quantity) });
      setName(''); setQuantity('1');
      loadItems();
    } catch (err) {
      console.error('Add item error:', err);
      Alert.alert('Error Adding Item', err.response?.data?.message || err.message);
    }
  };

  // Open modal for price entry
  const openBuyModal = (itemId) => {
    setSelectedItemId(itemId);
    setPriceInput('');
    setModalVisible(true);
  };

  // Call backend to mark bought
  const confirmBuy = async () => {
    if (!priceInput || isNaN(Number(priceInput))) {
      Alert.alert('Validation', 'Enter a valid numeric price');
      return;
    }
    try {
      // endpoint expected: POST /lists/item/:itemId/buy
      const res = await api.post(`/lists/item/${selectedItemId}/buy`, {
        price: Number(priceInput),
        date_bought: new Date().toISOString().slice(0,10) // YYYY-MM-DD
      });
      setModalVisible(false);
      setSelectedItemId(null);
      loadItems();
      Alert.alert('Success', res.data?.message || 'Marked as bought');
    } catch (err) {
      console.error('Mark bought error:', err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      Alert.alert('Error', serverMsg);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={{flex:1}}>
        <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
        <Text style={styles.itemMeta}>
          Bought: {item.bought ? '✅ Yes' : '❌ No'}
          {item.bought && ` | Price: R${Number(item.price).toFixed(2)}`}
        </Text>
      </View>

      {!item.bought ? (
        <Button title="Mark bought" onPress={() => openBuyModal(item.id)} />
      ) : (
        <TouchableOpacity style={styles.disabledBtn}>
          <Text>Bought</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{padding:12, flex:1}}>
      <Text style={{fontSize:18, fontWeight:'bold', marginBottom:8}}>{title || 'Items'}</Text>

      <TextInput
        placeholder="Item name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
        style={styles.input}
      />
      <Button title="Add Item" onPress={addItem} />

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        style={{marginTop:12}}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>No items yet</Text>}
      />

      
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight:'bold', marginBottom:8}}>Enter price</Text>
            <TextInput
              placeholder="e.g. 100.50"
              value={priceInput}
              onChangeText={setPriceInput}
              keyboardType="decimal-pad"
              style={styles.input}
            />
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:12}}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Confirm" onPress={confirmBuy} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  input: { borderWidth:1, borderColor:'#ccc', padding:8, marginBottom:8, borderRadius:6 },
  itemRow: { padding:12, borderBottomWidth:1, borderColor:'#eee', flexDirection:'row', alignItems:'center' },
  itemName: { fontSize:16, fontWeight:'600' },
  itemMeta: { color:'#666', marginTop:4 },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', padding:20 },
  modalContent: { backgroundColor:'#fff', padding:16, borderRadius:8 }
};
*/}
/*
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';

export default function ItemListScreen({ route }) {
  const { listID, title } = route.params;
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [total, setTotal] = useState(0);
  const [isOffline, setIsOffline] = useState(false);

  // Load data from server or cache
  const loadItems = async () => {
    const localKey = `items_${listID}`;

    const netState = await NetInfo.fetch();
    setIsOffline(!netState.isConnected);

    if (netState.isConnected) {
      try {
        const res = await api.get(`/lists/list/${listID}/items`);
        const fetchedItems = res.data.items || [];
        setItems(fetchedItems);
        await AsyncStorage.setItem(localKey, JSON.stringify(fetchedItems));
        calculateTotal(fetchedItems);
      } catch (err) {
        console.error('Error loading items:', err);
        Alert.alert('Error', 'Failed to load items');
      }
    } else {
      // Load from local storage when offline
      const cached = await AsyncStorage.getItem(localKey);
      if (cached) {
        const cachedItems = JSON.parse(cached);
        setItems(cachedItems);
        calculateTotal(cachedItems);
      }
    }
  };

  const calculateTotal = (list) => {
    const sum = list.filter(i => i.bought).reduce((acc, cur) => acc + (Number(cur.price) || 0), 0);
    setTotal(sum);
  };

  useEffect(() => {
    loadItems();
    const unsubscribe = NetInfo.addEventListener(state => setIsOffline(!state.isConnected));
    return () => unsubscribe();
  }, []);

  // Save actions for later if offline
  const queueAction = async (action) => {
    const queue = JSON.parse(await AsyncStorage.getItem('pendingActions') || '[]');
    queue.push(action);
    await AsyncStorage.setItem('pendingActions', JSON.stringify(queue));
  };

  const syncQueuedActions = async () => {
    const queue = JSON.parse(await AsyncStorage.getItem('pendingActions') || '[]');
    if (queue.length === 0) return;

    for (const action of queue) {
      try {
        if (action.type === 'ADD_ITEM') {
          await api.post(`/lists/list/${action.listID}/item`, action.payload);
        } else if (action.type === 'BUY_ITEM') {
          await api.post(`/lists/item/${action.itemID}/buy`, action.payload);
        }
      } catch (e) {
        console.error('Sync error for action:', action, e.message);
      }
    }

    await AsyncStorage.removeItem('pendingActions');
    loadItems();
  };

  useEffect(() => {
    if (!isOffline) syncQueuedActions();
  }, [isOffline]);

  const addItem = async () => {
    if (!name.trim()) return Alert.alert('Validation', 'Please enter an item name');

    const newItem = { id: Date.now(), name, quantity: Number(quantity), bought: false };
    const updated = [...items, newItem];
    setItems(updated);
    calculateTotal(updated);
    await AsyncStorage.setItem(`items_${listID}`, JSON.stringify(updated));

    if (isOffline) {
      await queueAction({ type: 'ADD_ITEM', listID, payload: { name, quantity: Number(quantity) } });
      Alert.alert('Offline', 'Item will sync when back online.');
    } else {
      try {
        await api.post(`/lists/list/${listID}/item`, { name, quantity: Number(quantity) });
        loadItems();
      } catch (err) {
        Alert.alert('Error', err.response?.data?.message || err.message);
      }
    }

    setName('');
    setQuantity('1');
  };

  const confirmBuy = async () => {
    if (!priceInput || isNaN(Number(priceInput))) return Alert.alert('Validation', 'Enter a valid price');

    const updatedItems = items.map((i) =>
      i.id === selectedItemId ? { ...i, bought: true, price: Number(priceInput) } : i
    );
    setItems(updatedItems);
    calculateTotal(updatedItems);
    await AsyncStorage.setItem(`items_${listID}`, JSON.stringify(updatedItems));

    if (isOffline) {
      await queueAction({
        type: 'BUY_ITEM',
        itemID: selectedItemId,
        payload: { price: Number(priceInput), date_bought: new Date().toISOString().slice(0, 10) },
      });
      Alert.alert('Offline', 'Item marked bought, will sync later.');
    } else {
      try {
        await api.post(`/lists/item/${selectedItemId}/buy`, {
          price: Number(priceInput),
          date_bought: new Date().toISOString().slice(0, 10),
        });
        loadItems();
      } catch (err) {
        Alert.alert('Error', err.response?.data?.message || err.message);
      }
    }

    setModalVisible(false);
    setSelectedItemId(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
        <Text style={styles.itemMeta}>
          Bought: {item.bought ? '✅ Yes' : '❌ No'}
          {item.bought && ` | Price: R${Number(item.price).toFixed(2)}`}
        </Text>
      </View>
      {!item.bought ? (
        <Button title="Mark bought" style={styles.button} onPress={() => { setSelectedItemId(item.id); setModalVisible(true); }} />
      ) : (
        <TouchableOpacity style={styles.disabledBtn}>
          <Text style={{ color: '#555' }}>Bought</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>⚠️ Offline Mode - Changes will sync later</Text>
        </View>
      )}

      <Text style={styles.header}>{title || 'Items'}</Text>

      <TextInput
        placeholder="Item name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
        style={styles.input}
      />
      <Button title="Add Item" style={styles.button} onPress={addItem} />

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        style={{ marginTop: 12 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No items yet</Text>}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Spent: R{total.toFixed(2)}</Text>
      </View>

      {/* Price modal }
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Enter price</Text>
            <TextInput
              placeholder="e.g. 50.00"
              value={priceInput}
              onChangeText={setPriceInput}
              keyboardType="decimal-pad"
              style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Button style={styles.button} title="Cancel" onPress={() => setModalVisible(false)} />
              <Button style={styles.button} title="Confirm" onPress={confirmBuy} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 6 },
  itemRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemMeta: { color: '#666', marginTop: 4 },
  disabledBtn: { padding: 8, backgroundColor: '#eee', borderRadius: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: { backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  totalContainer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
    marginTop: 10,
    alignItems: 'flex-end',
  },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  offlineBanner: {
    backgroundColor: '#ffe9b3',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  offlineText: { color: '#8a6d3b', textAlign: 'center' },
});

/*
import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { 
  Button, 
  TextInput, 
  Card, 
  Modal, 
  Portal, 
  Text 
} from "react-native-paper";

export default function ItemListScreen() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const [budgetModal, setBudgetModal] = useState(false);
  const [budgetValue, setBudgetValue] = useState("");

  const [priceModal, setPriceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemPrice, setItemPrice] = useState("");

  const [totalSpent, setTotalSpent] = useState(0);

  // ============================
  // ADD ITEM + BUDGET MODAL
  // ============================
  const handleAddItem = () => {
    if (!newItem.trim()) return;

    setBudgetModal(true); // open modal to enter budget
  };

  const confirmAddItem = () => {
    const item = {
      id: Date.now(),
      name: newItem,
      budget: Number(budgetValue),
      boughtPrice: 0,
      isBought: false
    };

    setItems([...items, item]);
    setNewItem("");
    setBudgetValue("");
    setBudgetModal(false);
  };

  // ============================
  // MARK AS BOUGHT → ENTER PRICE
  // ============================
  const openPriceModal = (item) => {
    setSelectedItem(item);
    setItemPrice("");
    setPriceModal(true);
  };

  const confirmPrice = () => {
    const updatedItems = items.map((i) =>
      i.id === selectedItem.id
        ? { ...i, isBought: true, boughtPrice: Number(itemPrice) }
        : i
    );

    setItems(updatedItems);
    setPriceModal(false);

    calculateTotal(updatedItems);
  };

  const calculateTotal = (list) => {
    const sum = list
      .filter((i) => i.isBought)
      .reduce((acc, curr) => acc + curr.boughtPrice, 0);

    setTotalSpent(sum);
  };

  // ============================
  // RENDER ITEM
  // ============================
  const renderItem = ({ item }) => (
    <Card style={{ marginVertical: 6, padding: 10 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>

      <Text>Budget: R {item.budget}</Text>
      <Text>
        {item.isBought
          ? `Bought for: R ${item.boughtPrice}`
          : "Not yet bought"}
      </Text>

      {!item.isBought && (
        <Button
          mode="contained"
          style={{ marginTop: 8 }}
          onPress={() => openPriceModal(item)}
        >
          Mark as Bought
        </Button>
      )}
    </Card>
  );

  return (
    <View style={{ flex: 1, padding: 15 }}>

      
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Grocery List
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 15 }}>
        Total Spent: <Text style={{ fontWeight: "bold" }}>R {totalSpent}</Text>
      </Text>

      
      <TextInput
        label="Enter item name"
        mode="outlined"
        value={newItem}
        onChangeText={setNewItem}
      />

      <Button 
        style={{ marginTop: 10 }} 
        mode="contained" 
        onPress={handleAddItem}
      >
        Add Item
      </Button>

      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={{ marginTop: 15 }}
      />

     
      <Portal>
        <Modal visible={budgetModal} onDismiss={() => setBudgetModal(false)}>
          <Card style={{ padding: 20, margin: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Enter Budget
            </Text>

            <TextInput
              label="Budget Amount"
              keyboardType="numeric"
              value={budgetValue}
              onChangeText={setBudgetValue}
              style={{ marginTop: 15 }}
            />

            <Button
              mode="contained"
              style={{ marginTop: 15 }}
              onPress={confirmAddItem}
            >
              Save
            </Button>
          </Card>
        </Modal>
      </Portal>

      
      <Portal>
        <Modal visible={priceModal} onDismiss={() => setPriceModal(false)}>
          <Card style={{ padding: 20, margin: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Enter Bought Price
            </Text>

            <TextInput
              label="Price Paid"
              keyboardType="numeric"
              value={itemPrice}
              onChangeText={setItemPrice}
              style={{ marginTop: 15 }}
            />

            <Button
              mode="contained"
              style={{ marginTop: 15 }}
              onPress={confirmPrice}
            >
              Confirm
            </Button>
          </Card>
        </Modal>
      </Portal>

    </View>
  );
}
*/

/*
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';

export default function ItemListScreen({ route, navigation }) {
  const { listID, title, budget: initialBudget } = route.params || {};
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');

  // price modal state (for marking bought)
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  // budget states
  const [budget, setBudget] = useState(initialBudget ?? null);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  // network
  const [isOffline, setIsOffline] = useState(false);

  // totals
  const [totalSpent, setTotalSpent] = useState(0);

  const ITEMS_KEY = `items_${listID}`;
  const LISTS_CACHE_KEY = 'lists_cache';

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setIsOffline(offline);
      if (!offline) syncQueuedActions();
    });

    // load local + remote
    loadAll();

    return () => unsubscribe();
  }, []);

  // load items and list-level data (budget)
  const loadAll = async () => {
    try {
      const net = await NetInfo.fetch();
      const offline = !(net.isConnected && net.isInternetReachable);
      setIsOffline(offline);

      if (!offline) {
        // fetch items from API
        try {
          const resItems = await api.get(`/lists/list/${listID}/items`);
          const fetchedItems = resItems.data.items || [];
          setItems(fetchedItems);
          await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(fetchedItems));
        } catch (e) {
          console.warn('Failed to fetch items from API, will fallback to cache', e.message);
          const cached = await AsyncStorage.getItem(ITEMS_KEY);
          if (cached) setItems(JSON.parse(cached));
        }

        // try to get latest list details from lists cache or API
        try {
          const resLists = await api.get('/lists/lists');
          const lists = resLists.data.lists || [];
          // find this list
          const my = lists.find(l => String(l.id) === String(listID));
          if (my) {
            setBudget(my.budget ?? 0);
            // update lists_cache
            await AsyncStorage.setItem(LISTS_CACHE_KEY, JSON.stringify(lists));
          } else {
            // fallback to cached lists
            const cachedLists = await AsyncStorage.getItem(LISTS_CACHE_KEY);
            if (cachedLists) {
              const parsed = JSON.parse(cachedLists);
              const found = parsed.find(l => String(l.id) === String(listID));
              if (found) setBudget(found.budget ?? 0);
            }
          }
        } catch (e) {
          const cachedLists = await AsyncStorage.getItem(LISTS_CACHE_KEY);
          if (cachedLists) {
            const parsed = JSON.parse(cachedLists);
            const found = parsed.find(l => String(l.id) === String(listID));
            if (found) setBudget(found.budget ?? 0);
          }
        }
      } else {
        // offline: load local cache
        const cached = await AsyncStorage.getItem(ITEMS_KEY);
        if (cached) setItems(JSON.parse(cached));
        const cachedLists = await AsyncStorage.getItem(LISTS_CACHE_KEY);
        if (cachedLists) {
          const parsed = JSON.parse(cachedLists);
          const found = parsed.find(l => String(l.id) === String(listID));
          if (found) setBudget(found.budget ?? 0);
        } else {
          // fallback to route param if provided
          if (initialBudget !== undefined) setBudget(initialBudget);
        }
      }
    } catch (err) {
      console.error('loadAll error', err);
      Alert.alert('Error', 'Failed to load list data');
    } finally {
      calculateTotal(items);
    }
  };

  // Calculate spent total from bought items
  const calculateTotal = (list) => {
    const sum = (list || items)
      .filter(i => i.bought)
      .reduce((acc, cur) => acc + (Number(cur.price) || 0), 0);
    setTotalSpent(sum);
  };

  // Queue offline actions
  const queueAction = async (action) => {
    const queueStr = await AsyncStorage.getItem('pendingActions');
    const queue = queueStr ? JSON.parse(queueStr) : [];
    queue.push(action);
    await AsyncStorage.setItem('pendingActions', JSON.stringify(queue));
  };

  const syncQueuedActions = async () => {
    const queueStr = await AsyncStorage.getItem('pendingActions');
    const queue = queueStr ? JSON.parse(queueStr) : [];
    if (!queue.length) return;

    for (const action of queue) {
      try {
        if (action.type === 'ADD_ITEM') {
          await api.post(`/lists/list/${action.listID}/item`, action.payload);
        } else if (action.type === 'BUY_ITEM') {
          await api.post(`/lists/item/${action.itemID}/buy`, action.payload);
        } else if (action.type === 'UPDATE_BUDGET') {
          // PATCH endpoint - adjust if your backend uses different route
          await api.patch(`/lists/list/${action.listID}`, { budget: action.payload.budget });
        }
      } catch (e) {
        console.warn('Failed to sync action', action, e.message);
      }
    }

    await AsyncStorage.removeItem('pendingActions');
    // reload fresh data
    loadAll();
  };

  // Add item (online/offline)
  const addItem = async () => {
    if (!name.trim()) { Alert.alert('Validation', 'Please enter an item name'); return; }
    const payload = { name: name.trim(), quantity: Number(quantity) || 1 };

    // optimistic UI: add locally
    const newItemLocal = {
      id: Date.now(), // temporary id
      name: payload.name,
      quantity: payload.quantity,
      bought: false,
      price: 0,
    };
    const updated = [...items, newItemLocal];
    setItems(updated);
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(updated));

    const net = await NetInfo.fetch();
    const offline = !(net.isConnected && net.isInternetReachable);

    if (offline) {
      await queueAction({ type: 'ADD_ITEM', listID, payload });
      Alert.alert('Offline', 'Item saved locally and will sync later');
    } else {
      try {
        await api.post(`/lists/list/${listID}/item`, payload);
        // refresh from server to get real IDs
        await loadAll();
      } catch (err) {
        console.error('addItem error', err);
        Alert.alert('Error', err.response?.data?.message || err.message);
      }
    }

    setName(''); setQuantity('1');
  };

  // Open price modal to mark bought
  const openPriceModal = (itemId) => {
    setSelectedItemId(itemId);
    setPriceInput('');
    setPriceModalVisible(true);
  };

  // Confirm buy (online/offline)
  const confirmBuy = async () => {
    if (!priceInput || isNaN(Number(priceInput))) return Alert.alert('Validation', 'Enter a valid price');

    const updated = items.map(i => i.id === selectedItemId ? { ...i, bought: true, price: Number(priceInput) } : i);
    setItems(updated);
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(updated));
    calculateTotal(updated);

    const net = await NetInfo.fetch();
    const offline = !(net.isConnected && net.isInternetReachable);

    if (offline) {
      await queueAction({
        type: 'BUY_ITEM',
        itemID: selectedItemId,
        payload: { price: Number(priceInput), date_bought: new Date().toISOString().slice(0,10) }
      });
      Alert.alert('Offline', 'Marked bought locally; will sync later.');
    } else {
      try {
        await api.post(`/lists/item/${selectedItemId}/buy`, {
          price: Number(priceInput),
          date_bought: new Date().toISOString().slice(0,10)
        });
        // reload authoritative data
        await loadAll();
      } catch (err) {
        console.error('confirmBuy error', err);
        Alert.alert('Error', err.response?.data?.message || err.message);
      }
    }

    setPriceModalVisible(false);
    setSelectedItemId(null);
    setPriceInput('');
  };

  // Delete item
  const deleteItem = async (itemId) => {
    // optimistic remove locally
    const updated = items.filter(i => i.id !== itemId);
    setItems(updated);
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(updated));

    const net = await NetInfo.fetch();
    const offline = !(net.isConnected && net.isInternetReachable);

    if (offline) {
      await queueAction({ type: 'DELETE_ITEM', listID, itemID: itemId });
      Alert.alert('Offline', 'Delete queued; will sync later.');
    } else {
      try {
        await api.delete(`/lists/item/${itemId}`);
        await loadAll();
      } catch (err) {
        console.warn('deleteItem error', err.message);
      }
    }
  };

  // ---------------------------
  // BUDGET EDIT
  // ---------------------------
  const openEditBudget = () => {
    setBudgetInput(budget != null ? String(budget) : '');
    setBudgetModalVisible(true);
  };

  const saveBudget = async () => {
    if (!budgetInput.trim()) return Alert.alert('Validation', 'Enter a budget amount');

    const newBudget = Number(budgetInput);
    if (isNaN(newBudget) || newBudget < 0) return Alert.alert('Validation', 'Invalid budget');

    // optimistic update
    setBudget(newBudget);

    // update lists_cache local copy so MonthScreen shows new value
    try {
      const listsCacheStr = await AsyncStorage.getItem(LISTS_CACHE_KEY);
      if (listsCacheStr) {
        const parsed = JSON.parse(listsCacheStr);
        const idx = parsed.findIndex(l => String(l.id) === String(listID));
        if (idx > -1) {
          parsed[idx].budget = newBudget;
          await AsyncStorage.setItem(LISTS_CACHE_KEY, JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.warn('Failed updating lists cache locally', e.message);
    }

    const net = await NetInfo.fetch();
    const offline = !(net.isConnected && net.isInternetReachable);

    if (offline) {
      // queue update
      await queueAction({ type: 'UPDATE_BUDGET', listID, payload: { budget: newBudget } });
      Alert.alert('Offline', 'Budget updated locally and will sync when online.');
    } else {
      try {
        // attempt to PATCH (adjust endpoint if your backend differs)
        await api.patch(`/lists/list/${listID}`, { budget: newBudget });
        // refresh lists and items
        await loadAll();
      } catch (err) {
        console.warn('saveBudget error', err.message);
        // if backend doesn't support PATCH, fallback to POST or notify
        Alert.alert('Error', err.response?.data?.message || err.message);
      }
    }

    setBudgetModalVisible(false);
    setBudgetInput('');
  };

  // render item row
  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemName, item.bought && { textDecorationLine: 'line-through', opacity: 0.6 }]}>
          {item.name} x{item.quantity}
        </Text>
        <Text style={styles.itemMeta}>
          Bought: {item.bought ? 'Yes' : 'No'}
          {item.bought && ` | Price: R${Number(item.price).toFixed(2)}`}
        </Text>
      </View>

      {!item.bought ? (
        <Button title="Mark bought" onPress={() => openPriceModal(item.id)} />
      ) : (
        <TouchableOpacity style={styles.disabledBtn}><Text>Bought</Text></TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => deleteItem(item.id)} style={{ marginLeft: 8 }}>
        <Text style={{ color: 'red' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const remaining = (budget ?? 0) - totalSpent;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={{ padding: 12, flex: 1 }}>
        {isOffline && (
          <View style={styles.offlineBanner}><Text style={styles.offlineText}>⚠️ Offline - changes will sync later</Text></View>
        )}

        <Text style={styles.header}>{title || 'Items'}</Text>

        {/* Budget header }
        <View style={styles.budgetHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.budgetLabel}>Budget: {budget != null ? `R${Number(budget).toFixed(2)}` : 'Not set'}</Text>
            <Text style={[styles.remainingLabel, remaining < 0 ? { color: 'red' } : {}]}>
              Remaining: R{Number(remaining || 0).toFixed(2)}
            </Text>
          </View>

          <View style={{ justifyContent: 'center' }}>
            <TouchableOpacity style={styles.editBudgetBtn} onPress={openEditBudget}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Edit Budget</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add item controls }
        <TextInput placeholder="Item name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="number-pad" style={styles.input} />
        <Button title="Add Item" onPress={addItem} />

        <FlatList data={items} keyExtractor={i => String(i.id)} renderItem={renderItem} style={{ marginTop: 12 }} ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:20 }}>No items yet</Text>} />

        <View style={styles.totalContainer}><Text style={styles.totalText}>Total Spent: R{Number(totalSpent).toFixed(2)}</Text></View>

        {/* PRICE MODAL }
        <Modal visible={priceModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontWeight: '700', marginBottom: 8 }}>Enter price</Text>
              <TextInput placeholder="e.g. 50.00" value={priceInput} onChangeText={setPriceInput} keyboardType="decimal-pad" style={styles.input} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <Button title="Cancel" onPress={() => setPriceModalVisible(false)} />
                <Button title="Confirm" onPress={confirmBuy} />
              </View>
            </View>
          </View>
        </Modal>

        {/* BUDGET EDIT MODAL }
        <Modal visible={budgetModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontWeight: '700', marginBottom: 8 }}>Edit Budget (R)</Text>
              <TextInput placeholder="Enter new budget" value={budgetInput} onChangeText={setBudgetInput} keyboardType="decimal-pad" style={styles.input} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <Button title="Cancel" onPress={() => setBudgetModalVisible(false)} />
                <Button title="Save" onPress={saveBudget} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  offlineBanner: { backgroundColor: '#fff3cd', padding: 8, borderRadius: 6, marginBottom: 8 },
  offlineText: { color: '#856404', textAlign: 'center' },
  header: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  budgetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#fff', padding: 12, borderRadius: 8 },
  budgetLabel: { fontSize: 16, fontWeight: '600' },
  remainingLabel: { fontSize: 14, color: 'green', marginTop: 4, fontWeight: '600' },
  editBudgetBtn: { backgroundColor: '#4b7bec', padding: 10, borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 6 },
  itemRow: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemMeta: { color: '#666', marginTop: 4 },
  disabledBtn: { padding: 8, backgroundColor: '#eee', borderRadius: 6, marginLeft: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  totalContainer: { borderTopWidth: 1, borderColor: '#ddd', paddingTop: 10, marginTop: 10, alignItems: 'flex-end' },
  totalText: { fontSize: 18, fontWeight: 'bold' }
});
*/
// src/screens/ItemListScreen.js
/*
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity, Modal, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';

export default function ItemListScreen({ route, navigation }) {
  // ensure route and params exist
  const params = route?.params || {};
  const listID = params.listID;
  const title = params.title || 'Items';
  const initialBudget = Number(params.budget || 0);

  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');

  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [editBudgetModal, setEditBudgetModal] = useState(false);
  const [budget, setBudget] = useState(initialBudget);

  const [totalSpent, setTotalSpent] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  const ITEMS_CACHE_KEY = `items_${listID}`;
  const QUEUE_KEY = 'pendingActions';

  useEffect(() => {
    if (!listID) {
      Alert.alert('Navigation Error', 'No listID passed. Please open list from Month screen.');
      return;
    }
    loadItems();

    const unsub = NetInfo.addEventListener(state => {
      const online = !!(state.isConnected && state.isInternetReachable);
      setIsOnline(online);
      if (online) syncQueuedActions();
    });
    return () => unsub();
  }, []);

  // load items and budget from cache or API
  const loadItems = async () => {
    try {
      const net = await NetInfo.fetch();
      if (net.isConnected && net.isInternetReachable) {
        try {
          const res = await api.get(`/lists/list/${listID}/items`);
          const fetched = res.data?.items || [];
          setItems(fetched);
          await AsyncStorage.setItem(ITEMS_CACHE_KEY, JSON.stringify(fetched));
          // fetch list metadata (budget/spent) from lists endpoint if possible
          try {
            const listsRes = await api.get('/lists/lists');
            const found = (listsRes.data?.lists || []).find(l => String(l.id) === String(listID));
            if (found) setBudget(Number(found.budget || 0));
          } catch (err) { /* ignore list meta error *}
          calculateTotal(fetched);
          return;
        } catch (err) {
          console.warn('Fetch items API failed', err.response?.status, err.message);
        }
      }
      // fallback to cache
      const cached = await AsyncStorage.getItem(ITEMS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setItems(parsed);
        calculateTotal(parsed);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.warn('loadItems error', err.message);
    }
  };

  const calculateTotal = (list) => {
    const sum = (list || []).filter(i => i.bought).reduce((s, i) => s + (Number(i.price) || 0), 0);
    setTotalSpent(sum);
  };

  // queue action helper
  const queueAction = async (action) => {
    const queue = JSON.parse((await AsyncStorage.getItem(QUEUE_KEY)) || '[]');
    queue.push(action);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  };

  // sync queued actions
  const syncQueuedActions = async () => {
    const queue = JSON.parse((await AsyncStorage.getItem(QUEUE_KEY)) || '[]');
    if (!queue.length) return;
    const remaining = [];
    for (const action of queue) {
      try {
        if (action.type === 'ADD_ITEM') {
          await api.post(`/lists/list/${listID}/item`, action.payload);
        } else if (action.type === 'BUY_ITEM') {
          await api.post(`/lists/item/${action.itemID}/buy`, action.payload);
        } else if (action.type === 'UPDATE_BUDGET') {
          // try PUT to update budget; backend may not have this route
          try {
            await api.put(`/lists/list/${listID}`, { budget: action.payload.budget });
          } catch (err) {
            // if PUT not available, try a POST to create a list with same id? fallback skip
            // keep in remaining to retry later
            throw err;
          }
        }
      } catch (err) {
        remaining.push(action);
      }
    }
    if (remaining.length === 0) {
      await AsyncStorage.removeItem(QUEUE_KEY);
    } else {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    }
    // refresh items
    await loadItems();
  };

  // Add item (API or queue)
  const addItem = async () => {
    if (!name.trim()) return Alert.alert('Validation', 'Enter item name');
    const payload = { name, quantity: Number(quantity) };

    // optimistic UI
    const localItem = { id: Date.now(), name, quantity: Number(quantity), bought: false, price: 0 };
    const updated = [...items, localItem];
    setItems(updated);
    await AsyncStorage.setItem(ITEMS_CACHE_KEY, JSON.stringify(updated));

    if (!isOnline) {
      await queueAction({ type: 'ADD_ITEM', payload });
      Alert.alert('Offline', 'Item saved locally and will sync later');
      setName(''); setQuantity('1');
      return;
    }

    try {
      await api.post(`/lists/list/${listID}/item`, payload);
      await loadItems();
      setName(''); setQuantity('1');
    } catch (err) {
      console.warn('addItem error', err.message || err);
      // fallback: queue
      await queueAction({ type: 'ADD_ITEM', payload });
      Alert.alert('Saved locally', 'Backend failed — item queued for sync.');
    }
  };

  // Open price modal for marking bought
  const openPriceModal = (itemId) => {
    setSelectedItemId(itemId);
    setPriceInput('');
    setPriceModalVisible(true);
  };

  // Confirm bought (API or queue)
  const confirmBuy = async () => {
    if (!priceInput || isNaN(Number(priceInput))) return Alert.alert('Validation', 'Enter valid price');

    const payload = { price: Number(priceInput), date_bought: new Date().toISOString().slice(0,10) };

    // optimistic update locally
    const updated = items.map(i => i.id === selectedItemId ? {...i, bought:true, price: Number(priceInput)} : i);
    setItems(updated);
    await AsyncStorage.setItem(ITEMS_CACHE_KEY, JSON.stringify(updated));
    calculateTotal(updated);
    setPriceModalVisible(false);

    if (!isOnline) {
      await queueAction({ type: 'BUY_ITEM', itemID: selectedItemId, payload });
      Alert.alert('Offline', 'Marked bought locally; will sync later.');
      setSelectedItemId(null);
      setPriceInput('');
      return;
    }

    try {
      await api.post(`/lists/item/${selectedItemId}/buy`, payload);
      await loadItems();
      setSelectedItemId(null);
      setPriceInput('');
    } catch (err) {
      console.warn('buy error', err.message || err);
      await queueAction({ type: 'BUY_ITEM', itemID: selectedItemId, payload });
      Alert.alert('Saved locally', 'Buy action queued for sync.');
    }
  };

  // Edit budget flow
  const openEditBudget = () => {
    setEditBudgetModal(true);
    // budget state is already set from params or earlier fetch
  };

  const updateBudget = async () => {
    const newBudget = Number(budget);
    if (isNaN(newBudget)) return Alert.alert('Validation', 'Enter valid number');

    // optimistic UI: update list in local cache
    try {
      // try backend update (PUT). Backend may not have route; handle 404.
      await api.put(`/lists/list/${listID}`, { budget: newBudget });
      // success; refresh lists/items
      await loadItems();
      setEditBudgetModal(false);
      Alert.alert('Success', 'Budget updated on server');
    } catch (err) {
      console.warn('updateBudget error', err.response?.status, err.message);
      // fallback: queue action and update local cached list
      await queueAction({ type: 'UPDATE_BUDGET', payload: { budget: newBudget } });

      // update cached lists cache for MonthScreen
      try {
        const cachedLists = JSON.parse((await AsyncStorage.getItem('lists_cache')) || '[]');
        const updatedLists = cachedLists.map(l => String(l.id) === String(listID) ? { ...l, budget: newBudget } : l);
        await AsyncStorage.setItem('lists_cache', JSON.stringify(updatedLists));
      } catch (e) { /* ignore  }

      setEditBudgetModal(false);
      Alert.alert('Saved locally', 'Budget saved locally and queued to sync.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={{flex:1}}>
        <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
        <Text style={styles.itemMeta}>
          Bought: {item.bought ? '✅ Yes' : '❌ No'} {item.bought && ` | Price: R${Number(item.price).toFixed(2)}`}
        </Text>
      </View>

      {!item.bought ? (
        <Button title="Mark bought" onPress={() => openPriceModal(item.id)} />
      ) : (
        <TouchableOpacity style={styles.disabledBtn}><Text>Bought</Text></TouchableOpacity>
      )}
    </View>
  );

  const remaining = (Number(budget) || 0) - totalSpent;

  return (
    <View style={{flex:1, padding:12}}>
      <Text style={{fontSize:18, fontWeight:'bold', marginBottom:8}}>{title}</Text>

      {/* Budget header }
      <View style={styles.budgetHeader}>
        <Text style={{fontSize:16}}>Budget: R{Number(budget).toFixed(2)}</Text>
        <Text style={{fontSize:16, fontWeight:'600', color: remaining < 0 ? 'red' : '#222'}}>Remaining: R{remaining.toFixed(2)}</Text>
        <TouchableOpacity onPress={openEditBudget} style={styles.editBudgetBtn}><Text style={{color:'#007bff'}}>Edit Budget</Text></TouchableOpacity>
      </View>

      {/* Add item }
      <TextInput placeholder="Item name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Quantity" keyboardType="number-pad" value={quantity} onChangeText={setQuantity} style={styles.input} />
      <Button title="Add Item" onPress={addItem} />

      <FlatList data={items} keyExtractor={i => String(i.id)} renderItem={renderItem} style={{marginTop:12}} ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>No items yet</Text>} />

      <View style={styles.totalContainer}><Text style={styles.totalText}>Total Spent: R{totalSpent.toFixed(2)}</Text></View>

      {/* Price modal }
      <Modal visible={priceModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight:'bold'}}>Enter price</Text>
            <TextInput placeholder="e.g. 100.50" keyboardType="decimal-pad" value={priceInput} onChangeText={setPriceInput} style={styles.input} />
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:12}}>
              <Button title="Cancel" onPress={() => setPriceModalVisible(false)} />
              <Button title="Confirm" onPress={confirmBuy} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit budget modal }
      <Modal visible={editBudgetModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{fontWeight:'700', marginBottom:10}}>Edit Budget (R)</Text>
            <TextInput value={String(budget)} onChangeText={t => setBudget(t)} keyboardType="numeric" style={styles.input} />
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:12}}>
              <Button title="Cancel" onPress={() => setEditBudgetModal(false)} />
              <Button title="Save" onPress={updateBudget} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  input:{borderWidth:1,borderColor:'#ccc',padding:8,marginBottom:8,borderRadius:6},
  itemRow:{padding:12,borderBottomWidth:1,borderColor:'#eee',flexDirection:'row',alignItems:'center'},
  itemName:{fontSize:16,fontWeight:'600'},
  itemMeta:{color:'#666',marginTop:4},
  disabledBtn:{padding:8,backgroundColor:'#eee',borderRadius:6},
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',padding:20},
  modalContent:{backgroundColor:'#fff',padding:16,borderRadius:8},
  modalBox:{backgroundColor:'#fff',padding:16,borderRadius:8,width:'85%'},
  totalContainer:{borderTopWidth:1,borderColor:'#ddd',paddingTop:10,marginTop:10,alignItems:'flex-end'},
  totalText:{fontSize:18,fontWeight:'bold'},
  budgetHeader:{backgroundColor:'#fff',padding:12,borderRadius:8, marginBottom:10},
  editBudgetBtn:{marginTop:8}
});*/
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import api from '../api';
import { Ionicons } from '@expo/vector-icons';


export default function ItemListScreen({ route }) {
  const { listID, title } = route.params;

  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [budget, setBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [currentPrice, setCurrentPrice] = useState('');

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [hasWarned, setHasWarned] = useState(false);

  useEffect(() => {
    
    if (budget > 0 && totalSpent > budget && !hasWarned) {
    Alert.alert(
      'Budget Exceeded ⚠️',
      `You have exceeded your budget by R${(totalSpent - budget).toFixed(2)}`,
      [{ text: 'OK' }]
    );
    setHasWarned(true);
  }
  loadItems();
  }, [totalSpent, budget, hasWarned]);

  const loadItems = async () => {
    try {

      setHasWarned(false);
      // Get list budget
      const listRes = await api.get(`/lists/list/${listID}`);
      setBudget(Number(listRes.data.list.budget || 0));

      const res = await api.get(`/lists/list/${listID}/items`);
      setItems(res.data.items || []);

      // Calculate total spent
      const spent = res.data.items.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
      setTotalSpent(spent);
    } catch (err) {
      Alert.alert('Error', 'Failed to load items');
    }
  };

  const addItem = async () => {
    if (!itemName) return Alert.alert('Validation', 'Item name required');

    try {
      const res = await api.post(`/lists/list/${listID}/item`, {
        name: itemName,
        quantity: Number(itemQuantity),
      });
      setItems([...items, res.data.item]);
      setItemName('');
      setItemQuantity('1');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  const markBought = (item) => {
    setCurrentItemId(item.id);
    setCurrentPrice(item.price ? item.price.toString() : '');
    setPriceModalVisible(true);
  };

  const editPrice = (item) => {
    setCurrentItemId(item.id);
    setCurrentPrice(item.price?.toString() || '');
    setPriceModalVisible(true);
  };

  const confirmDeleteItem = (item) => {
        setItemToDelete(item);
        setDeleteModalVisible(true);
      };

  const deleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await api.delete(`/lists/item/${itemToDelete.id}`);

      // Remove item locally
      const updatedItems = items.filter(i => i.id !== itemToDelete.id);
      setItems(updatedItems);

      // Recalculate spent
      const spent = updatedItems.reduce(
        (sum, i) => sum + (Number(i.price) || 0),
        0
      );
      setTotalSpent(spent);

      setDeleteModalVisible(false);
      setItemToDelete(null);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to delete item');
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };


  const savePrice = async () => {
    if (!currentItemId) return;
    try {
      await api.post(`/lists/item/${currentItemId}/buy`, { price: Number(currentPrice) });
      setPriceModalVisible(false);
      setCurrentItemId(null);
      setCurrentPrice('');
      loadItems();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.header}>{title}</Text>
      <Text style={{ marginBottom: 10 }}>
        Budget: R{Number (budget || 0).toFixed(2)} | Spent: R{Number(totalSpent || 0).toFixed(2)}
      </Text>

      <TextInput
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantity"
        value={itemQuantity}
        onChangeText={setItemQuantity}
        keyboardType="number-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text>
                  {item.name} x {item.quantity}
                  {item.bought ? ` - R${Number(item.price || 0).toFixed(2)}` : ''}
                </Text>

                {!item.bought ? (
                  <TouchableOpacity onPress={() => markBought(item)}>
                    <Text style={{ color: 'green', marginTop: 4 }}>Mark as Bought</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => editPrice(item)}>
                    <Text style={{ color: '#1976d2', marginTop: 4 }}>Edit Price</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity onPress={() => confirmDeleteItem(item)}>
                <Ionicons name="trash-outline" size={22} color="#ff4444" />
              </TouchableOpacity>
            </View>
          )}
      />

      {/* Modal to enter price */}
      <Modal visible={priceModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
              {currentItemId ? 'Enter / Edit Price' : 'Enter Price'}
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              placeholder="Price"
              value={currentPrice}
              onChangeText={setCurrentPrice}
              style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <TouchableOpacity onPress={() => setPriceModalVisible(false)}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={savePrice}>
                <Text style={{ color: 'green', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/***Delete Confirmation */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name="warning-outline"
              size={40}
              color="#ff4444"
              style={{ alignSelf: 'center', marginBottom: 10 }}
            />

            <Text style={{ fontWeight: '700', fontSize: 18, textAlign: 'center' }}>
              Delete Item
            </Text>

            <Text style={{ textAlign: 'center', marginVertical: 10 }}>
              Are you sure you want to delete "{itemToDelete?.name}"?
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <Text style={{ color: '#666', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={deleteItem}>
                <Text style={{ color: '#ff4444', fontWeight: 'bold' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 10, backgroundColor: '#fff' },
  button: { backgroundColor: '#007bff', borderRadius: 50, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  listItem: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 16, borderRadius: 8 },
});
