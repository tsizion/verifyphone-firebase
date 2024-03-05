import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/app";
// import "firebase/auth";

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZh7XAVFTy09cDIWtcgAT22RyqQ32kGio",
  authDomain: "inventory-mangment.firebaseapp.com",
  projectId: "inventory-mangment",
  storageBucket: "inventory-mangment.appspot.com",
  messagingSenderId: "568907255334",
  appId: "1:568907255334:web:fae44b01544884782ce0e7",
  measurementId: "G-G6Q90X6C14",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp); // eslint-disable-next-line no-undef

export { firebaseApp, auth };
