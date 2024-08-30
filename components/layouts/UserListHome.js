import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import UserItemHome from "../elements/UserItemHome";
import { useRouter } from "expo-router";

export default function UserListHome({ users }) {
  const router = useRouter();

  return (
    <View className="align-middle justify-items-center ">
      {/* <Text className="bg-transparent text-gray-500 z-0 p-2">
        Your friends:
      </Text> */}
      <FlatList

        data={users}
        horizontal={true}
        // contentContainerStyle={{}}
        keyExtractor={(item) => item?.userId}
        renderItem={({ item, index }) => (
          <UserItemHome
            router={router}
            noBorder={index + 1 == users.length}
            item={item}
            index={index}
          />
        )}
      />
    </View>
  );
}
