// React Stuff
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

// Expo
import { Image } from "expo-image";

// Local Imports
import { blurhash } from "../../utils/common";

// Items for the lower section of the leaderboard, represents users...
export default function LeaderItem({ index, item, router, noBorder }) {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between mx-4 gap-3 mb-4 pb-2 ${
        noBorder ? "" : "border-b border-b-gray-400"
      }`}
    >
      <Image
        style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
        source={item?.profileUrl}
        placeholder={blurhash}
        transition={500}
      />

      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-black"
          >
            {index + 4}. {item?.username}
          </Text>
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-black"
          >
            {item?.wampnum} Wampums
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
