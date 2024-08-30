// React
import { createContext, useEffect, useState, useContext } from "react";

// Firebase
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  RecaptchaVerifier,
  PhoneAuthProvider,
  multiFactor,
  getAuth,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Local imports
import { placeHolderImageUrl } from '../utils/common';

export const AuthContext = createContext();
const PLACEHOLDERIMAGE = 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg';

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

      // Validate profile image URL
      console.log("Profile URL passed in: ", profileUrl);
      const isValidImage = await isImgUrl(profileUrl);
      console.log("Is this ia valid image? ", isValidImage);
      console.log("placehodlerURL: ", PLACEHOLDERIMAGE);
      let validProfileUrl = PLACEHOLDERIMAGE;
      if(isValidImage){
        validProfileUrl = profileUrl;
      }

      console.log("validProfileUrl:", validProfileUrl);

      // Create the auth token... NOT USER INFORMATION...
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;

      // I have moved the database registration into a try catch so I can know if there is issues with database...
      try {
        await setDoc(doc(db, "users", user.uid), {
          username,
          profileUrl: validProfileUrl,
          userId: user.uid,
          wampnum: 20,
          friends: [],
          active: true,
        });
      } catch (error) {
        console.error("Error writing user to Firestore: ", error);
      }

      // Potential Email Verification stuff
      //   const response = await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      //     // send verification mail.
      //     userCredential.user.sendEmailVerification();
      //     auth.signOut();
      // });
  
      return { success: true, data: { user } };
  
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Fix your email";
      } else if (msg.includes("(auth/weak-password)")) {
        msg = "Fix your password";
      } else if (msg.includes("(auth/email-already-in-use)")) {
        console.log(msg);
      } else if (msg.includes("(auth/invalid-phone-number)")) {
        msg = "Invalid phone number";
      } else {
        msg = "An unknown error occurred, " + e.message;
      }
  
      return { success: false, msg };
    }
  };

  const validateEmail = async(user) => {

  }

  const validatePhoneNumber = async(phoneNUmber) => {

  }

  const verifyIfUserIsEnrolled = async(user) => {
    const enrolledFactors = multiFactor(user).enrolledFactors;
    return enrolledFactors.length > 0;
  }

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
