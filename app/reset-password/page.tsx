'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { AuthNavbar } from '@/components/AuthNavbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/components/ui/Toast';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const toast = useToast();

  useEffect(() => {
    // Check if we have a valid session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    });
  }, [supabase.auth]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        toast.error(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success('Password updated successfully!');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30 border border-purple-700/50 mb-4">
              <Lock size={32} className="text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Set New Password</h1>
            <p className="text-gray-400">Enter your new password below</p>
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
                  <h3 className="text-xl font-semibold mb-2">Password Reset Successful!</h3>
                  <p className="text-gray-400 text-sm">
                    Your password has been updated. Redirecting to login...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-white placeholder-gray-500"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-white placeholder-gray-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Use at least 6 characters with a mix of letters and numbers
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>

                {/* Back to Login */}
                <Link href="/login">
                  <Button variant="ghost" size="lg" className="w-full">
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
