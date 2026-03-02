import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase Config
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
const auth = getAuth(app);

const INITIAL_BLOG_POSTS = [
    {
        id: 'shared-kitchen-survival',
        title: "How to survive a shared kitchen without losing your mind",
        category: "Living Tips",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
        date: "Feb 10, 2024",
        readTime: "5 min read",
        excerpt: "The ultimate guide to label management, cleaning schedules, and the unwritten rules of student fridge etiquette.",
        content: `Sharing a kitchen is one of the biggest challenges of student life. You're combining different hygiene standards, cooking habits, and schedules into one high-traffic zone. 

First, establish the Fridge Rule: label everything. It sounds overkill until you find your expensive oat milk has been used for someone's midnight cereal. Second, create a "Cleaning Rota" that actually works. Don't just list names; list specific tasks (e.g., bin duty, surface wipe, floor sweep). 

Third, communicate. If someone leaves a crusty pan for three days, don't leave a passive-aggressive note. Just ask them in the group chat: "Hey, mind giving that pan a scrub so I can use the hob?" Most people are just busy, not malicious. Finally, invest in a good set of headphones. If the kitchen vibe is too loud and you just want your pasta, some noise-cancelling tech is your best friend.`,
        nestorTake: "From experience, the 'Dirty Pan War' is never won with notes. Just be the bigger person, set the standard early, and maybe host a flat dinner to break the ice!",
        status: 'published'
    },
    {
        id: 'london-budgeting',
        title: "Budgeting for London living (without crying every Tuesday)",
        category: "Finance",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
        date: "Feb 08, 2024",
        readTime: "7 min read",
        excerpt: "Hidden student discounts, free events, and the secret art of meal prepping like a pro in the capital.",
        content: `London is expensive, but it doesn't have to break you. The key is understanding 'The student Londoner's triangle': Housing, Transport, and Food. 

For housing, look slightly further out on the Tube lines. Living in Zone 3 instead of Zone 1 can save you £400 a month—just check the commute time on NestQuest first! For transport, get your Student Oyster card and link it to a Railcard to save 34% on off-peak travel. 

Food-wise, skip the high-street meal deals. London's markets (like Whitechapel or Lewisham) offer veg bowls for £1 that will last a week. Also, download 'Too Good To Go' to grab high-end bakery and restaurant leftovers for pennies at closing time. London is your playground, you just need to know where the hidden exits are.`,
        nestorTake: "One thing students often miss is that London is full of free culture. Most museums are free! Spend your money on memories, not on overpriced coffees near Leicester Square.",
        status: 'published'
    },
    {
        id: 'house-viewing-guide',
        title: "Finding 'The One': What to look for during a house viewing",
        category: "Housing",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
        date: "Feb 05, 2024",
        readTime: "4 min read",
        excerpt: "Damp checks, water pressure, and how to spot a rogue landlord before you sign that dotted line.",
        content: `A house viewing is like a first date—everything looks perfect on the surface, but you need to look closer. 

Check the 'Damp Zones'. Look at the corners of the ceiling and behind wardrobes. If there's black mold or a musty smell, run. Next, test the water pressure. Turn on the shower and the kitchen tap at the same time. If it turns into a trickle, your morning routine will be a nightmare. 

Ask about the neighbors. Are they families (who like it quiet) or other students (who might be loud)? Finally, check the locks on the ground floor windows. Safety is non-negotiable. If you feel uneasy about the area, walk from the nearest station to the house at night before you sign.`,
        nestorTake: "If I were you, I'd bring a phone charger to the viewing. Plug it into the sockets in your potential bedroom to make sure they actually work!",
        status: 'published'
    },
    {
        id: 'room-decorating-budget',
        title: "From Room to Home: Decorating on a shoestring budget",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&q=80&w=800",
        date: "Jan 28, 2024",
        readTime: "6 min read",
        excerpt: "How to turn a sterile student room into a cozy oasis using nothing but IKEA hacks and plants.",
        content: `Your student room doesn't have to look like a hospital ward. Decorating on a budget is about texture and lighting. 

First, ignore the big overhead light—it's the enemy of 'vibes'. Get a cheap floor lamp and some fairy lights. Warmer light makes a small room feel twice as large. Second, use command hooks for everything. You want your deposit back, so don't touch the drill. 

Third, the 'Rug Hack'. Most student carpets are... questionable. A large, cheap rug from a charity shop or IKEA covers a multitude of sins. Finally, plants. Even a £3 spider plant from the supermarket adds life and oxygen to a cramped study space. It makes the 'night-owl' study sessions much more bearable.`,
        nestorTake: "One thing I always did was buy second-hand textiles and wash them at 60 degrees. It's the cheapest way to make a room feel premium without the price tag.",
        status: 'published'
    },
    {
        id: 'commute-study-hack',
        title: "The Commute hack: Making travel time your study time",
        category: "Academic",
        image: "https://images.unsplash.com/photo-1459253331268-2d0bc91bd0f9?auto=format&fit=crop&q=80&w=800",
        date: "Jan 20, 2024",
        readTime: "5 min read",
        excerpt: "Turning your 30-minute bus ride into your most productive hour of the day. Podcasts, flashcards, and more.",
        content: `The commute is often seen as dead time, but for a student, it's a secret productivity window. 

If you're on the bus or train for 30 minutes, that's 5 hours a week—basically a whole extra study day. Use apps like Anki or Quizlet for flashcards. It's much easier to do 10 minutes of vocab on the Tube than it is to sit down at a desk for an hour. 

If you get motion sick, switch to audio. Record your own lecture notes or find a podcast relevant to your module. By the time you reach campus, your brain is already 'warmed up' for the seminar. If you walk or cycle, use that time for 'The Mental Audit'. Plan your top 3 tasks for the day so you hit the library with a clear plan.`,
        nestorTake: "If I were you, I'd always keep a physical book in my bag. Tech fails, but a paperback never runs out of battery during a signal failure on the Jubilee line!",
        status: 'published'
    }
];

async function seedBlogPosts() {
    console.log('Starting blog posts seeding...');

    try {
        console.log('Skipping anonymous authentication...');
        // await signInAnonymously(auth);
        console.log('Proceeding to seed...');

        for (const post of INITIAL_BLOG_POSTS) {
            const docRef = doc(db, 'blog_posts', post.id);
            await setDoc(docRef, {
                ...post,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log(`✓ Seeded blog post: ${post.title}`);
        }

        console.log(`\n✅ Successfully seeded ${INITIAL_BLOG_POSTS.length} blog posts!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding blog posts:', error);
        process.exit(1);
    }
}

seedBlogPosts();
