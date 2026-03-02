
export interface UserProfile {
  name: string;
  university: string;
  budget: number; // Weekly budget in GBP
  commuteType: 'walk' | 'cycle' | 'bus' | 'tube';
  commuteTime: number; // Max minutes
  lifestyle: {
    socialLevel: number; // 1-5
    cleanliness: number; // 1-5
    studyHabits: 'early-bird' | 'night-owl' | 'balanced';
    hobbies: string[];
  };
  situation: {
    goal: string;
    timeframe: string;
    currentStatus: string;
  };
}

export interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  savedMatches: string[]; // List of property IDs
  enquiries: {
    propertyId: string;
    date: string;
    status: 'pending' | 'responded' | 'booked';
  }[];
  /** Support tickets from POST /api/v1/support/messages (201 response) */
  supportTickets?: SupportTicket[];
  profile?: UserProfile;
}

export interface Property {
  id: string;
  name: string;
  area: string;
  city: string;
  price: number; // PW
  pcm: number; // PCM calculated
  beds: number;
  baths: number;
  sqft?: number;
  type: 'En-suite' | 'Studio' | 'Shared Flat' | 'House Share';
  amenities: string[];
  description: string;
  vibe: string;
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  secondaryImages?: string[];
  // Added for high-fidelity details
  deposit?: number;
  councilTaxBand?: string;
  epcRating?: string;
  availableDate?: string;
  tenancyLength?: string;
  agentName?: string;
  agentLogo?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  nestorTake: string;
  status: 'published' | 'draft';
}

export interface MatchResult extends Property {
  matchScore: number;
  aiExplanation: string;
}

export interface BusinessDeal {
  id: string;
  businessName: string;
  dealTitle: string;
  description: string;
  discountCode: string;
  expiryDate: string;
  category: string;
  image: string;
  terms: string;
}

export enum AppState {
  LANDING = 'landing',
  ONBOARDING = 'onboarding',
  RESULTS = 'results',
  EXPLORE = 'explore',
  PROFILE = 'profile',
  SETTINGS = 'settings',
  LIFESTYLE_EDIT = 'lifestyle_edit',
  PROPERTY_DETAILS = 'property_details',
  FAQ = 'faq',
  SUPPORT = 'support',
  ABOUT = 'about',
  BLOG = 'blog',
  LEGAL_GUIDE = 'legal_guide',
  ARTICLE_DETAILS = 'article_details',
  ADMIN = 'admin',
  STUDENT_PERKS = 'student_perks'
}
