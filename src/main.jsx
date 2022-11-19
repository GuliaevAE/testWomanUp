import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { createContext } from 'react'
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import 'firebase/firestore'
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyACFubb0NfKpfY8rJH1FB5M34Fao6pWgsg",
  authDomain: "womanup-9b9fe.firebaseapp.com",
  projectId: "womanup-9b9fe",
  storageBucket: "womanup-9b9fe.appspot.com",
  messagingSenderId: "949127141076",
  appId: "1:949127141076:web:8ecb4a48a4426e65644d41",
  measurementId: "G-JRT972CT3P"
};
  
  const firebaseApp = initializeApp(firebaseConfig);
  // export const db = getDatabase(app);


  export const Context = createContext(null)
  const firestore = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Context.Provider value={{firebaseApp,firestore, storage}}>
    <App />
    </Context.Provider>
    
  </React.StrictMode>
)
