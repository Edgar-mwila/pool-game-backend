// Import the functions you need from the SDKs you need
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
let serviceAccount = require('./school-report-form-7403959fa0ce.json');

// Initialize Firebase
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://school-report-form.firebaseio.com",
  projectId: "school-report-form",
  storageBucket: "school-report-form.appspot.com",
});
export const auth = getAuth();
export const firestore = getFirestore();