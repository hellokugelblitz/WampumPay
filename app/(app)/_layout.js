// React stuff
import React from "react";

// Expo
import { Stack } from "expo-router";

// Local Imports
import HomeHeader from "../../components/headers/HomeHeader";
import UniversalHeader from "../../components/headers/UniversalHeader";

// Layout here is responsible for all universal items on authenticated pages... or just headers!
export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          header: ({ navigation, route, options, back }) => <HomeHeader />,
        }}
      />

      <Stack.Screen
        name="payment"
        options={{
          header: (props) => (
            <UniversalHeader {...props} title="Make a Payment" />
          ),
        }}
      />

      <Stack.Screen
        name="transaction"
        options={{
          header: (props) => (
            <UniversalHeader {...props} title="Your transaction" />
          ),
        }}
      />

      <Stack.Screen
        name="leaderboard"
        options={{
          header: (props) => <UniversalHeader {...props} title="Leaderboard" />,
        }}
      />

      <Stack.Screen
        name="global"
        options={{
          header: (props) => (
            <UniversalHeader {...props} title="Global Transactions" />
          ),
        }}
      />

      <Stack.Screen
        name="user"
        options={{
          header: (props) => (
            <UniversalHeader
              {...props}
              title="Profile settings"
              showProfileMenu={false}
            />
          ),
        }}
      />
    </Stack>
  );
}
