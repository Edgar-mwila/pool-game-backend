// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBs7MEsnZ8orMhhLU0BaMFkpV8ttirRRY",
  authDomain: "school-report-form.firebaseapp.com",
  databaseURL: "https://school-report-form.firebaseio.com",
  projectId: "school-report-form",
  storageBucket: "school-report-form.appspot.com",
  messagingSenderId: "736873991532",
  appId: "1:736873991532:web:6a3965360f0fbe727e7749",
  measurementId: "G-BHWJ4GF25D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);