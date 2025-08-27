import CustomAnimatedInput from "@/components/CustomAnimatedInput";
import { PRIMARY_COLOR } from "@/constants";
import { auth } from "@/firebase.secrets";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      Alert.alert("Sign In Error", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-4 mt-20">
      <View className="flex justify-end mt-10">
        <Text className="text-6xl  font-black text-gray-500">Hello there,</Text>
        <Text className="text-6xl font-black text-gray-500">Welcome</Text>
        <Text className="text-xl text-gray-500 mt-4">Log in to your account</Text>
      </View>

      <View className="flex-1 mt-8 items-center p-4 ">
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
        <TouchableOpacity style={styles.logInButton} onPress={handleSignIn}>
          <Text style={styles.login}>Sign in</Text>
        </TouchableOpacity>

        <View className="flex flex-row items-center justify-between mt-8">
          <Text style={styles.account}>Don&apos;t have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text style={styles.forgotPassword}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </SafeAreaView>
  );
};export default SignIn;

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