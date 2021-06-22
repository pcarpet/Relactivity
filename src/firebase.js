import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "tripopo.firebaseapp.com",
    databaseURL: "https://tripopo-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tripopo",
    storageBucket: "tripopo.appspot.com",
    messagingSenderId: "458297964125",
    appId: "1:458297964125:web:0fdbbac31165ad71d4ffb4",
    measurementId: "G-ZDJBGH71KF"
};

function initFirebase() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }
  
initFirebase();
  
export default firebase;