
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { Header } from './components/Header';
import { OnboardingForm } from './components/OnboardingForm';
import { ResultsView } from './components/ResultsView';
import { ExploreView } from './components/ExploreView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { ProfileEditor } from './components/ProfileEditor';
import { PropertyDetailsView } from './components/PropertyDetailsView';
import { Autocomplete } from './components/Autocomplete';
import { FaqView } from './components/FaqView';
import { SupportView } from './components/SupportView';
import { NestorChat } from './components/NestorChat';
import { AboutView } from './components/AboutView';
import { BlogView } from './components/BlogView';
import { LegalGuideView } from './components/LegalGuideView';
import { ArticleDetailsView } from './components/ArticleDetailsView';
import { AdminView } from './components/AdminView';
import { StudentPerksView } from './components/StudentPerksView';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppState, UserProfile, MatchResult, UserAccount, BlogPost, SupportTicket } from './types';
import { generateHousingMatches } from './geminiService';
import { UK_UNIVERSITIES, MOCK_PROPERTIES, INITIAL_BLOG_POSTS } from './constants';
import { subscribeToBlogPosts, createBlogPost, updateBlogPost, seedBlogPost } from './services/blogService';

// Fix: Pervasive type resolution errors in framer-motion are bypassed by casting to any.
const motionAny: any = motion;

const HERO_IMAGES = [
  // 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000', // Campus
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000', // Students
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=2000', // Library Study (Fixed)
  'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&q=80&w=2000', // Shared space
];

/** Map pathname to AppState and optional IDs for detail views */
function pathToView(pathname: string): { view: AppState; propertyId?: string; articleId?: string } {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/' || p === '/landing') return { view: AppState.LANDING };
  if (p === '/onboarding') return { view: AppState.ONBOARDING };
  if (p === '/results') return { view: AppState.RESULTS };
  if (p === '/explore') return { view: AppState.EXPLORE };
  if (p === '/profile') return { view: AppState.PROFILE };
  if (p === '/profile/edit') return { view: AppState.LIFESTYLE_EDIT };
  if (p === '/settings') return { view: AppState.SETTINGS };
  if (p === '/faq') return { view: AppState.FAQ };
  if (p === '/support') return { view: AppState.SUPPORT };
  if (p === '/about') return { view: AppState.ABOUT };
  if (p === '/blog') return { view: AppState.BLOG };
  if (p === '/legal') return { view: AppState.LEGAL_GUIDE };
  if (p === '/admin') return { view: AppState.ADMIN };
  if (p === '/student-perks') return { view: AppState.STUDENT_PERKS };
  const propMatch = p.match(/^\/property\/([^/]+)$/);
  if (propMatch) return { view: AppState.PROPERTY_DETAILS, propertyId: propMatch[1] };
  const artMatch = p.match(/^\/article\/([^/]+)$/);
  if (artMatch) return { view: AppState.ARTICLE_DETAILS, articleId: artMatch[1] };
  return { view: AppState.LANDING };
}

/** Map AppState (and optional IDs) to URL path */
function viewToPath(view: AppState, propertyId?: string | null, articleId?: string | null): string {
  if (view === AppState.PROPERTY_DETAILS && propertyId) return `/property/${propertyId}`;
  if (view === AppState.ARTICLE_DETAILS && articleId) return `/article/${articleId}`;
  const map: Record<AppState, string> = {
    [AppState.LANDING]: '/',
    [AppState.ONBOARDING]: '/onboarding',
    [AppState.RESULTS]: '/results',
    [AppState.EXPLORE]: '/explore',
    [AppState.PROFILE]: '/profile',
    [AppState.SETTINGS]: '/settings',
    [AppState.LIFESTYLE_EDIT]: '/profile/edit',
    [AppState.PROPERTY_DETAILS]: '/',
    [AppState.FAQ]: '/faq',
    [AppState.SUPPORT]: '/support',
    [AppState.ABOUT]: '/about',
    [AppState.BLOG]: '/blog',
    [AppState.LEGAL_GUIDE]: '/legal',
    [AppState.ARTICLE_DETAILS]: '/blog',
    [AppState.ADMIN]: '/admin',
    [AppState.STUDENT_PERKS]: '/student-perks'
  };
  return map[view] ?? '/';
}

