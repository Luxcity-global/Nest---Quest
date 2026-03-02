import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MOCK_DEALS } from '../constants';
import { DealCard } from './DealCard';
import { BusinessInterestForm } from './BusinessInterestForm';

const ALL_CATEGORIES = 'all';
const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  food: 'Food & Drink',
  academic: 'Academic',
  lifestyle: 'Lifestyle',
  travel: 'Travel'
};

export const StudentPerksView: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);

  const categories = useMemo(() => {
    const cats = new Set(MOCK_DEALS.map(d => d.category));
    return [ALL_CATEGORIES, ...Array.from(cats).sort()];
  }, []);

  const filteredDeals = useMemo(() => {
    if (categoryFilter === ALL_CATEGORIES) return MOCK_DEALS;
    return MOCK_DEALS.filter(deal => deal.category === categoryFilter);
  }, [categoryFilter]);
  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden mb-20">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000"
          alt="Student Perks"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <span className="bg-brand-orange text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
                NestQuest Perks
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Student Living, <br />
                <span className="text-brand-orange">Better Together.</span>
              </h1>
              <p className="text-xl text-gray-200 font-medium leading-relaxed">
                We partner with the best local businesses to bring you exclusive deals,
                discounts, and experiences that make student life more affordable and fun.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Deals Section */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Exclusive Student Deals</h2>
              <p className="text-lg text-gray-600 font-medium">Flash your NestQuest profile at these local spots to save big.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold text-gray-500">
                <p className="text-gray-900">500+ Students</p>
                <p>redeemed this week</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                  categoryFilter === cat
                    ? 'bg-brand-orange text-white shadow-lg shadow-orange-100'
                    : 'border-2 border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>

        {/* Business Collaboration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-gray-50 rounded-[40px] p-8 md:p-16">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-6">Own a Local Business?</h2>
            <p className="text-xl text-gray-600 font-medium mb-8 leading-relaxed">
              Reach thousands of students living right in your neighbourhood.
              Partner with NestQuest to drive foot traffic, build brand loyalty,
              and support the next generation.
            </p>

            <div className="space-y-6">
              {[
                { icon: 'fa-chart-line', title: 'Increased Visibility', desc: 'Get featured in our local guides and tips sections.' },
                { icon: 'fa-users', title: 'Direct Access', desc: 'Connect with students moving into your area.' },
                { icon: 'fa-handshake', title: 'Easy Integration', desc: 'Simple redemption flows with no complex tech needed.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-orange shadow-sm flex-shrink-0">
                    <i className={`fa-solid ${item.icon} text-xl`}></i>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BusinessInterestForm />
        </div>
      </div>
    </div>
  );
};
