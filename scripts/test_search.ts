
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.GEMINI_API_KEY !== "PLACEHOLDER_API_KEY" ? process.env.GEMINI_API_KEY : "AIzaSyAomglf0z4GEdFV8YQ8jrW-OwKlqzvG7g4",
    authDomain: "student-housing-ea907.firebaseapp.com",
    projectId: "student-housing-ea907",
    storageBucket: "student-housing-ea907.firebasestorage.app",
    messagingSenderId: "645350531563",
    appId: "1:645350531563:web:0931cd5782879f3339b9ae"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testSearch() {
    console.log("Testing Search Logic for Manchester...");

    // 1. Fetch properties from Firestore to confirm Manchester data exists
    const querySnapshot = await getDocs(collection(db, "properties"));
    const properties = querySnapshot.docs.map(doc => doc.data());

    const manchesterProps = properties.filter((p: any) => p.city === 'Manchester');
    console.log(`Found ${manchesterProps.length} Manchester properties in DB.`); // Should be ~10

    if (manchesterProps.length === 0) {
        console.error("No Manchester properties found! Scraper might have failed.");
        return;
    }

    console.log("Sample Manchester Property:", manchesterProps[0].name);

    // 2. Simulate Gemini Search (SKIPPED FOR DB VERIFICATION)
    console.log("Skipping Gemini search to verify Firestore data only.");

    if (manchesterProps.length > 0) {
        console.log("SUCCESS: Firestore contains Manchester properties.");
    } else {
        console.error("FAILURE: No Manchester properties found in Firestore.");
    }

    process.exit(0);
}

testSearch();
