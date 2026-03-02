import React, { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendPasswordResetEmailWithSettings } from '../firebase';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await sendPasswordResetEmailWithSettings(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${success ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-blue/10 text-brand-blue'}`}>
                        {success ? <CheckCircle2 className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {success ? 'Check Your Email' : 'Forgot Password?'}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {success
                            ? `We've sent a password reset link to ${email}`
                            : "No worries! Enter your email and we'll send you a link to reset your password."
                        }
                    </p>
                </div>

                {!success ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="you@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#146C9E] hover:bg-[#115a82] text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Back to Sign In
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6 text-center">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <p className="text-xs text-yellow-800 leading-relaxed">
                                If you don't see the email, please check your spam folder or try again in a few minutes.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            Got It
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
