// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiCR99Z-LWowfgnNtOaGYF9cyOEFneNhk",
  authDomain: "inventory-managment-7f4e1.firebaseapp.com",
  projectId: "inventory-managment-7f4e1",
  storageBucket: "inventory-managment-7f4e1.appspot.com",
  messagingSenderId: "767417549724",
  appId: "1:767417549724:web:2ae419a7079221169dfe59",
  measurementId: "G-9ZQRZKQT12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditionally initialize Analytics only if supported and on the client side
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const firestore = getFirestore(app)

export{firestore}