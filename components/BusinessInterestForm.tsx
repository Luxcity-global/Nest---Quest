import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const BusinessInterestForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center"
      >
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <i className="fa-solid fa-check text-2xl"></i>
        </div>
        <h3 className="text-2xl font-black text-emerald-900 mb-2">Interest Received!</h3>
        <p className="text-emerald-700 font-medium">Our partnership team will reach out to you within 48 hours to discuss how we can support your business.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <h3 className="text-2xl font-black text-gray-900 mb-6">Partner with NestQuest</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Business Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all font-bold"
              placeholder="e.g. The Local Cafe"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Email</label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all font-bold"
              placeholder="hello@business.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Partnership Type</label>
          <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all font-bold appearance-none">
            <option>Student Discount Partner</option>
            <option>Local Guide Sponsor</option>
            <option>Event Collaboration</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tell us about your proposal</label>
          <textarea
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all font-bold"
            placeholder="How would you like to collaborate with our student community?"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-brand-orange text-white py-4 rounded-xl font-black text-lg hover:bg-brand-orange-hover transition-all shadow-lg shadow-orange-100"
        >
          Send Interest
        </button>
      </form>
    </div>
  );
};
