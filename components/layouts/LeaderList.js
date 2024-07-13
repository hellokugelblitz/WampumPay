import { View, Text, FlatList } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import LeaderItem from "../elements/LeaderItem";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { blurhash } from "../../utils/common";

export default function LeaderList({ users }) {
  const router = useRouter();
  const topThree = users.slice(0, 3);

  //Colors
  //#a21caf winner Fuchsia-700
  //#7e22ce second Purple-700
  //#6d28d9 third Violet-700

  return (
    <View className="flex-1 bg-white">
      <View
        style={{ paddingTop: hp(10) }}
        className="flex-row gap-0 items-end self-center"
      >
        {/* SECOND */}
        <View
          style={{ width: wp(30), height: hp(18) }}
          className="flex-col bg-gray-100 rounded-tl-3xl rounded-bl-xl items-center justify-start relative"
        >
          <Image
            style={{
              height: hp(8),
              width: hp(8),
              borderRadius: 100,
              top: -hp(4),
              borderWidth: 3,
              borderColor: "#7e22ce",
            }}
            source={users[1].profileUrl}
            placeholder={blurhash}
            transition={500}
          ></Image>
          <FontAwesome6
            style={{ top: hp(2) }}
            name="diamond"
            size={24}
            color="#7e22ce"
            className="z-1 self-center absolute visible"
          ></FontAwesome6>
          <Text
            style={{ top: hp(2.5), fontSize: hp(1.4) }}
            className="absolute text-white"
          >
            2
          </Text>
          <Text
            style={{ fontSize: hp(2) }}
            className="font-light text-black relative mb-2"
          >
            {users[1].username}
          </Text>
          <Text
            style={{ fontSize: hp(2.5) }}
            className="font-bold text-purple-700 relative"
          >
            {users[1].wampnum}
          </Text>
        </View>

        {/* WINNER */}
        <View
          style={{ width: wp(30), height: hp(25) }}
          className="bg-gray-200 rounded-t-3xl items-center "
        >
          <FontAwesome5
            style={{ top: -hp(9) }}
            className="absolute z-10"
            name="crown"
            size={35}
            color="#a21caf"
          />
          <Image
            style={{
              height: hp(10),
              width: hp(10),
              borderRadius: 100,
              top: -hp(4),
              borderWidth: 3,
              borderColor: "#a21caf",
            }}
            source={users[0].profileUrl}
            placeholder={blurhash}
            transition={500}
          ></Image>
          <FontAwesome6
            style={{ top: hp(4.2) }}
            name="diamond"
            size={24}
            color="#a21caf"
            className="z-1 self-center absolute visible"
          ></FontAwesome6>
          <Text
            style={{ top: hp(4.6), fontSize: hp(1.4) }}
            className="absolute text-white"
          >
            1
          </Text>
          <Text
            style={{ fontSize: hp(2) }}
            className="font-light text-black relative mb-2"
          >
            {users[0].username}
          </Text>
          <Text
            style={{ fontSize: hp(2.5) }}
            className="font-bold text-fuchsia-700 relative"
          >
            {users[0].wampnum}
          </Text>
        </View>

        {/* THIRD */}
        <View
          style={{ width: wp(30), height: hp(18) }}
          className="flex-col bg-gray-100 rounded-tr-3xl rounded-br-xl items-center justify-start relative"
        >
          <Image
            style={{
              height: hp(8),
              width: hp(8),
              borderRadius: 100,
              top: -hp(4),
              borderWidth: 3,
              borderColor: "#6d28d9",
            }}
            source={users[2].profileUrl}
            placeholder={blurhash}
            transition={500}
          ></Image>
          <FontAwesome6
            style={{ top: hp(2) }}
            name="diamond"
            size={24}
            color="#6d28d9"
            className="z-1 self-center absolute visible"
          ></FontAwesome6>
          <Text
            style={{ top: hp(2.5), fontSize: hp(1.4) }}
            className="absolute text-white"
          >
            3
          </Text>
          <Text
            style={{ fontSize: hp(2) }}
            className="font-light text-black relative mb-2"
          >
            {users[2].username}
          </Text>
          <Text
            style={{ fontSize: hp(2.5) }}
            className="font-bold text-violet-700 relative"
          >
            {users[2].wampnum}
          </Text>
        </View>
      </View>
      <View
        style={{ width: wp(100), marginTop: hp(1) }}
        className="flex-1 bg-white content-center rounded-t-2xl"
      >
        <FlatList
          data={users.slice(3)}
          contentContainerStyle={{ margin: hp(2), paddingVertical: 2 }}
          keyExtractor={(item) => Math.random()}
          showsVerticalScrollIndicator={true}
          alwaysBounceVertical={true}
          renderItem={({ item, index }) => (
            <LeaderItem
              router={router}
              noBorder={index + 1 == users.slice(3).length}
              item={item}
              index={index}
            />
          )}
        />
      </View>
    </View>
  );
}
