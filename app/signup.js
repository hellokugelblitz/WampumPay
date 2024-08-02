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
import PhoneInput from "react-native-phone-number-input";

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
  const [phoneNumber, setPhoneNumber] = useState("");

  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const emailRef = useRef("");
  const profileRef = useRef("");
  const phoneInputRef = useRef(null); // Phone number input reference

  const handleRegister = async () => {
    if (!phoneInputRef.current?.isValidNumber(phoneNumber)) {
      Alert.alert("Please input a valid phone number...");
      return;
    }

    let errorMessage = "";

    // Check each field for validity
    if (!usernameRef.current || usernameRef.current.trim() === "") {
      errorMessage += "Username is required.\n";
    } else if (usernameRef.current.length > 12) {
      errorMessage += "Username is too long.\n";
    }

    if (!passwordRef.current || passwordRef.current.trim() === "") {
      errorMessage += "Password is required.\n";
    }
    if (!emailRef.current || emailRef.current.trim() === "") {
      errorMessage += "Email address is required.\n";
    }
    if (!profileRef.current || profileRef.current.trim() === "") {
      errorMessage += "Profile picture URL is required.\n";
    }

    // If there are any error messages, show them to the user
    if (errorMessage) {
      Alert.alert("Registration Error", errorMessage.trim());
      return;
    }

    setLoading(true);
    console.log("Registering with: ", profileRef.current, " and, ", phoneNumber)
    let response = await register(
      emailRef.current,
      passwordRef.current,
      usernameRef.current,
      profileRef.current,
      phoneInputRef.current
    );
    setLoading(false);

    console.log("got result:", response);
    if (!response.success) {
      Alert.alert("Sign up Issue", response.msg);
    }

    // Prompt user for verification code if MFA is enabled
    // if (response.data?.verificationId) {
    //   Alert.alert(
    //     "Verify Phone Number",
    //     "Please enter the verification code sent to your phone.",
    //     [
    //       {
    //         text: "Submit",
    //         onPress: async () => {
    //           try {
    //             const credential = PhoneAuthProvider.credential(
    //               response.data.verificationId,
    //               verificationCode
    //             );
    //             const user = response.data.user;
    //             await user.multiFactor.enroll(credential, "My phone number");
    //             Alert.alert("Success", "Your account has been created!");
    //           } catch (error) {
    //             Alert.alert("Verification Error", error.message);
    //           }
    //         },
    //       },
    //     ],
    //     {
    //       cancelable: false,
    //     }
    //   );
    // } else {
    //   Alert.alert("Success", "Your account has been created!");
    // }

  };

  return (
    <CustomKeyboardView>
      <View className="flex-1">
        <StatusBar style="dark" />
        <View
          style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }}
          className="flex-1 gap-10"
        >
          <View className="items-center">
            <Image
              style={{ height: hp(15) }}
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

              {/* PHONE NUMBER INPUT! Tehehehehehe */}
              <View style={{height: hp(7), flexDirection:"row", alignSelf:"center"}}>
                <PhoneInput
                  ref={phoneInputRef}
                  defaultValue={phoneNumber}
                  defaultCode="US"
                  layout="first"
                  onChangeFormattedText={(text) => setPhoneNumber(text)}
                  flagButtonStyle={{backgroundColor: "#e5e5e5", borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }}
                  codeTextStyle={{ color:"#808080"}} // Text for + code
                  textContainerStyle={{ backgroundColor: "#f5f5f5", fontWeight: '600', borderTopRightRadius: 16, borderBottomRightRadius: 16 }} // Box for user number
                  textInputProps={{
                    placeholder:"Phone Number",
                    placeholderTextColor: "#808080"
                  }}
                  textInputStyle={{ padding: 0, fontSize: 16, fontWeight: '600', color: "#404040" }} // For users number
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
