import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import UserItem from "../elements/UserItem";
import { useRouter } from "expo-router";

export default function UserList({ users, onAddFavorite, initialFavorites }) {
  const router = useRouter();
  const [favorites, setFavorites] = useState(initialFavorites);

  //This is used to optimistacally update the favorites view without server confirmation since that takes too long...
  const handleToggleFavorite = async (userId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(userId)
        ? prevFavorites.filter((id) => id !== userId)
        : [...prevFavorites, userId]
    );

    // Perform the server update
    try {
      await onAddFavorite(userId);
    } catch (error) {
      // Revert the local state if the server update fails
      setFavorites((prevFavorites) =>
        prevFavorites.includes(userId)
          ? prevFavorites.filter((id) => id !== userId)
          : [...prevFavorites, userId]
      );
      console.error("Error updating favorite: ", error);
    }
  };

  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ paddingVertical: 25 }}
        keyExtractor={(item) => item?.userId}
        showsVerticalScrollIndicator={true}
        renderItem={({ item, index }) => (
          <UserItem
            isOnFavorites={favorites.includes(item.userId)}
            router={router}
            noBorder={index + 1 == users.length}
            item={item}
            index={index}
            onAddFavorite={handleToggleFavorite}
          />
        )}
      />
    </View>
  );
}
