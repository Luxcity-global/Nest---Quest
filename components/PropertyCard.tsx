
import React from 'react';
import { MatchResult } from '../types';

interface PropertyCardProps {
  property: MatchResult;
  onBook: () => void;
  onView?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onBook, onView }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group flex flex-col md:flex-row mb-4 relative">
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-brand-orange text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
          <i className="fa-solid fa-sparkles animate-pulse"></i>
          {property.matchScore}% Match
        </div>
      </div>

      <div
        className="w-full md:w-80 h-56 md:h-auto shrink-0 relative overflow-hidden bg-gray-100 cursor-pointer"
        onClick={onView}
      >
        <img
          src={property.imageUrl}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {property.secondaryImages && (
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-bold">
            <i className="fa-solid fa-camera mr-1"></i>
            1/{1 + property.secondaryImages.length}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <div className="cursor-pointer" onClick={onView}>
            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-brand-orange transition-colors">
              {property.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {property.area}, {property.city}
            </p>
          </div>
          <button className="text-gray-400 hover:text-brand-orange transition-colors">
            <i className="fa-regular fa-heart text-xl"></i>
          </button>
        </div>

        <div className="flex items-center gap-4 my-3 text-gray-600 text-sm">
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-bed text-gray-400"></i>
            <span className="font-semibold">{property.beds} Bed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-bath text-gray-400"></i>
            <span className="font-semibold">{property.baths} Bath</span>
          </div>
          {property.sqft && (
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-ruler-combined text-gray-400"></i>
              <span className="font-semibold">{property.sqft} sq ft</span>
            </div>
          )}
        </div>

        <div className="mb-4 bg-blue-50 p-3 rounded-xl border border-blue-100 relative group/insight">
          <div className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mb-1 flex items-center gap-1">
            Why this fits you
          </div>
          <p className="text-sm text-gray-700 leading-relaxed italic line-clamp-2 group-hover/insight:line-clamp-none transition-all">
            "{property.aiExplanation}"
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-xl font-extrabold text-gray-900">
              £{property.pcm.toLocaleString()} pcm
            </div>
            <div className="text-xs text-gray-500 font-medium">
              £{property.price} pw
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onView}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm"
            >
              <i className="fa-regular fa-eye"></i>
              View
            </button>
            <button
              onClick={onBook}
              className="bg-brand-orange text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brand-orange-hover transition-all shadow-md shadow-orange-100 flex items-center gap-2 text-sm"
            >
              <i className="fa-regular fa-comment-dots"></i>
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
