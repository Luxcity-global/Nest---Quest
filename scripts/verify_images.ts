
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs, query, limit } from "firebase/firestore";
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.VITE_GEMINI_API_KEY || "AIzaSyAomglf0z4GEdFV8YQ8jrW-OwKlqzvG7g4",
    authDomain: "student-housing-ea907.firebaseapp.com",
    projectId: "student-housing-ea907",
    storageBucket: "student-housing-ea907.firebasestorage.app",
    messagingSenderId: "645350531563",
    appId: "1:645350531563:web:0931cd5782879f3339b9ae"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function verify() {
    console.log('Verifying Firestore data...');
    try {
        const q = query(collection(db, "properties"), limit(5));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`\nProperty: ${data.name} (${doc.id})`);
            console.log(`City: ${data.city}`);
            console.log(`Image Count: ${data.secondaryImages ? data.secondaryImages.length : 0}`);
            if (data.secondaryImages && data.secondaryImages.length > 0) {
                console.log('Sample Images:', data.secondaryImages.slice(0, 3));
            } else {
                console.log('WARNING: No secondary images found!');
            }
        });

    } catch (e) {
        console.error("Error verifying:", e);
    }
    process.exit(0);
}

verify();
