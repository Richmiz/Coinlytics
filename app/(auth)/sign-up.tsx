import CustomAnimatedInput from "@/components/CustomAnimatedInput";
import { PRIMARY_COLOR } from "@/constants";
import { auth, db } from "@/firebase.secrets";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name in Firebase Auth
      await updateProfile(user, {
        displayName: name
      });

      // Store additional user information in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.push("/") }
      ]);
    } catch (error: any) {
      Alert.alert("Sign Up Error", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4 mt-10">
      <View className="flex justify-end mt-10">
        <Text className="text-6xl  font-black text-gray-500">Hello there,</Text>
        <Text className="text-6xl font-black text-gray-500">Welcome</Text>
        <Text className="text-xl text-gray-500 mt-4">Fill your information below to create account</Text>
      </View>

      <View className="flex-1 mt-8 items-center p-4 ">
        <CustomAnimatedInput
          label="Your name"
          placeholder="Enter name"
          autoCapitalize='words'
          value={name}
          onChangeText={setName}
          icon={() => (
            <AntDesign 
              name="user" 
              size={24} 
              color="#6e6e6e" 
            />
            
          )}
        />
        <CustomAnimatedInput
          label="Your email"
          placeholder="Enter email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon={() => (
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color="#6e6e6e"
            />
          )}
        />
        <View style={{ marginTop: 4 }}>
          <CustomAnimatedInput
            label="Your password"
            placeholder="Enter password"
            autoCapitalize="none"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            icon={() => (
              <MaterialIcons name="lock-outline" size={28} color="#6e6e6e" />
            )}
          />
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logInButton} onPress={handleSignUp}>
          <Text style={styles.login}>Sign Up</Text>
        </TouchableOpacity>

        <View className="flex flex-row items-center justify-between mt-8">
          <Text style={styles.account}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={styles.forgotPassword}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </SafeAreaView>
  );
};export default SignUp;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    width: "100%",
    marginTop: 28,
  },
  logInButton: {
    width: "100%",
    padding: 16,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  login: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPasswordButton: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  forgotPassword: {
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  account: {
    color: "#6e6e6e",
    fontWeight: "600",
  },
});