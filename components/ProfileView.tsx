
import React, { useState } from 'react';
import { UserAccount, SupportTicket } from '../types';
import { MOCK_PROPERTIES } from '../constants';
import { motion } from 'framer-motion';

interface ProfileViewProps {
  user: UserAccount;
  onEditProfile: () => void;
  onViewSaved: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  /** Optional: navigate to Contact Support (for Ticket Reference section) */
  onContactSupport?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onEditProfile, onViewSaved, onOpenSettings, onLogout, onContactSupport }) => {
  const savedProperties = MOCK_PROPERTIES.filter(p => user.savedMatches?.includes(p.id));
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-100 pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-blue text-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-3xl md:text-4xl font-black shadow-2xl shadow-blue-100 border-4 border-white">
              {user.name[0]}
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-1">Hello {user.name}</h1>
              <p className="text-gray-500 font-bold flex items-center justify-center md:justify-start gap-2">
                <i className="fa-solid fa-graduation-cap text-brand-orange"></i>
                {user.profile?.university || 'UK University Student'}
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-center md:justify-end w-full md:w-auto">
            <button
              onClick={onEditProfile}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 font-black text-gray-600 hover:border-brand-orange hover:text-brand-orange transition-all bg-white"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Edit Profile
            </button>
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-orange text-white font-black hover:bg-brand-orange-hover transition-all shadow-lg shadow-orange-100"
            >
              <i className="fa-solid fa-gear"></i>
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Dashboard Column */}
          <div className="lg:col-span-8 space-y-8">

            {/* My Enquiries Section */}
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <i className="fa-solid fa-envelope text-brand-blue"></i>
                  Recent Enquiries
                </h2>
                <span className="bg-blue-50 text-brand-blue px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {user.enquiries.length} Sent
                </span>
              </div>

              {user.enquiries.length > 0 ? (
                <div className="space-y-4">
                  {user.enquiries.map((enq, idx) => {
                    const prop = MOCK_PROPERTIES.find(p => p.id === enq.propertyId);
                    return (
                      <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all cursor-pointer">
                        <img src={prop?.imageUrl} className="w-20 h-20 rounded-xl object-cover" alt="" />
                        <div className="flex-1">
                          <h4 className="font-black text-gray-900">{prop?.name}</h4>
                          <p className="text-xs text-gray-500 font-bold mt-1">Enquiry sent on {enq.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${enq.status === 'pending' ? 'bg-orange-50 text-brand-orange' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                            {enq.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[2rem]">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-2xl mx-auto mb-4">
                    <i className="fa-solid fa-paper-plane"></i>
                  </div>
                  <h3 className="font-black text-gray-900">No enquiries sent yet</h3>
                  <p className="text-gray-400 text-sm font-medium mt-1">Your housing journey starts when you reach out!</p>
                  <button className="mt-6 text-brand-orange font-black text-sm hover:underline">Find properties to enquire about</button>
                </div>
              )}
            </section>

            {/* Saved Properties Section */}
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <i className="fa-solid fa-heart text-brand-orange"></i>
                  Saved Homes
                </h2>
                <button
                  onClick={onViewSaved}
                  className="text-brand-orange font-black text-sm flex items-center gap-2 hover:underline"
                >
                  See All <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedProperties.length > 0 ? (
                  savedProperties.slice(0, 2).map(prop => (
                    <div key={prop.id} className="group rounded-[2rem] overflow-hidden border border-gray-200 hover:shadow-xl transition-all">
                      <div className="h-40 overflow-hidden relative">
                        <img src={prop.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-gray-900 shadow-sm uppercase tracking-widest">
                          £{prop.price} pw
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-black text-gray-900 leading-tight mb-1">{prop.name}</h4>
                        <p className="text-xs text-gray-500 font-bold mb-4">{prop.area}</p>
                        <button className="w-full py-3 rounded-xl border-2 border-brand-orange text-brand-orange font-black text-xs hover:bg-brand-orange hover:text-white transition-all uppercase tracking-widest">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 text-center py-12 border-2 border-dashed border-gray-100 rounded-[2rem]">
                    <p className="text-gray-400 font-bold">Start saving your favorite matches!</p>
                  </div>
                )}
              </div>
            </section>

            {/* Ticket Reference - under Saved Homes */}
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <i className="fa-solid fa-ticket text-brand-blue"></i>
                  Ticket Reference
                </h2>
                {onContactSupport && (
                  <button
                    onClick={onContactSupport}
                    className="text-brand-orange font-black text-sm flex items-center gap-2 hover:underline"
                  >
                    Contact Support <i className="fa-solid fa-arrow-right"></i>
                  </button>
                )}
              </div>
              {user.supportTickets && user.supportTickets.length > 0 ? (
                <div className="space-y-3">
                  {user.supportTickets.map((ticket: SupportTicket) => {
                    const isOpen = expandedTicketId === ticket.id;
                    const sentDate = ticket.created_at
                      ? new Date(ticket.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : null;
                    return (
                      <div key={ticket.id} className="rounded-2xl border border-gray-100 overflow-hidden">
                        {/* Accordion Header */}
                        <button
                          type="button"
                          onClick={() => setExpandedTicketId(isOpen ? null : ticket.id)}
                          className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                            <i className="fa-solid fa-ticket"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                              Support Message #{ticket.id}
                            </span>
                            <span className="font-black text-gray-900 text-sm truncate block">{ticket.subject}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 text-brand-orange">
                              {ticket.status}
                            </span>
                            <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} text-gray-400 text-xs transition-transform`}></i>
                          </div>
                        </button>
                        {/* Accordion Body */}
                        {isOpen && (
                          <div className="px-6 pb-5 border-t border-gray-50">
                            <div className="pt-4 space-y-3">
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Message</p>
                                <p className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
                              </div>
                              {sentDate && (
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  Sent on {sentDate}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[2rem]">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-2xl mx-auto mb-4">
                    <i className="fa-solid fa-ticket"></i>
                  </div>
                  <h3 className="font-black text-gray-900">No support tickets yet</h3>
                  <p className="text-gray-400 text-sm font-medium mt-1">Your support messages will appear here after you contact us.</p>
                  {onContactSupport && (
                    <button type="button" onClick={onContactSupport} className="mt-6 text-brand-orange font-black text-sm hover:underline">
                      Contact Support
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">

            {/* My Situation / Lifestyle Card */}
            <section className="bg-brand-blue p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-100">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <i className="fa-solid fa-fingerprint"></i>
                My Situation
              </h2>

              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                  <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-1">Goal</span>
                  <span className="font-black text-sm">{user.profile?.situation?.goal || 'Renting my first student home'}</span>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                  <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-1">Timeframe</span>
                  <span className="font-black text-sm">{user.profile?.situation?.timeframe || 'Flexible (Next Academic Year)'}</span>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-200 mb-4">Lifestyle Profile</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 px-3 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 capitalize">
                      <i className="fa-solid fa-book text-blue-200"></i> {user.profile?.lifestyle?.studyHabits?.replace('-', ' ') || 'Balanced'}
                    </div>
                    <div className="bg-white/10 px-3 py-2 rounded-lg text-[10px] font-black flex items-center gap-2">
                      <i className="fa-solid fa-user-group text-blue-200"></i> Social {user.profile?.lifestyle?.socialLevel || 3}/5
                    </div>
                    <div className="bg-white/10 px-3 py-2 rounded-lg text-[10px] font-black flex items-center gap-2">
                      <i className="fa-solid fa-sparkles text-blue-200"></i> Neatness {user.profile?.lifestyle?.cleanliness || 4}/5
                    </div>
                  </div>
                </div>

                <button
                  onClick={onEditProfile}
                  className="w-full bg-white text-brand-blue py-4 rounded-xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl"
                >
                  Update My Profile
                </button>
              </div>
            </section>

            {/* Account Settings Shortcut */}
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-200">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Account Details</h3>
              <div className="space-y-6">
                {[
                  { label: 'Name', val: user.name, icon: 'fa-user' },
                  { label: 'Email', val: user.email, icon: 'fa-envelope' },
                  { label: 'University', val: user.profile?.university || 'Set your university', icon: 'fa-graduation-cap' }
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{item.label}</span>
                      <span className="font-bold text-gray-900 text-sm">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={onLogout}
                className="w-full mt-10 py-3 rounded-xl border border-gray-200 text-gray-500 font-black text-xs hover:border-brand-orange hover:text-brand-orange transition-all uppercase tracking-widest"
              >
                Log Out
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
