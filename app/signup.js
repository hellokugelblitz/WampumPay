// Imports
import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React, { useRef, useState } from "react";

// Expo
import { Octicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Local Imports
import Loading from "../components/elements/Loading";
import CustomKeyboardView from "../components/CustomKeyboardView";
import { useAuth } from "../context/authContext";

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const emailRef = useRef("");
  const profileRef = useRef("");

  const handleRegister = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !usernameRef.current ||
      !profileRef.current
    ) {
      Alert.alert("You've done something", "Please do better next time");
      return;
    }
    setLoading(true);

    let response = await register(
      emailRef.current,
      passwordRef.current,
      usernameRef.current,
      profileRef.current
    );
    setLoading(false);

    console.log("got result:", response);
    if (!response.success) {
      Alert.alert("Sign up Issue", response.msg);
    }
  };

  return (
    <CustomKeyboardView>
      <View className="flex-1">
        <StatusBar style="dark" />
        <View
          style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }}
          className="flex-1 gap-12"
        >
          <View className="items-center">
            <Image
              style={{ height: hp(20) }}
              resizeMode="contain"
              source={require("../assets/images/WP_purp-02.png")}
            ></Image>
          </View>
          <View className="gap-10">
            <Text
              style={{ fontSize: hp(4) }}
              className="font-bold tracking-wider text-center text-neutral-800"
            >
              Sign Up
            </Text>

            <View className="gap-4">
              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center"
              >
                <Feather name="user" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={(value) => (usernameRef.current = value)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Username"
                  placeholderTextColor="gray"
                />
              </View>

              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center"
              >
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={(value) => (passwordRef.current = value)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Password"
                  placeholderTextColor="gray"
                  secureTextEntry
                />
              </View>

              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center"
              >
                <Octicons name="mail" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={(value) => (emailRef.current = value)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Email Address"
                  placeholderTextColor="gray"
                />
              </View>

              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center"
              >
                <Feather name="image" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={(value) => (profileRef.current = value)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Profile Picture URL"
                  placeholderTextColor="gray"
                />
              </View>

              <View>
                {loading ? (
                  <View className="flex-row justify-center">
                    <Loading size={hp(6)} />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleRegister}
                    style={{ height: hp(6.5) }}
                    className="bg-purple-950 rounded-xl justify-center items-center"
                  >
                    <Text
                      style={{ fontSize: hp(2.7) }}
                      className="font-bold tracking-wider text-white"
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="flex-row justify-center items-center gap-2">
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="font-semibold text-neutral-500"
                >
                  Already have an account?
                </Text>
                <Pressable onPress={() => router.push("signin")}>
                  <Text
                    style={{ fontSize: hp(1.8) }}
                    className="font-semibold text-purple-500"
                  >
                    Sign In!
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
