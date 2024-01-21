import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnC0mx5s45mLdBTPzs8lkkkPmR60RUD7w",
  authDomain: "rock8-8f274.firebaseapp.com",
  projectId: "rock8-8f274",
  storageBucket: "rock8-8f274.appspot.com",
  messagingSenderId: "994550602307",
  appId: "1:994550602307:web:1ea8170f06aa68932712f6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