const _UNUSED_INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '0',
    title: "How to survive a shared kitchen without losing your mind",
    category: "Living Tips",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
    date: "Feb 10, 2024",
    readTime: "5 min read",
    excerpt: "The ultimate guide to label management, cleaning schedules, and the unwritten rules of student fridge etiquette.",
    content: `Sharing a kitchen is one of the biggest challenges of student life. You’re combining different hygiene standards, cooking habits, and schedules into one high-traffic zone. 

First, establish the Fridge Rule: label everything. It sounds overkill until you find your expensive oat milk has been used for someone's midnight cereal. Second, create a "Cleaning Rota" that actually works. Don't just list names; list specific tasks (e.g., bin duty, surface wipe, floor sweep). 

Third, communicate. If someone leaves a crusty pan for three days, don't leave a passive-aggressive note. Just ask them in the group chat: "Hey, mind giving that pan a scrub so I can use the hob?" Most people are just busy, not malicious. Finally, invest in a good set of headphones. If the kitchen vibe is too loud and you just want your pasta, some noise-cancelling tech is your best friend.`,
    nestorTake: "From experience, the 'Dirty Pan War' is never won with notes. Just be the bigger person, set the standard early, and maybe host a flat dinner to break the ice!",
    status: 'published'
  },
  {
    id: '1',
    title: "Budgeting for London living (without crying every Tuesday)",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
    date: "Feb 08, 2024",
    readTime: "7 min read",
    excerpt: "Hidden student discounts, free events, and the secret art of meal prepping like a pro in the capital.",
    content: `London is expensive, but it doesn't have to break you. The key is understanding 'The student Londoner's triangle': Housing, Transport, and Food. 

For housing, look slightly further out on the Tube lines. Living in Zone 3 instead of Zone 1 can save you £400 a month—just check the commute time on NestQuest first! For transport, get your Student Oyster card and link it to a Railcard to save 34% on off-peak travel. 

Food-wise, skip the high-street meal deals. London’s markets (like Whitechapel or Lewisham) offer veg bowls for £1 that will last a week. Also, download 'Too Good To Go' to grab high-end bakery and restaurant leftovers for pennies at closing time. London is your playground, you just need to know where the hidden exits are.`,
    nestorTake: "One thing students often miss is that London is full of free culture. Most museums are free! Spend your money on memories, not on overpriced coffees near Leicester Square.",
    status: 'published'
  },
  {
    id: '2',
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
    id: '3',
    title: "From Room to Home: Decorating on a shoestring budget",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&q=80&w=800",
    date: "Jan 28, 2024",
    readTime: "6 min read",
    excerpt: "How to turn a sterile student room into a cozy oasis using nothing but IKEA hacks and plants.",
    content: `Your student room doesn't have to look like a hospital ward. Decorating on a budget is about texture and lighting. 

First, ignore the big overhead light—it’s the enemy of 'vibes'. Get a cheap floor lamp and some fairy lights. Warmer light makes a small room feel twice as large. Second, use command hooks for everything. You want your deposit back, so don't touch the drill. 

Third, the 'Rug Hack'. Most student carpets are... questionable. A large, cheap rug from a charity shop or IKEA covers a multitude of sins. Finally, plants. Even a £3 spider plant from the supermarket adds life and oxygen to a cramped study space. It makes the 'night-owl' study sessions much more bearable.`,
    nestorTake: "One thing I always did was buy second-hand textiles and wash them at 60 degrees. It’s the cheapest way to make a room feel premium without the price tag.",
    status: 'published'
  },
  {
    id: '4',
    title: "The Commute hack: Making travel time your study time",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1459253331268-2d0bc91bd0f9?auto=format&fit=crop&q=80&w=800",
    date: "Jan 20, 2024",
    readTime: "5 min read",
    excerpt: "Turning your 30-minute bus ride into your most productive hour of the day. Podcasts, flashcards, and more.",
    content: `The commute is often seen as dead time, but for a student, it's a secret productivity window. 

If you're on the bus or train for 30 minutes, that's 5 hours a week—basically a whole extra study day. Use apps like Anki or Quizlet for flashcards. It’s much easier to do 10 minutes of vocab on the Tube than it is to sit down at a desk for an hour. 

If you get motion sick, switch to audio. Record your own lecture notes or find a podcast relevant to your module. By the time you reach campus, your brain is already 'warmed up' for the seminar. If you walk or cycle, use that time for 'The Mental Audit'. Plan your top 3 tasks for the day so you hit the library with a clear plan.`,
    nestorTake: "If I were you, I'd always keep a physical book in my bag. Tech fails, but a paperback never runs out of battery during a signal failure on the Jubilee line!",
    status: 'published'
  }
];

const TESTIMONIALS = [
  {
    name: "Tom W",
    uni: "Edinburgh University",
    text: "The perfect fit guarantee is real. Every recommendation was spot on. Moved in within 2 weeks of signing up!",
    rating: 5,
    avatar: "TW",
    color: "bg-brand-orange"
  },
  {
    name: "Sarah M",
    uni: "Oxford University",
    text: "Found my dream flat in Oxford in literally 5 minutes. The AI understood exactly what I needed - close to campus, quiet for studying, but social too!",
    rating: 5,
    avatar: "SM",
    color: "bg-brand-orange"
  },
  {
    name: "James T",
    uni: "Cambridge University",
    text: "Way better than SpareRoom. Actually understands what students need. No more scrolling through hundreds of unsuitable listings!",
    rating: 5,
    avatar: "JT",
    color: "bg-brand-orange"
  }
];

