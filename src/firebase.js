import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyA-paxKcGlRKuPpL0KsEjXEypojqeVVqFs",
    authDomain: "tripopo.firebaseapp.com",
    projectId: "tripopo",
    storageBucket: "tripopo.appspot.com",
    messagingSenderId: "458297964125",
    appId: "1:458297964125:web:0fdbbac31165ad71d4ffb4",
    measurementId: "G-ZDJBGH71KF"
};
firebase.initializeApp(config);
export default firebase;