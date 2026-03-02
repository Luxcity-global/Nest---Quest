
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { UK_UNIVERSITIES } from '../constants';

interface OnboardingFormProps {
  onSubmit: (profile: UserProfile) => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  // Fix: Added missing 'situation' property and explicitly cast 'hobbies' as string[] to satisfy the UserProfile interface.
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    university: UK_UNIVERSITIES[0],
    budget: 200,
    commuteType: 'walk',
    commuteTime: 20,
    lifestyle: {
      socialLevel: 3,
      cleanliness: 4,
      studyHabits: 'balanced',
      hobbies: [] as string[]
    },
    situation: {
      goal: 'Renting my first home',
      timeframe: 'Flexible',
      currentStatus: 'Living with others'
    }
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-10 flex justify-between items-center relative">
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-10"></div>
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${step >= s ? 'bg-brand-orange text-white scale-110' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
              {s}
            </div>
            <span className={`text-xs mt-3 font-bold uppercase tracking-wider ${step >= s ? 'text-brand-orange' : 'text-gray-400'}`}>
              {s === 1 ? 'Personal' : s === 2 ? 'Commute' : 'Lifestyle'}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Tell us about yourself</h2>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">What's your name?</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                placeholder="Student Name"
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-brand-orange focus:ring-0 outline-none transition-all text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Where are you studying?</label>
              <select 
                value={profile.university}
                onChange={e => setProfile({...profile, university: e.target.value})}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-brand-orange focus:ring-0 outline-none transition-all text-lg appearance-none bg-white"
              >
                {UK_UNIVERSITIES.map(uni => <option key={uni} value={uni}>{uni}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Weekly budget (GBP): £{profile.budget}</label>
              <input 
                type="range" 
                min="100" 
                max="1000" 
                step="10"
                value={profile.budget}
                onChange={e => setProfile({...profile, budget: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-orange"
              />
              <div className="flex justify-between text-xs font-bold text-gray-400 mt-3">
                <span>£100</span>
                <span>£1,000+</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Your Daily Commute</h2>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">How do you prefer to travel?</label>
              <div className="grid grid-cols-2 gap-4">
                {(['walk', 'cycle', 'bus', 'tube'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setProfile({...profile, commuteType: type})}
                    className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${profile.commuteType === type ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                  >
                    <i className={`fa-solid fa-${type === 'walk' ? 'person-walking' : type === 'cycle' ? 'bicycle' : type === 'bus' ? 'bus' : 'subway'} text-3xl`}></i>
                    <span className="capitalize text-sm font-bold">{type}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Max commute time (mins): {profile.commuteTime}</label>
              <input 
                type="range" 
                min="5" 
                max="60" 
                value={profile.commuteTime}
                onChange={e => setProfile({...profile, commuteTime: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-orange"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Lifestyle Preferences</h2>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">How social are you?</label>
              <div className="flex justify-between items-center gap-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    onClick={() => setProfile({...profile, lifestyle: {...profile.lifestyle, socialLevel: v}})}
                    className={`w-full py-4 rounded-xl border-2 transition-all font-black ${profile.lifestyle.socialLevel === v ? 'bg-brand-orange text-white border-brand-orange' : 'border-gray-100 text-gray-500'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-3 text-center uppercase tracking-widest">1: Library Regular — 5: Nightlife Enthusiast</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Study Habits</label>
              <div className="flex flex-wrap gap-3">
                {(['early-bird', 'night-owl', 'balanced'] as const).map(hab => (
                  <button
                    key={hab}
                    onClick={() => setProfile({...profile, lifestyle: {...profile.lifestyle, studyHabits: hab}})}
                    className={`px-6 py-3 rounded-full border-2 transition-all capitalize text-sm font-bold ${profile.lifestyle.studyHabits === hab ? 'bg-brand-orange text-white border-brand-orange' : 'border-gray-100 text-gray-500'}`}
                  >
                    {hab.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">What's important to you?</label>
              <div className="flex flex-wrap gap-2">
                {['Gym', 'En-suite', 'Fast Wifi', 'Large Kitchen', 'Central Location', 'Garden'].map(h => (
                  <button
                    key={h}
                    onClick={() => {
                      const hobbies = profile.lifestyle.hobbies.includes(h)
                        ? profile.lifestyle.hobbies.filter(i => i !== h)
                        : [...profile.lifestyle.hobbies, h];
                      setProfile({...profile, lifestyle: {...profile.lifestyle, hobbies}});
                    }}
                    className={`px-4 py-2 rounded-full border-2 transition-all text-xs font-bold ${profile.lifestyle.hobbies.includes(h) ? 'bg-brand-blue text-white border-brand-blue' : 'border-gray-100 text-gray-500 hover:border-brand-blue/30'}`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex gap-4">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="px-8 py-4 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all"
            >
              Back
            </button>
          )}
          <button 
            onClick={step === 3 ? () => onSubmit(profile) : nextStep}
            className="flex-1 bg-brand-orange text-white py-4 rounded-xl font-black text-lg hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-2"
          >
            {step === 3 ? 'Get My Matches' : 'Continue'}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
