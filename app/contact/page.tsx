'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, Briefcase, Users } from 'lucide-react'
import { Currency } from '@/types'
import { AuthNavbar } from '@/components/AuthNavbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

type InquiryType = 'general' | 'support' | 'business' | 'talent'

export default function ContactPage() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'general' as InquiryType,
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const inquiryTypes = [
    { id: 'general', name: 'General Inquiry', icon: MessageSquare, description: 'Questions about our platform' },
    { id: 'support', name: 'Customer Support', icon: HelpCircle, description: 'Help with bookings or issues' },
    { id: 'business', name: 'Business Inquiry', icon: Briefcase, description: 'Partnership opportunities' },
    { id: 'talent', name: 'Talent Inquiry', icon: Users, description: 'Joining as a celebrity' },
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@torashaout.com',
      description: 'We respond within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+263 77 123 4567',
      description: 'Mon-Fri, 8am-6pm CAT'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Harare, Zimbabwe',
      description: 'By appointment only'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 8am-6pm',
      description: 'Weekend: 9am-2pm CAT'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black">
        <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Message Sent!</h1>
            <p className="text-xl text-neutral-400 mb-8">
              Thank you for reaching out. Our team will get back to you within 24 hours.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
              <Link href="/">
                <Button variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2 mb-6">
            <Mail className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Contact <span className="text-gradient-brand">Us</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            Have questions, feedback, or need assistance? We are here to help. Reach out to our team and we will get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
          {contactInfo.map((info) => {
            const Icon = info.icon
            return (
              <div key={info.title} className="bg-neutral-900 rounded-xl p-6 text-center hover:bg-neutral-800 transition">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{info.title}</h3>
                <p className="text-purple-400 font-medium mb-1">{info.details}</p>
                <p className="text-sm text-neutral-500">{info.description}</p>
              </div>
            )
          })}
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Inquiry Type Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">How can we help?</h2>
            <div className="space-y-3">
              {inquiryTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setFormData(prev => ({ ...prev, inquiryType: type.id as InquiryType }))}
                    className={`w-full text-left p-4 rounded-xl transition flex items-start gap-4 ${
                      formData.inquiryType === type.id
                        ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500'
                        : 'bg-neutral-900 border border-neutral-800 hover:border-purple-700/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      formData.inquiryType === type.id
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                        : 'bg-neutral-800'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        formData.inquiryType === type.id ? 'text-white' : 'text-neutral-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{type.name}</h3>
                      <p className="text-sm text-neutral-400">{type.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Quick Links */}
            <div className="mt-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/faq" className="flex items-center gap-3 text-neutral-400 hover:text-white transition">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                  <span>Check our FAQ</span>
                </Link>
                <Link href="/how-it-works" className="flex items-center gap-3 text-neutral-400 hover:text-white transition">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                  <span>How ToraShaout Works</span>
                </Link>
                <Link href="/business" className="flex items-center gap-3 text-neutral-400 hover:text-white transition">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <span>Business Solutions</span>
                </Link>
                <Link href="/join" className="flex items-center gap-3 text-neutral-400 hover:text-white transition">
                  <Users className="w-5 h-5 text-green-400" />
                  <span>Join as Talent</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="What is this about?"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-pink-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="privacy" className="text-sm text-neutral-400">
                    I agree to the{' '}
                    <Link href="/privacy" className="text-purple-400 hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    and consent to ToraShaout processing my data.
                  </label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Map/Location Section */}
        <div className="max-w-5xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Based in Harare, Zimbabwe</h2>
                <p className="text-neutral-300 mb-6">
                  ToraShaout is proudly Zimbabwean, connecting our local celebrities with fans around the world. Our team operates from Harare, serving customers globally.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span>Harare, Zimbabwe</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Clock className="w-5 h-5 text-pink-400" />
                    <span>CAT Timezone (UTC+2)</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-64 h-48 bg-neutral-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-neutral-400">Harare, Zimbabwe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
