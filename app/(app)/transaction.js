// React stuff
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, Text, TouchableOpacity, Alert, TextInput } from "react-native";
import React, { useState } from "react";

// Expo stuff
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

// Local Imports
import { useAuth } from "../../context/authContext";
import { blurhash } from "../../utils/common";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import { auth, db } from "../../firebaseConfig";

// Firebase
import { doc, setDoc, runTransaction, collection } from "firebase/firestore";

// Direct transaction between two users
export default function Transaction() {
  const { logout, user, updateUserData } = useAuth();
  const [currentCount, setCurrentCount] = useState(0);
  const [message, setMessage] = useState("No Message");
  const item = useLocalSearchParams();
  const router = useRouter();

  // For the counter
  const increaseAmt = () => {
    if (currentCount < Number(user?.wampnum)) {
      setCurrentCount((prevCount) => prevCount + 1);
    }
  };

  const decreaseAmt = () => {
    if (currentCount > 0) setCurrentCount((prevCount) => prevCount - 1);
  };

  // TODO: This method is too complex need to compartmentalize it
  // Makes the payment between two users
  const makePayment = async () => {
    const userRef = doc(db, "users", user?.userId);
    const itemUserRef = doc(db, "users", item?.userId);

    if (currentCount == 0) {
      Alert.alert("Transaction failed: ", "You cannot send 0 Wampums");
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const itemUserDoc = await transaction.get(itemUserRef);

        if (!userDoc.exists() || !itemUserDoc.exists()) {
          throw "Document does not exist!";
        }

        const newUserWampnum = Number(userDoc.data().wampnum) - currentCount;
        const newItemUserWampnum =
          Number(itemUserDoc.data().wampnum) + currentCount;

        transaction.update(userRef, { wampnum: newUserWampnum });
        transaction.update(itemUserRef, { wampnum: newItemUserWampnum });

        // Create a new payment entry
        const newPaymentRef = doc(collection(db, "payments"));
        const paymentData = {
          fromUserId: userRef.id,
          toUserId: itemUserRef.id,
          amount: currentCount,
          message: message,
          timestamp: new Date(),
        };
        transaction.set(newPaymentRef, paymentData);
      });

      //Updating local user data.
      const response = await updateUserData(user?.userId);

      setCurrentCount(0);
      Alert.alert("Thank you", "Payment Successful!");
      router.push({ pathname: "/home" });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };

  return (
    <CustomKeyboardView style={{ height: hp(100) }} className="bg-white">
      <View
        style={{ height: hp(85) }}
        className="flex-1 bg-white items-center p-8 gap-6"
      >
        <View className="flex-row align-middle items-center gap-6">
          <View className="flex gap-2">
            <View className="rounded-full border-2 border-purple-200">
              <Image
                style={{ height: hp(12), width: hp(12), borderRadius: 100 }}
                source={user?.profileUrl}
                placeholder={blurhash}
                transition={500}
              />
            </View>
            <Text
              style={{ fontSize: hp(1.4) }}
              className="text-neutral-400 text-center"
            >
              {user?.username}
            </Text>
          </View>
          <AntDesign name="heart" size={24} color="#581c87" />
          <View className="flex gap-2">
            <View className="rounded-full border-2 border-purple-200">
              <Image
                style={{ height: hp(12), width: hp(12), borderRadius: 100 }}
                source={item?.profileUrl}
                placeholder={blurhash}
                transition={500}
              />
            </View>
            <Text
              style={{ fontSize: hp(1.4) }}
              className="text-neutral-400 text-center"
            >
              {item?.username}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-6">
          <TouchableOpacity
            onPress={decreaseAmt}
            style={{ height: hp(6.5) }}
            className="flex-row gap-4 bg-white border border-black px-4 rounded-full justify-center align-bottom items-center m-4"
          >
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: hp(12) }} className="text-black text-center">
            {currentCount}
          </Text>
          <TouchableOpacity
            onPress={increaseAmt}
            style={{ height: hp(6.5) }}
            className="flex-row gap-4 bg-white border border-black px-4 rounded-full justify-center align-bottom items-center m-4"
          >
            <AntDesign name="right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{ height: hp(7) }}
          className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center"
        >
          <TextInput
            onChangeText={setMessage}
            style={{ fontSize: hp(2) }}
            className="flex-1 font-semibold text-neutral-700"
            placeholder="Message"
            placeholderTextColor="gray"
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={makePayment}
            style={{ height: hp(6.5) }}
            className="flex-row gap-4 bg-purple-700 px-4 rounded-xl justify-center align-bottom items-center m-4"
          >
            <Text
              style={{ fontSize: hp(2.7) }}
              className="font-semibold tracking-wider text-white"
            >
              Make Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
