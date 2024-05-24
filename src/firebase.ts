// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTTl6qxORUB4LrPUs7mOGc_rLyq5Udlos",
    authDomain: "shakil-it-solution.firebaseapp.com",
    databaseURL: "https://shakil-it-solution-default-rtdb.firebaseio.com",
    projectId: "shakil-it-solution",
    storageBucket: "shakil-it-solution.appspot.com",
    messagingSenderId: "228399758204",
    appId: "1:228399758204:web:460e9e987ea6e8008a02f9",
    measurementId: "G-QNKLFS6Z31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);

