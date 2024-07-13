// React Stuff
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, ActivityIndicator, StatusBar } from "react-native";
import { useEffect, useState } from "react";
import React from "react";

// Local Imports
import { useAuth } from "../../context/authContext";
import GlobalTransactionList from "../../components/layouts/GlobalTransactionList";
import { getDocs, query, orderBy } from "firebase/firestore";
import { paymentsRef } from "../../firebaseConfig";

export default function Global() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);

  // Runs on page load
  useEffect(() => {
    if (user?.userId) {
      getPayments();
    }
  }, []);

  // Fetches all historied transactions from the server
  const getPayments = async () => {
    try {
      const q = query(paymentsRef, orderBy("timestamp", "desc")); // Add params here...
      console.log("getting data:");

      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data() });
      });

      setPayments(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      {payments.length > 0 ? (
        <GlobalTransactionList payments={payments} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
