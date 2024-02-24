// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZthLO2Qk7wK57UKAePTdUSoSDsmKHJBs",
  authDomain: "test-bafb0.firebaseapp.com",
  projectId: "test-bafb0",
  storageBucket: "test-bafb0.appspot.com",
  messagingSenderId: "86299391945",
  appId: "1:86299391945:web:914d32e40cbba9e5915a18"
};

// Initialize Firebasefirebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };