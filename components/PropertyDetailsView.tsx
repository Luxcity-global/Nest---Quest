
import React, { useState, useEffect, useRef } from 'react';
import { MatchResult, UserAccount } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyDetailsViewProps {
  property: MatchResult;
  onBack: () => void;
  user: UserAccount | null;
}

export const PropertyDetailsView: React.FC<PropertyDetailsViewProps> = ({ property, onBack, user }) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const allImages = [property.imageUrl, ...(property.secondaryImages || [])];

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<any>(null);

  useEffect(() => {
    const google = (window as any).google;
    if (!mapRef.current || !google || showContactForm) return;

    if (!googleMap.current) {
      const position = { lat: property.location.lat, lng: property.location.lng };

      googleMap.current = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        styles: [
          { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] },
          { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] },
          { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] },
          { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] },
          { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] },
          { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] },
          { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] },
          { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] },
          { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] },
          { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] },
          { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }
        ],
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: 'cooperative'
      });

      // Custom Marker for Property
      new google.maps.Marker({
        position: position,
        map: googleMap.current,
        title: property.name,
        icon: {
          path: 'M0,0 L40,0 L40,25 L20,35 L0,25 Z',
          fillColor: '#DC5F12',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 1.2,
          labelOrigin: new google.maps.Point(20, 12)
        },
        label: {
          text: 'HERE',
          color: 'white',
          fontSize: '10px',
          fontWeight: '900'
        }
      });
    }
  }, [property, showContactForm]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Enquiry sent successfully to the agent!");
    setShowContactForm(false);
  };

  const zoomIn = () => googleMap.current?.setZoom((googleMap.current.getZoom() || 15) + 1);
  const zoomOut = () => googleMap.current?.setZoom((googleMap.current.getZoom() || 15) - 1);

  if (showContactForm) {
    return (
      <div className="bg-gray-50 min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => setShowContactForm(false)}
            className="flex items-center gap-2 text-gray-500 hover:text-brand-orange mb-8 font-black text-sm uppercase tracking-widest"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to property
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Contact Agent</h1>
                <p className="text-gray-500 font-medium mb-8">Ref: {property.id} — {property.name}</p>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem label="First Name" defaultValue={user?.name?.split(' ')[0] || ""} placeholder="e.g. Aisha" />
                    <InputItem label="Last Name" defaultValue={user?.name?.split(' ')[1] || ""} placeholder="e.g. Daodu" />
                    <InputItem label="Email Address" defaultValue={user?.email || ""} placeholder="aisha.d@student.ac.uk" />
                    <InputItem label="Telephone" placeholder="e.g. 07700 900 000" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem label="Country" defaultValue="United Kingdom" placeholder="" />
                    <InputItem label="Postcode" placeholder="e.g. MK6 1AJ" />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Your Message (Optional)</label>
                    <textarea
                      rows={4}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-brand-orange outline-none font-medium transition-all bg-gray-50/30"
                      placeholder="Please share any questions, requirements or additional details about your situation..."
                    ></textarea>
                  </div>

                  <div className="bg-orange-50/50 p-6 rounded-2xl border border-brand-orange/10 space-y-4">
                    <p className="text-sm font-black text-gray-900">About your move:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <RadioGroup label="When do you want to move in?" options={['Within 2 weeks', 'Within 1 month', '3 months +', 'I\'m flexible']} />
                      <RadioGroup label="Desired length of tenancy?" options={['6 months', '12 months', '24 months', 'Flexible']} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-orange text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-2"
                  >
                    Send enquiry
                    <i className="fa-solid fa-paper-plane text-sm"></i>
                  </button>
                  <p className="text-[10px] text-center text-gray-400 font-medium mt-4">
                    NestQuest may contact you with relevant properties. By submitting this form you agree to our terms.
                  </p>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 sticky top-32">
                <img src={property.imageUrl} className="w-full h-48 object-cover rounded-2xl mb-4" alt="" />
                <h3 className="text-xl font-black text-gray-900 mb-1">£{property.pcm.toLocaleString()} pcm</h3>
                <p className="text-sm font-bold text-brand-orange mb-4">£{property.price} pw</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <i className="fa-solid fa-bed text-brand-orange"></i> {property.beds} bedroom {property.type.toLowerCase()}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <i className="fa-solid fa-location-dot text-brand-orange"></i> {property.area}
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-blue italic font-black text-xl">
                    {property.agentLogo || 'NQ'}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marketed by</p>
                    <p className="text-xs font-black text-gray-900 uppercase">{property.agentName || 'NestQuest Verified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      {/* Top Header / Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between border-b border-gray-100 mb-4 md:mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-brand-orange transition-all font-black text-[10px] md:text-sm uppercase tracking-widest"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span className="hidden xs:inline">Back to search results</span>
            <span className="xs:hidden">Back</span>
          </button>
        </div>
        <div className="flex gap-4 md:gap-6">
          <button className="text-gray-400 hover:text-brand-orange flex items-center gap-1.5 md:gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest transition-colors">
            <i className="fa-solid fa-share-nodes"></i> Share
          </button>
          <button className="text-gray-400 hover:text-brand-orange flex items-center gap-1.5 md:gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest transition-colors">
            <i className="fa-regular fa-heart"></i> Save
          </button>
        </div>
      </div>

      {/* Hero Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 mb-6 md:mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[300px] sm:h-[450px] md:h-[600px] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Main Large Image */}
          <div className="md:col-span-3 md:row-span-2 h-full relative group cursor-pointer overflow-hidden">
            <img
              src={allImages[activeImage]}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              alt="Main property view"
            />
            <div className="absolute top-4 md:top-6 left-4 md:left-6 flex gap-2">
              <span className="bg-brand-orange text-white px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg">Added today</span>
              <span className="bg-white/90 backdrop-blur text-gray-900 px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                <i className="fa-solid fa-camera"></i> {activeImage + 1} / {allImages.length}
              </span>
            </div>
          </div>
          {/* Side Gallery Items */}
          <div className="hidden md:block h-full overflow-hidden relative group cursor-pointer" onClick={() => setActiveImage(1 % allImages.length)}>
            <img src={allImages[1 % allImages.length]} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" alt="Gallery 2" />
          </div>
          <div className="hidden md:block h-full overflow-hidden relative group cursor-pointer" onClick={() => setActiveImage(2 % allImages.length)}>
            <img src={allImages[2 % allImages.length]} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" alt="Gallery 3" />
            {allImages.length > 3 && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                <span className="text-3xl font-black">+{allImages.length - 3}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">More Photos</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column */}
        <div className="lg:col-span-8 space-y-12">

          {/* Header & Pricing */}
          <div className="border-b border-gray-100 pb-8 md:pb-10">
            <h2 className="text-sm md:text-lg font-black text-gray-400 uppercase tracking-widest mb-2">{property.area}, {property.city}</h2>
            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3 mb-4">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900">£{property.pcm.toLocaleString()} pcm</h1>
              <span className="text-base md:text-xl font-bold text-gray-400 pb-1">(£{property.price} pw)</span>
            </div>
            <p className="text-xs md:text-sm font-black text-brand-orange hover:underline cursor-pointer mb-6 inline-block">See if you could afford to buy</p>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 font-bold text-sm">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-bed text-brand-orange"></i>
                {property.beds} beds
              </span>
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-bath text-brand-orange"></i>
                {property.baths} bath
              </span>
              {property.sqft && (
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-vector-square text-brand-orange"></i>
                  {property.sqft} sq ft
                </span>
              )}
            </div>
          </div>

          {/* AI MATCH SECTION (Unique Value Proposition) */}
          <section className="bg-blue-50/30 text-gray-900 p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-xl border border-brand-blue/20 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl group-hover:bg-brand-blue/10 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl border border-brand-blue/20">
                  <i className="fa-solid fa-wand-magic-sparkles text-brand-blue"></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl md:text-3xl font-black">Nestor's Match: {property.matchScore}%</h3>
                  </div>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Personalized Insights for {user?.name || 'Students'}</p>
                </div>
              </div>
              <p className="text-base md:text-2xl font-medium leading-relaxed italic mb-8 md:mb-10 opacity-90 border-l-4 border-brand-blue pl-6 md:pl-8 py-2">
                "{property.aiExplanation}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <span>Commute Score</span>
                    <span>94%</span>
                  </div>
                  <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue w-[94%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <span>Lifestyle Vibe</span>
                    <span>88%</span>
                  </div>
                  <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue w-[88%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <span>Study Fit</span>
                    <span>91%</span>
                  </div>
                  <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue w-[91%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Letting Details & Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-8 md:py-10 border-b border-gray-100">
            <div>
              <h3 className="text-lg md:text-xl font-black text-gray-900 mb-4 md:mb-6 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-list-check text-brand-orange"></i>
                Letting details
              </h3>
              <div className="space-y-3 md:space-y-4 text-xs md:text-sm font-bold">
                <LettingRow label="Let available date" value={property.availableDate || 'Ask agent'} />
                <LettingRow label="Deposit" value={property.deposit ? `£${property.deposit.toLocaleString()}` : 'Ask agent'} />
                <LettingRow label="Min. tenancy" value={property.tenancyLength || '12 months'} />
                <LettingRow label="Furnish type" value="Furnished" />
              </div>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h3 className="text-lg md:text-xl font-black text-gray-900 mb-4 md:mb-6 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-brand-orange"></i>
                Key information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase mb-1">Council tax</p>
                  <p className="text-xs md:text-sm font-black text-gray-900">{property.councilTaxBand || 'Band E'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase mb-1">EPC Rating</p>
                  <p className="text-xs md:text-sm font-black text-emerald-600">{property.epcRating || 'B'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="space-y-6 md:space-y-8">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900">Features and description</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 md:gap-y-4">
              {property.amenities.map(feat => (
                <div key={feat} className="flex items-center gap-3 text-gray-700 font-bold text-sm md:text-base">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] text-brand-orange flex-shrink-0">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <span className="break-words">{feat}</span>
                </div>
              ))}
            </div>
            <div className="prose prose-orange max-w-none text-gray-600 font-medium leading-relaxed text-base md:text-lg pt-4 md:pt-6">
              {property.description && property.description !== 'No description available.' ? (
                <>
                  <p>
                    {isDescriptionExpanded
                      ? property.description
                      : property.description.length > 300
                        ? `${property.description.substring(0, 300)}...`
                        : property.description
                    }
                  </p>
                  {property.description.length > 300 && (
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="text-brand-orange font-black text-[10px] md:text-sm uppercase tracking-widest mt-6 md:mt-8 border-b-2 border-brand-orange/20 hover:border-brand-orange transition-all"
                    >
                      {isDescriptionExpanded ? 'Show less' : 'Read full description'}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-400 italic text-sm">Full property description coming soon. Contact the agent for more details.</p>
              )}
            </div>
          </section>

          {/* Local Area Information (Functional Map) */}
          <section className="space-y-8 md:space-y-10 pt-8 md:pt-10 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900">Local area information</h3>
              <div className="flex gap-2">
                <button onClick={zoomIn} className="bg-gray-100 text-gray-600 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all shadow-sm">
                  <i className="fa-solid fa-plus text-xs md:text-base"></i>
                </button>
                <button onClick={zoomOut} className="bg-gray-100 text-gray-600 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all shadow-sm">
                  <i className="fa-solid fa-minus text-xs md:text-base"></i>
                </button>
              </div>
            </div>

            <div className="bg-slate-100 h-[300px] md:h-[450px] rounded-3xl md:rounded-[3rem] overflow-hidden relative shadow-inner group border border-gray-200">
              <div ref={mapRef} className="absolute inset-0 w-full h-full" />
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 flex justify-center gap-3 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest text-brand-orange flex items-center gap-2 border border-white/50 text-center">
                  <i className="fa-solid fa-location-dot"></i> Real-time Neighborhood Data
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <i className="fa-solid fa-train text-red-600"></i> Transport Links
                </h4>
                <div className="space-y-2">
                  <PlaceRow name="Goodge Street Station" dist="0.1 miles" color="bg-red-500" />
                  <PlaceRow name="Tottenham Court Road" dist="0.3 miles" color="bg-red-600" />
                  <PlaceRow name="Warren Street" dist="0.3 miles" color="bg-sky-500" />
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-brand-blue"></i> Education Hubs
                </h4>
                <div className="space-y-2">
                  <PlaceRow name="University College London" dist="0.2 miles" icon="fa-building-columns" />
                  <PlaceRow name="Fitzrovia Primary School" dist="0.3 miles" icon="fa-school" />
                  <PlaceRow name="Birkbeck College" dist="0.5 miles" icon="fa-building-columns" />
                </div>
              </div>
            </div>
          </section>

          {/* Similar Properties Placeholder */}
          <section className="pt-10 border-t border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 mb-8">See more properties like this</h3>
            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
              {[1, 2, 3].map(i => (
                <div key={i} className="min-w-[300px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all">
                  <div className="h-40 overflow-hidden relative">
                    <img src={`https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=400&sig=${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-lg text-[10px] font-black">£850 pcm</div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-black text-sm text-gray-900 mb-1">Similar Flat in {property.area}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">2 beds • 1 bath</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sticky Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">

            {/* Action Card */}
            <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-2xl border border-gray-100 ring-1 ring-gray-100">
              <div className="text-center mb-6 md:mb-10">
                <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Marketed By</p>
                <div className="w-full py-4 md:py-6 bg-gray-50 rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center mb-4 border border-gray-100">
                  <span className="text-brand-blue font-black text-2xl md:text-3xl italic tracking-tighter">
                    {property.agentLogo || 'NQ'}
                  </span>
                  <p className="text-[9px] md:text-[10px] font-black text-brand-blue mt-1 uppercase tracking-widest">{property.agentName || 'NestQuest Verified'}</p>
                </div>
                <p className="text-[10px] md:text-xs font-bold text-gray-400">2 Jubilee Street, London, E1 3FU</p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-emerald-500 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 group">
                  <i className="fa-solid fa-phone group-hover:animate-bounce"></i>
                  020 8022 6256
                </button>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-brand-orange text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-envelope"></i>
                  Request details
                </button>
              </div>

              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-50 text-center">
                <button className="text-[10px] md:text-xs font-black text-brand-blue hover:text-brand-orange uppercase tracking-widest transition-colors">
                  View agent properties
                </button>
              </div>
            </div>

            {/* AI Trust Card */}
            <div className="bg-brand-blue/5 p-8 rounded-[2.5rem] border border-brand-blue/10">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-sm border border-brand-blue/10 shrink-0">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 mb-2">Verified Protection</h4>
                  <p className="text-xs font-medium text-gray-500 leading-relaxed">This property is part of our Verified Listings. Your deposit and identity are protected by NestQuest AI.</p>
                </div>
              </div>
            </div>

            {/* Zoopla Style "Could you afford?" */}
            <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <i className="fa-solid fa-chart-pie text-4xl md:text-6xl"></i>
              </div>
              <h4 className="text-[10px] md:text-sm font-black text-gray-900 mb-4 md:mb-6 uppercase tracking-widest">Affordability</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] md:text-xs font-bold text-gray-400">Monthly Budget Needs</span>
                  <span className="text-base md:text-lg font-black text-gray-900">£{Math.floor(property.pcm * 1.5).toLocaleString()}</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full">
                  <div className="h-full bg-brand-orange w-2/3"></div>
                </div>
                <p className="text-[9px] md:text-[10px] font-medium text-gray-400">Recommended income based on rent multiplier.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const LettingRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <span className="text-gray-400 font-bold">{label}</span>
    <span className="text-gray-900 font-black">{value}</span>
  </div>
);

const PlaceRow: React.FC<{ name: string; dist: string; color?: string; icon?: string }> = ({ name, dist, color, icon = "fa-train" }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-brand-orange hover:bg-white transition-all group">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 ${color || 'bg-brand-blue'} rounded-xl flex items-center justify-center text-white text-[10px] shadow-sm`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <span className="text-sm font-black text-gray-900 group-hover:text-brand-orange transition-colors">{name}</span>
    </div>
    <span className="text-xs font-bold text-gray-400">{dist}</span>
  </div>
);

const RadioGroup: React.FC<{ label: string; options: string[] }> = ({ label, options }) => (
  <div className="space-y-3">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <div className="grid grid-cols-2 gap-2">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-2 p-3 rounded-xl border-2 border-gray-50 hover:bg-white cursor-pointer transition-all">
          <input type="radio" name={label} className="accent-brand-orange" />
          <span className="text-xs font-bold text-gray-600">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const InputItem: React.FC<{ label: string; defaultValue?: string; placeholder?: string }> = ({ label, defaultValue, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
    <input
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-bold text-gray-700 transition-all bg-gray-50/50"
    />
  </div>
);
