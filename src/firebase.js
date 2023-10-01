import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCO6lXpEZaqg3jEM6F8Z76YQls88Xuk0vc",
  authDomain: "reddit-clone-4e368.firebaseapp.com",
  projectId: "reddit-clone-4e368",
  storageBucket: "reddit-clone-4e368.appspot.com",
  messagingSenderId: "239513818184",
  appId: "1:239513818184:web:6da95daeb5885a50aab47d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
