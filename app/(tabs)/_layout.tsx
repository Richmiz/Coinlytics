import CustomNavBar from "@/components/CustomNavBat";
import { Tabs } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Tabs tabBar={(props) => <CustomNavBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Tabs.Screen name="History" options={{ title: "History", headerShown: false }} />
      <Tabs.Screen name="Analytics" options={{ title: "Analytics", headerShown: false }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile", headerShown: false }} />
    </Tabs>
  );
}