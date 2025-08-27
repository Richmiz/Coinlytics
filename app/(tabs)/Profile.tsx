import SimpleLoading from "@/components/SimpleLoading";
import { images, PRIMARY_COLOR } from "@/constants";
import { auth, db } from "@/firebase.secrets";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";
import { signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [refreshKey]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const handleEditProfile = () => {
    if (user) {
      router.push({
        pathname: "/(screens)/EditProfile",
        params: { userId: user.uid }
      });
    }
  };

  const handleProfileUpdated = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-bgColor">
        <SimpleLoading />
      </SafeAreaView>
    );
  }  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg">Please sign in to view your profile</Text>
        <TouchableOpacity 
          onPress={() => router.replace("/sign-in")}
          className="mt-4 bg-primary p-3 rounded-lg"
        >
          <Text className="text-white font-bold">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/** Header **/}
        <View className="flex-1 flex-row items-center justify-between m-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close-sharp" size={24} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Text className="text-lg font-extrabold text-black">Profile</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={PRIMARY_COLOR}
            />
          </TouchableOpacity>
        </View>

        <View className="flex flex-col items-center mt-5">
          <View className="h-auto w-auto rounded-full bg-white items-center p-1 shadow-xl shadow-black">
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={{ height: 70, width: 70 }}
                className="rounded-full"
              />
            ) : (
              <Image
                source={images.avatar}
                style={{ height: 70, width: 70 }}
                className="rounded-full "
              />
            )}
          </View>
          <View className="flex flex-col mt-8 min-w-[90%] p-4 items-start gap-8">

            <View className="flex flex-row items-center gap-4 mb-4">
              <View className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full border border-primary">
                <FontAwesome5 name="user-tie" size={20} color={PRIMARY_COLOR} />
              </View>
              <View className="flex-col">
                <Text className="font-normal text-gray-100">Full Name</Text>
                <Text className="font-semibold">{user.displayName || 'Not provided'}</Text>
              </View>
            </View>
            <View className="flex flex-row items-center gap-4 mb-4">
              <View className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full border border-primary">
                <FontAwesome5 name="envelope" size={20} color={PRIMARY_COLOR} />
              </View>
              <View className="flex-col">
                <Text className="font-normal text-gray-100">Email</Text>
                <Text className="font-semibold">{user.email}</Text>
              </View>
            </View>
            <View className="flex flex-row items-center gap-4 mb-4">
              <View className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full border border-primary">
                <FontAwesome5 name="phone" size={20} color={PRIMARY_COLOR} />
              </View>
              <View className="flex-col">
                <Text className="font-normal text-gray-100">Phone</Text>
                <Text className="font-semibold">{userData?.phone || 'Not provided'}</Text>
              </View>
            </View>
            <View className="flex flex-row items-center gap-4 mb-4">
              <View className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full border border-primary">
                <FontAwesome5 name="calendar" size={20} color={PRIMARY_COLOR} />
              </View>
              <View className="flex-col">
                <Text className="font-normal text-gray-100">Member Since</Text>
                <Text className="font-semibold">
                  {user.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString() 
                    : 'Unknown'}
                </Text>
              </View>
            </View>
            
          </View>

          <View className="flex flex-col mt-20 gap-4">
            <TouchableOpacity 
              onPress={handleEditProfile}
              className="flex items-center justify-center bg-primary/10 min-w-[90%] p-4 rounded-full border border-primary"
            >
              <Text className="text-primary font-bold text-base">
                Edit Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogout}
              className="flex flex-row items-center justify-center bg-red-50 min-w-[90%] p-4 rounded-full border border-red-500 gap-3"
            >
              <SimpleLineIcons name="logout" size={20} color="#ef4444" />
              <Text className="text-red-600 font-bold text-base">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
