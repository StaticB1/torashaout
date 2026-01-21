'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Currency } from '@/types';
import { Button } from '@/components/ui/Button';
import { NotificationCenter } from '@/components/NotificationCenter';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

interface AuthNavbarProps {
  currency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
}

export function AuthNavbar({ currency = 'USD', onCurrencyChange }: AuthNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, loading, signOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast.success('You have been signed out');
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!profile) return '/customer-dashboard';
    switch (profile.role) {
      case 'admin':
        return '/admin';
      case 'talent':
        return '/dashboard';
      default:
        return '/customer-dashboard';
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAvatar = (size: 'sm' | 'md' = 'sm') => {
    const sizeClasses = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-10 h-10 text-sm';

    if (profile?.avatar_url) {
      return (
        <Image
          src={profile.avatar_url}
          alt={profile.full_name || 'User avatar'}
          width={size === 'sm' ? 28 : 40}
          height={size === 'sm' ? 28 : 40}
          className={`${sizeClasses} rounded-full object-cover`}
        />
      );
    }

    const initials = getInitials(profile?.full_name);
    if (initials) {
      return (
        <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-medium`}>
          {initials}
        </div>
      );
    }

    return <User size={size === 'sm' ? 18 : 24} />;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-black/90 backdrop-blur-lg border-b border-purple-900/30 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center font-bold text-base sm:text-xl">
              TS
            </div>
            <span className="text-base sm:text-xl font-bold text-gradient-brand whitespace-nowrap">ToraShaout</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/browse" className="text-gray-300 hover:text-white transition">
              Browse Talent
            </Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-white transition">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition">
              About
            </Link>
            {!isAuthenticated && (
              <Link href="/join" className="text-gray-300 hover:text-white transition">
                Join as Talent
              </Link>
            )}

            {/* Currency Selector */}
            {onCurrencyChange && (
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                  className="appearance-none bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-lg px-4 py-2 pr-8 text-sm font-medium cursor-pointer hover:border-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="USD" className="bg-gray-900 text-white py-2">
                    USD ($)
                  </option>
                  <option value="ZIG" className="bg-gray-900 text-white py-2">
                    ZIG
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Notification Center - Only show when authenticated */}
            {isAuthenticated && <NotificationCenter />}

            {/* Auth Section */}
            {loading ? (
              <div className="w-20 h-9 bg-gray-800/50 rounded-lg animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-full pl-1 pr-3 py-1 hover:border-purple-400 transition"
                  id="user-menu-button"
                >
                  {renderAvatar('sm')}
                  <span className="text-sm font-medium">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </span>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-purple-700/30 rounded-lg shadow-xl z-20">
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
                        {renderAvatar('md')}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{profile?.full_name}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          href={getDashboardLink()}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard size={16} />
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleSignOut();
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition w-full text-left"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="primary">Login / Sign Up</Button>
              </Link>
            )}
          </div>

          {/* Mobile: Login button + menu button */}
          <div className="md:hidden flex items-center gap-2">
            {!loading && !isAuthenticated && (
              <Link href="/login">
                <Button size="sm" variant="primary">Login</Button>
              </Link>
            )}
            <button
              className="p-2 -mr-2 flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-purple-900/30">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated && profile && (
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-800">
                {renderAvatar('md')}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{profile.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            )}

            <Link
              href="/browse"
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Talent
            </Link>
            <Link
              href="/how-it-works"
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            {!isAuthenticated && (
              <Link
                href="/join"
                className="block text-gray-300 hover:text-white py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join as Talent
              </Link>
            )}

            {/* Currency Selector Mobile */}
            {onCurrencyChange && (
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                  className="w-full appearance-none bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-lg px-4 py-3 pr-10 font-medium cursor-pointer hover:border-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="USD" className="bg-gray-900 text-white py-2">
                    USD ($)
                  </option>
                  <option value="ZIG" className="bg-gray-900 text-white py-2">
                    ZIG
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-purple-400">
                  <svg
                    className="h-5 w-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Auth Buttons Mobile - only show for authenticated users */}
            {isAuthenticated && (
              <div className="space-y-2 pt-2">
                <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" variant="outline">
                    <LayoutDashboard size={18} className="mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
