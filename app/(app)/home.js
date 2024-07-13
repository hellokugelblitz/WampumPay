// React stuff
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

// Expo
import { MaterialIcons } from "@expo/vector-icons";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Local Imports
import { useAuth } from "../../context/authContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  //Keep track of weather the server has returned the wampum value
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user && user.wampnum !== undefined) {
      setLoading(false);
    }
  }, [user]);

  // These functions route the user to different pages...
  const openPaymentWindow = () => {
    router.push({ pathname: "/payment" });
  };

  const openLeaderBoardWindow = () => {
    router.push({ pathname: "/leaderboard" });
  };

  const openGlobalWindow = () => {
    router.push({ pathname: "/global" });
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex flex-col p-4 gap-6">
        {
          // Account for lag time with the server
          loading ? (
            <View
              style={{ height: hp(20) }}
              className="flex-col border-2 border-purple-200 rounded-full justify-center items-center"
            >
              <ActivityIndicator className="" size="large" />
            </View>
          ) : (
            <View
              style={{ height: hp(20) }}
              className="flex-col border-2 border-purple-200 rounded-full justify-center items-center"
            >
              <Text
                style={{ fontSize: hp(12) }}
                className="text-purple-950 text-center"
              >
                {user?.wampnum}
              </Text>
              <Text
                style={{ fontSize: hp(2) }}
                className="text-neutral-400 text-center"
              >
                Wampums
              </Text>
            </View>
          )
        }

        <View className="gap-0">
          <TouchableOpacity
            onPress={openPaymentWindow}
            style={{ height: hp(6.5) }}
            className="flex-row gap-4 bg-purple-700 rounded-xl justify-center align-bottom items-center m-4"
          >
            <Feather name="send" size={24} color="white" />
            <Text
              style={{ fontSize: hp(2.7) }}
              className="font-semibold tracking-wider text-white"
            >
              Make Payment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openLeaderBoardWindow}
            style={{ height: hp(6.5) }}
            className="flex-row gap-4 bg-purple-700 rounded-xl justify-center align-bottom items-center m-4"
          >
            <MaterialIcons name="leaderboard" size={24} color="white" />
            <Text
              style={{ fontSize: hp(2.7) }}
              className="font-semibold tracking-wider text-white"
            >
              Leaderboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openGlobalWindow}
            style={{ height: hp(6.5) }}
            className="flex-row gap-4 bg-purple-700 rounded-xl justify-center align-bottom items-center m-4"
          >
            <AntDesign name="earth" size={24} color="white" />
            <Text
              style={{ fontSize: hp(2.2) }}
              className="font-semibold tracking-wider text-white"
            >
              Global Transactions
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
