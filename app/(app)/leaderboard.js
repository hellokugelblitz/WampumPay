// React
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, Text, ActivityIndicator, StatusBar } from "react-native";
import { useEffect, useState } from "react";
import React from "react";

// Local Imports
import { useAuth } from "../../context/authContext";
import LeaderList from "../../components/layouts/LeaderList";

// Firebase
import { getDocs, query, where, orderBy } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";

// Leaderboard
export default function Leaderboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  // On Load
  useEffect(() => {
    if (user?.userId) {
      getUsers();
      console.log("fetching users...");
    }
  }, []);

  // Fetches users from firebase and parses the data
  const getUsers = async () => {
    //Fetch Users
    const q = query(usersRef, orderBy("wampnum", "desc"));

    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data() });
    });

    // Remove deleted users...
    const cutDeactivated = data.filter((u) => u.active == true);

    setUsers(cutDeactivated);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      {users.length > 0 ? (
        <LeaderList users={users}></LeaderList>
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
