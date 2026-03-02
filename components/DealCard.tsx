import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BusinessDeal } from '../types';

interface DealCardProps {
  deal: BusinessDeal;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const [isRedeemed, setIsRedeemed] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={deal.image}
          alt={deal.businessName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
          {deal.category}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-gray-900 leading-tight">{deal.dealTitle}</h3>
        </div>
        <p className="text-sm font-bold text-brand-blue mb-3">{deal.businessName}</p>
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">{deal.description}</p>

        <AnimatePresence mode="wait">
          {!isRedeemed ? (
            <motion.button
              key="redeem-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRedeemed(true)}
              className="w-full border-2 border-brand-orange bg-transparent text-brand-orange py-3 rounded-xl font-black text-sm hover:bg-brand-orange hover:text-white transition-colors"
            >
              Redeem Deal
            </motion.button>
          ) : (
            <motion.div
              key="code-display"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-brand-orange/10 border-2 border-dashed border-brand-orange rounded-xl p-4 text-center"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-1">Your Code</p>
              <p className="text-2xl font-black text-brand-orange tracking-widest">{deal.discountCode}</p>
              <p className="text-[10px] text-gray-500 mt-2 font-medium">Expires: {new Date(deal.expiryDate).toLocaleDateString()}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-[10px] text-gray-400 mt-4 italic">*{deal.terms}</p>
      </div>
    </motion.div>
  );
};
