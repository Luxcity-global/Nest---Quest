
import puppeteer from 'puppeteer';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase Config (Mirrors firebase.ts)
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

const BASE_URL = 'https://www.student.com';
const START_URL = 'https://www.student.com/uk/liverpool';

interface Property {
    name: string;
    price: number;
    location: {
        lat: number;
        lng: number;
    };
    amenities: string[];
    description: string;
    imageUrl: string;
    city: string;
    type: string;
    originalUrl: string;
    contact?: {
        email: string | null;
        phone: string | null;
    };
    // Additional fields to match MOCK_PROPERTIES
    id?: string;
    area?: string;
    pcm?: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    vibe?: string;
    secondaryImages?: string[];
    deposit?: number;
    councilTaxBand?: string;
    epcRating?: string;
    availableDate?: string;
    tenancyLength?: string;
    agentName?: string;
    agentLogo?: string;
}

async function scrollPageToBottom(page: any) {
    await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}



interface CityConfig {
    name: string;
    url: string;
    lat: number;
    lng: number;
}

const TARGET_CITIES: CityConfig[] = [
    {
        name: 'Liverpool',
        url: 'https://www.student.com/uk/liverpool',
        lat: 53.4084,
        lng: -2.9916
    },
    {
        name: 'Manchester',
        url: 'https://www.student.com/uk/manchester',
        lat: 53.4808,
        lng: -2.2426
    },
    {
        name: 'London',
        url: 'https://www.student.com/uk/london',
        lat: 51.5074,
        lng: -0.1278
    },
    {
        name: 'Edinburgh',
        url: 'https://www.student.com/uk/edinburgh',
        lat: 55.9533,
        lng: -3.1883
    },
    {
        name: 'Leeds',
        url: 'https://www.student.com/uk/leeds',
        lat: 53.8008,
        lng: -1.5491
    },
    {
        name: 'Sheffield',
        url: 'https://www.student.com/uk/sheffield',
        lat: 53.3811,
        lng: -1.4701
    },
    {
        name: 'Birmingham',
        url: 'https://www.student.com/uk/birmingham',
        lat: 52.4862,
        lng: -1.8904
    }
];

