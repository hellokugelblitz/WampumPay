// React and React native
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React from "react";
import { View } from "react-native";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";

// Expo
import { Image } from "expo-image";
import { Feather, AntDesign } from "@expo/vector-icons";

// Local Imports
import { blurhash } from "../../utils/common";
import { MenuItem } from "../menu/CustomMenuItems";

// Function that handles profile picture for header
export default function ProfilePicture({
  user,
  onImageError,
  openUserOptionsWindow,
  handleLogout,
}) {
  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          triggerWrapper: {
            // trigger wrapper styles not using this haha
          },
        }}
      >
        <Image
          style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
          source={user?.profileUrl}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={500}
          onError={onImageError}
        />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 10,
            borderCurve: "continuous",
            marginTop: 40,
            marginLeft: -30,
            backgroundColor: "white",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 0 },
            width: 200,
          },
        }}
      >
        <MenuItem
          text="Manage Profile"
          action={openUserOptionsWindow}
          value={null}
          icon={<Feather name="user" size={hp(2.5)} color="#737373" />}
        />
        <Divider />
        <MenuItem
          text="Log Out"
          action={handleLogout}
          value={null}
          icon={<AntDesign name="logout" size={hp(2.5)} color="#737373" />}
        />
      </MenuOptions>
    </Menu>
  );
}

// Small function to create a divider between options...
const Divider = () => {
  return <View className="p-[1px] w-full bg-neutral-200" />;
};
