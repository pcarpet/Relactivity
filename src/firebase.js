import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  //apiKey: "AIzaSyA-paxKcGlRKuPpL0KsEjXEypojqeVVqFs",
  authDomain: "tripopo.firebaseapp.com",
  databaseURL: "https://tripopo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tripopo",
  storageBucket: "tripopo.appspot.com",
  messagingSenderId: "458297964125",
  appId: "1:458297964125:web:0fdbbac31165ad71d4ffb4",
  measurementId: "G-ZDJBGH71KF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//export const auth = getAuth()
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth};