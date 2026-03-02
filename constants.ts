
import { Property, BlogPost, BusinessDeal } from './types';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
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

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Bell Lane, London, E1',
    area: 'Spitalfields',
    city: 'London',
    price: 270,
    pcm: 1170,
    beds: 3,
    baths: 2,
    sqft: 850,
    type: 'Shared Flat',
    amenities: ['Modern Kitchen', 'High Speed Wifi', 'Student Community', '24h Security'],
    description: 'Double Room in Shared Flat E1 Liverpool Street. This immaculate apartment is situated on the first floor of a Georgian-style building on the very popular Exmouth Market. The owners have created a minimal aesthetic internally, working with sleek surfaces, bespoke storage solutions and concealed kitchen equipment.',
    vibe: 'Modern, social, convenient',
    location: { lat: 51.5204, lng: -0.0722 },
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    secondaryImages: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800'
    ],
    deposit: 1350,
    councilTaxBand: 'Band E',
    epcRating: 'B',
    availableDate: '15 February 2026',
    tenancyLength: '12 months',
    agentName: 'CloudRooms London',
    agentLogo: 'NQ'
  },
  {
    id: '2',
    name: 'Exmouth Market, London, EC1R',
    area: 'Clerkenwell',
    city: 'London',
    price: 623,
    pcm: 2700,
    beds: 1,
    baths: 1,
    sqft: 527,
    type: 'Studio',
    amenities: ['Ensuite', 'Study Desk', 'Near Library', 'Designer Furniture'],
    description: '1 bedroom apartment to rent in the heart of Clerkenwell. Super-fast 80Mbps broadband included. Recently renovated with top-tier materials and energy-efficient appliances.',
    vibe: 'Artsier, bustling, social',
    location: { lat: 51.5264, lng: -0.1068 },
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    secondaryImages: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800'
    ],
    deposit: 3115,
    councilTaxBand: 'Band D',
    epcRating: 'A',
    availableDate: 'Available Now',
    tenancyLength: '12 months',
    agentName: 'Winkworth Clerkenwell',
    agentLogo: 'WK'
  },
  {
    id: '3',
    name: 'Goodge Place, London W1T',
    area: 'Fitzrovia',
    city: 'London',
    price: 196,
    pcm: 850,
    beds: 9,
    baths: 4,
    type: 'House Share',
    amenities: ['Garden', 'Large Kitchen', 'Central Location', 'Student Hub'],
    description: 'Shared accommodation for students. This property offers an energetic yet convenient lifestyle with a wide range of local bus routes. Minutes from Tottenham Court Road.',
    vibe: 'Calm, productive, high-end',
    location: { lat: 51.5204, lng: -0.1368 },
    imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800',
    secondaryImages: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
    ],
    deposit: 981,
    councilTaxBand: 'Band C',
    epcRating: 'C',
    availableDate: 'January 2026',
    tenancyLength: 'Flexible',
    agentName: 'Ad Hoc Property Management',
    agentLogo: 'AH'
  }
];

export const MOCK_DEALS: BusinessDeal[] = [
  {
    id: 'd1',
    businessName: 'The Coffee Lab',
    dealTitle: '50% Off Your First Brew',
    description: 'Get half price on any coffee when you show your NestQuest profile.',
    discountCode: 'NESTBREW50',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400',
    expiryDate: '2026-12-31',
    terms: 'Valid for new customers only. One per person.'
  },
  {
    id: 'd2',
    businessName: 'Student Stationery Co.',
    dealTitle: '20% Off All Planners',
    description: 'Stay organized with our premium academic planners and notebooks.',
    discountCode: 'PLANWITHNEST',
    category: 'academic',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=400',
    expiryDate: '2026-09-01',
    terms: 'Valid on full price items only.'
  },
  {
    id: 'd3',
    businessName: 'Urban Fitness',
    dealTitle: 'No Joining Fee + Free Month',
    description: 'Join the most student-friendly gym in London with this exclusive offer.',
    discountCode: 'NESTFITFREE',
    category: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    expiryDate: '2026-06-30',
    terms: 'Requires 12-month student contract.'
  },
  {
    id: 'd4',
    businessName: 'Pizza Planet',
    dealTitle: 'Buy One Get One Free',
    description: 'The ultimate study fuel. BOGO on all large pizzas every Tuesday.',
    discountCode: 'NESTPIZZA',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
    expiryDate: '2026-12-31',
    terms: 'Collection only. Tuesdays only.'
  },
  {
    id: 'd5',
    businessName: 'Eco-Travel Bikes',
    dealTitle: '15% Off Annual Rental',
    description: 'The greenest way to get to campus. Save on your yearly bike subscription.',
    discountCode: 'NESTBIKE15',
    category: 'travel',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400',
    expiryDate: '2026-10-15',
    terms: 'Student ID required at pickup.'
  }
];

export const UK_UNIVERSITIES = [
  'University of Manchester',
  'University College London (UCL)',
  'University of Edinburgh',
  'University of Sheffield',
  'University of Bristol',
  'King\'s College London',
  'University of Birmingham',
  'University of Warwick',
  'University of Oxford',
  'University of Cambridge'
];
