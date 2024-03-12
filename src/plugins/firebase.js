import { initializeApp } from 'firebase/app'
import firebaseConfig from '@/plugins/firebaseConfig'


const firebase = initializeApp(firebaseConfig)

export default firebase