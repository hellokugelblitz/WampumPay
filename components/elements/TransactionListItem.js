import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React from "react";
import { Image } from "expo-image";
import { blurhash } from "../../utils/common";
import { getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";
import AntDesign from "@expo/vector-icons/AntDesign";

// Caching profile information for ease :)
const profileCache = {};

// Here we have a rather unique methodology for caching all of the user data
// Transactions only contain the corresponding userIds and nothing else so we
// have to grab that information from elsewhere in the database so that it
// can be displayed to the user...
const getUserProfileData = async (userId) => {
  if (profileCache[userId]) {
    return profileCache[userId];
  }

  const q = query(usersRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  let data = [];
  querySnapshot.forEach((doc) => {
    data.push({ ...doc.data() });
  });

  const profileData = data[0] || {};
  profileCache[userId] = profileData;
  return profileData;
};

// List items for list of transactions, query is handled on the higher level
export default function TransactionListItem({ item, noBorder }) {
  const [senderData, setSenderData] = useState({});
  const [receiverData, setReceiverData] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      if (item?.fromUserId) {
        const sender = await getUserProfileData(item.fromUserId);
        const receiver = await getUserProfileData(item.toUserId);
        setSenderData(sender);
        setReceiverData(receiver);
      }
    };
    fetchProfileData();
  }, [item]);

  const getUser = async (userId) => {
    //Fetch Users
    const q = query(usersRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data() });
    });
    console.log("RETURNING USER DATA", data[0].profileUrl); // prints just the profile url
    return data;
  };

  // Formatting message for readability..
  const truncatedMessage =
    item?.message.length > 60
      ? item.message.slice(0, 60) + "..."
      : item?.message;

  // Formatting timestamp object for readability...
  const date = new Date(item?.timestamp.seconds * 1000);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      style={{}}
      className={`flex-row justify-between items-center mx-4 pb-4 pt-4 gap-4  ${
        noBorder ? "" : "border-b border-b-neutral-200"
      }`}
    >
      <View className="flex-row gap-3">
        <View className="align-top self-start border-2 rounded-full border-purple-300">
          <Image
            style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
            source={senderData.profileUrl}
            placeholder={blurhash}
            transition={500}
          />
        </View>
        <View className="flex-col gap-3 ml-2">
          <View className="flex-col gap-1">
            <View className="flex-row gap-1">
              <Text className="font-bold text-neutral-400">
                {senderData.username}
              </Text>
              <Text className="text-neutral-400">paid</Text>
              <Text className="font-bold text-neutral-400">
                {receiverData.username}
              </Text>
            </View>
            <Text style={{ fontSize: hp(1.2) }} className="text-neutral-400">
              {formattedDate}, {formattedTime}
            </Text>
          </View>
          <Text
            style={{ maxWidth: wp(50), fontSize: hp(1.8) }}
            className="text-wrap"
          >
            {truncatedMessage}
          </Text>
        </View>
      </View>
      <View>
        <Text
          style={{ fontSize: hp(2.2) }}
          className="text-purple-300 absolute right-2"
        >
          +{item?.amount}
        </Text>
      </View>
    </View>
  );
}
