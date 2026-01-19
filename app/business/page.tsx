'use client'

import { useState } from 'react'
import { Briefcase, Users, TrendingUp, Award, Gift, Megaphone, CheckCircle, ArrowRight, Sparkles, Target, BarChart3, Heart } from 'lucide-react'
import { Currency } from '@/types'
import { AuthNavbar } from '@/components/AuthNavbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function BusinessPage() {
  const [currency, setCurrency] = useState<Currency>('USD')

  const useCases = [
    {
      icon: Users,
      title: 'Employee Recognition',
      description: 'Celebrate milestones, achievements, and work anniversaries with personalized celebrity shoutouts that make employees feel valued.',
      examples: [
        'New hire welcomes',
        'Work anniversary celebrations',
        'Performance awards',
        'Retirement tributes'
      ]
    },
    {
      icon: Heart,
      title: 'Customer Appreciation',
      description: 'Strengthen customer relationships by surprising top clients with exclusive celebrity messages that show genuine appreciation.',
      examples: [
        'VIP customer thank you',
        'Milestone celebrations',
        'Loyalty rewards',
        'Apology videos'
      ]
    },
    {
      icon: Megaphone,
      title: 'Marketing Campaigns',
      description: 'Amplify your brand message with authentic celebrity endorsements that resonate with your target audience.',
      examples: [
        'Product launches',
        'Brand partnerships',
        'Social media content',
        'Event promotions'
      ]
    },
    {
      icon: Gift,
      title: 'Corporate Gifting',
      description: 'Replace traditional corporate gifts with memorable video experiences that recipients will treasure forever.',
      examples: [
        'Holiday greetings',
        'Client appreciation',
        'Partner thank yous',
        'Conference giveaways'
      ]
    },
    {
      icon: Target,
      title: 'Event Experiences',
      description: 'Elevate your corporate events with surprise celebrity appearances via personalized video messages.',
      examples: [
        'Conference openings',
        'Award ceremonies',
        'Team building events',
        'Product launches'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Sales Incentives',
      description: 'Motivate your sales team with celebrity shoutouts as rewards for hitting targets and closing deals.',
      examples: [
        'Top performer awards',
        'Quota celebrations',
        'Contest prizes',
        'Motivation boosts'
      ]
    }
  ]

  const benefits = [
    {
      icon: Sparkles,
      title: 'Memorable Impact',
      description: 'Stand out from generic corporate communications with personalized celebrity messages that create lasting impressions.'
    },
    {
      icon: BarChart3,
      title: 'Measurable Engagement',
      description: 'Track video views, shares, and engagement metrics to measure the ROI of your celebrity campaigns.'
    },
    {
      icon: Award,
      title: 'Premium Branding',
      description: 'Associate your brand with Zimbabwe\'s top celebrities and enhance your company\'s prestige and credibility.'
    },
    {
      icon: CheckCircle,
      title: 'Hassle-Free',
      description: 'No contracts, no negotiations, no logistics. Simply book, pay, and receive your video within days.'
    }
  ]

  const features = [
    {
      title: 'Bulk Booking Discounts',
      description: 'Save on large orders with volume pricing for 10+ videos'
    },
    {
      title: 'Dedicated Account Manager',
      description: 'Get personalized support for your business needs'
    },
    {
      title: 'Priority Delivery',
      description: 'Fast-track your orders for urgent campaigns'
    },
    {
      title: 'Custom Branding Options',
      description: 'Add your logo or brand elements to videos (premium)'
    },
    {
      title: 'Usage Rights',
      description: 'Commercial usage licenses available for marketing content'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Track engagement and measure campaign performance'
    }
  ]

  const testimonials = [
    {
      company: 'TechHub Zimbabwe',
      logo: '🚀',
      quote: 'We used ToraShaout to recognize our Employee of the Month with a shoutout from their favorite musician. The impact on team morale was incredible!',
      author: 'Sarah Moyo',
      role: 'HR Director'
    },
    {
      company: 'Delta Beverages',
      logo: '🍺',
      quote: 'For our product launch, we partnered with local celebrities through ToraShaout. The authentic endorsements helped us reach millions on social media.',
      author: 'Tendai Chikwanha',
      role: 'Marketing Manager'
    },
    {
      company: 'EcoCash',
      logo: '💳',
      quote: 'We surprised our top 50 merchants with personalized thank you videos from a popular comedian. It was more memorable than any gift card we could have sent.',
      author: 'Rudo Masunda',
      role: 'Merchant Relations Lead'
    }
  ]

  const pricingTiers = [
    {
      name: 'Starter',
      description: 'Perfect for small teams',
      range: '1-9 videos',
      discount: 'Standard pricing',
      features: [
        'All platform features',
        'Email support',
        'Basic analytics',
        'Personal use rights'
      ]
    },
    {
      name: 'Growth',
      description: 'For growing companies',
      range: '10-49 videos',
      discount: '10% discount',
      features: [
        'Everything in Starter',
        'Priority support',
        'Advanced analytics',
        'Account manager',
        'Volume discount'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      range: '50+ videos',
      discount: 'Custom pricing',
      features: [
        'Everything in Growth',
        'Dedicated account manager',
        'Custom contracts',
        'Commercial usage rights',
        'White-label options',
        'API access'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2 mb-6">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">ToraShaout for Business</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Elevate Your Business with <span className="text-gradient-brand">Celebrity Power</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-8">
            From employee recognition to marketing campaigns, leverage Zimbabwe's top celebrities to create memorable experiences that drive engagement and results.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="#contact-sales">
              <Button size="lg">
                Contact Sales
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline">
                Browse Talent
              </Button>
            </Link>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Businesses Use ToraShaout</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Discover creative ways to integrate celebrity messages into your business strategy
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => {
              const Icon = useCase.icon
              return (
                <div key={useCase.title} className="bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                  <p className="text-neutral-400 mb-4">{useCase.description}</p>
                  <div className="space-y-2">
                    {useCase.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-neutral-500">
                        <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ToraShaout for Business</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div key={benefit.title} className="bg-neutral-900 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-neutral-400">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Business Features</h2>
              <p className="text-xl text-neutral-300">
                Everything you need to run successful celebrity campaigns at scale
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-neutral-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Business Pricing</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Flexible plans that scale with your needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl p-8 ${
                  tier.popular
                    ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500 relative'
                    : 'bg-neutral-900 border border-neutral-800'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-neutral-400 text-sm mb-4">{tier.description}</p>
                <div className="mb-4">
                  <div className="text-3xl font-bold mb-1">{tier.range}</div>
                  <div className="text-purple-400 font-semibold">{tier.discount}</div>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="#contact-sales">
                  <Button
                    variant={tier.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Businesses Say</h2>
            <p className="text-xl text-neutral-400">
              See how companies are using ToraShaout to drive results
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.company} className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-2xl">
                    {testimonial.logo}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.company}</div>
                  </div>
                </div>
                <p className="text-neutral-300 mb-4 leading-relaxed">"{testimonial.quote}"</p>
                <div className="text-sm">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-neutral-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Study Preview */}
        <div className="mb-20">
          <div className="bg-neutral-900 rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="p-8 md:p-12">
                <div className="inline-block bg-green-600/20 text-green-400 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Case Study
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  How Delta Increased Social Engagement by 340%
                </h2>
                <p className="text-neutral-400 mb-6">
                  Learn how Delta Beverages partnered with 5 local celebrities to launch their new product line, generating over 2 million impressions in just one week.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-neutral-300">2M+ social media impressions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-neutral-300">340% increase in engagement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-neutral-300">50,000+ video shares</span>
                  </li>
                </ul>
                <Button variant="outline">
                  Read Full Case Study
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 md:p-12 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="text-6xl md:text-8xl font-bold mb-4">340%</div>
                  <div className="text-xl font-semibold">Social Engagement Increase</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Sales Section */}
        <div id="contact-sales" className="mb-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-xl text-neutral-300">
                  Speak with our business team to discuss your needs and create a custom package
                </p>
              </div>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Work Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+263 ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">How many videos do you need?</label>
                  <select className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>1-9 videos</option>
                    <option>10-49 videos</option>
                    <option>50+ videos</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tell us about your project</label>
                  <textarea
                    rows={4}
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your use case, timeline, and any specific requirements..."
                  ></textarea>
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Contact Sales Team
                </Button>
                <p className="text-sm text-neutral-500 text-center">
                  By submitting this form, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Business FAQ</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                q: 'Can we get commercial usage rights?',
                a: 'Yes! For an additional fee, you can purchase commercial usage rights to use videos in marketing materials, advertisements, and promotional content. Contact our sales team for pricing.'
              },
              {
                q: 'Do you offer invoicing for businesses?',
                a: 'Yes, we provide invoicing for business accounts. You can pay via bank transfer, credit card, or Paynow. Net-30 payment terms available for verified businesses.'
              },
              {
                q: 'Can we add our company logo to videos?',
                a: 'Custom branding options are available for Enterprise customers. This includes adding your logo, branded intro/outro, and custom graphics to celebrity videos.'
              },
              {
                q: 'What if we need videos urgently?',
                a: 'Priority delivery is available for business customers. We can fast-track your orders to ensure delivery within 24-48 hours for urgent campaigns.'
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

      <Footer />
    </div>
  )
}
