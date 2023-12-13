// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB58wU7B-_mb-7pxM-JfDQJ-QfHtFPpiBw",
  authDomain: "shmotive-83fa3.firebaseapp.com",
  projectId: "shmotive-83fa3",
  storageBucket: "shmotive-83fa3.appspot.com",
  messagingSenderId: "263390452051",
  appId: "1:263390452051:web:89184d31aeb8fed0aee9a6",
  measurementId: "G-V4TQ6HR059"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };