// React Stuff
import { View, Text, FlatList, ScrollView } from "react-native";
import React from "react";

// Local imports
import TransactionListItem from "../elements/TransactionListItem";

// Represents layout for smaller list items on the global transactions page.
// Query is done at a higher level...
export default function GlobalTransactionList({ payments }) {
  return (
    <View className="flex-1">
      <FlatList
        data={payments}
        contentContainerStyle={{ paddingVertical: 10 }}
        keyExtractor={(item) => Math.random()}
        showsVerticalScrollIndicator={true}
        renderItem={({ item, index }) => (
          <TransactionListItem
            noBorder={index + 1 == payments.length}
            item={item}
            index={index}
          />
        )}
      />
    </View>
  );
}
