import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyBOK7x5N5UnjY4TDqndzH7l5tvdNIsWFRc",
  authDomain: "todo-app-e3cf0.firebaseapp.com",
  projectId: "todo-app-e3cf0",
  storageBucket: "todo-app-e3cf0.appspot.com",
  messagingSenderId: "940016886081",
  appId: "1:940016886081:web:91686613f16b1b1f8001c0",
  measurementId: "G-JHPC7TP12K"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

export default db;