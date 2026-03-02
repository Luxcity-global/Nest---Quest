import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserAccount, SupportTicket } from '../types';

// Fix: Pervasive type resolution errors in framer-motion are bypassed by casting to any.
const motionAny: any = motion;

const SUPPORT_API_BASE = import.meta.env.VITE_APP_URL || 'http://localhost:8000';
const SUPPORT_API_URL = `${SUPPORT_API_BASE.replace(/\/$/, '')}/api/v1/support/messages`;

/** 422 validation error detail item from API */
interface ValidationDetail {
  loc: (string | number)[];
  msg: string;
  type?: string;
}

interface SupportViewProps {
  user: UserAccount | null;
  onBack: () => void;
  /** Called when a support message is successfully sent (201); passes the full ticket to store on the user profile */
  onSupportMessageSent?: (ticket: SupportTicket) => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ user, onBack, onSupportMessageSent }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: 'General Enquiry',
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [genericError, setGenericError] = useState<string | null>(null);

  // Pre-populate name/email when user becomes available
  useEffect(() => {
    if (user?.name) setFormData(prev => ({ ...prev, name: user.name }));
    if (user?.email) setFormData(prev => ({ ...prev, email: user.email }));
  }, [user?.name, user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGenericError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(SUPPORT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: formData.name.trim(),
          user_email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim()
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 201) {
        const rawId = data.id;
        const id =
          typeof rawId === 'number' && Number.isInteger(rawId)
            ? rawId
            : typeof rawId === 'string'
              ? parseInt(rawId, 10)
              : null;
        const ticketId = id != null && !Number.isNaN(id) ? id : null;
        setSubmittedId(ticketId);
        if (ticketId != null) {
          const ticket: SupportTicket = {
            id: ticketId,
            subject: formData.subject,
            message: formData.message.trim(),
            status: data.status || 'pending',
            created_at: data.created_at || new Date().toISOString()
          };
          onSupportMessageSent?.(ticket);
        }
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (response.status === 422 && Array.isArray(data.detail)) {
        const errors: Record<string, string> = {};
        for (const item of data.detail as ValidationDetail[]) {
          const key = item.loc && item.loc[item.loc.length - 1];
          if (key !== undefined && key !== 'body') {
            const field = String(key);
            errors[field] = item.msg || 'Invalid value';
          }
        }
        setFieldErrors(errors);
        return;
      }

      if (response.status === 500) {
        setGenericError('Something went wrong. Please try again.');
        return;
      }

      setGenericError('Something went wrong. Please try again.');
    } catch {
      setGenericError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motionAny.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100"
          >
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Message Received!</h1>
            <p className="text-gray-500 font-medium mb-10">
              Thanks for reaching out, {formData.name.split(' ')[0] || 'there'}. Our student support team has been notified and we'll get back to you within 2-4 business hours.
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10 text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Ticket Reference</p>
              <p className="font-black text-brand-blue">
                {submittedId != null ? `Message #${submittedId}` : `#NQ-${Math.floor(Math.random() * 90000) + 10000}`}
              </p>
            </div>
            <button 
              onClick={onBack}
              className="bg-brand-orange text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100"
            >
              Back to Help Center
            </button>
          </motionAny.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        <button 
          onClick={onBack}
          className="mb-10 flex items-center gap-2 text-sm font-black text-gray-400 hover:text-brand-orange transition-all uppercase tracking-widest"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to FAQ
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-gray-100">
              <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 mb-4">Message Support</h1>
                <p className="text-gray-500 font-medium">Have a specific question or issue? Send us a detailed message and we'll help you out.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {genericError && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-bold">
                    {genericError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className={`w-full px-6 py-4 rounded-2xl border-2 focus:border-brand-orange outline-none font-bold transition-all bg-gray-50/50 ${fieldErrors.user_name ? 'border-red-300' : 'border-gray-100'}`}
                      placeholder="e.g. Aisha Daodu"
                    />
                    {fieldErrors.user_name && (
                      <p className="text-xs font-bold text-red-600">{fieldErrors.user_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-6 py-4 rounded-2xl border-2 focus:border-brand-orange outline-none font-bold transition-all bg-gray-50/50 ${fieldErrors.user_email ? 'border-red-300' : 'border-gray-100'}`}
                      placeholder="aisha.d@student.ac.uk"
                    />
                    {fieldErrors.user_email && (
                      <p className="text-xs font-bold text-red-600">{fieldErrors.user_email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className={`w-full px-6 py-4 rounded-2xl border-2 focus:border-brand-orange outline-none font-bold transition-all bg-gray-50/50 appearance-none bg-[url('https://cdn-icons-png.flaticon.com/512/60/60995.png')] bg-[length:12px] bg-[right_20px_center] bg-no-repeat ${fieldErrors.subject ? 'border-red-300' : 'border-gray-100'}`}
                  >
                    <option>General Enquiry</option>
                    <option>Technical Issue</option>
                    <option>Property Verification</option>
                    <option>Agent Complaint</option>
                    <option>Account Deletion</option>
                  </select>
                  {fieldErrors.subject && (
                    <p className="text-xs font-bold text-red-600">{fieldErrors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className={`w-full px-6 py-4 rounded-2xl border-2 focus:border-brand-orange outline-none font-bold transition-all bg-gray-50/50 resize-none ${fieldErrors.message ? 'border-red-300' : 'border-gray-100'}`}
                    placeholder="Tell us more about how we can help you today..."
                  ></textarea>
                  {fieldErrors.message && (
                    <p className="text-xs font-bold text-red-600">{fieldErrors.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-orange text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <i className="fa-solid fa-circle-notch animate-spin"></i>
                    ) : (
                      <i className="fa-solid fa-paper-plane"></i>
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 font-bold mt-4 uppercase tracking-widest">
                    Response time: ~2 hours
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-brand-blue text-white p-10 rounded-[3rem] shadow-2xl shadow-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="fa-solid fa-headset text-8xl"></i>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-6">Other ways to connect</h3>
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shrink-0">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-blue-100 text-xs uppercase tracking-widest mb-1">Phone Support</h4>
                      <p className="font-black text-lg">0800 123 4567</p>
                      <p className="text-[10px] text-blue-200 font-bold uppercase mt-1">Mon-Fri, 9am - 6pm GMT</p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shrink-0">
                      <i className="fa-solid fa-envelope-open-text"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-blue-100 text-xs uppercase tracking-widest mb-1">Email directly</h4>
                      <p className="font-black text-lg">hello@nestquest.ac.uk</p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shrink-0">
                      <i className="fa-brands fa-whatsapp"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-blue-100 text-xs uppercase tracking-widest mb-1">WhatsApp Chat</h4>
                      <p className="font-black text-lg">+44 7700 900 123</p>
                      <p className="text-[10px] text-blue-200 font-bold uppercase mt-1">Available 24/7 for quick Qs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Socials</h3>
              <div className="grid grid-cols-2 gap-4">
                <SocialLink icon="fa-instagram" label="Instagram" />
                <SocialLink icon="fa-twitter" label="Twitter" />
                <SocialLink icon="fa-tiktok" label="TikTok" />
                <SocialLink icon="fa-linkedin" label="LinkedIn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLink: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <a href="#" className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-brand-orange hover:bg-white transition-all group">
    <i className={`fa-brands ${icon} text-gray-400 group-hover:text-brand-orange transition-colors`}></i>
    <span className="text-xs font-black text-gray-900">{label}</span>
  </a>
);
