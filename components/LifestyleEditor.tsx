
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion } from 'framer-motion';

// Fix: Pervasive type resolution errors in framer-motion are bypassed by casting to any.
const motionAny: any = motion;

interface LifestyleEditorProps {
  currentProfile: UserProfile;
  onSave: (lifestyle: UserProfile['lifestyle']) => void;
  onCancel: () => void;
}

export const LifestyleEditor: React.FC<LifestyleEditorProps> = ({ currentProfile, onSave, onCancel }) => {
  const [lifestyle, setLifestyle] = useState(currentProfile.lifestyle);

  return (
    <div className="max-w-2xl mx-auto py-32 px-4">
      <motionAny.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-gray-200"
      >
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <h2 className="text-3xl font-black text-gray-900">Edit Your Lifestyle Profile</h2>
          <p className="text-gray-500 font-medium mt-2">Adjust your preferences to get even better housing matches.</p>
        </div>

        <div className="space-y-10">
          {/* Social Level */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-users text-brand-blue"></i> Social Level
              </label>
              <span className="text-brand-orange font-black">Level {lifestyle.socialLevel}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  onClick={() => setLifestyle({ ...lifestyle, socialLevel: v })}
                  className={`w-full py-4 rounded-xl border-2 transition-all font-black ${lifestyle.socialLevel === v ? 'bg-brand-orange text-white border-brand-orange' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-black text-gray-400 mt-3 uppercase tracking-widest">
              <span>Introvert</span>
              <span>Extrovert</span>
            </div>
          </div>

          {/* Cleanliness */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-sparkles text-emerald-500"></i> Cleanliness
              </label>
              <span className="text-emerald-600 font-black">Level {lifestyle.cleanliness}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  onClick={() => setLifestyle({ ...lifestyle, cleanliness: v })}
                  className={`w-full py-4 rounded-xl border-2 transition-all font-black ${lifestyle.cleanliness === v ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-black text-gray-400 mt-3 uppercase tracking-widest">
              <span>Relaxed</span>
              <span>Pristine</span>
            </div>
          </div>

          {/* Study Habits */}
          <div>
            <label className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
              <i className="fa-solid fa-book-open text-purple-500"></i> Study Habits
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['early-bird', 'night-owl', 'balanced'] as const).map(hab => (
                <button
                  key={hab}
                  onClick={() => setLifestyle({ ...lifestyle, studyHabits: hab })}
                  className={`py-4 rounded-xl border-2 transition-all capitalize text-sm font-black ${lifestyle.studyHabits === hab ? 'bg-purple-500 text-white border-purple-500' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                >
                  {hab.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-100 text-gray-600 font-black hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(lifestyle)}
            className="flex-[2] bg-brand-orange text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100"
          >
            Save Changes
          </button>
        </div>
      </motionAny.div>
    </div>
  );
};
