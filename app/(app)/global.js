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
import { getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { paymentsRef } from "../../firebaseConfig";

export default function Global() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const LIMIT = 7; // Number of payments to load per batch

  // Runs on page load
  useEffect(() => {
    if (user?.userId) {
      getPayments();
    }
  }, []);

  // Fetches payments with a limit and handles pagination
  const getPayments = async () => {
    setLoading(true);
    try {
      const q = query(paymentsRef, orderBy("timestamp", "desc"), limit(LIMIT));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });

      setPayments(data);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  // Load more payments when reaching the end of the list
  const loadMorePayments = async () => {
    if (!lastDoc) return; // No more documents to load

    setLoadingMore(true);
    try {
      const q = query(
        paymentsRef,
        orderBy("timestamp", "desc"),
        startAfter(lastDoc),
        limit(LIMIT)
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });

      setPayments((prevPayments) => [...prevPayments, ...data]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoadingMore(false);
    } catch (e) {
      console.log(e);
      setLoadingMore(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      {payments.length > 0 ? (
        <GlobalTransactionList payments={payments} loadMore={loadMorePayments} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
