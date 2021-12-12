import * as firebase from "firebase/app";
import {initializeFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA174aEiZHJWzPLox77Cwvn9ElRsYmJ57A",
  authDomain: "book-notes-app-9ea54.firebaseapp.com",
  projectId: "book-notes-app-9ea54",
};

const fb = firebase.initializeApp(firebaseConfig);
const db = initializeFirestore(fb, {})
export default db;
