import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SocialSignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { displayName: string; university: string }) => void;
    defaultEmail?: string;
    loading: boolean;
}

export const SocialSignUpModal: React.FC<SocialSignUpModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    defaultEmail,
    loading
}) => {
    const [displayName, setDisplayName] = useState('');
    const [university, setUniversity] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName || !university) {
            setError('Please fill in all fields');
            return;
        }
        onSubmit({ displayName, university });
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
                    <p className="text-sm text-gray-500">Just a couple more details to get you started</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800 text-xs">
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Display Name</label>
                        <input
                            type="text"
                            className="auth-input"
                            placeholder="How others will see you"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">University</label>
                        <input
                            type="text"
                            className="auth-input"
                            placeholder="Your university name"
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button-primary"
                    >
                        {loading ? 'Saving...' : 'Continue'}
                    </button>
                </form>

                {defaultEmail && (
                    <p className="mt-6 text-center text-xs text-gray-400">
                        Signing in as <span className="font-medium">{defaultEmail}</span>
                    </p>
                )}
            </div>
        </div>
    );
};
