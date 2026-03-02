
import React, { useState, useEffect } from 'react';
import { MatchResult, UserProfile } from '../types';
import { PropertyCard } from './PropertyCard';
import { UK_UNIVERSITIES } from '../constants';
import { FilterOverlay } from './FilterOverlay';
import { PropertyMap } from './PropertyMap';

interface ResultsViewProps {
  matches: MatchResult[];
  profile: UserProfile;
  onNewSearch: () => void;
  onFilterUpdate: (profile: UserProfile) => void;
  onViewProperty: (id: string) => void;
  isFromQuickSearch?: boolean;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ matches, profile, onNewSearch, onFilterUpdate, onViewProperty, isFromQuickSearch }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    if (isFromQuickSearch) {
      // Small delay for entrance effect
      const timer = setTimeout(() => setShowTooltip(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isFromQuickSearch]);

  const handleOpenFilters = () => {
    setIsFilterOpen(true);
    setShowTooltip(false);
  };

  const handleContact = (id: string) => {
    const prop = matches.find(m => m.id === id);
    alert(`Contacting Agent for ${prop?.name || 'this property'}`);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset page when matches change
  useEffect(() => {
    setCurrentPage(1);
  }, [matches]);

  // Calculate pagination
  const totalPages = Math.ceil(matches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMatches = matches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Great news, {profile.name}!</h2>
            <p className="text-gray-500 font-medium">We found {matches.length} matches near {profile.university}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="bg-gray-200/50 p-1 rounded-xl md:rounded-2xl flex items-center shadow-inner">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 md:gap-2 ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <i className="fa-solid fa-list-ul"></i>
                <span className="hidden xs:inline">List</span>
                <span className="xs:hidden">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 md:gap-2 ${viewMode === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <i className="fa-solid fa-map-location-dot"></i>
                <span className="hidden xs:inline">Map</span>
                <span className="xs:hidden">Map</span>
              </button>
            </div>

            <div className="relative">
              <button
                onClick={handleOpenFilters}
                className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white border-2 border-gray-200 text-gray-900 font-black hover:border-brand-orange hover:text-brand-orange transition-all shadow-sm group text-xs md:text-base"
              >
                <i className="fa-solid fa-sliders group-hover:rotate-90 transition-transform"></i>
                <span className="hidden sm:inline">Change Criteria</span>
                <span className="sm:hidden">Criteria</span>
              </button>

              {/* AI Refinement Tooltip */}
              {showTooltip && (
                <div className="absolute top-full mt-4 right-0 z-[60] w-72 animate-bounce-slow">
                  <div className="bg-brand-orange text-white p-4 rounded-2xl shadow-2xl relative">
                    <div className="absolute -top-2 right-10 w-4 h-4 bg-brand-orange rotate-45"></div>
                    <button
                      onClick={() => setShowTooltip(false)}
                      className="absolute top-2 right-2 text-white/50 hover:text-white"
                    >
                      <i className="fa-solid fa-xmark text-xs"></i>
                    </button>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest mb-1">Refine your match</p>
                        <p className="text-sm font-medium leading-snug">Click here to add your commute & lifestyle for a more refined result!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Summary Sidebar (Read Only) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="fa-solid fa-fingerprint text-brand-orange"></i>
                Active Search
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">University</span>
                  <span className="text-sm font-black text-gray-900 truncate block">{profile.university}</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Weekly Budget</span>
                  <span className="text-sm font-black text-brand-orange">£{profile.budget} Max</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Commute Preference</span>
                  <div className="flex items-center gap-2 mt-1">
                    <i className={`fa-solid fa-${profile.commuteType === 'walk' ? 'person-walking' : profile.commuteType === 'cycle' ? 'bicycle' : profile.commuteType === 'bus' ? 'bus' : 'subway'} text-brand-blue`}></i>
                    <span className="text-sm font-bold text-gray-700 capitalize">{profile.commuteType} ({profile.commuteTime} min)</span>
                  </div>
                </div>

                <button
                  onClick={handleOpenFilters}
                  className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:text-brand-orange hover:border-brand-orange hover:bg-orange-50 transition-all text-xs font-black uppercase tracking-wider group"
                >
                  <i className="fa-solid fa-sparkles mr-1 group-hover:animate-pulse"></i>
                  Refine Preferences
                </button>
              </div>
            </div>

            <div className="bg-brand-blue p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
              <h4 className="font-black text-lg mb-2">Need Help?</h4>
              <p className="text-blue-100 text-sm mb-4 leading-relaxed font-medium">Our AI assistants are online 24/7 to help you with your booking.</p>
              <button className="w-full bg-white text-brand-blue font-black py-3 rounded-xl hover:bg-blue-50 transition-all text-sm">
                Chat with Expert
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {viewMode === 'list' ? (
              <div className="space-y-8">
                <div className="space-y-4 animate-in fade-in duration-500">
                  {currentMatches.length > 0 ? (
                    currentMatches.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onBook={() => handleContact(property.id)}
                        onView={() => onViewProperty(property.id)}
                      />
                    ))
                  ) : (
                    <EmptyState onAdjust={handleOpenFilters} />
                  )}
                </div>

                {/* Pagination Controls */}
                {matches.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand-orange hover:text-brand-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">Page {currentPage}</span>
                      <span className="text-sm text-gray-400">of {totalPages}</span>
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand-orange hover:text-brand-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
            ) : (

              <div className="animate-in fade-in zoom-in-95 duration-500">
                <PropertyMap properties={matches} onBook={handleContact} />
              </div>
            )}
          </div>
        </div>
      </div>

      <FilterOverlay
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        profile={profile}
        onApply={onFilterUpdate}
      />
    </div>
  );
};

const EmptyState: React.FC<{ onAdjust: () => void }> = ({ onAdjust }) => (
  <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-4xl mx-auto mb-6">
      <i className="fa-solid fa-house-crack"></i>
    </div>
    <h3 className="text-2xl font-black text-gray-900 mb-2">No direct matches found</h3>
    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Try increasing your budget or changing your preferred commute distance.</p>
    <button
      onClick={onAdjust}
      className="bg-brand-orange text-white px-8 py-3 rounded-xl font-black hover:bg-brand-orange-hover transition-all"
    >
      Adjust Filters
    </button>
  </div>
);
