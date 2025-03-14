import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getSession } from "next-auth/react";

// ✅ Correct Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD-hdDuf90fPO2cS1zraufx444Q0z3wbKU",
  authDomain: "medx-55bb7.firebaseapp.com",
  projectId: "medx-55bb7",
  storageBucket: "medx-55bb7.appspot.com", // ✅ Fixed storageBucket URL
  messagingSenderId: "975536264474",
  appId: "1:975536264474:web:6ef8c8b702c83df40b88a3",
  measurementId: "G-JLRX80CGX5",
};

// ✅ Initialize Firebase FIRST
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Function to update user data in Firestore
export const userUpdatedData = async (userData:any) => {
  const session = await getSession(); // Get NextAuth session

  if (!session || !session.user?.email) {
    console.error("User is not authenticated or email is missing");
    return;
  }
  try {
    const userRef = doc(db, "users", session.user.email); // Store by email

    await setDoc(
      userRef,
      {
        ...userData,
        email: session.user.email,
        updatedAt: serverTimestamp(),
      },
      { merge: true } // ✅ Merge to update only necessary fields
    );

    console.log("User data updated!");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

// ✅ Export Firestore utility functions if needed
export { setDoc, doc, serverTimestamp };
