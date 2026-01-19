'use client'

import { useState } from 'react'
import { Search, CreditCard, Video, Download, CheckCircle, Clock, Shield, Star } from 'lucide-react'
import { Currency } from '@/types'
import { AuthNavbar } from '@/components/AuthNavbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HowItWorksPage() {
  const [currency, setCurrency] = useState<Currency>('USD')

  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Browse & Select',
      description: 'Browse through our curated list of Zimbabwe\'s top celebrities. From musicians to sports legends, find the perfect talent for your occasion.',
      details: [
        'Filter by category (Musicians, Comedians, Sports, etc.)',
        'View prices in USD or ZIG',
        'Check response times and ratings',
        'Read reviews from other fans'
      ]
    },
    {
      number: '02',
      icon: CreditCard,
      title: 'Book & Pay',
      description: 'Tell us about your request and complete your booking. Provide details about the occasion and what you\'d like the celebrity to say.',
      details: [
        'Fill in recipient details',
        'Choose your occasion',
        'Write personalized instructions',
        'Secure payment via Paynow, Stripe, or Innbucks'
      ]
    },
    {
      number: '03',
      icon: Video,
      title: 'Talent Creates',
      description: 'Your chosen celebrity receives your request and records a personalized video message just for you or your loved one.',
      details: [
        'Typical response time: 24-72 hours',
        'HD quality video recording',
        'Authentic and personal message',
        'Email notification when ready'
      ]
    },
    {
      number: '04',
      icon: Download,
      title: 'Receive & Share',
      description: 'Get notified when your video is ready. Download, share, and make someone\'s day unforgettable!',
      details: [
        'Download in HD quality',
        'Share on social media',
        'Keep forever',
        '100% money-back guarantee'
      ]
    }
  ]

  const faqs = [
    {
      question: 'How long does it take to receive my video?',
      answer: 'Most videos are delivered within 24-72 hours. Each celebrity has their own response time displayed on their profile. If your video isn\'t delivered within 7 days, you\'ll receive a full refund automatically.'
    },
    {
      question: 'What can I ask for in my video?',
      answer: 'You can request birthday wishes, congratulations, motivational messages, thank you notes, or just about anything positive! Be specific about what you\'d like them to say, include names, inside jokes, or special mentions.'
    },
    {
      question: 'Can I request a video for myself?',
      answer: 'Absolutely! While many people gift these videos to others, you can definitely request one for yourself. It\'s a great way to get personalized motivation or a special message from your favorite celebrity.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Paynow (EcoCash, OneMoney), Innbucks for USD payments, and international credit/debit cards via Stripe. All payments are secure and processed through industry-standard payment gateways.'
    },
    {
      question: 'What if I\'m not satisfied with my video?',
      answer: 'We offer a 100% money-back guarantee. If the video doesn\'t meet your expectations or if the talent doesn\'t fulfill the request as specified, you can request a refund within 30 days of delivery.'
    },
    {
      question: 'Can I make the video public?',
      answer: 'Yes! When booking, you can choose to make your video public. Public videos may be featured on the celebrity\'s profile (with your permission) and can help other fans see what to expect.'
    }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'All transactions are encrypted and processed through trusted payment gateways'
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Most videos delivered within 24-72 hours, or your money back'
    },
    {
      icon: Star,
      title: 'Verified Talent',
      description: 'All celebrities are verified by our team to ensure authenticity'
    },
    {
      icon: CheckCircle,
      title: 'Money-Back Guarantee',
      description: '100% refund if your video isn\'t delivered or doesn\'t meet expectations'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            How <span className="text-gradient-brand">ToraShaout</span> Works
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            Get personalized video messages from Zimbabwe's biggest celebrities in 4 simple steps
          </p>
        </div>

        {/* Steps Section */}
        <div className="max-w-5xl mx-auto mb-20">
          {steps.map((step, index) => (
            <div key={step.number} className="relative mb-16 last:mb-0">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-12 top-24 w-0.5 h-32 bg-gradient-to-b from-purple-600 to-pink-600" />
              )}

              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Icon & Number */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <step.icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-black border-2 border-purple-500 flex items-center justify-center">
                      <span className="text-purple-400 font-bold text-sm">{step.number}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-neutral-900 rounded-xl p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">{step.title}</h2>
                  <p className="text-neutral-300 text-lg mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-400">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-neutral-300 mb-8">
              Browse our amazing roster of celebrities and book your personalized video today
            </p>
            <Link href="/browse">
              <Button size="lg">
                Browse All Talent
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose ToraShaout?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="bg-neutral-900 rounded-xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-neutral-900 rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-bold mb-3 text-purple-400">{faq.question}</h3>
                <p className="text-neutral-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-neutral-400 mb-6">
            Our support team is here to help you every step of the way
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button variant="outline">
                Contact Support
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="ghost">
                View Full FAQ
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
