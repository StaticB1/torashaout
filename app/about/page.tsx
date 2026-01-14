'use client';

import { useState } from 'react';
import { Heart, Target, Users, Zap, Globe, Shield, Award, TrendingUp, Star, CheckCircle } from 'lucide-react';
import { Currency } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  const [currency, setCurrency] = useState<Currency>('USD');

  const values = [
    {
      icon: Heart,
      title: 'Fan First',
      description: 'We put fans at the center of everything we do, creating unforgettable connections between celebrities and their supporters.'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Every talent is verified, every transaction is secure, and every video is authentic. Your trust is our foundation.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connecting Zimbabwean talent with fans worldwide, breaking geographical barriers and celebrating our culture globally.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to make celebrity connections accessible, affordable, and instant.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a vibrant ecosystem where talent thrives, fans celebrate, and everyone wins together.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in quality, service, and user experience across every interaction.'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'The Beginning',
      description: 'ToraShaout was founded with a vision to connect Zimbabwean celebrities with their fans worldwide.'
    },
    {
      year: '2025',
      title: 'Platform Launch',
      description: 'Officially launched with 50+ verified celebrities and delivered our first 1,000 personalized videos.'
    },
    {
      year: '2025',
      title: 'Growing Strong',
      description: 'Reached 500+ active talent and 10,000+ videos delivered, becoming Zimbabwe\'s leading celebrity video platform.'
    },
    {
      year: '2026',
      title: 'Looking Ahead',
      description: 'Expanding features, growing our talent roster, and building the future of fan-celebrity connections.'
    }
  ];

  const stats = [
    { value: '500+', label: 'Verified Celebrities' },
    { value: '10K+', label: 'Videos Delivered' },
    { value: '$2M+', label: 'Earned by Talent' },
    { value: '50+', label: 'Countries Reached' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '95%', label: 'Customer Satisfaction' }
  ];

  const team = [
    {
      name: 'The Founders',
      role: 'Leadership Team',
      description: 'A passionate team of entrepreneurs, technologists, and entertainment industry veterans dedicated to revolutionizing fan-celebrity connections.'
    },
    {
      name: 'Product & Engineering',
      role: 'Innovation Team',
      description: 'Building world-class technology to power seamless video creation, delivery, and payment processing across borders.'
    },
    {
      name: 'Talent Relations',
      role: 'Partnership Team',
      description: 'Working closely with celebrities and influencers to ensure they have the best experience and support on our platform.'
    },
    {
      name: 'Customer Success',
      role: 'Support Team',
      description: 'Dedicated to ensuring every fan gets their perfect video and every talent request is handled with care and professionalism.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2 mb-6">
            <Heart className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">About ToraShaout</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connecting <span className="text-gradient-brand">Stars & Fans</span> Across the Globe
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            We are on a mission to make celebrity connections accessible to everyone, celebrating Zimbabwean talent and bringing joy to fans worldwide through personalized video messages.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-neutral-900 rounded-xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient-brand mb-2">{stat.value}</div>
              <div className="text-sm text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
                </div>
              </div>
              <p className="text-xl text-neutral-300 leading-relaxed">
                To empower Zimbabwean celebrities and influencers to monetize their fame while bringing unforgettable joy to fans through personalized video messages. We believe that everyone deserves a chance to connect with their heroes, and every talent deserves a platform to engage with their community on their own terms.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Story</h2>
            <div className="space-y-6 text-lg text-neutral-300 leading-relaxed">
              <p>
                ToraShaout was born from a simple observation: fans around the world wanted meaningful connections with Zimbabwean celebrities, but there was no easy way to make it happen. Traditional fan mail was slow, meet-and-greets were expensive and limited, and social media interactions were fleeting.
              </p>
              <p>
                We saw an opportunity to bridge this gap using technology. By creating a platform where celebrities could record personalized video messages for their fans, we could deliver the magic of a personal connection at scale. No travel required, no expensive tickets, just authentic moments captured and shared.
              </p>
              <p>
                What started as an idea has grown into Zimbabwe\'s leading celebrity video platform. Today, we are proud to facilitate thousands of connections every month, helping fans celebrate special moments and enabling talent to earn income doing what they love.
              </p>
              <p>
                But we are just getting started. Our vision extends beyond video messages to building a comprehensive ecosystem where Zimbabwean talent can thrive globally, fans can engage meaningfully, and everyone benefits from the power of authentic human connection.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-neutral-400">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-neutral-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-neutral-400">
              Key milestones in our growth
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative pl-8 md:pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-full bg-purple-600/30"></div>
                  )}
                  <div className="bg-neutral-900 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-gradient-brand">{milestone.year}</span>
                      <span className="text-xl font-bold">{milestone.title}</span>
                    </div>
                    <p className="text-neutral-400">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-xl text-neutral-400">
              Passionate people building the future of fan connections
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {team.map((member, idx) => (
              <div key={idx} className="bg-neutral-900 rounded-xl p-8 hover:bg-neutral-800 transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-sm text-purple-400">{member.role}</p>
                  </div>
                </div>
                <p className="text-neutral-400">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Zimbabwe Section */}
        <div className="mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-3xl">
                  🇿🇼
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">Why Zimbabwe?</h2>
                </div>
              </div>
              <div className="space-y-4 text-lg text-neutral-300 leading-relaxed">
                <p>
                  Zimbabwe is home to incredible talent across music, comedy, gospel, sports, and entertainment. From international chart-toppers to beloved local personalities, our celebrities have captured hearts both at home and across the diaspora.
                </p>
                <p>
                  Yet connecting with these stars has always been challenging, especially for fans living abroad. ToraShaout changes that by creating a digital bridge that spans continents, making it possible for anyone, anywhere to receive a personal message from their favorite Zimbabwean celebrity.
                </p>
                <p>
                  We are proud to showcase Zimbabwean talent to the world and help our celebrities build sustainable income streams while maintaining authentic connections with their global fanbase.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Future Vision */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Looking Ahead</h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Our vision for the future of ToraShaout
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-neutral-900 rounded-xl p-8">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Expansion</h3>
              <p className="text-neutral-400">
                Expanding beyond video messages to offer live video calls, merchandise collaborations, and virtual events connecting Zimbabwean talent with global audiences.
              </p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-8">
              <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Talent Growth</h3>
              <p className="text-neutral-400">
                Building tools and resources to help our talent grow their brands, reach new audiences, and maximize their earning potential on and off the platform.
              </p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-8">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fan Experience</h3>
              <p className="text-neutral-400">
                Continuously enhancing the platform with new features, better personalization, and more ways for fans to connect with and support their favorite celebrities.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Journey</h2>
            <p className="text-xl text-neutral-300 mb-8">
              Whether you are a fan looking for that perfect gift or a celebrity wanting to connect with your audience, ToraShaout is here to make it happen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/browse">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition">
                  Browse Talent
                </button>
              </a>
              <a href="/join">
                <button className="bg-transparent border-2 border-purple-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-purple-600/20 transition">
                  Join as Talent
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
