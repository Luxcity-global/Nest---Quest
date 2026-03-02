
import React from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';

const motionAny: any = motion;

interface ArticleDetailsViewProps {
  posts: BlogPost[];
  articleId: string;
  onBack: () => void;
}

export const ArticleDetailsView: React.FC<ArticleDetailsViewProps> = ({ posts, articleId, onBack }) => {
  const article = posts.find(p => p.id === articleId);

  if (!article) {
    return (
      <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Article not found</h2>
          <button onClick={onBack} className="text-brand-orange font-black uppercase tracking-widest">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm font-black text-gray-400 hover:text-brand-orange transition-all uppercase tracking-widest"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Notebook
        </button>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-brand-orange/10 text-brand-orange px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {article.category}
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {article.date} • {article.readTime}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
            {article.title}
          </h1>
          <div className="w-full h-[400px] rounded-[3rem] overflow-hidden shadow-2xl mb-12">
            <img src={article.image} className="w-full h-full object-cover" alt={article.title} />
          </div>
        </header>

        {/* Layout: Content + Nestor Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="prose prose-lg prose-orange max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-wrap break-words">
              {article.content}
            </div>

            {/* In-article CTA */}
            <div className="mt-16 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center mb-4">
                <i className="fa-solid fa-house-circle-check"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Finding your own place?</h3>
              <p className="text-sm text-gray-500 mb-6">Use Nestor's AI to match with student-vetted homes.</p>
              <button className="bg-brand-orange text-white px-8 py-3 rounded-xl font-black hover:bg-brand-orange-hover transition-all shadow-lg shadow-orange-100">
                Find My Match
              </button>
            </div>
          </div>

          {/* Nestor's Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-brand-blue text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <i className="fa-solid fa-quote-right text-6xl"></i>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue text-xl font-black shadow-lg">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-lg">Nestor's Take</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Senior Student Mentor</p>
                  </div>
                </div>
                <p className="text-sm font-medium leading-relaxed italic opacity-90 break-words">
                  "{article.nestorTake}"
                </p>
                <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Active in Notebook</span>
                </div>
              </div>

              {/* Related articles sidebar mini-list */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">More from the Notebook</h4>
                <div className="space-y-6">
                  {posts.filter((p) => p.id !== articleId).slice(0, 2).map((p) => (
                    <div key={p.id} className="group cursor-pointer">
                      <p className="text-xs font-black text-brand-orange uppercase mb-1">{p.category}</p>
                      <h5 className="font-black text-gray-900 text-sm group-hover:text-brand-orange transition-colors line-clamp-2">
                        {p.title}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
