import React, { useState } from 'react';
import { UserProfile } from '../types';
import { UK_UNIVERSITIES } from '../constants';
import { Autocomplete } from './Autocomplete';

interface FilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onApply: (newProfile: UserProfile) => void;
}

export const FilterOverlay: React.FC<FilterOverlayProps> = ({ isOpen, onClose, profile, onApply }) => {
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const budgetOptions = [150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000];
  const commuteTimes = [10, 20, 30, 45, 60];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-blue/20 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Change Criteria</h3>
            <p className="text-sm text-gray-500 font-medium">Refine your search for the perfect home</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-white hover:shadow-md flex items-center justify-center transition-all text-gray-400 hover:text-brand-orange"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Section: Academic & Finance */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-brand-orange uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap"></i>
                Location & Budget
              </h4>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">University</label>
                <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus-within:border-brand-orange outline-none font-semibold bg-gray-50 transition-colors">
                  <Autocomplete
                    options={UK_UNIVERSITIES}
                    value={tempProfile.university}
                    onChange={val => setTempProfile({...tempProfile, university: val})}
                    placeholder="Type to search..."
                    dark={true}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Weekly Budget (Max)</label>
                <select 
                  value={tempProfile.budget}
                  onChange={e => setTempProfile({...tempProfile, budget: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-semibold text-gray-700 bg-gray-50 transition-colors"
                >
                  {budgetOptions.map(val => <option key={val} value={val}>Up to £{val}</option>)}
                </select>
              </div>
            </div>

            {/* Section: Commute */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-brand-blue uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-route"></i>
                Daily Commute
              </h4>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Transport Mode</label>
                <select 
                  value={tempProfile.commuteType}
                  onChange={e => setTempProfile({...tempProfile, commuteType: e.target.value as any})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-semibold text-gray-700 bg-gray-50 transition-colors"
                >
                  <option value="walk">Walking</option>
                  <option value="cycle">Cycling</option>
                  <option value="bus">Bus</option>
                  <option value="tube">Underground/Subway</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Commute Time</label>
                <select 
                  value={tempProfile.commuteTime}
                  onChange={e => setTempProfile({...tempProfile, commuteTime: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-semibold text-gray-700 bg-gray-50 transition-colors"
                >
                  {commuteTimes.map(time => <option key={time} value={time}>{time} Minutes</option>)}
                </select>
              </div>
            </div>

            {/* Section: Lifestyle */}
            <div className="md:col-span-2 pt-4 border-t border-gray-50 space-y-6">
              <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-face-smile"></i>
                Lifestyle & Vibes
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Social Level</label>
                  <select 
                    value={tempProfile.lifestyle.socialLevel}
                    onChange={e => setTempProfile({...tempProfile, lifestyle: {...tempProfile.lifestyle, socialLevel: parseInt(e.target.value)}})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-semibold text-gray-700 bg-gray-50 transition-colors"
                  >
                    <option value="1">1 - Quiet & Studious</option>
                    <option value="2">2 - Mostly Quiet</option>
                    <option value="3">3 - Balanced</option>
                    <option value="4">4 - Quite Social</option>
                    <option value="5">5 - Life of the Party</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Study Habits</label>
                  <select 
                    value={tempProfile.lifestyle.studyHabits}
                    onChange={e => setTempProfile({...tempProfile, lifestyle: {...tempProfile.lifestyle, studyHabits: e.target.value as any}})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-semibold text-gray-700 bg-gray-50 transition-colors"
                  >
                    <option value="early-bird">Early Bird</option>
                    <option value="night-owl">Night Owl</option>
                    <option value="balanced">Balanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cleanliness</label>
                  <select 
                    value={tempProfile.lifestyle.cleanliness}
                    onChange={e => setTempProfile({...tempProfile, lifestyle: {...tempProfile.lifestyle, cleanliness: parseInt(e.target.value)}})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-semibold text-gray-700 bg-gray-50 transition-colors"
                  >
                    <option value="1">1 - Relaxed</option>
                    <option value="3">3 - Standard</option>
                    <option value="5">5 - Pristine/Neat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Key Priorities</label>
                <div className="flex flex-wrap gap-2">
                  {['Gym', 'En-suite', 'Fast Wifi', 'Large Kitchen', 'Central Location', 'Garden'].map(h => {
                    const active = tempProfile.lifestyle.hobbies.includes(h);
                    return (
                      <button
                        key={h}
                        onClick={() => {
                          const hobbies = active
                            ? tempProfile.lifestyle.hobbies.filter(i => i !== h)
                            : [...tempProfile.lifestyle.hobbies, h];
                          setTempProfile({...tempProfile, lifestyle: {...tempProfile.lifestyle, hobbies}});
                        }}
                        className={`px-4 py-2 rounded-xl border-2 transition-all text-xs font-bold flex items-center gap-2 ${active ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-gray-100 text-gray-500 hover:border-brand-blue/30'}`}
                      >
                        {active && <i className="fa-solid fa-check"></i>}
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-white transition-all shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onApply(tempProfile);
              onClose();
            }}
            className="flex-[2] bg-brand-orange text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-2"
          >
            Apply Changes
            <i className="fa-solid fa-sparkles"></i>
          </button>
        </div>
      </div>
    </div>
  );
};