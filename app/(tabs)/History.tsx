import { PRIMARY_COLOR } from "@/constants";
import { auth, db } from "@/firebase.secrets";
import { AntDesign, Entypo, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  createdAt: any;
  userId: string;
}

const History = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Generate week dates (Sunday to Saturday)
  useEffect(() => {
    const generateWeekDates = (date: Date) => {
      const dates: Date[] = [];
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day;

      for (let i = 0; i < 7; i++) {
        const weekDate = new Date(startOfWeek.setDate(diff + i));
        dates.push(new Date(weekDate));
      }
      return dates;
    };

    setWeekDates(generateWeekDates(selectedDate));
  }, [selectedDate]);

  // Fetch transactions for selected date
  useEffect(() => {
    if (!user) return;

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      where('createdAt', '>=', startOfDay),
      where('createdAt', '<=', endOfDay),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        const transaction = { id: doc.id, ...doc.data() } as Transaction;
        transactionsData.push(transaction);
      });
      setTransactions(transactionsData);
    }, (error) => {
      console.error('History snapshot error:', error);
      // If index error, clear transactions to show empty state
      if (error instanceof Error && error.message.includes('requires an index')) {
        console.log('History index not ready, showing empty state');
        setTransactions([]);
      }
    });

    return unsubscribe;
  }, [user, selectedDate]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('id-ID');
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const iconSize = 24;
    const iconColor = PRIMARY_COLOR;

    switch (category.toLowerCase()) {
      case 'food':
        return <MaterialCommunityIcons name="food" size={iconSize} color={iconColor} />;
      case 'family':
        return <MaterialIcons name="family-restroom" size={iconSize} color={iconColor} />;
      case 'money':
        return <Fontisto name="money-symbol" size={iconSize} color={iconColor} />;
      case 'device':
        return <MaterialIcons name="devices-other" size={iconSize} color={iconColor} />;
      case 'shopping':
        return <Entypo name="shopping-bag" size={iconSize} color={iconColor} />;
      case 'medicine':
        return <Fontisto name="pills" size={iconSize} color={iconColor} />;
      case 'haircut':
        return <Ionicons name="cut" size={iconSize} color={iconColor} />;
      case 'others':
        return <AntDesign name="sharealt" size={iconSize} color={iconColor} />;
      default:
        return <AntDesign name="sharealt" size={iconSize} color={iconColor} />;
    }
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const formatWeekRange = () => {
    if (weekDates.length === 0) return '';

    const startDate = weekDates[0];
    const endDate = weekDates[6];

    const startMonth = startDate.toLocaleDateString('en-GB', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-GB', { month: 'short' });
    const year = startDate.getFullYear();

    if (startMonth === endMonth) {
      return `${startDate.getDate()} - ${endDate.getDate()} ${startMonth} ${year}`;
    } else {
      return `${startDate.getDate()} ${startMonth} - ${endDate.getDate()} ${endMonth} ${year}`;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex">
      <ScrollView
        className="flex"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/** Header **/}
        <View className="flex-1 flex-row items-center justify-between m-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Text className="text-lg font-extrabold text-black">History</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={PRIMARY_COLOR}
            />
          </TouchableOpacity>
        </View>

        {/** Date Range Header **/}
        <View className="flex-1 m-4 mt-2">
          <Text className="text-xl font-extrabold text-black">{formatWeekRange()}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weekDates.map((date, index) => {
              const isSelected = isSameDate(date, selectedDate);
              const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedDate(date)}
                  className={`flex-col items-center gap-2 rounded-2xl px-4 py-2 mr-4 mt-4 ${
                    isSelected ? 'bg-secondary/80 shadow-xl' : 'bg-white shadow-md'
                  }`}
                >
                  <Text className={`text-xl font-semibold ${
                    isSelected ? 'text-white' : 'text-primary'
                  }`}>
                    {date.getDate()}
                  </Text>
                  <Text className={`font-normal text-md ${
                    isSelected ? 'text-white' : 'text-primary'
                  }`}>
                    {dayName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/** Transactions **/}
        <View className="flex-1 mt-2 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-extrabold text-black mt-2">
              Transactions
            </Text>
            <TouchableOpacity>
              <Entypo name="list" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/** Transaction List **/}
          <View className="">
            {transactions.length === 0 ? (
              <View className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 mt-4">
                <AntDesign name="filetext1" size={48} color="#9ca3af" />
                <Text className="text-lg font-semibold text-gray-600 mt-4">
                  No transactions found
                </Text>
                <Text className="text-md text-gray-500 text-center mt-2">
                  No transactions for {selectedDate.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            ) : (
              transactions.map((transaction) => (
                <Pressable
                  key={transaction.id}
                  className="flex flex-col p-4 items-start justify-between border border-quaternary rounded-xl mt-4 bg-white shadow-md"
                >
                  <View className="flex-row w-full justify-end">
                    <Text className="text-xs text-gray-700">
                      {formatDate(transaction.createdAt)}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center justify-start gap-4">
                    <View className="bg-white shadow-xl rounded-xl h-20 w-20 items-center justify-center p-4">
                      {getCategoryIcon(transaction.category)}
                    </View>
                    <View className="flex-row flex-1">
                      <View className="flex-col items-start justify-between gap-3 flex-1">
                        <Text className={`text-md font-extrabold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </Text>
                        <Text className="text-md font-bold text-gray-700">
                          {transaction.title}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
