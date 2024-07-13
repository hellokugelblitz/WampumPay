// Imports
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

// Used for initial app loading screen.. beware of issue with LottieView and android.
export default function Loading({ size }) {
  return (
    <View style={{ height: size, aspectRatio: 1 }}>
      <LottieView
        style={{ flex: 1, width: wp(15), height: hp(15) }}
        source={require("../../assets/anims/load.json")}
        autoPlay
        loop
      ></LottieView>
    </View>
  );
}
