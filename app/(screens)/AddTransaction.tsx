import { GRAY_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants';
import { auth, db } from '@/firebase.secrets';
import { AntDesign, Entypo, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddTransaction = () => {
  const router = useRouter();
  const [type, setType] = useState('income');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);

  // Fetch current balance
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let income = 0;
      let expenses = 0;

      querySnapshot.forEach((doc) => {
        const transaction = doc.data();
        if (transaction.type === 'income') {
          income += transaction.amount;
        } else if (transaction.type === 'expense') {
          expenses += transaction.amount;
        }
      });

      setCurrentBalance(income - expenses);
    }, (error) => {
      console.error('Error fetching balance:', error);
    });

    return unsubscribe;
  }, []);

  // Format amount with dots for better UX
  const formatAmount = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    // Add dots every 3 digits
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Handle amount input change
  const handleAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setAmount(formatted);
  };

  const handleAddTransaction = async () => {
    if (!type || !title || !amount || !category) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a transaction.');
      return;
    }

    try {
      const transactionData = {
        type,
        title,
        amount: parseFloat(amount.replace(/\./g, '')), // Remove dots before parsing
        category,
        createdAt: new Date(),
        userId: user.uid,
      };
      console.log('Adding transaction:', transactionData);
      await addDoc(collection(db, 'transactions'), transactionData);
      console.log('Transaction added successfully');
      router.back();
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', 'Could not save transaction.');
    }
  };

  return (
    <SafeAreaView className="flex bg-white h-full">
      <KeyboardAvoidingView className="flex h-full"
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/** Header **/}
        <View className="flex-1 flex-row items-center justify-between m-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close-sharp" size={24} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Text className="text-lg font-extrabold text-black">Add Transaction</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={PRIMARY_COLOR}
            />
          </TouchableOpacity>
        </View>

        {/** Type Input **/}
        <View className='flex flex-col m-4'>
          <Text className="text-lg font-extrabold text-black">Type:</Text>
          <View className='flex-row gap-4 mt-2'>
            <Pressable 
              onPress={() => setType('income')} 
              className={`flex-1 p-4 rounded-xl border-2 items-center justify-center ${type === 'income' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
            >
              <MaterialIcons name="trending-up" size={24} color={type === 'income' ? '#22c55e' : '#6b7280'} />
              <Text className={`text-lg font-semibold mt-2 ${type === 'income' ? 'text-green-600' : 'text-gray-600'}`}>Income</Text>
            </Pressable>
            <Pressable 
              onPress={() => setType('expense')} 
              className={`flex-1 p-4 rounded-xl border-2 items-center justify-center ${type === 'expense' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            >
              <MaterialIcons name="trending-down" size={24} color={type === 'expense' ? '#ef4444' : '#6b7280'} />
              <Text className={`text-lg font-semibold mt-2 ${type === 'expense' ? 'text-red-600' : 'text-gray-600'}`}>Expense</Text>
            </Pressable>
          </View>
        </View>

        {/** Title Input **/}
        <View className='flex flex-col m-4'>
          <Text className="text-lg font-extrabold text-black">Title:</Text>
          <TextInput 
            className="border border-primary  p-2 py-4 rounded-xl mt-2 text-black font-medium" 
            placeholder="Enter title ..."
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={GRAY_COLOR}
          />
        </View>

        {/** Category **/}
        <View className='flex flex-col m-4 gap-4'>
          <Text className="text-lg font-extrabold text-black">Category:</Text>

          <View className='flex-row gap-4 items-center justify-between'>
            <Pressable onPress={() => setCategory('Food')} className={`flex-col items-center justify-center border p-2 rounded-xl mt-2 w-24 ${category === 'Food' ? 'border-secondary' : 'border-quaternary'}`}>
              <MaterialCommunityIcons name="food" size={24} color={SECONDARY_COLOR} />
              <Text className='text-md text-primary font-medium mt-2'>Food</Text>
            </Pressable>
            <Pressable onPress={() => setCategory('Family')} className={`flex-col items-center justify-center border p-2 rounded-xl mt-2 w-24 ${category === 'Family' ? 'border-secondary' : 'border-quaternary'}`}>
              <MaterialIcons name="family-restroom" size={24} color={SECONDARY_COLOR} />
              <Text className='text-md text-primary font-medium mt-2'>Family</Text>
            </Pressable>
            <Pressable onPress={() => setCategory('Money')} className={`flex-col items-center justify-center border p-2 rounded-xl mt-2 w-24 ${category === 'Money' ? 'border-secondary' : 'border-quaternary'}`}>
              <Fontisto name="money-symbol" size={24} color={SECONDARY_COLOR} />
              <Text className='text-md text-primary font-medium mt-2'>Money</Text>
            </Pressable>
            <Pressable onPress={() => setCategory('Device')} className={`flex-col items-center justify-center border p-2 rounded-xl mt-2 w-24 ${category === 'Device' ? 'border-secondary' : 'border-quaternary'}`}>
              <MaterialIcons name="devices-other" size={24} color={SECONDARY_COLOR} />
              <Text className='text-md text-primary font-medium mt-2'>Device</Text>
            </Pressable>
          </View>
          <View className='flex-row gap-4 items-center justify-between'>
            <Pressable onPress={() => setCategory('Shopping')} className={`flex-col items-center justify-center border p-2 rounded-xl mt-2 w-24 ${category === 'Shopping' ? 'border-secondary' : 'border-quaternary'}`}>
              <Entypo name="shopping-bag" size={24} color={SECONDARY_COLOR} />
              <Text className='text-md text-primary font-medium mt-2'>Shopping</Text>
            </Pressable>
            <Pressable onPress={() => setCategory('Medicine')} className={`flex-col items-center justify-center border p-2 rounded-xl mt-2 w-24 ${category === 'Medicine' ? 'border-secondary' : 'border-quaternary'}`}>
              <Fontisto name="pills" size={24} color={SECONDARY_COLOR} />
              <Text className='text-md text-primary font-medium mt-2'>Medicine</Text>
            </Pressable>
            <Pressable onPress={() => setCategory('Haircut')} className={`flex-col items-center justify-center border p-2 rounded-xl mt-2 w-24 ${category === 'Haircut' ? 'border-secondary' : 'border-quaternary'}`}>
              <Ionicons name="cut" size={24} color={SECONDARY_COLOR} />
              <Text className='text-md text-primary font-medium mt-2'>Haircut</Text>
            </Pressable>
            <Pressable onPress={() => setCategory('Others')} className={`flex-col items-center justify-center border p-2 rounded-xl mt-2 w-24 ${category === 'Others' ? 'border-secondary' : 'border-quaternary'}`}>
              <AntDesign name="sharealt" size={24} color={SECONDARY_COLOR} />
              <Text className='text-md text-primary font-medium mt-2'>Others</Text>
            </Pressable>
          </View>
        </View>

        {/** Amount Input **/}
        <View className='flex flex-col m-4 mb-10'>
          <View className='flex-row items-center'>
          <Text className="text-lg font-extrabold text-black">Amount: </Text>
          <Text className="text-lg font-normal text-gray-100">Your Balance </Text>
          <Text className='text-primary font-medium'>RP {formatAmount(currentBalance.toString())}</Text>
          </View>
          <TextInput
            className="border border-primary p-2 py-4 rounded-xl mt-2 text-black font-medium"
            placeholder="Enter amount ..."
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholderTextColor={GRAY_COLOR}
          />
        </View>

        {/** Add Transaction Button **/}
        <View className='m-4 mt-10'>
          <TouchableOpacity 
            className='bg-primary p-4 rounded-xl flex items-center justify-center'
            onPress={handleAddTransaction}
          >
            <Text className='text-white text-lg font-bold'>Add Transaction</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AddTransaction