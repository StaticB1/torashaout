'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, HelpCircle, Video, CreditCard, Shield, Clock, RefreshCw, Users } from 'lucide-react'
import { Currency } from '@/types'
import { AuthNavbar } from '@/components/AuthNavbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'booking', name: 'Booking', icon: Video },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'delivery', name: 'Delivery', icon: Clock },
    { id: 'refunds', name: 'Refunds', icon: RefreshCw },
    { id: 'talent', name: 'For Talent', icon: Users },
  ]

  const faqs: FAQ[] = [
    // General
    {
      id: 'what-is-torashaout',
      category: 'general',
      question: 'What is ToraShaout?',
      answer: 'ToraShaout is Zimbabwe\'s premier platform for booking personalized video messages from your favorite celebrities. Whether it\'s a birthday, anniversary, graduation, or just because, you can get a custom video shoutout from musicians, comedians, athletes, and other popular figures.'
    },
    {
      id: 'how-it-works',
      category: 'general',
      question: 'How does ToraShaout work?',
      answer: 'It\'s simple! Browse our roster of celebrities, select your favorite, fill out a booking form with details about what you\'d like them to say, complete payment, and wait for your personalized video. Most videos are delivered within 24-72 hours.'
    },
    {
      id: 'who-can-use',
      category: 'general',
      question: 'Who can use ToraShaout?',
      answer: 'Anyone! You can book videos for yourself, as gifts for friends and family, or even for business purposes like employee recognition or marketing campaigns. Our platform is accessible worldwide.'
    },
    {
      id: 'available-celebrities',
      category: 'general',
      question: 'What types of celebrities are available?',
      answer: 'We feature Zimbabwe\'s top talent across multiple categories including musicians, comedians, gospel artists, sports personalities, actors, influencers, and more. Our roster is constantly growing with new verified celebrities joining regularly.'
    },

    // Booking
    {
      id: 'booking-process',
      category: 'booking',
      question: 'How do I book a video?',
      answer: 'Select a celebrity from our browse page, click "Book Now", fill in the recipient\'s details and your message instructions, choose your payment method, and complete checkout. You\'ll receive an email confirmation immediately.'
    },
    {
      id: 'what-to-include',
      category: 'booking',
      question: 'What should I include in my booking request?',
      answer: 'Be specific! Include names (with pronunciation if needed), the occasion, any inside jokes or special mentions, and what you\'d like the celebrity to say. The more details you provide, the more personalized your video will be.'
    },
    {
      id: 'video-length',
      category: 'booking',
      question: 'How long are the videos?',
      answer: 'Videos typically range from 30 seconds to 2 minutes, depending on the complexity of your request and the celebrity\'s style. Most aim for around 60-90 seconds to ensure a meaningful, personalized message.'
    },
    {
      id: 'book-for-myself',
      category: 'booking',
      question: 'Can I book a video for myself?',
      answer: 'Absolutely! While many people gift videos to others, you can definitely request one for yourself. It\'s a great way to get motivation, encouragement, or just a personal message from someone you admire.'
    },
    {
      id: 'multiple-people',
      category: 'booking',
      question: 'Can I request a video for multiple people?',
      answer: 'Yes! When filling out your booking form, you can mention multiple recipients. Just make sure to include all names and details in the instructions section. Note that this doesn\'t affect the price - you pay the same rate regardless.'
    },
    {
      id: 'business-bookings',
      category: 'booking',
      question: 'Can I book videos for business purposes?',
      answer: 'Yes! Many businesses use our platform for employee recognition, customer appreciation, marketing campaigns, and corporate events. For bulk bookings or special business arrangements, please contact our business team.'
    },

    // Payment
    {
      id: 'payment-methods',
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept Paynow (EcoCash, OneMoney) for local payments, international credit/debit cards via Stripe, and Innbucks for USD transactions. All payments are secure and encrypted using industry-standard protocols.'
    },
    {
      id: 'currency-options',
      category: 'payment',
      question: 'What currencies can I pay in?',
      answer: 'You can pay in USD or ZIG (Zimbabwe Gold). Prices are displayed in both currencies, and you can toggle between them using the currency selector in the navigation bar.'
    },
    {
      id: 'payment-security',
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Yes! We use industry-leading payment processors (Paynow and Stripe) that comply with PCI-DSS standards. We never store your full credit card details on our servers. All transactions are encrypted and secure.'
    },
    {
      id: 'payment-timing',
      category: 'payment',
      question: 'When am I charged?',
      answer: 'You\'re charged immediately when you complete your booking. However, if your video isn\'t delivered within 7 days, you\'ll automatically receive a full refund. Celebrities only receive payment after they deliver your video.'
    },
    {
      id: 'payment-failed',
      category: 'payment',
      question: 'What if my payment fails?',
      answer: 'If your payment fails, you\'ll see an error message with details. Common issues include insufficient funds, incorrect card details, or bank restrictions. You can try again with a different payment method. Contact support if problems persist.'
    },

    // Delivery
    {
      id: 'delivery-time',
      category: 'delivery',
      question: 'How long does it take to receive my video?',
      answer: 'Most videos are delivered within 24-72 hours. Each celebrity has their own response time displayed on their profile. If your video isn\'t delivered within 7 days, you\'ll automatically receive a full refund.'
    },
    {
      id: 'delivery-notification',
      category: 'delivery',
      question: 'How will I know when my video is ready?',
      answer: 'You\'ll receive an email notification as soon as your video is delivered. You can also check the status anytime by visiting your booking page. We recommend checking your spam folder if you don\'t see the email.'
    },
    {
      id: 'video-format',
      category: 'delivery',
      question: 'What format is the video?',
      answer: 'Videos are delivered in MP4 format in HD quality (1080p), optimized for sharing on social media and viewing on any device. The file size typically ranges from 20-100MB depending on length.'
    },
    {
      id: 'download-video',
      category: 'delivery',
      question: 'Can I download my video?',
      answer: 'Yes! Once delivered, you can download your video from your booking page. The video is yours to keep forever. You can download it multiple times and share it anywhere you like.'
    },
    {
      id: 'video-ownership',
      category: 'delivery',
      question: 'Who owns the video?',
      answer: 'You own the video for personal use. You can download, share, and post it on social media. However, you cannot use it for commercial purposes or resell it without written permission from the celebrity.'
    },
    {
      id: 'share-video',
      category: 'delivery',
      question: 'Can I share my video on social media?',
      answer: 'Absolutely! We encourage you to share your videos on social media. When booking, you can choose to make your video public, which may allow it to be featured on the celebrity\'s profile (with your permission).'
    },

    // Refunds
    {
      id: 'refund-policy',
      category: 'refunds',
      question: 'What is your refund policy?',
      answer: 'We offer a 100% money-back guarantee. You can request a refund if: (1) your video isn\'t delivered within 7 days, (2) the video doesn\'t meet your expectations or match your request, or (3) the celebrity declines your request. Refunds are processed within 5-10 business days.'
    },
    {
      id: 'request-refund',
      category: 'refunds',
      question: 'How do I request a refund?',
      answer: 'Visit your booking page and click the "Request Refund" button, or contact our support team at info@torashaout.com with your booking ID. We\'ll review your request within 24 hours and process approved refunds immediately.'
    },
    {
      id: 'celebrity-decline',
      category: 'refunds',
      question: 'What if the celebrity declines my request?',
      answer: 'If a celebrity declines your request (which is rare), you\'ll receive an automatic full refund within 24 hours. Celebrities may decline for various reasons, such as the request not aligning with their brand or containing inappropriate content.'
    },
    {
      id: 'not-satisfied',
      category: 'refunds',
      question: 'What if I\'m not satisfied with my video?',
      answer: 'If the video doesn\'t meet your expectations or doesn\'t match your request, contact us within 30 days of delivery. We\'ll review your case and either request a redo from the celebrity or issue a full refund.'
    },

    // For Talent
    {
      id: 'join-as-talent',
      category: 'talent',
      question: 'How can I join ToraShaout as talent?',
      answer: 'If you\'re a public figure or content creator with an established following, visit our "Join as Talent" page and submit an application. Our team reviews all applications and will contact you within 5-7 business days if you\'re a good fit.'
    },
    {
      id: 'talent-requirements',
      category: 'talent',
      question: 'What are the requirements to join as talent?',
      answer: 'We look for established public figures with a significant following and engagement on social media or in traditional media. You should be comfortable recording video messages and have a genuine desire to connect with fans.'
    },
    {
      id: 'talent-earnings',
      category: 'talent',
      question: 'How much can I earn as talent?',
      answer: 'Earnings vary based on your pricing, request volume, and engagement with the platform. You set your own price, and we take a small platform fee. Top talent can earn significant income. Contact our talent team for specific details.'
    },
    {
      id: 'set-my-price',
      category: 'talent',
      question: 'Can I set my own price?',
      answer: 'Yes! As talent, you have full control over your pricing. You can adjust your rates anytime based on demand, your schedule, and your preferences. We provide guidance and analytics to help you optimize your pricing.'
    },
    {
      id: 'talent-obligations',
      category: 'talent',
      question: 'What are my obligations as talent?',
      answer: 'You\'re expected to respond to requests within your stated response time, create personalized videos that match the booking instructions, and maintain professionalism. You can decline requests that don\'t align with your brand or values.'
    },
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Frequently Asked <span className="text-gradient-brand">Questions</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-8">
            Find answers to common questions about booking, payments, delivery, and more
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            )
          })}
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No questions found</h3>
              <p className="text-neutral-400">
                Try adjusting your search or browse a different category
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-12">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-purple-700/50 transition"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4"
                  >
                    <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedId === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-neutral-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Still Need Help Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-8 md:p-12 text-center">
            <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-neutral-300 mb-8">
              Our support team is available 24/7 to assist you with any questions or concerns
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Contact Support
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
          <Link href="/browse" className="bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition">
            <Video className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-semibold mb-2">Browse Talent</h3>
            <p className="text-sm text-neutral-400">
              Explore our roster of celebrities
            </p>
          </Link>
          <Link href="/join" className="bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition">
            <Users className="w-8 h-8 text-pink-400 mb-3" />
            <h3 className="font-semibold mb-2">Join as Talent</h3>
            <p className="text-sm text-neutral-400">
              Become a talent on ToraShaout
            </p>
          </Link>
          <Link href="/business" className="bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition">
            <Shield className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold mb-2">For Business</h3>
            <p className="text-sm text-neutral-400">
              Learn about business solutions
            </p>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
