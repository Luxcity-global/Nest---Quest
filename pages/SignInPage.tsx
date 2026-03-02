import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, AlertCircle, Loader2 } from 'lucide-react';
import {
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import {
    auth,
    googleProvider,
    twitterProvider,
    getUserProfile,
    saveUserProfile
} from '../firebase';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import { SocialSignUpModal } from '../components/SocialSignUpModal';
import { toast } from 'sonner';

export const SignInPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [isSocialSignUpOpen, setIsSocialSignUpOpen] = useState(false);
    const [socialUser, setSocialUser] = useState<any>(null);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const profile = await getUserProfile(userCredential.user.uid);

            if (profile) {
                toast.success('Welcome back!');
                navigate('/');
            } else {
                // This shouldn't happen with email/password if sign-up flow is followed,
                // but as a fallback, we could trigger profile creation.
                setError('User profile not found.');
            }
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email format');
            } else {
                setError('An error occurred during sign in');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignIn = async (provider: any) => {
        setSocialLoading(true);
        setError(null);

        try {
            const result = await signInWithPopup(auth, provider);
            const profile = await getUserProfile(result.user.uid);

            if (profile) {
                toast.success(`Welcome back, ${profile.displayName}!`);
                navigate('/');
            } else {
                setSocialUser(result.user);
                setIsSocialSignUpOpen(true);
            }
        } catch (err: any) {
            console.error(err);
            setError('Social sign in failed. Please try again.');
        } finally {
            setSocialLoading(false);
        }
    };

    const handleSocialSignUpSubmit = async (data: { displayName: string; university: string }) => {
        if (!socialUser) return;

        setSocialLoading(true);
        try {
            const profileData = {
                name: socialUser.displayName || data.displayName,
                displayName: data.displayName,
                email: socialUser.email,
                university: data.university,
                createdAt: new Date().toISOString(),
            };
            await saveUserProfile(socialUser.uid, profileData);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to save profile');
        } finally {
            setSocialLoading(false);
            setIsSocialSignUpOpen(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: 'url("/assets/signin-bg.png")' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#146C9E]/75 to-[#DC5F12]/65"></div>

            <div className="relative z-10 w-full max-w-[450px] bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Brand Block */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#DC5F12] rounded-full flex items-center justify-center mb-3 shadow-lg">
                        <Home className="text-white w-8 h-8" />
                    </div>
                    <h1 className="font-heading text-lg font-bold text-[#146C9E]">Nest Quest</h1>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Find your ideal home near campus</p>
                </div>

                {/* Welcome Text */}
                <div className="text-center mb-8">
                    <h2 className="font-heading text-xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-xs text-[#717182]">Sign in to find your perfect student housing</p>
                </div>

                {/* Error Block */}
                {error && (
                    <div className="mb-6 p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl flex items-center gap-3 text-[#991b1b] text-xs animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Sign In Form */}
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold font-heading text-gray-700 uppercase tracking-tight">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@university.edu"
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold font-heading text-gray-700 uppercase tracking-tight">Password</label>
                            <button
                                type="button"
                                onClick={() => setIsForgotOpen(true)}
                                className="text-xs font-semibold text-[#146C9E] hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button-primary mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Signing In...
                            </>
                        ) : 'Sign In'}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-gray-400 font-medium">or</span>
                    </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <button
                        onClick={() => handleSocialSignIn(googleProvider)}
                        disabled={socialLoading}
                        className="auth-button-social"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-sm">Google</span>
                    </button>
                    <button
                        onClick={() => handleSocialSignIn(twitterProvider)}
                        disabled={socialLoading}
                        className="auth-button-social"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#1DA1F2" d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.04.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                        </svg>
                        <span className="text-sm">Twitter</span>
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-[#717182]">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#146C9E] font-bold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>

            <ForgotPasswordModal
                isOpen={isForgotOpen}
                onClose={() => setIsForgotOpen(false)}
            />

            <SocialSignUpModal
                isOpen={isSocialSignUpOpen}
                onClose={() => setIsSocialSignUpOpen(false)}
                onSubmit={handleSocialSignUpSubmit}
                defaultEmail={socialUser?.email}
                loading={socialLoading}
            />
        </div>
    );
};