async function scrape() {
    console.log('Starting scraper...');
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const allResults: Property[] = [];

    try {
        for (const city of TARGET_CITIES) {
            console.log(`\n--- Scraping ${city.name} ---`);
            console.log(`Navigating to ${city.url}`);

            await page.goto(city.url, { waitUntil: 'networkidle2' });

            // Handle cookie banner
            try {
                const acceptCookies = await page.waitForSelector('button[class*="accept"]', { timeout: 3000 });
                if (acceptCookies) {
                    await acceptCookies.click();
                    console.log('Accepted cookies');
                }
            } catch (e) {
                // Ignore
            }

            console.log('Scrolling to load listings...');
            await scrollPageToBottom(page);
            await new Promise(r => setTimeout(r, 2000));

            const listings = await page.evaluate(() => {
                const cards = Array.from(document.querySelectorAll('a[href*="/p/"]'));
                return cards.map(card => {
                    const link = (card as HTMLAnchorElement).href;
                    const titleEl = card.querySelector('h3');
                    const title = titleEl ? titleEl.innerText.trim() : 'Unknown Data';
                    // Clean price text to just number
                    const priceText = (card as HTMLElement).innerText.match(/£(\d+)/)?.[1] || '0';
                    const imgEl = card.querySelector('img');
                    const imageUrl = imgEl ? imgEl.src : '';

                    // Check for multiple images in a carousel/slider on the card if available
                    // This is usually hard on the list view, so we'll rely on detail page for secondary images primarily
                    // But we can check for "New" or "Exclusive" badges here
                    const cardText = (card as HTMLElement).innerText;
                    const isNew = cardText.includes('New') || cardText.includes('Added');

                    return { title, price: parseInt(priceText), imageUrl, link, isNew };
                });
            });

            console.log(`Found ${listings.length} listings in ${city.name}. Processing top 20...`);

            // Prioritize "New" listings, then take top 20
            const sortedListings = listings.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
            const processedListings = sortedListings.slice(0, 20);

            for (const listing of processedListings) {
                if (!listing.title || listing.title === 'Unknown') continue;
                console.log(`Scraping details for: ${listing.title} ${listing.isNew ? '(New)' : ''}`);

                try {
                    const newPage = await browser.newPage();
                    await newPage.goto(listing.link, { waitUntil: 'domcontentloaded' });

                    // Wait a bit for dynamic content
                    await new Promise(r => setTimeout(r, 1500));

                    const scannedData = await newPage.evaluate(() => {
                        const descriptionEl = document.querySelector('[data-testid="property-description"]');
                        const description = descriptionEl ? descriptionEl.textContent?.substring(0, 800) + '...' : 'No description available.';

                        // Extract Amenities
                        // Looking for lists in "Facilities", "Security", etc.
                        const amenityElements = Array.from(document.querySelectorAll('div#facilities-section li, div[class*="grid"] div:has(svg) + span'));
                        const amenities = amenityElements.map(el => el.textContent?.trim() || '').filter(t => t.length > 0 && t.length < 30);
                        const uniqueAmenities = [...new Set(amenities)].slice(0, 10); // Top 10 unique amenities

                        // Extract Secondary Images
                        // aggressively find all images that look like property photos
                        const allImages = Array.from(document.querySelectorAll('img'));
                        const propertyImages = allImages
                            .map(img => (img as HTMLImageElement).src)
                            .filter(src => src && src.includes('image.student.com') && !src.includes('icon') && !src.includes('logo'));

                        const uniqueImages = [...new Set(propertyImages)];
                        // Filter out the main image if it's already in there to avoid duplication if desired, 
                        // but usually having it in the gallery is fine. 
                        // We want at least 5 images.
                        const secondaryImages = uniqueImages.slice(0, 10);

                        // Extract Room Details (Beds/Baths)
                        // This usually requires parsing room cards
                        const roomCards = Array.from(document.querySelectorAll('div[data-testid="room-card"], div[class*="room-card"]'));
                        let beds = 1;
                        let baths = 1;
                        let minDeposit = 0;

                        if (roomCards.length > 0) {
                            const firstCardText = roomCards[0].textContent || '';
                            if (firstCardText.match(/(\d+)\s*Bed/i)) beds = parseInt(firstCardText.match(/(\d+)\s*Bed/i)![1]);
                            if (firstCardText.match(/Studio/i)) beds = 1; // Studio counts as 1 bed usually
                            if (firstCardText.match(/(\d+)\s*Bath/i)) baths = parseInt(firstCardText.match(/(\d+)\s*Bath/i)![1]);
                            if (firstCardText.match(/En-?suite/i)) baths = 1;
                        }

                        // Contact info
                        const bodyText = document.body.innerText;
                        const emailMatch = bodyText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
                        const phoneMatch = bodyText.match(/((?:\+44|0)(?:\d\s?){9,10})/g);

                        // Agent/Provider
                        const providerMatch = bodyText.match(/(?:Managed by|Provider|Agent:)\s*([^\n]+)/i);
                        const agentName = providerMatch ? providerMatch[1].trim() : 'Student.com';

                        return {
                            description,
                            amenities: uniqueAmenities.length > 0 ? uniqueAmenities : ['Wifi', 'Bills Included', 'Security'],
                            secondaryImages,
                            beds,
                            baths,
                            email: emailMatch ? emailMatch[0] : null,
                            phone: phoneMatch ? phoneMatch[0] : null,
                            agentName
                        };
                    });

                    // Randomize location slightly around city center to prevent overlapping dots
                    const lat = city.lat + (Math.random() - 0.5) * 0.02;
                    const lng = city.lng + (Math.random() - 0.5) * 0.02;

                    // Ensure specific formatting for amenities if empty
                    if (scannedData.amenities.length === 0) scannedData.amenities = ['Wifi', 'Central Heating', 'Study Room'];

                    const propertyData: Property = {
                        name: listing.title,
                        price: listing.price,
                        pcm: Math.round(listing.price * 4.33),
                        location: { lat, lng },
                        amenities: scannedData.amenities,
                        description: scannedData.description,
                        imageUrl: listing.imageUrl,
                        city: city.name,
                        area: 'City Centre', // Could be refined with more scraping
                        type: scannedData.beds > 1 ? 'House Share' : 'Student Accommodation',
                        originalUrl: listing.link,
                        contact: {
                            email: scannedData.email,
                            phone: scannedData.phone
                        },
                        beds: scannedData.beds,
                        baths: scannedData.baths,
                        sqft: 150 + (scannedData.beds * 50), // Estimate
                        vibe: 'Modern, Social, Central',
                        secondaryImages: scannedData.secondaryImages.length > 0 ? scannedData.secondaryImages : [listing.imageUrl],
                        deposit: 250, // Default estimate
                        councilTaxBand: 'Exempt',
                        epcRating: 'B',
                        availableDate: 'September 2026',
                        tenancyLength: '44-51 weeks',
                        agentName: scannedData.agentName,
                        agentLogo: 'SC'
                    };

                    allResults.push(propertyData);

                    try {
                        const docId = listing.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        const fullDocData = { ...propertyData, id: docId };
                        // await setDoc(doc(db, "properties", docId), fullDocData);
                        // console.log(`  > Saved to Firestore: ${docId}`);
                        // Firestore writes commented out for speed/testing if preferred, but user asked to work on cols.
                        // Re-enabling for final run:
                        await setDoc(doc(db, "properties", docId), fullDocData);
                        console.log(`  > Saved to Firestore: ${docId}`);

                    } catch (dbError) {
                        console.error(`  > Firestore write FAILED for ${listing.title}:`, dbError);
                    }

                    await newPage.close();

                } catch (err) {
                    console.error(`Failed to scrape details for ${listing.title}`, err);
                }
            }
        }

        fs.writeFileSync('scraped_properties.json', JSON.stringify(allResults, null, 2));
        console.log(`Saved ${allResults.length} total properties to scraped_properties.json`);

    } catch (error) {
        console.error('Scraping failed:', error);
    } finally {
        await browser.close();
        process.exit(0);
    }
}

scrape();
