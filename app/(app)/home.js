// React stuff
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Text, View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';

//Firebase and configuration
import { getDocs, query, where } from "firebase/firestore";
import { onSnapshot, doc } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";

// Expo
import { MaterialIcons } from "@expo/vector-icons";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Local Imports
import { useAuth } from "../../context/authContext";
import UserListHome from "../../components/layouts/UserListHome";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const [currentWampum, setCurrentWampum] = useState(user?.wampnum);

  //Keep track of weather the server has returned the wampum value
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Handles reloading front page information between page navigation...
  useFocusEffect(
    useCallback(() => {
      setCurrentWampum(user?.wampnum);
      setUsers([]); // Need to reset the list of friends
      if (user && user.friends) {
        console.log(user?.wampnum);
        getUserFriends();
      } else {
        console.log("User or friends not yet loaded");
      }
    }, [user])
  );

  useEffect(() => {
    if (user && user.userId) {
      fetchWampums();
      setLoading(false);
    }
  }, [user]);

  const fetchWampums = () => {
    if (user && user.userId) {
      const userDocRef = doc(usersRef, user.userId);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setCurrentWampum(data.wampnum);
          user.wampnum = data.wampnum;
        } else {
          console.log("No such document!");
        }
      });

      return () => unsubscribe(); // Clean up the listener on component unmount
    }
  };

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

  // Grabs users and parses the data
  const getUserFriends = async () => {
    if (!user || !user.friends) {
      console.error("User or user.friends is not defined");
      return;
    }

    setLoadingUsers(true);

    try {
      // Fetch Users
      const q = query(usersRef, where("active", "==", true));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data() });
      });

      // Get rid of the currently signed-in user!
      const cutData = data.filter(
        (u) => u.userId !== user.userId
      );

      // Separate friends and non-friends
      const friends = cutData.filter((u) =>
        user.friends.includes(u.userId)
      );

      // We only want to show the user their friends on the homepage...
      setUsers(friends);
    } catch (e) {
      Alert.alert("Data Error", "There has been an issue");
      console.log(e);
    }

    setLoadingUsers(false); // Stop loading once data is fetched
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-col align-middle justify-center bg-gray-200 pt-2" style={{height:hp(10)}}>
        {users.length > 0 ? (
          <UserListHome
            users={users}
          />
        ) : loadingUsers ? (
          <></>
        ) : (
          <></>
        )}
      </View>
      <View className="flex flex-col p-4 gap-6 m-4">
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
                {currentWampum}
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
