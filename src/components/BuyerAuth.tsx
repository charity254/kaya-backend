import React, { useState } from 'react';
import { ShoppingCart, ArrowRight, Shield, ArrowLeft, Eye, EyeOff, Mail, Phone, Lock } from 'lucide-react';

interface BuyerAuthProps {
  onAuthenticated: (phoneNumber: string, isNewUser: boolean) => void;
  onBack: () => void;
}

export function BuyerAuth({ onAuthenticated, onBack }: BuyerAuthProps) {
  const [mode, setMode] = useState<'welcome' | 'signup' | 'signin'>('welcome');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  
  // Sign up form fields
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Sign in form fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // OTP
  const [otp, setOtp] = useState('');

  const handleSignUpNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // TODO: Validate email format and phone number format
    // TODO: Send OTP to phone number
    setStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Verify OTP with backend
    onAuthenticated(phoneNumber, true);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Authenticate with backend
    const phone = loginIdentifier.includes('@') ? '712345678' : loginIdentifier;
    onAuthenticated(phone, false);
  };

  // Welcome screen
  if (mode === 'welcome') {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col">
        <div className="bg-[#2d5f3f] text-white p-6 pb-12">
          <button
            onClick={onBack}
            className="mb-4 flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 mr-2" />
            <span className="text-2xl font-bold">Kilimo Trace</span>
          </div>
          <h1 className="text-xl font-bold text-center mb-2">Buyer Authentication</h1>
          <p className="text-white/80 text-sm text-center">Source verified produce with confidence</p>
        </div>

        <div className="flex-1 px-6 -mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="bg-[#2d5f3f]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-10 h-10 text-[#2d5f3f]" />
              </div>
              <h2 className="font-bold text-xl text-gray-900 mb-2">Welcome, Buyer!</h2>
              <p className="text-sm text-gray-600">
                Access traceable produce directly from verified sources
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setMode('signup');
                  setStep('form');
                }}
                className="w-full bg-[#2d5f3f] text-white rounded-xl py-4 font-semibold flex items-center justify-center space-x-2 hover:bg-[#234a32] transition-colors"
              >
                <span>Create New Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setMode('signin');
                  setStep('form');
                }}
                className="w-full bg-white border-2 border-[#2d5f3f] text-[#2d5f3f] rounded-xl py-4 font-semibold flex items-center justify-center space-x-2 hover:bg-[#2d5f3f]/5 transition-colors"
              >
                <span>Sign In to Existing Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to Kilimo Trace's Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sign Up Flow
  if (mode === 'signup') {
    if (step === 'form') {
      return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col">
          <div className="bg-[#2d5f3f] text-white p-6 pb-12">
            <button
              onClick={() => setMode('welcome')}
              className="mb-4 flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="text-sm">Back</span>
            </button>
            <div className="flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 mr-2" />
              <span className="text-2xl font-bold">Kilimo Trace</span>
            </div>
            <h1 className="text-xl font-bold text-center mb-2">Create Buyer Account</h1>
            <p className="text-white/80 text-sm text-center">Set up your account details</p>
          </div>

          <div className="flex-1 px-6 -mt-6 pb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
              <form onSubmit={handleSignUpNext}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="buyer@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex">
                      <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl px-4 py-3 flex items-center">
                        <span className="text-gray-700 font-semibold">+254</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="712345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-r-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                        pattern="[0-9]{9}"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter 9 digits (e.g., 712345678)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl pl-11 pr-11 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl pl-11 pr-11 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2d5f3f] text-white rounded-xl py-3 font-semibold flex items-center justify-center space-x-2 hover:bg-[#234a32] transition-colors mt-6"
                >
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    // OTP Verification
    if (step === 'otp') {
      return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col">
          <div className="bg-[#2d5f3f] text-white p-6 pb-12">
            <button
              onClick={() => setStep('form')}
              className="mb-4 flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="text-sm">Back</span>
            </button>
            <div className="flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 mr-2" />
              <span className="text-2xl font-bold">Kilimo Trace</span>
            </div>
            <h1 className="text-xl font-bold text-center mb-2">Verify Phone Number</h1>
            <p className="text-white/80 text-sm text-center">Enter the code sent to your phone</p>
          </div>

          <div className="flex-1 px-6 -mt-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
              <form onSubmit={handleVerifyOTP}>
                <div className="text-center mb-6">
                  <div className="bg-[#2d5f3f]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-[#2d5f3f]" />
                  </div>
                  <h2 className="font-bold text-lg text-gray-900 mb-1">Enter Verification Code</h2>
                  <p className="text-sm text-gray-600">
                    Code sent to +254{phoneNumber}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    (Demo mode: Enter any 4-digit code)
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    4-digit verification code
                  </label>
                  <input
                    type="text"
                    placeholder="0000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-3xl tracking-widest font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                    pattern="[0-9]{4}"
                    maxLength={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2d5f3f] text-white rounded-xl py-3 font-semibold flex items-center justify-center space-x-2 hover:bg-[#234a32] transition-colors"
                >
                  <span>Verify & Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  className="w-full text-gray-600 text-sm mt-3 py-2 hover:text-gray-900 transition-colors"
                >
                  Resend code
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }

  // Sign In Flow
  if (mode === 'signin') {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col">
        <div className="bg-[#2d5f3f] text-white p-6 pb-12">
          <button
            onClick={() => setMode('welcome')}
            className="mb-4 flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 mr-2" />
            <span className="text-2xl font-bold">Kilimo Trace</span>
          </div>
          <h1 className="text-xl font-bold text-center mb-2">Sign In as Buyer</h1>
          <p className="text-white/80 text-sm text-center">Access your buyer dashboard</p>
        </div>

        <div className="flex-1 px-6 -mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
            <form onSubmit={handleSignIn}>
              <div className="text-center mb-6">
                <div className="bg-[#2d5f3f]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-8 h-8 text-[#2d5f3f]" />
                </div>
                <h2 className="font-bold text-lg text-gray-900 mb-1">Welcome Back</h2>
                <p className="text-sm text-gray-600">Sign in to continue</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="email@example.com or 712345678"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-11 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2d5f3f] text-white rounded-xl py-3 font-semibold flex items-center justify-center space-x-2 hover:bg-[#234a32] transition-colors mt-6"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="w-full text-[#2d5f3f] text-sm font-semibold mt-3 py-2"
              >
                Forgot password?
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
