import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAQTJzRGMC5sQj0zVekyGB-saR07y9e9N8",
    authDomain: "instaa-2b529.firebaseapp.com",
    databaseURL: "https://instaa-2b529.firebaseio.com",
    projectId: "instaa-2b529",
    storageBucket: "instaa-2b529.appspot.com",
    messagingSenderId: "895732320554",
    appId: "1:895732320554:web:41c84a88e8e32c547e3653",
    measurementId: "G-N1K9KWQYLR"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};