const LoadingMascot = () => (
  <div className="relative flex flex-col items-center">
    <div className="relative w-48 h-48 mb-12">
      <motionAny.div
        className="absolute inset-0 bg-brand-orange/5 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motionAny.div
        className="relative z-10 w-32 h-32 mx-auto mt-8"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full bg-brand-orange rounded-full relative shadow-2xl flex items-center justify-center border-4 border-white">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-900 rounded-full shadow-lg"></div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-10 bg-gray-900 rounded-lg transform skew-x-12"></div>
          <div className="absolute -top-8 right-4 w-1 h-8 bg-yellow-400 rounded-full origin-top transform rotate-12"></div>
          <div className="flex gap-4">
            <motionAny.div
              className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }}
            >
              <div className="w-2.5 h-2.5 bg-gray-900 rounded-full"></div>
            </motionAny.div>
            <motionAny.div
              className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }}
            >
              <div className="w-2.5 h-2.5 bg-gray-900 rounded-full"></div>
            </motionAny.div>
          </div>
          <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45 rounded-sm"></div>
          <motionAny.div
            className="absolute -left-3 top-1/2 w-8 h-12 bg-brand-orange-hover rounded-l-3xl border-l-2 border-white"
            animate={{ rotate: [-15, -35, -15] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          ></motionAny.div>
          <motionAny.div
            className="absolute -right-3 top-1/2 w-8 h-12 bg-brand-orange-hover rounded-r-3xl border-r-2 border-white"
            animate={{ rotate: [15, 35, 15] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          ></motionAny.div>
        </div>
        <motionAny.div
          className="absolute -right-8 top-0 w-16 h-16 border-4 border-brand-blue rounded-full bg-brand-blue/10 backdrop-blur-md z-20 flex items-center justify-center"
          animate={{
            x: [-10, 20, -10],
            y: [-10, 10, -10],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2 h-10 bg-brand-blue rounded-full"></div>
          <i className="fa-solid fa-house-magnifying-glass text-brand-blue text-xl"></i>
        </motionAny.div>
      </motionAny.div>

      <AnimatePresence>
        {[
          { icon: 'fa-book', color: 'text-purple-500', x: -60, y: -40, delay: 0 },
          { icon: 'fa-pizza-slice', color: 'text-orange-400', x: 80, y: -60, delay: 0.5 },
          { icon: 'fa-bus', color: 'text-brand-blue', x: 70, y: 60, delay: 1 },
          { icon: 'fa-heart', color: 'text-red-400', x: -70, y: 70, delay: 1.5 },
          { icon: 'fa-pound-sign', color: 'text-emerald-500', x: -90, y: 10, delay: 2 }
        ].map((item, i) => (
          <motionAny.div
            key={i}
            className={`absolute left-1/2 top-1/2 ${item.color} bg-white p-2.5 rounded-xl shadow-lg border border-gray-100 text-sm`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              x: item.x,
              y: item.y
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            <i className={`fa-solid ${item.icon}`}></i>
          </motionAny.div>
        ))}
      </AnimatePresence>
    </div>

    <div className="text-center">
      <h2 className="text-3xl font-black text-gray-900 mb-2">Nestor is Matching You...</h2>
      <p className="text-gray-500 font-bold max-w-sm">Comparing local student vibes, campus distance, and room quality in real-time.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathInfo = pathToView(location.pathname);
  const view = pathInfo.view;
  const selectedPropertyId = pathInfo.propertyId ?? null;
  const selectedArticleId = pathInfo.articleId ?? null;

  const goToView = (newView: AppState, opts?: { propertyId?: string; articleId?: string }) => {
    const path = viewToPath(newView, opts?.propertyId, opts?.articleId);
    navigate(path);
  };

  const [user, setUser] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isQuickSearch, setIsQuickSearch] = useState(false);
  const [heroUniversity, setHeroUniversity] = useState('');

  // Blog State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isBlogLoading, setIsBlogLoading] = useState(true);
  const hasSeededRef = useRef(false);

  // Auto-seed blog posts if database is empty and user is valid
  useEffect(() => {
    if (!isBlogLoading && blogPosts.length === 0 && !hasSeededRef.current && user) {
      console.log("Auto-seeding initial blog posts...");
      hasSeededRef.current = true;
      const seed = async () => {
        for (const post of _UNUSED_INITIAL_BLOG_POSTS) {
          try {
            await seedBlogPost(post);
          } catch (err) {
            console.error("Failed to seed post:", post.id, err);
          }
        }
        console.log("Auto-seeding complete.");
      };
      seed();
    }
  }, [isBlogLoading, blogPosts, user]);

  // Subscribe to blog posts from Firestore
  useEffect(() => {
    console.log('Setting up blog posts listener...');
    const unsubscribe = subscribeToBlogPosts((posts) => {
      console.log('Blog posts updated:', posts.length);
      setBlogPosts(posts);
      setIsBlogLoading(false);
    }, true, (error) => {
      console.error("Subscription error (likely permission denied):", error);
      setIsBlogLoading(false);
    }); // true = include drafts (filter in UI)

    return () => {
      console.log('Unsubscribing from blog posts...');
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (view === AppState.LANDING) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [view]);

  // Auth Listener
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;
    console.log("Setting up Auth Listener...");

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth State Changed. Current User:", currentUser?.email);

      // Unsubscribe from previous profile listener if it exists
      if (unsubscribeProfile) {
        console.log("Cleaning up previous profile listener");
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (currentUser) {
        console.log("User is logged in. Setting up Firestore listener for:", currentUser.uid);
        // Real-time listener for user profile
        const userDocRef = doc(db, "users", currentUser.uid);

        unsubscribeProfile = onSnapshot(userDocRef, async (docSnap) => {
          console.log("Firestore Snapshot Fired. Exists:", docSnap.exists());

          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("Got user data:", userData);
            const userProfile = userData.profile as UserProfile;

            // Merge Firestore tickets with localStorage fallback so local tickets
            // are never lost if a Firestore write failed.
            const localStorageKey = `supportTickets_${currentUser.uid}`;
            const localTicketsRaw = localStorage.getItem(localStorageKey);
            const localTickets: SupportTicket[] = localTicketsRaw ? JSON.parse(localTicketsRaw).filter((t: any) => t && typeof t === 'object') : [];
            const firestoreTickets: SupportTicket[] = (userData.supportTickets || []).filter((t: any) => t && typeof t === 'object');
            const allById = new Map<number, SupportTicket>();
            [...firestoreTickets, ...localTickets].forEach(t => allById.set(t.id, t));
            const mergedTickets = Array.from(allById.values()).sort((a, b) => a.id - b.id);
            // Keep localStorage in sync with the merged result
            localStorage.setItem(localStorageKey, JSON.stringify(mergedTickets));

            setProfile(userProfile);
            const newUserObj = {
              id: currentUser.uid,
              name: userData.name || currentUser.displayName || 'Student',
              email: currentUser.email || '',
              savedMatches: userData.savedMatches || [],
              enquiries: userData.enquiries || [],
              supportTickets: mergedTickets,
              phone: userData.phone || '',
              profile: userProfile
            };

            console.log("Updating User State to:", newUserObj);
            setUser(newUserObj);
          } else {
            console.log("No user document found. Creating default local state...");

            // Create default profile 
            const defaultProfile: UserProfile = {
              name: currentUser.displayName || 'Student',
              university: 'University of London',
              budget: 250,
              commuteType: 'walk',
              commuteTime: 20,
              lifestyle: {
                socialLevel: 3,
                cleanliness: 4,
                studyHabits: 'balanced',
                hobbies: []
              },
              situation: {
                goal: 'Renting my first home',
                timeframe: 'Flexible',
                currentStatus: 'Living with others'
              }
            };

            // 1. Set Local State Immediately (Optimistic UI)
            const missingDocStorageKey = `supportTickets_${currentUser.uid}`;
            const missingDocRaw = localStorage.getItem(missingDocStorageKey);
            const missingDocTickets: SupportTicket[] = missingDocRaw ? JSON.parse(missingDocRaw).filter((t: any) => t && typeof t === 'object') : [];
            const newUserObj = {
              id: currentUser.uid,
              name: currentUser.displayName || 'Student',
              email: currentUser.email || '',
              savedMatches: [],
              enquiries: [],
              supportTickets: missingDocTickets,
              phone: '',
              profile: defaultProfile
            };
            console.log("Setting default user state (doc missing):", newUserObj);
            setProfile(defaultProfile);
            setUser(newUserObj);

            // 2. Try to persist to DB (might fail if permissions are bad)
            try {
              await setDoc(userDocRef, {
                name: currentUser.displayName || 'Student',
                email: currentUser.email,
                createdAt: new Date().toISOString(),
                profile: defaultProfile
              }, { merge: true });
              console.log("Default profile created successfully in DB.");
            } catch (err) {
              console.error("Error creating default profile in DB (ignored, using local):", err);
            }
          }
        }, (error) => {
          console.error("Firestore Error in onSnapshot - Permission/Network issue:", error);

          // Fallback: Set user state anyway so they can use the app
          const defaultProfile: UserProfile = {
            name: currentUser.displayName || 'Student',
            university: 'University of London',
            budget: 250,
            commuteType: 'walk',
            commuteTime: 20,
            lifestyle: { socialLevel: 3, cleanliness: 4, studyHabits: 'balanced', hobbies: [] },
            situation: { goal: 'Renting my first home', timeframe: 'Flexible', currentStatus: 'Living with others' }
          };

          const errorFallbackStorageKey = `supportTickets_${currentUser.uid}`;
          const errorFallbackRaw = localStorage.getItem(errorFallbackStorageKey);
          const errorFallbackTickets: SupportTicket[] = errorFallbackRaw ? JSON.parse(errorFallbackRaw).filter((t: any) => t && typeof t === 'object') : [];
          const newUserObj = {
            id: currentUser.uid,
            name: currentUser.displayName || 'Student',
            email: currentUser.email || '',
            savedMatches: [],
            enquiries: [],
            supportTickets: errorFallbackTickets,
            phone: '',
            profile: defaultProfile
          };

          console.log("Setting default user state (error fallback):", newUserObj);
          setProfile(defaultProfile);
          setUser(newUserObj);
        });

      } else {
        console.log("User is signed out. Clearing state.");
        // User is signed out
        setUser(null);
        setProfile(null);
        setMatches([]);
        if (view !== AppState.LANDING) {
          goToView(AppState.LANDING);
        }
      }
    });

    return () => {
      console.log("Unsubscribing from Auth...");
      if (unsubscribeProfile) unsubscribeProfile();
      unsubscribeAuth();
    };
  }, []);

  const resetSearch = () => {
    window.scrollTo(0, 0);
    goToView(AppState.LANDING);
    setIsQuickSearch(false);
    setHeroUniversity('');
  };

  const handleAuthSuccess = (name: string, email: string) => {
    // Auth state is handled by the onAuthStateChanged listener
    console.log("Authentication successful for:", email);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      // State updates handled by listener
      goToView(AppState.LANDING);
    }).catch((error) => {
      console.error("Sign out error", error);
    });
  };

  const handleQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const budgetValue = formData.get('budget') as string;
    const socialLifestyle = formData.get('socialLifestyle') as string;

    const quickProfile: UserProfile = {
      name: user?.name || 'Student',
      university: heroUniversity || UK_UNIVERSITIES[0],
      budget: parseInt(budgetValue) || 300,
      commuteType: 'walk',
      commuteTime: 20,
      lifestyle: {
        socialLevel: parseInt(socialLifestyle) || 3,
        cleanliness: 4,
        studyHabits: 'balanced',
        hobbies: []
      },
      situation: user?.profile?.situation || {
        goal: 'Renting my first home',
        timeframe: 'Flexible',
        currentStatus: 'Living with others'
      }
    };

    setIsQuickSearch(true);
    handleProfileSubmit(quickProfile);
  };

  const handleProfileSubmit = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    if (user) {
      setUser({ ...user, profile: newProfile, name: newProfile.name });

      // Save to Firestore
      try {
        await setDoc(doc(db, "users", user.id), {
          profile: newProfile,
          name: newProfile.name
        }, { merge: true });
      } catch (e) {
        console.error("Error saving profile:", e);
      }
    }
    setIsLoading(true);
    goToView(AppState.RESULTS);
    window.scrollTo(0, 0);

    try {
      const results = await generateHousingMatches(newProfile);
      setMatches(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedFields: Partial<UserProfile>) => {
    if (user && user.profile) {
      const updatedProfile = { ...user.profile, ...updatedFields };
      setUser({ ...user, profile: updatedProfile });
      setProfile(updatedProfile);
      goToView(AppState.PROFILE);

      // Save to Firestore
      try {
        await setDoc(doc(db, "users", user.id), {
          profile: updatedProfile
        }, { merge: true });
      } catch (e) {
        console.error("Error updating profile:", e);
      }
    }
  };

  const handleSaveSettings = async (updatedDetails: Partial<UserAccount>) => {
    if (user) {
      // Optimistic update
      setUser({ ...user, ...updatedDetails });

      // Save to Firestore
      try {
        // Only save fields that are part of UserAccount and not UserProfile
        const { name, email, ...rest } = updatedDetails; // Destructure to exclude name and email
        await setDoc(doc(db, "users", user.id), rest, { merge: true });
        console.log("Settings saved to Firestore successfully");
      } catch (e) {
        console.error("Error saving settings:", e);
        alert("Failed to save settings. Please check your connection.");
      }
    }
  };

  const handleExplore = () => {
    goToView(AppState.EXPLORE);
    window.scrollTo(0, 0);
  };

  const handleAboutView = () => {
    goToView(AppState.ABOUT);
    window.scrollTo(0, 0);
  };

  const handleFaqView = () => {
    goToView(AppState.FAQ);
    window.scrollTo(0, 0);
  };

  const handleBlogView = () => {
    goToView(AppState.BLOG);
    window.scrollTo(0, 0);
  };

  const handleLegalView = () => {
    goToView(AppState.LEGAL_GUIDE);
    window.scrollTo(0, 0);
  };

  const handleStudentPerksView = () => {
    goToView(AppState.STUDENT_PERKS);
    window.scrollTo(0, 0);
  };

  const handleSupportView = () => {
    goToView(AppState.SUPPORT);
    window.scrollTo(0, 0);
  };

  const handleSupportMessageSent = async (ticket: SupportTicket) => {
    if (!user) return;
    const storageKey = `supportTickets_${user.id}`;
    const existingRaw = localStorage.getItem(storageKey);
    const existing: SupportTicket[] = existingRaw ? JSON.parse(existingRaw).filter((t: any) => t && typeof t === 'object') : [];
    if (!existing.some(t => t.id === ticket.id)) {
      const next = [...existing, ticket];
      localStorage.setItem(storageKey, JSON.stringify(next));
      setUser({ ...user, supportTickets: next });
      try {
        await setDoc(doc(db, 'users', user.id), { supportTickets: next }, { merge: true });
      } catch (e) {
        console.error('Error saving support ticket to Firestore (localStorage fallback active):', e);
      }
    }
  };

  const handleProfileView = () => {
    if (user) {
      goToView(AppState.PROFILE);
      window.scrollTo(0, 0);
    } else {
      navigate('/signin');
    }
  };

  const handleViewProperty = (id: string) => {
    goToView(AppState.PROPERTY_DETAILS, { propertyId: id });
    window.scrollTo(0, 0);
  };

  const handleArticleView = (id: string) => {
    goToView(AppState.ARTICLE_DETAILS, { articleId: id });
    window.scrollTo(0, 0);
  };

  const handleAdminView = () => {
    goToView(AppState.ADMIN);
    window.scrollTo(0, 0);
  };

  const onAddBlogPost = async (newPost: BlogPost) => {
    try {
      if (newPost.id && blogPosts.find(p => p.id === newPost.id)) {
        // Update existing post
        await updateBlogPost(newPost.id, newPost);
        console.log('Blog post updated successfully');
      } else {
        // Create new post
        const { id, ...postData } = newPost;
        await createBlogPost(postData);
        console.log('Blog post created successfully');
      }
      // Real-time listener will update the state automatically
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post. Please try again.');
    }
  };

  const currentProperty = matches.find(m => m.id === selectedPropertyId) || MOCK_PROPERTIES.find(p => p.id === selectedPropertyId) as MatchResult;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        onReset={resetSearch}
        onAboutClick={handleAboutView}
        onExplore={handleExplore}
        onFaqClick={handleFaqView}
        onBlogClick={handleBlogView}
        onLegalClick={handleLegalView}
        onStudentPerksClick={handleStudentPerksView}
        onProfileClick={handleProfileView}
        onSignInClick={() => navigate('/signin')}
        transparent={view === AppState.LANDING}
        user={user}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === AppState.LANDING && (
            <motionAny.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* HERO SECTION */}
              <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden py-24">
                {HERO_IMAGES.map((img, idx) => (
                  <div
                    key={img}
                    className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Hero background" />
                    <div className="absolute inset-0 bg-black/45"></div>
                  </div>
                ))}

                <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center">
                  <motionAny.div
                    initial={{ scale: 0.95, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="glass-card-main w-full py-16 px-8 md:px-12 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center text-center"
                  >
                    <motionAny.h1
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white leading-tight"
                    >
                      Find Your Perfect Student Home
                    </motionAny.h1>
                    <motionAny.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="text-base md:text-lg lg:text-xl font-medium mb-12 text-white/90 max-w-2xl leading-relaxed"
                    >
                      Stop browsing endless listings. Our AI matches you with homes where you'll actually thrive. Based on your budget, lifestyle, and study habits.
                    </motionAny.p>

                    <motionAny.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="bg-white p-3 md:p-4 rounded-[2rem] shadow-xl w-full max-w-4xl mb-12"
                    >
                      <form onSubmit={handleQuickSearch} className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="flex-[1.5] w-full bg-gray-50 rounded-2xl flex items-center px-5 py-3.5 text-gray-800 border border-gray-100 focus-within:ring-2 focus-within:ring-brand-orange/20 transition-all">
                          <Autocomplete
                            options={UK_UNIVERSITIES}
                            value={heroUniversity}
                            onChange={setHeroUniversity}
                            placeholder="City or University"
                            icon="fa-solid fa-location-dot"
                            dark={true}
                          />
                        </div>

                        <div className="flex-1 w-full bg-white rounded-2xl flex items-center px-4 py-3 text-gray-800 border border-gray-100">
                          <div className="text-left w-full flex items-center">
                            <i className="fa-solid fa-pound-sign text-brand-orange mr-3"></i>
                            <select name="budget" className="w-full focus:outline-none font-bold bg-transparent text-sm cursor-pointer appearance-none pr-8 bg-[url('https://cdn-icons-png.flaticon.com/512/60/60995.png')] bg-[length:12px] bg-[right_5px_center] bg-no-repeat">
                              <option value="" disabled selected>Pricing (Weekly)</option>
                              <option value="150">Up to £150</option>
                              <option value="250">Up to £250</option>
                              <option value="350">Up to £350</option>
                              <option value="500">Up to £500</option>
                              <option value="1000">No Limit</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex-1 w-full bg-white rounded-2xl flex items-center px-4 py-3 text-gray-800 border border-gray-100">
                          <div className="text-left w-full flex items-center">
                            <i className="fa-solid fa-users text-brand-orange mr-3"></i>
                            <select name="socialLifestyle" className="w-full focus:outline-none font-bold bg-transparent text-sm cursor-pointer appearance-none pr-8 bg-[url('https://cdn-icons-png.flaticon.com/512/60/60995.png')] bg-[length:12px] bg-[right_5px_center] bg-no-repeat">
                              <option value="" disabled selected>Social Lifestyle</option>
                              <option value="1">Quiet & Focused</option>
                              <option value="3">Balanced Social</option>
                              <option value="5">Very Social</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full lg:w-auto bg-brand-orange text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl whitespace-nowrap transform hover:scale-[1.02] active:scale-95"
                        >
                          Get My Matches
                        </button>
                      </form>
                    </motionAny.div>
                  </motionAny.div>
                </div>
              </section>

              {/* WHY CHOOSE US SECTION */}
              <section className="py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                  <motionAny.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
                  >
                    Why Students Choose Our AI Matchmaker
                  </motionAny.h2>
                  <motionAny.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 max-w-2xl mx-auto mb-20 font-medium"
                  >
                    We understand student life. Our AI doesn't just match properties - it matches lifestyles.
                  </motionAny.p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { icon: 'fa-brain', title: 'AI-Powered Matching', desc: 'Our smart algorithm learns your preferences and finds homes that actually fit your lifestyle.', color: 'bg-brand-blue' },
                      { icon: 'fa-circle-check', title: 'Verified Properties', desc: 'All properties are verified by us ensuring quality and authenticity for students.', color: 'bg-emerald-500' },
                      { icon: 'fa-shield-halved', title: 'Perfect Fit Guarantee', desc: 'Each recommendation includes AI results, evaluating exactly why it suits your needs.', color: 'bg-orange-600' },
                      { icon: 'fa-wand-magic-sparkles', title: 'Instant Booking', desc: 'Book your ideal student home in minutes. No more endless viewings or paperwork.', color: 'bg-purple-600' },
                      { icon: 'fa-users', title: 'Student Community', desc: 'Connect with fellow students and find compatible roommates through our platform.', color: 'bg-pink-600' },
                      { icon: 'fa-magnifying-glass', title: 'Advanced Filters', desc: 'Filter by budget, location, amenities, and proximity to your university campus.', color: 'bg-cyan-600' },
                    ].map((feat, idx) => (
                      <motionAny.div
                        key={feat.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-12 rounded-[2rem] border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center"
                      >
                        <div className={`w-14 h-14 ${feat.color} text-white rounded-xl flex items-center justify-center text-xl mb-8 shadow-lg shadow-gray-200 transition-transform group-hover:scale-110`}>
                          <i className={`fa-solid ${feat.icon}`}></i>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4">{feat.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-[280px]">{feat.desc}</p>
                      </motionAny.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* FEATURED LISTINGS SECTION */}
              <section className="py-24 px-4 bg-gray-50/50">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-4xl md:text-5xl font-black text-[#0D1B2A] mb-4 tracking-tight">Featured Student Homes</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto mb-16 font-medium">
                    Discover verified properties perfect for student life. Each home is vetted for quality and location.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {MOCK_PROPERTIES.slice(0, 3).map((prop, idx) => (
                      <motionAny.div
                        key={prop.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 text-left"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img src={prop.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={prop.name} />
                          <div className="absolute top-4 right-4 bg-brand-orange text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                            Featured
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="flex items-center gap-1 text-xs mb-3">
                            <i className="fa-solid fa-star text-brand-orange"></i>
                            <span className="font-black text-gray-900">{idx === 0 ? '4.9' : idx === 1 ? '4.8' : '4.7'}</span>
                            <span className="text-gray-400 font-bold">({idx === 0 ? '127' : idx === 1 ? '94' : '156'} reviews)</span>
                          </div>
                          <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{prop.name}</h3>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
                            <i className="fa-solid fa-location-dot"></i> {prop.area}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-8">
                            {prop.amenities.map(tag => (
                              <span key={tag} className="bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                            <div className="text-2xl font-black text-brand-orange">
                              £{prop.price === 850 ? '850' : prop.price === 720 ? '720' : '950'}<span className="text-xs text-gray-400 font-bold">/month</span>
                            </div>
                            <button
                              onClick={() => handleViewProperty(prop.id)}
                              className="px-5 py-2.5 rounded-xl border-2 border-brand-orange text-brand-orange font-black text-xs hover:bg-brand-orange hover:text-white transition-all uppercase tracking-widest"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </motionAny.div>
                    ))}
                  </div>

                  <button
                    onClick={() => goToView(AppState.EXPLORE)}
                    className="bg-brand-orange text-white px-12 py-4 rounded-xl font-black shadow-xl shadow-orange-100 hover:bg-brand-orange-hover transition-all text-sm uppercase tracking-widest"
                  >
                    View All Properties
                  </button>
                </div>
              </section>

              {/* TESTIMONIALS SECTION */}
              <section className="py-24 px-4 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-4xl md:text-5xl font-black text-[#0D1B2A] mb-4 tracking-tight">Loved by Students Across the UK</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto mb-20 font-medium">Real stories from students who found their perfect homes through NestQuest.</p>

                  <div className="relative flex items-center px-4 md:px-12">
                    <button className="absolute left-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-brand-orange hover:bg-brand-orange hover:text-white transition-all">
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                      {TESTIMONIALS.map((t, idx) => (
                        <motionAny.div
                          key={t.name}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          className="bg-white p-10 rounded-3xl border border-gray-100 text-left shadow-sm hover:shadow-md transition-all flex flex-col h-full"
                        >
                          <div className="flex gap-1 text-brand-orange mb-8">
                            {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star text-xs"></i>)}
                          </div>
                          <p className="text-gray-500 font-medium mb-12 leading-relaxed flex-grow">"{t.text}"</p>

                          <div className="pt-8 border-t border-gray-50 flex items-center gap-4">
                            <div className={`w-12 h-12 ${t.color} text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg`}>
                              {t.avatar}
                            </div>
                            <div>
                              <h4 className="font-black text-gray-900 text-sm">{t.name}</h4>
                              <p className="text-xs font-bold text-gray-400">{t.uni}</p>
                            </div>
                          </div>
                        </motionAny.div>
                      ))}
                    </div>

                    <button className="absolute right-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-brand-orange hover:bg-brand-orange hover:text-white transition-all">
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </section>

              {/* CTA SECTION */}
              <section className="py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                  <motionAny.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-brand-blue rounded-[4rem] p-12 md:p-24 overflow-hidden shadow-2xl shadow-blue-100 text-center"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Your Dream Student Home <br /> is Just a Click Away</h2>
                      <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mb-12">Join 50,000+ UK students using NestQuest for lifestyle-matched accommodation.</p>

                      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button onClick={() => goToView(AppState.ONBOARDING)} className="bg-brand-orange text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 transform hover:scale-105">
                          Find My Match Now
                          <i className="fa-solid fa-sparkles"></i>
                        </button>
                      </div>
                    </div>
                  </motionAny.div>
                </div>
              </section>
            </motionAny.div>
          )}

          {view === AppState.ONBOARDING && (
            <motionAny.div key="onboarding" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <OnboardingForm onSubmit={handleProfileSubmit} />
            </motionAny.div>
          )}

          {view === AppState.RESULTS && (
            <motionAny.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white">
                  <LoadingMascot />
                </div>
              ) : profile && (
                <ResultsView
                  profile={profile}
                  matches={matches}
                  onNewSearch={() => goToView(AppState.ONBOARDING)}
                  onFilterUpdate={handleProfileSubmit}
                  onViewProperty={handleViewProperty}
                  isFromQuickSearch={isQuickSearch}
                />
              )}
            </motionAny.div>
          )}

          {view === AppState.PROPERTY_DETAILS && currentProperty && (
            <motionAny.div key="property_details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PropertyDetailsView
                property={currentProperty}
                onBack={() => goToView(AppState.RESULTS)}
                user={user}
              />
            </motionAny.div>
          )}

          {view === AppState.EXPLORE && (
            <motionAny.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ExploreView />
            </motionAny.div>
          )}

          {view === AppState.BLOG && (
            <motionAny.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BlogView posts={blogPosts.filter(p => p.status === 'published')} onReadArticle={handleArticleView} isLoading={isBlogLoading} />
            </motionAny.div>
          )}

          {view === AppState.ARTICLE_DETAILS && selectedArticleId !== null && (
            <motionAny.div key="article" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ArticleDetailsView posts={blogPosts} articleId={selectedArticleId} onBack={handleBlogView} />
            </motionAny.div>
          )}

          {view === AppState.LEGAL_GUIDE && (
            <motionAny.div key="legal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LegalGuideView />
            </motionAny.div>
          )}

          {view === AppState.STUDENT_PERKS && (
            <motionAny.div key="student_perks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StudentPerksView />
            </motionAny.div>
          )}

          {view === AppState.FAQ && (
            <motionAny.div key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FaqView onContactSupport={handleSupportView} />
            </motionAny.div>
          )}

          {view === AppState.SUPPORT && (
            <motionAny.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SupportView user={user} onBack={handleFaqView} onSupportMessageSent={handleSupportMessageSent} />
            </motionAny.div>
          )}

          {view === AppState.ABOUT && (
            <motionAny.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AboutView onStartMatching={() => goToView(AppState.ONBOARDING)} />
            </motionAny.div>
          )}

          {view === AppState.ADMIN && (
            <motionAny.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminView posts={blogPosts} onAddPost={onAddBlogPost} onBack={() => goToView(AppState.LANDING)} />
            </motionAny.div>
          )}

          {view === AppState.PROFILE && user && (
            <motionAny.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ProfileView
                user={user}
                onEditProfile={() => goToView(AppState.LIFESTYLE_EDIT)}
                onViewSaved={() => goToView(AppState.RESULTS)}
                onOpenSettings={() => goToView(AppState.SETTINGS)}
                onLogout={handleLogout}
                onContactSupport={handleSupportView}
              />
            </motionAny.div>
          )}

          {view === AppState.LIFESTYLE_EDIT && user?.profile && (
            <motionAny.div key="lifestyle_edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProfileEditor
                currentProfile={user.profile}
                onSave={handleUpdateProfile}
                onCancel={() => goToView(AppState.PROFILE)}
              />
            </motionAny.div>
          )}

          {view === AppState.SETTINGS && user && (
            <motionAny.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SettingsView
                user={user}
                onSave={handleSaveSettings}
                onBack={() => goToView(AppState.PROFILE)}
              />
            </motionAny.div>
          )}
        </AnimatePresence>
      </main>

      <NestorChat />

      <footer className="bg-brand-blue text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-lg">
                  <span className="text-2xl font-black">N</span>
                </div>
                <span className="text-3xl font-black tracking-tight">NestQuest</span>
              </div>
              <p className="text-blue-100 text-base leading-relaxed mb-10 font-medium">
                AI-powered student accommodation matching. Find your perfect home faster than ever.
              </p>
              {/* Subtle Admin Link */}
              <button
                onClick={handleAdminView}
                className="text-xs font-black text-white/30 hover:text-white uppercase tracking-widest transition-colors mt-4"
              >
                Content Console
              </button>
            </div>

            <div>
              <h4 className="text-xl font-black mb-10 border-b border-white/10 pb-3 inline-block">Quick Links</h4>
              <ul className="space-y-5 text-blue-100 text-base font-bold">
                <li><a href="#" className="hover:text-brand-orange transition-colors" onClick={(e) => { e.preventDefault(); resetSearch(); }}>Home</a></li>
                <li><a href="#" className="hover:text-brand-orange transition-colors" onClick={(e) => { e.preventDefault(); handleAboutView(); }}>About</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); handleStudentPerksView(); }}>Student Perks</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); handleFaqView(); }}>FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); goToView(AppState.EXPLORE); }}>Explore UK</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-10 border-b border-white/10 pb-3 inline-block">Support</h4>
              <ul className="space-y-5 text-blue-100 text-base font-bold">
                <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); handleFaqView(); }}>Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); handleSupportView(); }}>Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-10 border-b border-white/10 pb-3 inline-block">Join Us</h4>
              <p className="text-blue-100 text-sm mb-6 font-medium">Have questions?</p>
              <button
                onClick={handleSupportView}
                className="w-full bg-white hover:bg-gray-100 text-brand-blue py-5 rounded-2xl shadow-xl transition-all font-black text-base"
              >
                Contact Support
              </button>
            </div>
          </div>

          <div className="pt-10 border-t border-white/10 text-center text-blue-200 text-xs font-black uppercase tracking-widest">
            <p className="mb-4">© 2026 NestQuest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
