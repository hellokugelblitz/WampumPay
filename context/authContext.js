// React
import { createContext, useEffect, useState, useContext } from "react";

// Firebase
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Local imports
import { placeholderImageUrl } from '../utils/common';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const updateUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({
        ...user,
        username: data.username,
        profileUrl: data.profileUrl,
        userId: data.userId,
        wampnum: data.wampnum,
        friends: data.friends,
        active: data.active,
      });
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: response.user };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Your email is not registered...";
      }
      if (msg.includes("(auth/invalid-credential)")) {
        msg = "Email or password are incorrect...";
      }
      return { success: false, msg };
    }
  };

  //Part 4 21:00
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch {
      return { success: false, msg: e.message, error: e };
    }
  };

  const register = async (email, password, username, profileUrl) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const isValidImage = await isImgUrl(profileUrl);
      const validProfileUrl = isValidImage
        ? profileUrl
        : placeholderImageUrl; // Use placeholder image if URL is not valid

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        profileUrl: validProfileUrl,
        userId: response?.user?.uid,
        wampnum: 20,
        friends: [],
        active: true,
      });
      return { success: true, data: response?.user };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "fix your email";
      } else if (msg.includes("(auth/weak-password)")) {
        msg = "fix your password";
      } else if (msg.includes("(auth/email-already-in-use)")) {
        msg = "your email is already being used for an account silly";
      }

      return { success: false, msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

async function isImgUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return (
      response.ok && response.headers.get("content-type").startsWith("image/")
    );
  } catch (error) {
    return false;
  }
}

// Provides the context
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("UseAuth must be wrapped inside AuthContextProvider.");
  }
  return value;
};
