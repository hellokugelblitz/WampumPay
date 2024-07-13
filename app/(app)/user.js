// React
import { Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Expo
import { Image } from "expo-image";

// Local Imports
import { blurhash } from "../../utils/common";
import { useAuth } from "../../context/authContext";

// Firebase
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Page for managing user profiles
export default function UserOptions() {
  const { logout, user, updateUserData } = useAuth();
  const [newUsername, setNewUsername] = useState(user?.username);
  const [newUrl, setNewUrl] = useState(user?.profileUrl);

  const updateUserInformation = async () => {
    // Creating a reference to the current user...
    const docRef = doc(db, "users", user?.userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      // Check for valid information:
      if (!(await isImgUrl(newUrl))) {
        Alert.alert("Please enter a valid image URL");
      } else if (newUsername.length > 15 || newUsername.length < 1) {
        Alert.alert("Please enter better username (1-15 characters)");
      } else {
        await setDoc(docRef, {
          ...data,
          username: newUsername,
          profileUrl: newUrl,
        });
      }

      console.log("User Information Updated...");

      // Update local user data so this is reflected in UI...
      await updateUserData(user?.userId);
      console.log("User Information Updated");
    } else {
      console.log("No such document (deactivation)!");
    }
  };

  // Does actuall delete the user profile, misleading name, it prompts the user
  const deleteUserProfile = async () => {
    // Warn the user
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: promptReauthenticate },
      ]
    );
  };

  // Another prompt
  const promptReauthenticate = () => {
    // Prompt user to enter password for re-authentication
    Alert.prompt(
      "Re-authenticate",
      "Please enter your password to proceed with deletion.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: handleReauthenticate },
      ],
      "secure-text"
    );
  };

  // Reauthenticates the user before deletion
  const handleReauthenticate = async (password) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      // Re-authenticate the user
      await reauthenticateWithCredential(
        currentUser,
        EmailAuthProvider.credential(currentUser.email, password)
      );

      // Proceed with deletion
      await handleDelete();
    } catch (error) {
      Alert.alert("Re-authentication Failed", "Please try again.");
      console.log("Re-authentication error:", error);
    }
  };

  // Deactivates user in the database
  const handleDeactivate = async (userId) => {
    // Creating a reference to the current user...
    const docRef = doc(db, "users", user?.userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      // Update friends array correctly
      await setDoc(docRef, { ...data, active: false });
    } else {
      console.log("No such document (deactivation)!");
    }

    // Update local user data so this is reflected in UI...
    const response = await updateUserData(user?.userId);
    console.log("User deactivated");
  };

  // Actually deletes the user
  const handleDelete = async () => {
    try {
      // Notify server that this user will be deactivated...
      await handleDeactivate(user?.userId);

      // Grab auth for user
      const auth = getAuth();
      const currentUser = auth.currentUser;

      // Delete actual user
      if (currentUser) {
        await deleteUser(currentUser);
      }

      // Log them out
      await handleLogout();
    } catch (error) {
      Alert.alert("Issue", "There was an issue deleting your account");
      console.log("There has been a problem...", error);
    }
  };

  // For when a user deletes their account
  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-col items-center gap-2">
        <View className="rounded-full border-2 border-purple-300">
          <Image
            style={{ height: hp(15), width: hp(15), borderRadius: 100 }}
            source={user?.profileUrl}
            placeholder={blurhash}
            transition={500}
          />
        </View>
        <Text style={{ fontSize: hp(2) }} className="font-semibold">
          {user?.username}
        </Text>
        <View style={{ width: wp(90) }} className="flex-col gap-4 pt-4">
          <View>
            <Text className="pl-2 pb-1">Username:</Text>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center"
            >
              <TextInput
                style={{ fontSize: hp(2) }}
                onChangeText={setNewUsername}
                className="flex-1 font-semibold text-neutral-700"
                placeholder={user?.username}
                placeholderTextColor="gray"
              />
            </View>
          </View>
          <View>
            <Text className="pl-2 pb-1">Profile Image:</Text>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center"
            >
              <TextInput
                style={{ fontSize: hp(2) }}
                onChangeText={setNewUrl}
                className="flex-1 font-semibold text-neutral-700"
                placeholder={user?.profileUrl}
                placeholderTextColor="gray"
              />
            </View>
          </View>
        </View>
        <View className="pt-4">
          <TouchableOpacity
            onPress={updateUserInformation}
            style={{ height: hp(6.5) }}
            className="flex-row gap-4 bg-purple-700 rounded-xl justify-center align-bottom items-center my-4 p-4"
          >
            <Text
              style={{ fontSize: hp(2.2) }}
              className="tracking-wider text-white"
            >
              Update Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteUserProfile}
            style={{ height: hp(6.5) }}
            className="flex-row gap-4 bg-red-900 rounded-xl justify-center align-bottom items-center my-4 p-4"
          >
            <Text
              style={{ fontSize: hp(2.2) }}
              className="font-bold tracking-wider text-white"
            >
              Delete Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

async function isImgUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return (
      response.ok && response.headers.get("content-type").startsWith("image/")
    );
  } catch (error) {
    console.log("Not an image: ", url);
    console.log(error);
    return false;
  }
}
