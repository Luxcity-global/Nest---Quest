
import React, { useState } from 'react';
import { UserAccount } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

// Fix: Pervasive type resolution errors in framer-motion are bypassed by casting to any.
const motionAny: any = motion;

interface SettingsViewProps {
  user: UserAccount;
  onSave: (updatedUser: Partial<UserAccount>) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  // Local form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [university, setUniversity] = useState(user.profile?.university || '');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');

  const handlePersonalSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: Partial<UserAccount> = {
      phone,
    };

    // If university changed, we need to update the profile nested object
    if (user.profile) {
      updatedUser.profile = {
        ...user.profile,
        university
      };
    }

    onSave(updatedUser);
    setIsEditingPersonal(false);
    alert("Personal details updated successfully!");
  };

  const handleCancelEdit = () => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setUniversity(user.profile?.university || '');
    setIsEditingPersonal(false);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setSecurityError("All password fields are required.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setSecurityError("New passwords do not match!");
      return;
    }

    if (passwords.new.length < 6) {
      setSecurityError("New password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error("No user is currently logged in.");
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, passwords.current);
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, passwords.new);

      setSecuritySuccess("Password updated successfully!");
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        setSecurityError("Incorrect current password.");
      } else if (err.code === 'auth/weak-password') {
        setSecurityError("Password is too weak.");
      } else {
        setSecurityError(err.message || "Failed to update password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 pt-32">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm font-black text-gray-500 hover:text-brand-orange transition-all"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Profile
        </button>

        <h1 className="text-4xl font-black text-gray-900 mb-12">Account Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-200 p-4 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('personal');
                  setIsEditingPersonal(false);
                }}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-between transition-all ${activeTab === 'personal' ? 'bg-brand-orange/10 text-brand-orange' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Personal details
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-between transition-all ${activeTab === 'security' ? 'bg-brand-orange/10 text-brand-orange' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Account security
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' ? (
                <motionAny.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden"
                >
                  <div className="p-10 md:p-14">
                    <div className="flex justify-between items-center mb-10">
                      <h2 className="text-2xl font-black text-gray-900">Personal details</h2>
                      {!isEditingPersonal && (
                        <button
                          onClick={() => setIsEditingPersonal(true)}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-gray-100 font-black text-brand-orange hover:bg-gray-50 transition-all text-sm"
                        >
                          <i className="fa-solid fa-pen"></i>
                          Edit Details
                        </button>
                      )}
                    </div>

                    {!isEditingPersonal ? (
                      /* VIEW MODE */
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <DetailItem label="Full Name" value={user.name} />
                          <DetailItem label="Email Address" value={user.email} />
                          <DetailItem label="Phone Number" value={user.phone || 'Not added'} />
                          <DetailItem label="University" value={user.profile?.university || 'Not set'} />
                        </div>
                      </div>
                    ) : (
                      /* EDIT MODE */
                      <form onSubmit={handlePersonalSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <InputItem
                            label="Full Name"
                            value={name}
                            onChange={setName}
                            type="text"
                            disabled={true}
                          />
                          <InputItem
                            label="Email Address"
                            value={email}
                            onChange={setEmail}
                            type="email"
                            disabled={true}
                          />
                          <InputItem
                            label="Phone Number"
                            value={phone}
                            onChange={setPhone}
                            type="tel"
                            placeholder="Add your number"
                          />
                          <InputItem
                            label="University"
                            value={university}
                            onChange={setUniversity}
                            type="text"
                            placeholder="e.g. University of Manchester"
                          />
                        </div>

                        <div className="pt-8 border-t border-gray-100 flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-8 py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-black hover:bg-gray-50 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-brand-orange text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100"
                          >
                            Save Personal Details
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </motionAny.div>
              ) : (
                <motionAny.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2.5rem] border border-gray-200 p-10 md:p-14"
                >
                  <h2 className="text-2xl font-black text-gray-900 mb-8">Account security</h2>
                  <form onSubmit={handlePasswordSave} className="space-y-8">
                    <div className="max-w-lg space-y-6">
                      <InputItem
                        label="Current Password"
                        value={passwords.current}
                        onChange={v => setPasswords({ ...passwords, current: v })}
                        type="password"
                      />
                      <InputItem
                        label="New Password"
                        value={passwords.new}
                        onChange={v => setPasswords({ ...passwords, new: v })}
                        type="password"
                      />
                      <InputItem
                        label="Confirm New Password"
                        value={passwords.confirm}
                        onChange={v => setPasswords({ ...passwords, confirm: v })}
                        type="password"
                      />
                    </div>

                    {securityError && (
                      <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-bold text-sm mb-6">
                        <i className="fa-solid fa-circle-exclamation mr-2"></i>
                        {securityError}
                      </div>
                    )}

                    {securitySuccess && (
                      <div className="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl font-bold text-sm mb-6">
                        <i className="fa-solid fa-circle-check mr-2"></i>
                        {securitySuccess}
                      </div>
                    )}

                    <div className="pt-8 border-t border-gray-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-brand-orange text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isLoading && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                        Change Password
                      </button>
                    </div>
                  </form>
                </motionAny.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="space-y-1">
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</span>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);

const InputItem: React.FC<{ label: string; value: string; onChange: (v: string) => void; type: string; placeholder?: string; disabled?: boolean }> = ({ label, value, onChange, type, placeholder, disabled }) => (
  <div className="space-y-2">
    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-brand-orange outline-none font-bold transition-all ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50/50 text-gray-900'}`}
    />
  </div>
);
