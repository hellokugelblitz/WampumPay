// React stuff
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

// Expo
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";

// Local Imports
import { blurhash } from "../../utils/common";

// Represents a single user in any active list of users
export default function UserItem({
  item,
  router,
  onAddFavorite,
  noBorder,
  isOnFavorites,
}) {
  // Users can click on these and it will bring them to the
  const openTransactionRoom = () => {
    router.push({ pathname: "/transaction", params: item });
  };

  // Here there be dragons...
  return (
    <TouchableOpacity
      onPress={openTransactionRoom}
      className={`flex-col items-center align-middle justify-between px-2 pb-2 ${
        noBorder ? "" : "border-b border-b-neutral-200"
      }`}
    >
      <View className="rounded-full border-2 border-purple-300">
        <Image
          style={{ height: hp(7), width: hp(7), borderRadius: 100 }}
          source={item?.profileUrl}
          placeholder={blurhash}
          transition={500}
        />
      </View>
    </TouchableOpacity>
  );
}
