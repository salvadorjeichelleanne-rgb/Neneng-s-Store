import React, { useState } from 'react';
import { Store, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { SariSariIllustration } from './SariSariIllustration';

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser) {
      setErrorMessage('Please enter your username');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    // Accepts admin credentials
    const validUsers = ['admin', 'ederlyn', 'roderick', 'ederlyn salas', 'roderick salas', 'salas', 'store owner', 'aling neneng'];
    const validPasswords = ['password', 'store2024', 'admin', 'admin123'];

    if (!validUsers.includes(cleanUser) || !validPasswords.includes(password)) {
      setErrorMessage('Invalid username or password. Please try again.');
      return;
    }

    setIsSubmitting(true);
    // Simulate brief authentication verification
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(username.trim() || 'Ederlyn & Roderick Salas');
    }, 400);
  };

  return (
    <div
      id="login-screen-container"
      className="min-h-screen w-full bg-[#f4f6f8] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8"
    >
      {/* Centered White Rounded Card with Modern Shadow Effect */}
      <div
        id="login-card"
        className="w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left Column: Branding & Hero Section */}
        <div
          id="branding-hero-column"
          className="bg-amber-50/40 p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-amber-100/60"
        >
          {/* Header / Branding */}
          <div className="space-y-4">
            {/* Store Badge & Hours */}
            <div className="flex items-center justify-between gap-2">
              <div
                id="branding-store-icon"
                className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[#c2410c] shadow-xs"
              >
                <Store className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                Daily: 6:00 AM - 8:00 PM
              </span>
            </div>

            {/* Bold Primary Header in dark orange/red */}
            <div>
              <h2
                id="branding-primary-header"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#c2410c] uppercase font-sans"
              >
                SALAS STORE
              </h2>
              <p className="text-xs font-semibold text-gray-700 mt-0.5">
                Owners: Ederlyn Salas &amp; Roderick Salas
              </p>
            </div>

            {/* Subheader in bold dark text */}
            <h3
              id="branding-subheader"
              className="text-base sm:text-lg font-bold text-gray-900 leading-snug"
            >
              Customer Credit &amp; Payment Tracking System
            </h3>

            {/* Description Body Text */}
            <p
              id="branding-description-body"
              className="text-sm text-gray-600 leading-relaxed max-w-md"
            >
              Manage neighborhood store credits and payments efficiently. Built for Ederlyn &amp; Roderick Salas with accurate ledger tracking and printable receipts.
            </p>
          </div>

          {/* Hero Illustration: Colorful vector graphic of traditional sari-sari store with striped awning & palm trees */}
          <div id="hero-illustration-container" className="mt-8 pt-4">
            <SariSariIllustration className="shadow-xs" />
          </div>
        </div>

        {/* Right Column: Sign-In Form */}
        <div
          id="authentication-form-column"
          className="p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white"
        >
          <div className="max-w-md w-full mx-auto my-auto py-2">
            {/* Form Header */}
            <div className="mb-8 text-left">
              <h1
                id="form-header-title"
                className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight"
              >
                WELCOME BACK!
              </h1>
              <p
                id="form-header-subtitle"
                className="text-sm text-gray-500 mt-1.5 font-medium"
              >
                Please login to your account
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div
                id="login-error-alert"
                className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Info Message Alert */}
            {infoMessage && (
              <div
                id="login-info-alert"
                className="mb-5 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Sign-in Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Username Field */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="username-input"
                  className="block text-xs font-semibold text-gray-700 uppercase tracking-wide"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="username-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="password-input"
                  className="block text-xs font-semibold text-gray-700 uppercase tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="button"
                    id="toggle-password-visibility-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div
                id="form-options-row"
                className="flex items-center justify-between text-xs pt-1"
              >
                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 hover:text-gray-800">
                  <input
                    type="checkbox"
                    id="remember-me-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer accent-orange-600"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  id="forgot-password-link"
                  onClick={() => setInfoMessage('Please contact the store administrator to reset your password.')}
                  className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Action: Full-width bright orange/coral primary CTA button */}
              <button
                type="submit"
                id="login-submit-button"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-bold text-sm sm:text-base rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>

          {/* Footer: Small centered copyright text */}
          <footer className="pt-8 text-center">
            <p
              id="login-footer-copyright"
              className="text-xs text-gray-400 font-normal"
            >
              &copy; 2024 Salas Store &bull; Owners: Ederlyn Salas &amp; Roderick Salas. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
