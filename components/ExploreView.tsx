
import React, { useState } from 'react';
import { UK_UNIVERSITIES } from '../constants';
import { Autocomplete } from './Autocomplete';
import { getLocationInsights, LocationInsight } from '../geminiService';

const CITY_IMAGES: Record<string, string> = {
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=2000',
  'Manchester': 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?auto=format&fit=crop&q=80&w=2000',
  'Oxford': 'https://images.unsplash.com/photo-1517330156738-0b67e52f975b?auto=format&fit=crop&q=80&w=2000',
  'Edinburgh': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=2000',
  'Birmingham': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=2000',
  'Leeds': 'https://images.unsplash.com/photo-1516685018646-5483c8448f48?auto=format&fit=crop&q=80&w=2000',
  'Bristol': 'https://images.unsplash.com/photo-1536768139911-e290a59011e4?auto=format&fit=crop&q=80&w=2000',
  'Glasgow': 'https://images.unsplash.com/photo-1549492423-400259a2e574?auto=format&fit=crop&q=80&w=2000',
};

const FEATURED_CITIES = [
  { name: 'London', image: CITY_IMAGES['London'] },
  { name: 'Manchester', image: CITY_IMAGES['Manchester'] },
  { name: 'Oxford', image: CITY_IMAGES['Oxford'] },
  { name: 'Edinburgh', image: CITY_IMAGES['Edinburgh'] },
];

