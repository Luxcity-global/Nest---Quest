
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Fix: Pervasive type resolution errors in framer-motion are bypassed by casting to any.
const motionAny: any = motion;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // Create user document in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name,
          email,
          createdAt: new Date().toISOString(),
          profile: {
            university: 'University of London', // Default
            budget: 250,
            commuteType: 'walk',
            commuteTime: 20,
            lifestyle: {
              socialLevel: 3,
              cleanliness: 4,
              studyHabits: 'balanced',
              hobbies: []
            }
          }
        });
        onSuccess(name, email);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onSuccess(userCredential.user.displayName || 'Student', userCredential.user.email || '');
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setPassword('');
    setName('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motionAny.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-blue/30 backdrop-blur-sm"
      />
      <motionAny.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-10"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-brand-orange transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-orange text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-xl shadow-orange-100">
            N
          </div>
          <h2 className="text-3xl font-black text-gray-900">{isSignUp ? 'Join NestQuest' : 'Welcome Back'}</h2>
          <p className="text-gray-500 font-medium">Find your way home with NestQuest</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">First Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Aisha"
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-bold transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@student.ac.uk"
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-bold transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required={!isSignUp}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none font-bold transition-all"
            />
            {!isSignUp && (
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-black text-brand-orange hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm font-bold text-center bg-green-50 p-3 rounded-lg border border-green-100">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-orange text-white py-4 rounded-xl font-black text-lg hover:bg-brand-orange-hover transition-all shadow-xl shadow-orange-100 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <i className="fa-solid fa-circle-notch fa-spin"></i>}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 font-medium">
            {isSignUp ? 'Already have an account?' : 'New to NestQuest?'}
          </p>
          <button
            type="button"
            onClick={toggleMode}
            className="text-brand-orange font-black hover:underline mt-1"
          >
            {isSignUp ? 'Sign In' : 'Create an account'}
          </button>
        </div>
      </motionAny.div>
    </div>
  );
};
