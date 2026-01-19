'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30 border border-purple-700/50 mb-4">
              <KeyRound size={32} className="text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Reset Password</h1>
            <p className="text-gray-400">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          {/* Reset Form */}
          <div className="bg-gray-900/50 border border-purple-700/30 rounded-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start space-x-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success ? (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/20 border border-green-700/50">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
                  <p className="text-gray-400 text-sm">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Click the link in the email to reset your password.
                  </p>
                </div>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-white placeholder-gray-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                {/* Back to Login */}
                <Link href="/login">
                  <Button variant="ghost" size="lg" className="w-full">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
