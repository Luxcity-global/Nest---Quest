
import React from 'react';
import { UserAccount } from '../types';

interface HeaderProps {
  onReset: () => void;
  onAboutClick?: () => void;
  onExplore?: () => void;
  onFaqClick?: () => void;
  onBlogClick?: () => void;
  onLegalClick?: () => void;
  onStudentPerksClick?: () => void;
  onProfileClick?: () => void;
  onSignInClick?: () => void;
  title?: string;
  transparent?: boolean;
  user?: UserAccount | null;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onAboutClick,
  onExplore,
  onFaqClick,
  onBlogClick,
  onLegalClick,
  onStudentPerksClick,
  onProfileClick,
  onSignInClick,
  title = "NestQuest",
  transparent = false,
  user
}) => {
  console.log("HEADER RENDER. User:", user);
  return (
    <header className={`${transparent ? 'absolute top-0 left-0 w-full' : 'fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm'} z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center sm:justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onReset}
        >
          <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
            <span className="text-xl font-extrabold">N</span>
          </div>
          <span className={`text-2xl font-black tracking-tight ${transparent ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </span>
        </div>

        <nav className={`hidden lg:flex items-center gap-6 text-sm font-bold ${transparent ? 'text-white' : 'text-gray-600'}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              onAboutClick?.();
            }}
            className="hover:text-brand-orange transition-colors"
          >
            About
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onBlogClick?.();
            }}
            className="hover:text-brand-orange transition-colors"
          >
            Blog
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onLegalClick?.();
            }}
            className="hover:text-brand-orange transition-colors"
          >
            Legal Guide
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onStudentPerksClick?.();
            }}
            className="hover:text-brand-orange transition-colors"
          >
            Student Perks
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onFaqClick?.();
            }}
            className="hover:text-brand-orange transition-colors"
          >
            FAQ
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onExplore?.();
            }}
            className="hover:text-brand-orange transition-colors"
          >
            Explore UK
          </button>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={onProfileClick}
              className="flex items-center gap-3 group"
            >
              <div className={`hidden sm:block text-right ${transparent ? 'text-white' : 'text-gray-900'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Welcome back</p>
                <p className="text-sm font-black">{user.name}</p>
              </div>
              <div className="w-10 h-10 bg-brand-orange text-white rounded-xl flex items-center justify-center font-black shadow-lg transition-transform group-hover:scale-105">
                {user.name[0]}
              </div>
            </button>
          ) : (
            <>
              <button
                onClick={onSignInClick}
                className={`hidden sm:block text-sm font-black ${transparent ? 'text-white' : 'text-gray-700'} hover:text-brand-orange transition-colors`}
              >
                Log In
              </button>
              <button
                onClick={onSignInClick}
                className="bg-brand-orange text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-brand-orange-hover transition-all shadow-lg shadow-orange-100"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
