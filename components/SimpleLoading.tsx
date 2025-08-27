import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";

const SimpleLoading = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(1, { duration: 1000 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value * 360}deg` }],
    };
  });

  return (
    <View className="flex-1 items-center justify-center bg-bgColor">
      <Animated.View style={animatedStyle}>
        <View className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full" />
      </Animated.View>
      <Text className="text-primary text-lg font-semibold mt-4">Loading...</Text>
    </View>
  );
};

export default SimpleLoading;
