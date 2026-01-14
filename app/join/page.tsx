'use client';

import { useState } from 'react';
import { Star, TrendingUp, Clock, Shield, DollarSign, Users, Video, CheckCircle, ArrowRight, AlertCircle, Instagram, Facebook, Youtube } from 'lucide-react';
import { Currency } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

export default function JoinPage() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    stageName: '',
    email: '',
    phone: '',
    category: '',
    bio: '',
    yearsActive: '',
    notableWork: '',
    instagramHandle: '',
    instagramFollowers: '',
    facebookPage: '',
    facebookFollowers: '',
    youtubeChannel: '',
    youtubeSubscribers: '',
    twitterHandle: '',
    tiktokHandle: '',
    proposedPrice: '',
    responseTime: '48',
    hearAboutUs: '',
    additionalInfo: '',
    agreeToTerms: false
  });

  const benefits = [
    {
      icon: DollarSign,
      title: 'Earn on Your Terms',
      description: 'Set your own rates and keep 80% of every booking. Top talent earn $5,000+ per month.',
      highlight: '80% revenue share'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Work whenever you want. Accept requests that fit your schedule and decline those that do not.',
      highlight: 'Complete control'
    },
    {
      icon: Users,
      title: 'Global Reach',
      description: 'Connect with fans worldwide, not just in Zimbabwe. Your audience is everywhere.',
      highlight: 'International exposure'
    },
    {
      icon: Shield,
      title: 'Protected Platform',
      description: 'We handle payments, protect your privacy, and provide support every step of the way.',
      highlight: 'Full support'
    },
    {
      icon: Video,
      title: 'Easy to Use',
      description: 'Simple dashboard to manage requests. Record on your phone and upload - that is it.',
      highlight: 'No technical skills needed'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Brand',
      description: 'Increase your visibility and build stronger connections with your fanbase.',
      highlight: 'Brand building'
    }
  ];

  const requirements = [
    'Established public figure with a verified social media presence',
    'Minimum 10,000+ followers on at least one social platform',
    'Active in entertainment, sports, or media industry',
    'Professional conduct and reliable communication',
    'Able to create video content on mobile or camera',
    'Zimbabwean citizen or prominent Zimbabwe-based figure'
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Apply',
      description: 'Submit your application with social media profiles and relevant information.'
    },
    {
      step: 2,
      title: 'Review',
      description: 'Our team reviews applications within 5-7 business days.'
    },
    {
      step: 3,
      title: 'Onboarding',
      description: 'Once approved, we will guide you through profile setup and platform training.'
    },
    {
      step: 4,
      title: 'Go Live',
      description: 'Start receiving requests and earning money from your fans!'
    }
  ];

  const categories = [
    'Musician',
    'Comedian',
    'Gospel Artist',
    'Actor/Actress',
    'Sports Personality',
    'Media Personality',
    'Influencer',
    'Other'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Application submitted successfully! We will review it and get back to you within 5-7 business days.');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Join ToraShaout as Talent</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Turn Your Fame into <span className="text-gradient-brand">Income</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            Connect with your fans through personalized video messages and earn money doing what you love. Join Zimbabwe's leading celebrity video platform.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-20 max-w-5xl mx-auto">
          <div className="bg-neutral-900 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
            <div className="text-sm text-neutral-400">Active Talent</div>
          </div>
          <div className="bg-neutral-900 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">$2M+</div>
            <div className="text-sm text-neutral-400">Total Earnings</div>
          </div>
          <div className="bg-neutral-900 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">10K+</div>
            <div className="text-sm text-neutral-400">Videos Created</div>
          </div>
          <div className="bg-neutral-900 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">80%</div>
            <div className="text-sm text-neutral-400">Revenue Share</div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join ToraShaout?</h2>
            <p className="text-xl text-neutral-400">
              Everything you need to monetize your influence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="inline-block bg-purple-600/20 text-purple-400 text-xs font-semibold px-2 py-1 rounded mb-3">
                    {benefit.highlight}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-neutral-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-neutral-400">
              Simple process to get started
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-neutral-900 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-400">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 text-purple-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Requirements</h2>
              <p className="text-neutral-300 text-center mb-8">
                To ensure quality and authenticity, we look for the following in our talent:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {requirements.map((requirement, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-300">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-900 rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Apply to Join</h2>
                <p className="text-neutral-400">
                  Fill out the application below. We will review and get back to you within 5-7 business days.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">1</div>
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Stage Name / Professional Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.stageName}
                      onChange={(e) => handleInputChange('stageName', e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="The name your fans know you by"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+263 ..."
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="pt-6 border-t border-neutral-800">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">2</div>
                    Professional Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Years Active *</label>
                      <input
                        type="number"
                        required
                        value={formData.yearsActive}
                        onChange={(e) => handleInputChange('yearsActive', e.target.value)}
                        className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="5"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Bio / About You *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tell us about your career, achievements, and what makes you unique..."
                    ></textarea>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Notable Work / Achievements *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.notableWork}
                      onChange={(e) => handleInputChange('notableWork', e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Albums, shows, awards, media appearances, etc."
                    ></textarea>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-6 border-t border-neutral-800">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">3</div>
                    Social Media Presence
                  </h3>
                  <p className="text-sm text-neutral-400 mb-4">
                    Provide at least one platform with 10,000+ followers
                  </p>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <Instagram className="w-4 h-4" />
                          Instagram Handle
                        </label>
                        <input
                          type="text"
                          value={formData.instagramHandle}
                          onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                          className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="@yourhandle"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Followers</label>
                        <input
                          type="number"
                          value={formData.instagramFollowers}
                          onChange={(e) => handleInputChange('instagramFollowers', e.target.value)}
                          className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="50000"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <Facebook className="w-4 h-4" />
                          Facebook Page
                        </label>
                        <input
                          type="text"
                          value={formData.facebookPage}
                          onChange={(e) => handleInputChange('facebookPage', e.target.value)}
                          className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="facebook.com/yourpage"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Followers</label>
                        <input
                          type="number"
                          value={formData.facebookFollowers}
                          onChange={(e) => handleInputChange('facebookFollowers', e.target.value)}
                          className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="50000"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <Youtube className="w-4 h-4" />
                          YouTube Channel
                        </label>
                        <input
                          type="text"
                          value={formData.youtubeChannel}
                          onChange={(e) => handleInputChange('youtubeChannel', e.target.value)}
                          className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="youtube.com/@yourchannel"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subscribers</label>
                        <input
                          type="number"
                          value={formData.youtubeSubscribers}
                          onChange={(e) => handleInputChange('youtubeSubscribers', e.target.value)}
                          className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="50000"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Twitter/X Handle</label>
                        <input
                          type="text"
                          value={formData.twitterHandle}
                          onChange={(e) => handleInputChange('twitterHandle', e.target.value)}
                          className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="@yourhandle"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">TikTok Handle</label>
                        <input
                          type="text"
                          value={formData.tiktokHandle}
                          onChange={(e) => handleInputChange('tiktokHandle', e.target.value)}
                          className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="@yourhandle"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Details */}
                <div className="pt-6 border-t border-neutral-800">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">4</div>
                    Platform Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Proposed Price (USD) *</label>
                      <input
                        type="number"
                        required
                        value={formData.proposedPrice}
                        onChange={(e) => handleInputChange('proposedPrice', e.target.value)}
                        className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="50"
                        min="25"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Minimum $25. You keep 80%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Response Time *</label>
                      <select
                        required
                        value={formData.responseTime}
                        onChange={(e) => handleInputChange('responseTime', e.target.value)}
                        className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="24">24 hours</option>
                        <option value="48">48 hours</option>
                        <option value="72">72 hours (3 days)</option>
                        <option value="168">1 week</option>
                      </select>
                      <p className="text-xs text-neutral-500 mt-1">How quickly you will deliver videos</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="pt-6 border-t border-neutral-800">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">5</div>
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">How did you hear about us?</label>
                      <select
                        value={formData.hearAboutUs}
                        onChange={(e) => handleInputChange('hearAboutUs', e.target.value)}
                        className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select option</option>
                        <option value="social_media">Social Media</option>
                        <option value="friend">Friend / Colleague</option>
                        <option value="search">Search Engine</option>
                        <option value="existing_talent">Existing ToraShaout Talent</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Anything else you would like us to know?</label>
                      <textarea
                        rows={4}
                        value={formData.additionalInfo}
                        onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                        className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Optional additional information..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="pt-6 border-t border-neutral-800">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-neutral-700 bg-black/50 text-purple-600 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm text-neutral-300">
                      I agree to ToraShaout Terms of Service and Privacy Policy. I understand that my application will be reviewed and I will be contacted within 5-7 business days. *
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button type="submit" size="lg" className="flex-1">
                    Submit Application
                  </Button>
                </div>

                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-neutral-300">
                    <p className="font-semibold mb-1">What happens next?</p>
                    <p>Our team will review your application within 5-7 business days. If approved, we will send you an email with next steps and onboarding details.</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How much can I earn?',
                  a: 'You set your own price and keep 80% of every booking. Top talent on our platform earn $5,000+ per month. Your earnings depend on your pricing, request volume, and response time.'
                },
                {
                  q: 'How do I get paid?',
                  a: 'Payments are made monthly via bank transfer, EcoCash, or international wire transfer. You will receive payment for all completed videos from the previous month.'
                },
                {
                  q: 'What if I cannot fulfill a request?',
                  a: 'You can decline any request that does not align with your brand or schedule. There is no penalty for declining. However, maintaining a high acceptance rate helps your visibility on the platform.'
                },
                {
                  q: 'Do I need professional equipment?',
                  a: 'No! A smartphone with a good camera is all you need. We provide guidelines for lighting and audio to help you create quality videos with minimal equipment.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-neutral-900 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-purple-400">{faq.q}</h3>
                  <p className="text-neutral-300">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