export const ExploreView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<LocationInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCitySelect = async (cityName: string) => {
    setLoading(true);
    try {
      const data = await getLocationInsights(cityName);
      setSelectedCity(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load city details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedCity(null);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#f8fafc]">
        <div className="w-20 h-20 border-4 border-orange-100 border-t-brand-orange rounded-full animate-spin mb-8"></div>
        <h2 className="text-3xl font-black text-gray-900 animate-pulse">Gathering real insights...</h2>
        <p className="text-gray-500 font-bold mt-4">Connecting to local data for {searchTerm}</p>
      </div>
    );
  }

  if (selectedCity) {
    const cityImg = CITY_IMAGES[selectedCity.cityName] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000';
    
    return (
      <div className="bg-[#f8fafc] min-h-screen pb-20 animate-in fade-in duration-500">
        {/* HERO SECTION */}
        <section className="relative h-[450px] w-full overflow-hidden">
          <img 
            src={cityImg} 
            className="w-full h-full object-cover" 
            alt={selectedCity.cityName}
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 max-w-7xl mx-auto px-4 flex flex-col justify-center">
            <button 
              onClick={handleBack}
              className="text-white/80 hover:text-white mb-8 flex items-center gap-2 text-sm font-bold transition-all w-fit"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to all cities
            </button>
            <div className="flex gap-3 mb-4">
              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot"></i> {selectedCity.cityName}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 flex items-center gap-1.5">
                <i className="fa-solid fa-users"></i> {selectedCity.stats.studentPopulation} Students
              </span>
            </div>
            <h1 className="text-7xl font-black text-white mb-4 tracking-tight">{selectedCity.cityName}</h1>
            <p className="text-white/90 text-lg font-medium max-w-2xl leading-relaxed">
              {selectedCity.description}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
          {/* STATS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Universities', val: selectedCity.stats.universities.toString(), icon: 'fa-building-columns' },
              { label: 'Average Rent/mo', val: selectedCity.stats.avgRent, icon: 'fa-house' },
              { label: 'Student Population', val: selectedCity.stats.studentPopulation, icon: 'fa-users' },
              { label: 'Student Areas', val: selectedCity.stats.studentAreasCount.toString(), icon: 'fa-map-pin' },
            ].map((s) => (
              <div key={s.label} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="text-3xl font-black text-gray-900 mb-1">{s.val}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 space-y-8">
              {/* WHY CHOOSE */}
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <i className="fa-solid fa-sparkles text-brand-orange"></i>
                  Why Choose {selectedCity.cityName}?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCity.whyChoose.map(item => (
                    <div key={item} className="flex items-center gap-3 bg-orange-50/50 p-4 rounded-2xl border border-orange-50">
                      <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                      <span className="text-gray-700 font-bold text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* UNIVERSITIES */}
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <i className="fa-solid fa-graduation-cap text-brand-orange"></i>
                  Universities in {selectedCity.cityName}
                </h3>
                <div className="space-y-4">
                  {selectedCity.universitiesList.map(uni => (
                    <div key={uni.name} className="flex items-center justify-between p-6 rounded-2xl border border-gray-50 hover:border-brand-orange/20 hover:bg-orange-50/10 transition-all cursor-pointer group">
                      <div>
                        <h4 className="font-black text-gray-900 group-hover:text-brand-orange transition-colors">{uni.name}</h4>
                        <p className="text-xs text-gray-400 font-bold mt-1 flex items-center gap-1">
                          <i className="fa-solid fa-user-group text-[10px]"></i> {uni.students}
                        </p>
                      </div>
                      {uni.isRussellGroup && (
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 px-3 py-1 rounded-lg">Russell Group</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ENVIRONMENT */}
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <i className="fa-solid fa-tree text-brand-orange"></i>
                  Environment & Living
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: 'fa-cloud-sun', label: 'Climate', desc: selectedCity.environment.climate, color: 'bg-blue-50 text-brand-blue' },
                    { icon: 'fa-shield-halved', label: 'Safety', desc: selectedCity.environment.safety, color: 'bg-emerald-50 text-emerald-600' },
                    { icon: 'fa-globe', label: 'Diversity', desc: selectedCity.environment.diversity, color: 'bg-purple-50 text-purple-600' },
                    { icon: 'fa-leaf', label: 'Green Spaces', desc: selectedCity.environment.greenSpaces, color: 'bg-emerald-50 text-emerald-600' }
                  ].map(env => (
                    <div key={env.label} className={`${env.color} p-6 rounded-[2rem] border border-transparent hover:border-current transition-all cursor-default`}>
                      <div className="flex items-center gap-3 mb-3">
                        <i className={`fa-solid ${env.icon} text-xl`}></i>
                        <span className="font-black text-lg">{env.label}</span>
                      </div>
                      <p className="text-sm font-medium opacity-80 leading-relaxed">{env.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AMENITIES */}
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <i className="fa-solid fa-shop text-brand-orange"></i>
                  Amenities & Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[
                    { icon: 'fa-train', label: 'Transport', items: selectedCity.amenities.transport },
                    { icon: 'fa-cart-shopping', label: 'Shopping', items: selectedCity.amenities.shopping },
                    { icon: 'fa-utensils', label: 'Dining', items: selectedCity.amenities.dining },
                    { icon: 'fa-hospital', label: 'Healthcare', items: selectedCity.amenities.healthcare },
                    { icon: 'fa-masks-theater', label: 'Recreation', items: selectedCity.amenities.recreation },
                    { icon: 'fa-list-check', label: 'Essentials', items: selectedCity.amenities.essentials },
                  ].map(cat => (
                    <div key={cat.label}>
                      <div className="flex items-center gap-2 text-brand-orange mb-4">
                        <i className={`fa-solid ${cat.icon}`}></i>
                        <span className="font-black text-sm uppercase tracking-wider">{cat.label}</span>
                      </div>
                      <ul className="space-y-2">
                        {cat.items.map(item => (
                          <li key={item} className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* POPULAR AREAS */}
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <i className="fa-solid fa-map text-brand-orange"></i>
                  Popular Student Areas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCity.popularAreas.map(area => (
                    <div key={area.name} className="p-6 rounded-2xl border border-gray-50 hover:bg-gray-50/50 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-gray-900">{area.name}</h4>
                        <span className="text-[10px] font-black text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{area.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{area.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (SIDEBAR) */}
            <div className="lg:col-span-4 space-y-8">
              {/* MONTHLY COSTS */}
              <div className="bg-emerald-50/30 p-10 rounded-[2.5rem] shadow-sm border border-emerald-100">
                <h3 className="text-lg font-black text-emerald-800 mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-chart-line"></i>
                  Monthly Costs
                </h3>
                <div className="space-y-0 text-sm font-bold">
                  {[
                    { label: 'Rent', val: selectedCity.monthlyCosts.rent },
                    { label: 'Groceries', val: selectedCity.monthlyCosts.groceries },
                    { label: 'Utilities', val: selectedCity.monthlyCosts.utilities },
                    { label: 'Transport', val: selectedCity.monthlyCosts.transport },
                    { label: 'Entertainment', val: selectedCity.monthlyCosts.entertainment },
                  ].map(cost => (
                    <div key={cost.label} className="flex justify-between py-3 border-b border-emerald-100 last:border-0">
                      <span className="text-emerald-700/70">{cost.label}</span>
                      <span className="text-emerald-900">{cost.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA CARD */}
              <div className="bg-orange-50 p-10 rounded-[2.5rem] shadow-sm border border-orange-100">
                <h3 className="text-lg font-black text-gray-900 mb-4">Ready to Move to {selectedCity.cityName}?</h3>
                <p className="text-sm font-medium text-gray-600 mb-8 leading-relaxed">
                  Discover verified student properties and book your accommodation with our AI-powered matching system.
                </p>
                <div className="space-y-4">
                  <button className="w-full bg-brand-orange text-white py-4 rounded-xl font-black shadow-lg shadow-orange-200 hover:bg-brand-orange-hover transition-all flex items-center justify-center gap-2">
                    <i className="fa-solid fa-house"></i>
                    Find Properties
                  </button>
                  <button className="w-full bg-white text-brand-orange border-2 border-brand-orange/10 py-4 rounded-xl font-black hover:bg-white transition-all flex items-center justify-center gap-2">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    Visit University Websites
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Search Header */}
      <section className="bg-brand-blue-dark py-24 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-8">Explore Your New Home</h2>
          <p className="text-blue-100 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
            Get the inside scoop on UK student cities. Learn about the vibes, environment, and lifestyle before you move.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white p-3 rounded-[2rem] shadow-2xl flex items-center">
            <div className="flex-1 px-4">
              <Autocomplete
                options={UK_UNIVERSITIES}
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search a city or university..."
                icon="fa-solid fa-magnifying-glass"
                dark={true}
              />
            </div>
            <button 
              onClick={() => searchTerm && handleCitySelect(searchTerm)}
              className="bg-brand-orange text-white px-8 py-3.5 rounded-2xl font-black hover:bg-brand-orange-hover transition-all shrink-0 shadow-lg"
            >
              Explore
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h3 className="text-4xl font-black text-gray-900 mb-6">Popular Student Hubs</h3>
        <p className="text-gray-500 font-medium mb-16 max-w-2xl mx-auto">Click on a city to dive into detailed student life statistics, costs, and top university areas.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_CITIES.map((city) => (
            <button 
              key={city.name}
              onClick={() => handleCitySelect(city.name)}
              className="group relative h-[400px] rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all"
            >
              <img src={city.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white text-left">
                <div className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-2 bg-white/10 backdrop-blur-md inline-block px-2 py-0.5 rounded">Featured</div>
                <h4 className="text-3xl font-black mb-1">{city.name}</h4>
                <p className="text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                  Dive Into Vibe <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
