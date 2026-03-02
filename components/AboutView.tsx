
import React from 'react';
import { motion } from 'framer-motion';

// Fix: Pervasive type resolution errors in framer-motion are bypassed by casting to any.
const motionAny: any = motion;

export const AboutView: React.FC<{ onStartMatching: () => void }> = ({ onStartMatching }) => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <motionAny.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-brand-orange/10 text-brand-orange px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            A Luxcity Group Venture
          </motionAny.div>
          <motionAny.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight"
          >
            Housing Made for <span className="text-brand-orange">Humans</span>,<br /> Powered by AI.
          </motionAny.h1>
          <motionAny.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed"
          >
            NestQuest is the student-focused division of the Luxcity Group, dedicated to bridging the gap between professional property expertise and the genuine needs of university life. We believe that your accommodation should be a launchpad for your success, merging urban living mastery with a deep empathy for the student journey.
          </motionAny.p>
        </section>

        {/* Meet Nestor Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 bg-gray-50 rounded-[4rem] p-12 md:p-20 border border-gray-100">
          <div className="relative">
            <motionAny.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-brand-orange w-full aspect-square rounded-[3rem] flex items-center justify-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1),transparent)]"></div>
              {/* Giant Nestor Emoji or Graphic Placeholder */}
              <span className="text-9xl">🦉</span>
              
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-white">
                <p className="text-sm font-black uppercase tracking-widest mb-1">Meet Nestor</p>
                <p className="text-xs font-medium opacity-80">Our AI Guide & Senior Student Expert</p>
              </div>
            </motionAny.div>
            
            <motionAny.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl"
            >
              <i className="fa-solid fa-sparkles"></i>
            </motionAny.div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Meet Your Senior Student Mentor</h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              Nestor isn't just a mascot. He's the embodiment of the "Helpful Older Student." He's been through the rental scams, the 45-minute bus commutes, and the noisy flatmates. 
            </p>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              He uses our proprietary AI matching engine to scan thousands of listings to find the ones that don't just fit your budget, but fit your <span className="text-brand-orange font-black">life</span>.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <i className="fa-solid fa-shield-halved text-brand-orange mb-3 text-xl"></i>
                <h4 className="font-black text-sm text-gray-900 mb-1">Safety First</h4>
                <p className="text-xs text-gray-400 font-bold">Vetted landlords only.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <i className="fa-solid fa-bolt text-brand-orange mb-3 text-xl"></i>
                <h4 className="font-black text-sm text-gray-900 mb-1">Fast Results</h4>
                <p className="text-xs text-gray-400 font-bold">Matches in seconds.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="text-center mb-32">
          <h2 className="text-4xl font-black text-gray-900 mb-16 tracking-tight">Why We Built This</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: 'fa-brain', 
                title: 'No More Endless Lists', 
                desc: 'We replace scrolling with intelligence. Our AI understands that a "20 minute walk" means something different to everyone.' 
              },
              { 
                icon: 'fa-users-viewfinder', 
                title: 'Lifestyle First', 
                desc: 'Are you a night owl or a morning lark? Do you need a gym or a quiet library? We match you based on how you live.' 
              },
              { 
                icon: 'fa-heart-circle-check', 
                title: 'Student Centric', 
                desc: 'NestQuest is free for students, forever. We make our money from landlords, not from those just starting their journey.' 
              }
            ].map((value, idx) => (
              <motionAny.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 rounded-[3rem] bg-white border border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 bg-gray-50 text-brand-blue rounded-2xl flex items-center justify-center text-2xl mx-auto mb-8">
                  <i className={`fa-solid ${value.icon}`}></i>
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-4">{value.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{value.desc}</p>
              </motionAny.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-blue rounded-[4rem] p-12 md:p-24 text-center text-white shadow-2xl shadow-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to find your nest?</h2>
            <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">Join thousands of students who have skipped the stress and found their perfect home with Nestor.</p>
            <button
              onClick={onStartMatching}
              className="bg-brand-orange text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-brand-orange-hover transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 mx-auto transform hover:scale-105"
            >
              Start Matching Now
              <i className="fa-solid fa-sparkles"></i>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
