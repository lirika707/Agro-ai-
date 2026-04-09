import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../../firebase-applet-config.json';

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);
