import { getFirestore } from 'firebase/firestore';
import { app } from './app';
import firebaseConfig from '../../../firebase-applet-config.json';

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
