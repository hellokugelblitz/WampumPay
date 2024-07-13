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
      className={`flex-row items-center justify-between mx-4 gap-3 mb-4 pb-4 ${
        noBorder ? "" : "border-b border-b-neutral-200"
      }`}
    >
      <View className="rounded-full border-2 border-purple-300">
        <Image
          style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
          source={item?.profileUrl}
          placeholder={blurhash}
          transition={500}
        />
      </View>
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-neutral-800"
          >
            {item?.username}
          </Text>
          <View className="flex-row gap-4">
            <Text style={{ fontSize: hp(2.2) }} className="text-purple-300">
              {item?.wampnum}W
            </Text>
            {isOnFavorites ? (
              <TouchableOpacity onPress={() => onAddFavorite(item?.userId)}>
                <FontAwesome name="star" size={24} color="#fcd34d" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => onAddFavorite(item?.userId)}>
                <FontAwesome name="star" size={24} color="#d4d4d4" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
