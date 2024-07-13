import { View, Text, ActivityIndicator } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import React from "react";

// Essentially a splash screen
export default function StartPage() {
  return (
    // What we have here is a loading screen
    <View className="flex-1 justify-center align-middle items-center bg-white">
      <View>
        <Image
          style={{ height: hp(40), width: wp(40) }}
          contentFit="contain"
          source={require("../assets/images/WP_black-03.png")}
        ></Image>
        <ActivityIndicator size="large" color="gray" />
      </View>
    </View>
  );
}
