
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost } from '../types';

const motionAny: any = motion;

const TAGS = ["All", "Living Tips", "Finance", "Housing", "Lifestyle", "Academic"];

interface BlogViewProps {
  posts: BlogPost[];
  onReadArticle: (id: string) => void;
  isLoading?: boolean;
}

export const BlogView: React.FC<BlogViewProps> = ({ posts, onReadArticle, isLoading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = activeTag === 'All' || post.category === activeTag;
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, activeTag, posts]);

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-16">
          <motionAny.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-brand-orange/10 text-brand-orange px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            Nestor's Notebook
          </motionAny.div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Student Living, <span className="text-brand-orange">Simplified.</span></h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            Expert advice from Nestor and the team on navigating the ups and downs of UK university life.
          </p>
        </header>

        {/* Search & Filter Controls */}
        <div className="mb-16 space-y-8">
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-brand-orange transition-colors"></i>
            </div>
            <input
              type="text"
              placeholder="Search articles, tips, or guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white border-2 border-gray-100 focus:border-brand-orange outline-none font-bold text-gray-800 shadow-xl shadow-gray-200/50 transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-6 py-2.5 rounded-full text-sm font-black transition-all border-2 ${activeTag === tag
                  ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-orange-100'
                  : 'bg-white border-gray-100 text-gray-500 hover:border-brand-orange/30 hover:text-brand-orange'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            // Loading skeleton
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-8 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  return (
                    <motionAny.article
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => onReadArticle(post.id)}
                      className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group cursor-pointer"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                        <div className="absolute top-6 left-6">
                          <span className="bg-white/90 backdrop-blur-md text-brand-orange px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                          <span>{post.date}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{post.readTime}</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-brand-orange transition-colors break-words">
                          {post.title}
                        </h2>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 flex-grow break-words line-clamp-4">
                          {post.excerpt}
                        </p>
                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Read Article</span>
                          <i className="fa-solid fa-arrow-right text-brand-orange group-hover:translate-x-2 transition-transform"></i>
                        </div>
                      </div>
                    </motionAny.article>
                  );
                })
              ) : (
                <motionAny.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-3xl mx-auto mb-6">
                    <i className="fa-solid fa-notebook"></i>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Nestor couldn't find that one!</h3>
                  <p className="text-gray-500 font-medium">Try searching for something else or clearing your filters.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveTag('All'); }}
                    className="mt-8 text-brand-orange font-black text-sm uppercase tracking-widest border-b-2 border-brand-orange/20 hover:border-brand-orange transition-all"
                  >
                    Show all articles
                  </button>
                </motionAny.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <section className="mt-32 bg-brand-blue rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-black mb-6">Get the Notebook in your inbox.</h2>
            <p className="text-blue-100 font-medium text-lg mb-10 leading-relaxed">
              Weekly tips, exclusive housing deals, and university guides sent directly to you. No spam, just the good stuff.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="your@email.ac.uk"
                className="flex-grow px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:bg-white/20 transition-all font-bold"
              />
              <button className="bg-brand-orange text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-orange-hover transition-all shadow-xl shadow-black/10">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
