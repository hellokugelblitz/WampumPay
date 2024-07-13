// React
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
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Local imports
import Loading from "../components/elements/Loading";
import CustomKeyboardView from "../components/CustomKeyboardView";
import { useAuth } from "../context/authContext";

// Handles signing in
export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  // Self explanatory
  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("You've done something", "Please do better next time");
      return;
    }

    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);

    console.log("sign in response: ", response);
    if (!response.success) {
      Alert.alert("Sign in", response.msg);
    }
  };

  return (
    <CustomKeyboardView>
      <View className="flex-1">
        <StatusBar style="dark" />
        <View
          style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}
          className="flex-1 gap-12"
        >
          <View className="items-center">
            <Image
              style={{ height: hp(25) }}
              resizeMode="contain"
              source={require("../assets/images/WP_purp-02.png")}
            ></Image>
          </View>
          <View className="gap-10">
            <Text
              style={{ fontSize: hp(4) }}
              className="font-bold tracking-wider text-center text-neutral-800"
            >
              Sign In
            </Text>
            <View className="gap-4">
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
              <View className="gap-3">
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
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="font-semibold text-right text-neutral-500"
                >
                  Forgot Password
                </Text>
              </View>
              <View>
                {loading ? (
                  <View className="flex-row justify-center">
                    <Loading size={hp(6)} />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleLogin}
                    style={{ height: hp(6.5) }}
                    className="bg-purple-950 rounded-xl justify-center items-center"
                  >
                    <Text
                      style={{ fontSize: hp(2.7) }}
                      className="font-bold tracking-wider text-white"
                    >
                      Sign In
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View className="flex-row justify-center items-center gap-2">
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="font-semibold text-neutral-500"
                >
                  Don't have an account?
                </Text>
                <Pressable onPress={() => router.push("signup")}>
                  <Text
                    style={{ fontSize: hp(1.8) }}
                    className="font-semibold text-purple-500"
                  >
                    Sign Up
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
