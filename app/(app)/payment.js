// React
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import React from "react";

// Local Imports
import { useAuth } from "../../context/authContext";
import UserList from "../../components/layouts/UserList";

// Firebase
import { getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";
import { auth, db } from "../../firebaseConfig"; // Corrected import path
import { doc, getDoc, setDoc } from "firebase/firestore";

// Screen for selecting payment
export default function Payment() {
  const { user, updateUserData } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentSearch, setCurrentSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // On Load
  useEffect(() => {
    if (user?.userId) {
      getUsers();
    }
  }, [currentSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // Set timeout for 5 seconds

    return () => clearTimeout(timeout);
  }, []);

  // Okay, so im definetly prop drilling for this function, but its whatever... -jack
  const handleAddingFavorite = async (userId) => {
    // Creating a reference to the current user...
    const docRef = doc(db, "users", user?.userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      // Update friends array correctly
      if (data.friends && data.friends.includes(userId)) {
        updatedFriends = data.friends.filter((friendId) => friendId !== userId);
      } else {
        updatedFriends = [...(data.friends || []), userId];
      }

      await setDoc(docRef, { ...data, friends: updatedFriends });
    } else {
      console.log("No such document!");
    }

    // Update local user data so this is reflected in UI...
    const response = await updateUserData(user?.userId);
  };

  // Grabs users and parses the data
  const getUsers = async () => {
    // Fetch Users
    const q = query(usersRef, where("active", "==", true));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data() });
    });

    // Cut out based on the search parameters
    const cutData = data.filter((u) =>
      u.username.toLowerCase().includes(currentSearch.toLowerCase())
    );

    // Get rid of the currently signed in user!
    const cutCurrentUser = cutData.filter(
      (u) => !u.userId.includes(user?.userId)
    );

    // Separate friends and non-friends
    const friends = cutCurrentUser.filter((u) =>
      user.friends.includes(u.userId)
    );
    const nonFriends = cutCurrentUser.filter(
      (u) => !user.friends.includes(u.userId)
    );

    // Combine friends and non-friends, with friends displaying at the top
    const sortedData = [...friends, ...nonFriends];
    setUsers(sortedData);
    setLoading(false); // Stop loading once data is fetched
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <View
        style={{ height: hp(7) }}
        className="flex-row gap-4 px-4 m-4 mb-0 bg-neutral-100 rounded-2xl items-center"
      >
        <TextInput
          onChangeText={setCurrentSearch}
          style={{ fontSize: hp(2) }}
          className="flex-1 font-semibold text-neutral-700"
          placeholder="Enter Search..."
          placeholderTextColor="gray"
        />
      </View>

      {users.length > 0 ? (
        <UserList
          users={users}
          onAddFavorite={handleAddingFavorite}
          initialFavorites={user?.friends || []}
        />
      ) : loading ? (
        <View className="flex items-center" style={{ top: hp(20) }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View className="flex items-center" style={{ top: hp(20) }}>
          <Text className="text-neutral-400">No users found</Text>
        </View>
      )}
    </View>
  );
}
