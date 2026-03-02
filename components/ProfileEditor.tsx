
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Pervasive type resolution errors in framer-motion are bypassed by casting to any.
const motionAny: any = motion;

interface ProfileEditorProps {
  currentProfile: UserProfile;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
  onCancel: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ currentProfile, onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [lifestyle, setLifestyle] = useState(currentProfile.lifestyle);
  const [situation, setSituation] = useState(currentProfile.situation || {
    goal: 'Renting my first home',
    timeframe: 'Flexible',
    currentStatus: 'Living with others'
  });

  const goals = ['Renting my first home', 'Finding a new flatmate', 'Moving for year 2', 'Short term summer stay'];
  const timeframes = ['ASAP', 'Within 1 month', '1-3 months', 'Flexible'];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="max-w-3xl mx-auto py-24 px-4">
      <motionAny.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-200 overflow-hidden"
      >
        <div className="mb-8 text-center">
          <div className="w-14 h-14 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center text-xl mb-4 mx-auto">
            <i className={`fa-solid ${step === 1 ? 'fa-house-user' : 'fa-wand-magic-sparkles'}`}></i>
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            {step === 1 ? 'My Situation' : 'Lifestyle Preferences'}
          </h2>
          <p className="text-gray-500 font-medium mt-1 text-sm">
            {step === 1 
              ? 'Tell us about your current moving goals.' 
              : 'Adjust your preferences to get even better housing matches.'}
          </p>
          
          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-brand-orange' : 'w-4 bg-gray-100'}`}></div>
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-brand-orange' : 'w-4 bg-gray-100'}`}></div>
          </div>
        </div>

        <div className="min-h-[340px] relative">
          <AnimatePresence mode="wait" custom={step}>
            {step === 1 ? (
              <motionAny.section
                key="step1"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Property Goal</label>
                    <div className="space-y-2">
                      {goals.map(g => (
                        <button
                          key={g}
                          onClick={() => setSituation({ ...situation, goal: g })}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border-2 transition-all font-bold text-xs ${situation.goal === g ? 'bg-brand-orange/5 border-brand-orange text-brand-orange' : 'border-gray-50 text-gray-600 hover:border-gray-100'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Ideal Timeframe</label>
                    <div className="space-y-2">
                      {timeframes.map(t => (
                        <button
                          key={t}
                          onClick={() => setSituation({ ...situation, timeframe: t })}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border-2 transition-all font-bold text-xs ${situation.timeframe === t ? 'bg-brand-orange/5 border-brand-orange text-brand-orange' : 'border-gray-50 text-gray-600 hover:border-gray-100'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motionAny.section>
            ) : (
              <motionAny.section
                key="step2"
                custom={2}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       Social Level
                    </label>
                    <span className="text-brand-orange font-black text-xs">Level {lifestyle.socialLevel}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => setLifestyle({ ...lifestyle, socialLevel: v })}
                        className={`w-full py-3 rounded-xl border-2 transition-all font-black text-sm ${lifestyle.socialLevel === v ? 'bg-brand-orange text-white border-brand-orange' : 'border-gray-50 text-gray-500 hover:border-gray-100'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       Cleanliness
                    </label>
                    <span className="text-emerald-600 font-black text-xs">Level {lifestyle.cleanliness}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => setLifestyle({ ...lifestyle, cleanliness: v })}
                        className={`w-full py-3 rounded-xl border-2 transition-all font-black text-sm ${lifestyle.cleanliness === v ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-50 text-gray-500 hover:border-gray-100'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                     Study Habits
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['early-bird', 'night-owl', 'balanced'] as const).map(hab => (
                      <button
                        key={hab}
                        onClick={() => setLifestyle({ ...lifestyle, studyHabits: hab })}
                        className={`py-3 rounded-xl border-2 transition-all capitalize text-[10px] font-black ${lifestyle.studyHabits === hab ? 'bg-purple-500 text-white border-purple-500' : 'border-gray-50 text-gray-500 hover:border-gray-100'}`}
                      >
                        {hab.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </motionAny.section>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex gap-4">
          {step === 1 ? (
            <>
              <button 
                onClick={onCancel}
                className="flex-1 px-6 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-600 font-black hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => setStep(2)}
                className="flex-[2] bg-brand-orange text-white py-3.5 rounded-2xl font-black text-base hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-2"
              >
                Continue
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-600 font-black hover:bg-gray-50 transition-all text-sm"
              >
                Back
              </button>
              <button 
                onClick={() => onSave({ lifestyle, situation })}
                className="flex-[2] bg-brand-orange text-white py-3.5 rounded-2xl font-black text-base hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-2"
              >
                Save Profile
                <i className="fa-solid fa-check text-xs"></i>
              </button>
            </>
          )}
        </div>
      </motionAny.div>
    </div>
  );
};
