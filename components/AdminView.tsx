
import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost } from '../types';
import { INITIAL_BLOG_POSTS } from '../constants';

const motionAny: any = motion;

interface AdminViewProps {
  onAddPost: (post: BlogPost) => void;
  posts: BlogPost[];
  onBack: () => void;
}

const CATEGORIES = ["Living Tips", "Finance", "Housing", "Lifestyle", "Academic"];

type StatTab = 'total' | 'new' | 'drafts';

export const AdminView: React.FC<AdminViewProps> = ({ onAddPost, posts, onBack }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    image: '',
    excerpt: '',
    content: '',
    nestorTake: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeStatTab, setActiveStatTab] = useState<StatTab | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async (status: 'published' | 'draft') => {
    if (!formData.image) {
      alert("Please provide a hero image via URL or upload.");
      return;
    }
    if (!formData.title) {
      alert("Please provide a title.");
      return;
    }

    setIsSaving(true);
    try {
      const newPost: BlogPost = {
        id: editingId || Math.random().toString(36).substr(2, 9),
        ...formData,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        readTime: `${Math.ceil(formData.content.split(' ').length / 200)} min read`,
        status
      };

      await onAddPost(newPost);
      setIsSuccess(true);
      setSuccessMsg(status === 'published' ? 'Article published successfully! 🚀' : 'Article saved to drafts! 💾');

      // Clear Form
      setFormData({
        title: '',
        category: CATEGORIES[0],
        image: '',
        excerpt: '',
        content: '',
        nestorTake: ''
      });
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!window.confirm('This will recreate the 5 mock blog posts in the database. Continue?')) return;

    setIsSaving(true);
    try {
      let restoredCount = 0;
      for (const post of INITIAL_BLOG_POSTS) {
        // Check if post already exists is handled by creation logic (it will create new ID if not provided, 
        // but here we want to ensure these specific content pieces exist)
        // We'll create them as new posts to avoid ID conflicts or just use their specific IDs if we want strict restoration
        // Let's create them as new posts to be safe and simple
        const { id, ...postData } = post; // Drop the ID to let Firestore/service handle it or use the mock ID?
        // Actually onAddPost in App.tsx handles creation. 
        // Let's use the mock content but let it generate fresh IDs or use the mock ones if onAddPost supports it.
        // App.tsx: if (newPost.id && blogPosts.find...) updates. Else creates.
        // If the database is empty, the find will return undefined, so it will create.
        // If we want to force create, we can just pass the post.

        await onAddPost(post);
        restoredCount++;
      }
      setIsSuccess(true);
      setSuccessMsg(`Restored ${restoredCount} default articles! 🚀`);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Error restoring defaults:', error);
      alert('Failed to restore default posts.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadArticleForEdit = (article: BlogPost) => {
    setFormData({
      title: article.title,
      category: article.category,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content,
      nestorTake: article.nestorTake
    });
    setEditingId(article.id);
    setActiveStatTab(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const publishedPosts = useMemo(() => posts.filter(p => p.status === 'published'), [posts]);
  const draftPosts = useMemo(() => posts.filter(p => p.status === 'draft'), [posts]);
  const newThisMonth = useMemo(() => {
    const currentMonth = new Date().toLocaleString('en-GB', { month: 'short' });
    return publishedPosts.filter(p => p.date.includes(currentMonth));
  }, [publishedPosts]);

  const listData = useMemo(() => {
    if (activeStatTab === 'total') return publishedPosts;
    if (activeStatTab === 'new') return newThisMonth;
    if (activeStatTab === 'drafts') return draftPosts;
    return [];
  }, [activeStatTab, publishedPosts, newThisMonth, draftPosts]);

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-20 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto px-4">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">Nestor's Admin Console</h1>
            <p className="text-sm md:text-base text-gray-500 font-bold mt-1">Manage the Notebook and content portal.</p>
          </div>
          <div className="flex gap-3 md:gap-4 w-full md:w-auto">
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', category: CATEGORIES[0], image: '', excerpt: '', content: '', nestorTake: '' });
                }}
                className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-red-100 font-black text-xs md:text-sm text-red-500 hover:bg-red-50 transition-all bg-white"
              >
                Cancel Edit
              </button>
            )}
            <button
              onClick={onBack}
              className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-gray-200 font-black text-xs md:text-sm text-gray-600 hover:border-brand-orange hover:text-brand-orange transition-all bg-white"
            >
              Exit Console
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Upload Form */}
          <div className="lg:col-span-8">
            <section className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[3rem] shadow-xl border border-gray-100">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
                <i className={`fa-solid ${editingId ? 'fa-pen-to-square' : 'fa-plus-circle'} text-brand-orange`}></i>
                {editingId ? 'Edit Article' : 'Upload New Article'}
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Article Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-brand-orange outline-none font-bold transition-all bg-gray-50/50 text-sm md:text-base"
                      placeholder="e.g. 5 Ways to Save on Rent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-brand-orange outline-none font-bold transition-all bg-gray-50/50 appearance-none bg-[url('https://cdn-icons-png.flaticon.com/512/60/60995.png')] bg-[length:12px] bg-[right_15px_center] bg-no-repeat text-sm md:text-base"
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Hero Image</label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Option 1: Paste URL</p>
                      <input
                        type="url"
                        value={formData.image.startsWith('data:') ? '' : formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-bold transition-all bg-gray-50/50 text-sm"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Option 2: Upload File</p>
                      <div className="relative">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full px-5 py-3.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:border-brand-orange hover:text-brand-orange transition-all">
                          <i className="fa-solid fa-image"></i>
                          {formData.image.startsWith('data:') ? 'Image uploaded!' : 'Choose Image File'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.image && (
                    <motionAny.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative h-40 md:h-48 w-full rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 mt-2"
                    >
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-all"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-900 shadow-sm">
                        Hero Preview
                      </div>
                    </motionAny.div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Excerpt (Brief Summary)</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.excerpt}
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-brand-orange outline-none font-bold transition-all bg-gray-50/50 resize-none text-sm md:text-base"
                    placeholder="A short hook to get students reading..."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Article Content</label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-brand-orange outline-none font-medium transition-all bg-gray-50/50 resize-none text-sm md:text-base"
                    placeholder="Write the full advice here. Use plain text or Nestor style humor..."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <i className="fa-solid fa-quote-left text-brand-blue"></i>
                    Nestor's Take (The 'Older Student' Perspective)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.nestorTake}
                    onChange={e => setFormData({ ...formData, nestorTake: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-brand-blue/20 focus:border-brand-blue outline-none font-medium transition-all bg-blue-50/10 resize-none italic text-sm md:text-base"
                    placeholder="If I were you, I'd always..."
                  ></textarea>
                </div>

                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  <button
                    onClick={() => handleAction('published')}
                    disabled={isSaving}
                    className="flex-1 bg-brand-orange text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up text-sm md:text-base"></i>
                        {editingId ? 'Update & Publish' : 'Publish to Notebook'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleAction('draft')}
                    disabled={isSaving}
                    className="flex-1 bg-white border-2 border-brand-orange text-brand-orange py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-orange-50 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-file-pen text-sm md:text-base"></i>
                        Save to drafts
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {isSuccess && (
                    <motionAny.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-center font-bold text-sm"
                    >
                      {successMsg}
                    </motionAny.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* Sidebar: Quick Stats & Recent */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-brand-blue text-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-xl">
              <h3 className="text-lg md:text-xl font-black mb-6 flex items-center gap-2">
                <i className="fa-solid fa-chart-simple"></i>
                Portal Stats
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => setActiveStatTab('total')}
                  className={`w-full flex justify-between border-b border-white/10 pb-3 hover:bg-white/10 p-2 rounded-xl transition-all ${activeStatTab === 'total' ? 'bg-white/20' : ''}`}
                >
                  <span className="text-blue-100 font-bold">Total Articles</span>
                  <span className="font-black">{publishedPosts.length}</span>
                </button>
                <button
                  onClick={() => setActiveStatTab('new')}
                  className={`w-full flex justify-between border-b border-white/10 pb-3 hover:bg-white/10 p-2 rounded-xl transition-all ${activeStatTab === 'new' ? 'bg-white/20' : ''}`}
                >
                  <span className="text-blue-100 font-bold">New This Month</span>
                  <span className="font-black">{newThisMonth.length}</span>
                </button>
                <button
                  onClick={() => setActiveStatTab('drafts')}
                  className={`w-full flex justify-between pb-3 hover:bg-white/10 p-2 rounded-xl transition-all ${activeStatTab === 'drafts' ? 'bg-white/20' : ''}`}
                >
                  <span className="text-blue-100 font-bold">Drafts</span>
                  <span className="font-black">{draftPosts.length}</span>
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeStatTab ? (
                <motionAny.div
                  key={activeStatTab}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-brand-orange/30 shadow-xl overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[9px] md:text-[10px] font-black text-brand-orange uppercase tracking-widest">
                      Previewing {activeStatTab.replace('total', 'All Published').replace('new', 'Monthly Published').replace('drafts', 'Drafts')}
                    </h3>
                    <button onClick={() => setActiveStatTab(null)} className="text-gray-400 hover:text-red-500">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {listData.length > 0 ? listData.map(p => (
                      <div
                        key={p.id}
                        onClick={() => loadArticleForEdit(p)}
                        className="flex gap-4 p-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-brand-orange/10 group"
                      >
                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-gray-900 text-xs truncate group-hover:text-brand-orange">{p.title}</h4>
                          <p className="text-[9px] font-bold text-gray-400">{p.date} • {p.category}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-xs font-bold text-gray-400 py-10">No items to show</p>
                    )}
                  </div>
                </motionAny.div>
              ) : (
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recently Published</h3>
                    <button
                      onClick={handleRestoreDefaults}
                      disabled={isSaving}
                      className="text-[10px] font-black text-brand-orange hover:text-brand-orange-hover uppercase tracking-widest disabled:opacity-50"
                    >
                      {isSaving ? 'Restoring...' : 'Restore Defaults'}
                    </button>
                  </div>
                  <div className="space-y-6">
                    {publishedPosts.slice(0, 3).map(p => (
                      <div key={p.id} className="flex gap-4">
                        <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-gray-900 text-xs truncate">{p.title}</h4>
                          <p className="text-[10px] font-bold text-gray-400">{p.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>


            <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white">
              <h4 className="font-black text-sm mb-4 flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-brand-orange"></i>
                Admin Protocol
              </h4>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                Remember to verify all housing tips with current UK Renting legislation before publishing. Nestor depends on your accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
