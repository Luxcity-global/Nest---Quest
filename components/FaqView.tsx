
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Pervasive type resolution errors in framer-motion are bypassed by casting to any.
const motionAny: any = motion;

const FAQ_DATA = [
  {
    id: "getting-started",
    category: "Getting Started",
    icon: "fa-rocket",
    description: "Learn how to find and match with your perfect home.",
    questions: [
      {
        q: "What is NestQuest and how does it work for students?",
        a: "NestQuest is the UK's premier AI-powered student housing platform. We use advanced algorithms to analyze your university location, budget, and lifestyle preferences to match you with verified properties where you'll actually thrive, not just live."
      },
      {
        q: "How do I become a verified student on NestQuest?",
        a: "Simply sign up using your university (.ac.uk) email address. Once you verify your email, you'll gain access to exclusive verified listings and the ability to message agents directly through our secure platform."
      },
      {
        q: "What are the requirements to start searching?",
        a: "All you need is your university name and a rough idea of your weekly budget. Our AI Matchmaker will guide you through a quick 3-step profile setup to understand your commute needs and lifestyle vibes."
      }
    ]
  },
  {
    id: "rent-payments",
    category: "Rent & Payments",
    icon: "fa-credit-card",
    description: "Questions about deposits, rent, and student finance.",
    questions: [
      {
        q: "How is the deposit handled?",
        a: "Deposits are typically handled through government-approved Tenancy Deposit Schemes (TDS). Most properties require 5 weeks of rent as a deposit, which is fully refundable at the end of your tenancy provided the room is kept in good condition."
      },
      {
        q: "Are bills included in the rent price?",
        a: "This varies by property. Many student-specific 'En-suite' and 'Studio' listings are all-inclusive (Water, Electric, Wifi), while private house shares might require you to set up your own utilities. Check the 'Key Information' section on any property page for details."
      },
      {
        q: "Can I pay my rent using Student Finance?",
        a: "Most student landlords and halls of residence align their payment schedules with Student Finance England/Wales/Scotland disbursement dates. You can usually discuss quarterly payment plans with the agent after a successful match."
      }
    ]
  },
  {
    id: "viewing-booking",
    category: "Viewing & Booking",
    icon: "fa-calendar-check",
    description: "Everything you need to know about the booking process.",
    questions: [
      {
        q: "How do I book a viewing?",
        a: "On any property page, click the 'Message' or 'Request Details' button. This sends your AI-matched profile directly to the agent, who will then contact you to schedule a physical or virtual tour."
      },
      {
        q: "Can I book a property from overseas?",
        a: "Yes! Many of our verified properties offer high-quality video tours and virtual 360-degree viewings. You can complete the entire booking process online through our secure documentation portal."
      }
    ]
  },
  {
    id: "safety-security",
    category: "Support & Security",
    icon: "fa-shield-halved",
    description: "Your safety and data privacy are our top priorities.",
    questions: [
      {
        q: "How are properties verified?",
        a: "We perform multi-stage checks on all landlords and agents. This includes checking their registration with the Property Redress Scheme and verifying the property's EPC and Gas Safety certificates."
      },
      {
        q: "What if I have an issue with my landlord?",
        a: "NestQuest provides a dedicated support channel for our users. If you encounter any issues during your tenancy, our experts can guide you on your rights and help facilitate communication with the agent."
      }
    ]
  }
];

interface FaqViewProps {
  onContactSupport?: () => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onContactSupport }) => {
  const [activeTab, setActiveTab] = useState(FAQ_DATA[0].id);

  const activeCategory = FAQ_DATA.find(cat => cat.id === activeTab) || FAQ_DATA[0];

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motionAny.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-[#0D1B2A] mb-6 tracking-tight"
          >
            Everything You Need to <span className="text-brand-orange">Know</span>
          </motionAny.h1>
          <motionAny.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium text-lg max-w-3xl mx-auto"
          >
            Get answers to common questions about searching, payments, safety, and starting your student life with NestQuest.
          </motionAny.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar - Category List */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 space-y-2 sticky top-32">
              <div className="px-4 py-4 mb-2">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-regular fa-message text-brand-orange"></i>
                  FAQ Categories
                </h3>
                <p className="text-xs text-gray-400 font-bold mt-1">Browse questions by topic</p>
              </div>

              {FAQ_DATA.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full text-left px-5 py-5 rounded-2xl flex items-center justify-between transition-all duration-300 group ${
                    activeTab === cat.id 
                      ? 'bg-brand-orange/10 text-brand-orange ring-1 ring-brand-orange/20' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                      activeTab === cat.id ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}>
                      <i className={`fa-solid ${cat.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="font-black text-sm">{cat.category}</h4>
                      <p className={`text-[10px] font-bold ${activeTab === cat.id ? 'text-brand-orange/70' : 'text-gray-400'}`}>
                        {cat.questions.length} questions
                      </p>
                    </div>
                  </div>
                  <i className={`fa-solid fa-chevron-right text-[10px] transition-transform ${activeTab === cat.id ? 'translate-x-1' : 'opacity-0'}`}></i>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motionAny.div
                key={activeCategory.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Category Header Card */}
                <div className="bg-gray-50/80 backdrop-blur rounded-[2.5rem] p-8 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl text-brand-orange border border-gray-100">
                      <i className={`fa-solid ${activeCategory.icon}`}></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">{activeCategory.category}</h2>
                      <p className="text-sm font-bold text-gray-400">{activeCategory.questions.length} questions answered</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <i className="fa-solid fa-chevron-up text-gray-300"></i>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {activeCategory.questions.map((faq, idx) => (
                    <motionAny.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <h3 className="text-lg font-black text-gray-900 mb-6 group-hover:text-brand-orange transition-colors">
                        {faq.q}
                      </h3>
                      <div className="text-gray-500 font-medium leading-relaxed text-base">
                        {faq.a}
                      </div>
                    </motionAny.div>
                  ))}
                </div>

                {/* Need Help CTA in Category Area */}
                <div className="bg-brand-blue/5 rounded-[2.5rem] p-10 mt-10 border border-brand-blue/10 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="text-center md:text-left">
                     <h3 className="text-xl font-black text-brand-blue mb-2">Can't find what you're looking for?</h3>
                     <p className="text-sm font-bold text-gray-500">Our support team usually responds within 2 hours during business hours.</p>
                   </div>
                   <button 
                     onClick={onContactSupport}
                     className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-blue-dark transition-all shadow-xl shadow-blue-100 flex items-center gap-3 whitespace-nowrap"
                   >
                     <i className="fa-solid fa-headset"></i>
                     Message Support
                   </button>
                </div>
              </motionAny.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
