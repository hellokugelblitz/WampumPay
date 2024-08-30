// React
import React, { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";

// Expo
import { Slot, useSegments, useRouter } from "expo-router";

// Local imports
import { AuthContextProvider, useAuth } from "../context/authContext";

// Import the global CSS file for tailwind
import "../global.css";

// Unauthorized stuff is located here..
const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments(); //Segments returns array with possible routes in given folder
  const router = useRouter();

  // On load, here this handles some auth stuff
  useEffect(() => {
    //Check to see if user is authenticated.
    if (typeof isAuthenticated == "undefined") return;

    const inApp = segments[0] == "(app)";

    //User has auth clearance but they are not inside the app yet...
    if (isAuthenticated && !inApp) {
      router.replace("home");
    } else if (isAuthenticated == false) {
      router.replace("signin");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <MenuProvider className="bg-red">
      <AuthContextProvider>
        <MainLayout />
      </AuthContextProvider>
    </MenuProvider>
  );
}
