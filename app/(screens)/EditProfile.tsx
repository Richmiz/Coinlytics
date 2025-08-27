import { PRIMARY_COLOR } from "@/constants";
import { auth, db } from "@/firebase.secrets";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setName(currentUser.displayName || '');
          setPhone(currentUser.phoneNumber || '');
          setProfileImage(currentUser.photoURL || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserData();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: name.trim(),
        photoURL: profileImage
      });

      // Update Firestore user document
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: name.trim(),
        phone: phone.trim(),
        photoURL: profileImage,
        updatedAt: serverTimestamp()
      });

      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          }
        }
      ]);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg">Loading...</Text>
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
          <Text className="text-lg font-extrabold text-black">Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text className={`font-bold text-base ${loading ? 'text-gray-400' : 'text-primary'}`}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-col items-center mt-5">
          {/** Profile Image **/}
          <View className="relative">
            <TouchableOpacity onPress={pickImage}>
              <View className="h-32 w-32 rounded-full bg-white items-center justify-center p-1 shadow-xl shadow-black">
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{ height: 120, width: 120 }}
                    className="rounded-full"
                  />
                ) : (
                  <View className="h-24 w-24 rounded-full bg-gray-200 items-center justify-center">
                    <FontAwesome5 name="user" size={40} color="#9ca3af" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePhoto}
              className="absolute bottom-0 right-0 bg-primary rounded-full p-2"
            >
              <MaterialCommunityIcons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-gray-500 mt-2">Tap to change photo</Text>

          <View className="flex flex-col mt-8 min-w-[90%] p-4 gap-6">
            {/** Name Input **/}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Full Name</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
                <FontAwesome5 name="user" size={20} color={PRIMARY_COLOR} />
                <TextInput
                  className="flex-1 ml-3 text-black"
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/** Email (Read-only) **/}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <FontAwesome5 name="envelope" size={20} color="#9ca3af" />
                <Text className="flex-1 ml-3 text-gray-600">{auth.currentUser?.email}</Text>
              </View>
            </View>

            {/** Phone Input **/}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
                <FontAwesome5 name="phone" size={20} color={PRIMARY_COLOR} />
                <TextInput
                  className="flex-1 ml-3 text-black"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
