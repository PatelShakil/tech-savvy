// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDNgDnFui-A8km1-54yVHewwR1ABMf_xX8",
    authDomain: "tech-savvy-solution.firebaseapp.com",
    projectId: "tech-savvy-solution",
    storageBucket: "tech-savvy-solution.appspot.com",
    messagingSenderId: "156050581844",
    appId: "1:156050581844:web:aa180380d0f5cd4f33c0c1",
    measurementId: "G-1JPDS428Q9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
