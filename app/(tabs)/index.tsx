import { images } from "@/constants";
import { auth, db } from "@/firebase.secrets";
import { AntDesign, Entypo, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

export default function Index() {
  const isEven = (num: number) => num % 2 === 0;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Manual refresh function
  const refreshData = async () => {
    if (!user) return;

    setRefreshing(true);
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const transactionsData: Transaction[] = [];
      let income = 0;
      let expenses = 0;

      querySnapshot.forEach((doc) => {
        const transaction = { id: doc.id, ...doc.data() } as Transaction;
        transactionsData.push(transaction);

        if (transaction.type === 'income') {
          income += transaction.amount;
        } else if (transaction.type === 'expense') {
          expenses += transaction.amount;
        }
      });

      setTransactions(transactionsData);
      setTotalIncome(income);
      setTotalExpenses(expenses);
      setTotalBalance(income - expenses);
      //console.log('Manual refresh completed');
    } catch (error) {
      //console.error('Manual refresh error:', error);
      // If index is still building, show a message
      if (error instanceof Error && error.message.includes('requires an index')) {
        //console.log('Index is still building. Please wait a few minutes and try again.');
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    // Fetch transactions from Firestore
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      //console.log('Dashboard: Received snapshot update');
      const transactionsData: Transaction[] = [];
      let income = 0;
      let expenses = 0;

      querySnapshot.forEach((doc) => {
        const transaction = { id: doc.id, ...doc.data() } as Transaction;
        transactionsData.push(transaction);
        //console.log('Transaction:', transaction);

        if (transaction.type === 'income') {
          income += transaction.amount;
        } else if (transaction.type === 'expense') {
          expenses += transaction.amount;
        }
      });

      setTransactions(transactionsData);
      setTotalIncome(income);
      setTotalExpenses(expenses);
      setTotalBalance(income - expenses);
      //console.log('Dashboard updated:', { transactions: transactionsData.length, income, expenses, balance: income - expenses });
    }, (error) => {
      console.error('Dashboard snapshot error:', error);
      // If index error, try manual refresh as fallback
      if (error.message.includes('requires an index')) {
        //console.log('Index not ready, using manual refresh as fallback');
        refreshData();
      }
    });

    return unsubscribe;
  }, [user]);

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
    const iconColor = '#3B82F6'; // PRIMARY_COLOR equivalent

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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white h-full">
      <ScrollView
        className="flex"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        {/*Header*/}
        <View className="flex flex-row items-center justify-between p-4">
          <View className="flex-row items-center justify-start gap-2">
            <TouchableOpacity
              onPress={() => router.push("/Profile")}
              className="bg-primary rounded-xl h-14 w-14"
            >
              {user?.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={{ height: 50, width: 50 }}
                  className="rounded-xl"
                />
              ) : (
                <Image
                  source={images.avatar}
                  style={{ height: 50, width: 50 }}
                  className="rounded-xl"
                />
              )}
            </TouchableOpacity>
            <View className="flex-col items-start">
              <Text className="text-md text-gray-100">Welcome back,</Text>
              <Text className="text-[16px] text-black font-black">
                {user?.displayName}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/AddTransaction")}
            className="bg-white shadow-xl rounded-xl h-12 w-12 items-center justify-center border border-quaternary"
          >
            <Text className="text-primary font-extrabold text-2xl">+</Text>
          </TouchableOpacity>
        </View>

        {/*Top Section*/}
        <View className="flex flex-col items-center bg-primary/90 rounded-2xl min-w-[80%] p-5 m-6 mx-4">
          <Text className="text-lg text-white font-medium mt-2">
            Total Balance
          </Text>
          <View className="flex-row items-center mt-2 gap-3">
            <Text className="text-sm text-white font-normal">IDR</Text>
            <Text className="text-[32px] text-white font-extrabold">
              {formatCurrency(totalBalance)}
            </Text>
          </View>

          <View className="flex-row bg-primary rounded-xl p-4 mt-6 w-full justify-between items-center px-5 gap-2">
            <View className="flex-col items-start">
              <View className="flex-row items-center justify-start gap-1">
                <AntDesign name="arrowdown" size={18} color="green" />
                <Text className="text-sm text-white font-normal">Income</Text>
              </View>

              <Text className="text-[22px] text-white font-semibold">
                {formatCurrency(totalIncome)}
              </Text>
            </View>
            <View className="bg-gray-300 w-0.5 h-10" />
            <View className="flex-col items-start">
              <View className="flex-row items-center justify-start gap-1">
                <AntDesign name="arrowup" size={18} color="red" />
                <Text className="text-sm text-white font-normal">Expenses</Text>
              </View>

              <Text className="text-[22px] text-white font-semibold">
                {formatCurrency(totalExpenses)}
              </Text>
            </View>
          </View>
        </View>

        {/*Transaction History*/}
        <View className="flex flex-col m-4">
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="text-[18px] font-semibold text-black">
              Recent Transactions
            </Text>
            {transactions.length > 0 && (
              <TouchableOpacity onPress={() => router.push("/History")}>
                <Text className="text-md text-primary font-medium">See all</Text>
              </TouchableOpacity>
            )}
          </View>

          {transactions.length === 0 ? (
            <View className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <AntDesign name="filetext1" size={48} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-600 mt-4">
                No transactions yet
              </Text>
              <Text className="text-md text-gray-500 text-center mt-2">
                Start by adding your first transaction
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/AddTransaction")}
                className="bg-primary px-6 py-3 rounded-lg mt-4"
              >
                <Text className="text-white font-semibold">Add Transaction</Text>
              </TouchableOpacity>
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
      </ScrollView>
    </SafeAreaView>
  );
}
