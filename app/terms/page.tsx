'use client';

import { useState } from 'react';
import { Scale, FileText, AlertTriangle, Shield, Users, CreditCard, Video, Ban, Gavel, Globe, Mail, MapPin } from 'lucide-react';
import { Currency } from '@/types';
import { AuthNavbar } from '@/components/AuthNavbar';
import { Footer } from '@/components/Footer';

export default function TermsOfServicePage() {
  const [currency, setCurrency] = useState<Currency>('USD');

  const definitions = [
    { term: 'Platform', definition: 'The ToraShaout website, mobile applications, and all related services operated by ToraShaout (Pvt) Ltd.' },
    { term: 'User', definition: 'Any person who accesses or uses the Platform, including Fans and Celebrities.' },
    { term: 'Fan', definition: 'A User who purchases or requests personalised video content from Celebrities.' },
    { term: 'Celebrity/Talent', definition: 'A User who creates and provides personalised video content through the Platform.' },
    { term: 'Content', definition: 'All videos, images, text, and other materials uploaded, created, or shared on the Platform.' },
    { term: 'Services', definition: 'The celebrity video marketplace services provided by ToraShaout, including video requests, purchases, and related features.' },
  ];

  const prohibitedContent = [
    'Content that is illegal, harmful, threatening, abusive, harassing, defamatory, or discriminatory',
    'Content that infringes on intellectual property rights of others',
    'Content that is sexually explicit, pornographic, or obscene',
    'Content that promotes violence, terrorism, or illegal activities',
    'Content that contains malware, viruses, or harmful code',
    'Content that impersonates another person or entity',
    'Content that violates the privacy rights of others',
    'Content that is fraudulent, deceptive, or misleading',
    'Content that targets or exploits children in any way',
    'Content that promotes hate speech or discrimination based on race, ethnicity, religion, gender, or sexual orientation',
  ];

  const userObligations = [
    'Provide accurate and complete registration information',
    'Maintain the confidentiality of your account credentials',
    'Notify us immediately of any unauthorised use of your account',
    'Comply with all applicable laws and regulations',
    'Respect the intellectual property rights of others',
    'Use the Platform only for lawful purposes',
    'Not engage in any activity that disrupts or interferes with the Platform',
    'Not attempt to gain unauthorised access to any part of the Platform',
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2 mb-6">
            <Scale className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Terms of Service</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient-brand">Terms</span> of Service
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-8">
            Please read these terms carefully before using our platform. By accessing or using ToraShaout, you agree to be bound by these terms.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-neutral-400">
            <span className="bg-neutral-800 px-4 py-2 rounded-lg">Effective Date: 17 January 2026</span>
            <span className="bg-neutral-800 px-4 py-2 rounded-lg">Last Updated: 17 January 2026</span>
          </div>
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-3">Legal Agreement</h2>
                <p className="text-neutral-300">
                  These Terms of Service constitute a legally binding agreement between you and <strong>ToraShaout (Pvt) Ltd</strong>, a company registered in Zimbabwe and a subsidiary of StatoTech. By creating an account, accessing, or using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">1.</span> Introduction
            </h2>
            <div className="space-y-4 text-neutral-300">
              <p>
                Welcome to ToraShaout. We are a celebrity video marketplace platform that connects fans with their favourite celebrities through personalised video content. These Terms of Service ("Terms") govern your access to and use of our platform, including our website, mobile applications, and all related services.
              </p>
              <p>
                ToraShaout (Pvt) Ltd (<strong>"ToraShaout", "we", "us", "our"</strong>) operates this platform. Our registered address is 7514 Kuwadzana3, Harare, Zimbabwe. These Terms are governed by the laws of Zimbabwe.
              </p>
            </div>
          </section>

          {/* Section 2: Definitions */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">2.</span> Definitions
            </h2>
            <p className="text-neutral-300 mb-4">For the purposes of these Terms, the following definitions apply:</p>
            <div className="space-y-3">
              {definitions.map((item, idx) => (
                <div key={idx} className="bg-neutral-900 rounded-lg p-4">
                  <span className="font-semibold text-purple-400">{item.term}:</span>
                  <span className="text-neutral-300 ml-2">{item.definition}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Eligibility */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">3.</span> Eligibility
            </h2>
            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <Users className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div className="space-y-4 text-neutral-300">
                  <p>To use our Platform, you must:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Be at least 18 years of age, or at least 13 years of age with verifiable parental or guardian consent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Have the legal capacity to enter into a binding contract</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Not be prohibited from using the Platform under applicable laws</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Not have been previously suspended or removed from the Platform</span>
                    </li>
                  </ul>
                  <p>
                    By using the Platform, you represent and warrant that you meet all eligibility requirements. We reserve the right to verify your eligibility at any time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Account Registration */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">4.</span> Account Registration
            </h2>
            <div className="space-y-4 text-neutral-300">
              <p>
                To access certain features of the Platform, you must create an account. When registering, you agree to:
              </p>
              <div className="bg-neutral-900 rounded-xl p-6">
                <ul className="space-y-2">
                  {userObligations.map((obligation, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{obligation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                You are solely responsible for all activities that occur under your account. ToraShaout shall not be liable for any loss or damage arising from your failure to protect your account credentials.
              </p>
            </div>
          </section>

          {/* Section 5: Platform Services */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">5.</span> Platform Services
            </h2>
            <div className="space-y-6">
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  5.1 For Fans
                </h3>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Browse and discover celebrities on our platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Request personalised video messages from celebrities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Purchase video content for personal use or as gifts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Share received videos on social media (subject to our sharing guidelines)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Leave reviews and ratings for completed videos</span>
                  </li>
                </ul>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  5.2 For Celebrities
                </h3>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Create a profile and set your own pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Receive and fulfil video requests from fans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Receive payments for completed videos (subject to our commission structure)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Set availability and response times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Access analytics and insights about your performance</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6: Payments and Fees */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">6.</span> Payments and Fees
            </h2>
            <div className="space-y-6">
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  6.1 Pricing and Payment
                </h3>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Celebrities set their own prices for video content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>All prices are displayed in the selected currency (USD, ZAR, ZWG)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Payment is collected at the time of request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>We accept payments via EcoCash, OneMoney, bank transfer, and major credit/debit cards</span>
                  </li>
                </ul>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">6.2 Platform Commission</h3>
                <p className="text-neutral-300 mb-4">
                  ToraShaout charges a commission on each completed transaction. The current commission structure is:
                </p>
                <div className="bg-neutral-800 rounded-lg p-4">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-neutral-700">
                        <td className="py-2 text-purple-400 font-semibold">Standard Commission</td>
                        <td className="py-2 text-neutral-300 text-right">25% of video price</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-purple-400 font-semibold">Celebrity Payout</td>
                        <td className="py-2 text-neutral-300 text-right">75% of video price</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-neutral-400 text-sm mt-4">
                  Commission rates may vary based on promotional periods or special agreements. Celebrities will be notified of any changes to the commission structure.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">6.3 Refunds</h3>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Full refund if the celebrity does not fulfil the request within the specified timeframe (typically 7 days)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Refund requests for completed videos are reviewed on a case-by-case basis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>No refunds for videos that have been downloaded or shared</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Refunds are processed within 7-14 business days using the original payment method</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7: Content Guidelines */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">7.</span> Content Guidelines
            </h2>
            <div className="space-y-6">
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  7.1 Acceptable Content
                </h3>
                <p className="text-neutral-300 mb-4">
                  All content on the Platform must be appropriate for a general audience. Celebrities are expected to create professional, high-quality video content that:
                </p>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Is original and created specifically for the requesting fan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Addresses the fan's request in a meaningful way</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Meets minimum quality standards (clear audio and video)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Complies with all applicable laws and these Terms</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-400" />
                  7.2 Prohibited Content
                </h3>
                <p className="text-neutral-300 mb-4">
                  The following content is strictly prohibited on our Platform:
                </p>
                <ul className="space-y-2 text-neutral-300">
                  {prohibitedContent.map((content, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{content}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">7.3 Content Moderation</h3>
                <p className="text-neutral-300">
                  ToraShaout reserves the right to review, moderate, and remove any content that violates these Terms or our Community Guidelines. We may also suspend or terminate accounts that repeatedly violate our content policies. Users can report inappropriate content through our reporting system.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Intellectual Property */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">8.</span> Intellectual Property
            </h2>
            <div className="space-y-4 text-neutral-300">
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">8.1 Platform Ownership</h3>
                <p>
                  The Platform, including its design, features, content, and all related intellectual property rights, is owned by ToraShaout (Pvt) Ltd. You may not copy, modify, distribute, or create derivative works based on our Platform without our express written permission.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">8.2 User Content</h3>
                <p className="mb-4">
                  You retain ownership of the content you create and upload to the Platform. However, by uploading content, you grant ToraShaout a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content in connection with operating and promoting the Platform.
                </p>
                <p>
                  Celebrities grant fans a limited, personal, non-commercial license to view and share purchased videos. Commercial use of purchased videos is strictly prohibited without explicit written permission from both the celebrity and ToraShaout.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">8.3 Trademark</h3>
                <p>
                  "ToraShaout", our logo, and other ToraShaout trademarks are the property of ToraShaout (Pvt) Ltd. You may not use our trademarks without our prior written consent.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9: Disclaimers and Limitations */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">9.</span> Disclaimers and Limitations of Liability
            </h2>
            <div className="space-y-6">
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  9.1 Service Disclaimer
                </h3>
                <p className="text-neutral-300">
                  THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TORASHAOUT DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. WE DO NOT GUARANTEE THE QUALITY, ACCURACY, OR COMPLETENESS OF ANY CONTENT ON THE PLATFORM.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">9.2 Limitation of Liability</h3>
                <p className="text-neutral-300 mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, TORASHAOUT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE PLATFORM.
                </p>
                <p className="text-neutral-300">
                  Our total liability to you for any claims arising from these Terms or your use of the Platform shall not exceed the amount you paid to us in the 12 months preceding the claim.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">9.3 Third-Party Services</h3>
                <p className="text-neutral-300">
                  The Platform may contain links to third-party websites or services. ToraShaout is not responsible for the content, privacy practices, or terms of any third-party services. Your use of third-party services is at your own risk.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10: Indemnification */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">10.</span> Indemnification
            </h2>
            <div className="bg-neutral-900 rounded-xl p-6">
              <p className="text-neutral-300">
                You agree to indemnify, defend, and hold harmless ToraShaout, its parent company (StatoTech), affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or relating to:
              </p>
              <ul className="space-y-2 text-neutral-300 mt-4">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Your use of the Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Your violation of these Terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Your violation of any rights of another party</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Any content you upload or share on the Platform</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 11: Termination */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">11.</span> Termination
            </h2>
            <div className="space-y-4 text-neutral-300">
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">11.1 Termination by You</h3>
                <p>
                  You may terminate your account at any time by contacting us or using the account deletion feature in your settings. Upon termination, you will lose access to your account and any content associated with it.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">11.2 Termination by ToraShaout</h3>
                <p className="mb-4">
                  We may suspend or terminate your account at any time, with or without cause, and with or without notice. Reasons for termination may include, but are not limited to:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Violation of these Terms or our Community Guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Fraudulent or illegal activity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Extended period of inactivity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Request by law enforcement or government agencies</span>
                  </li>
                </ul>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">11.3 Effect of Termination</h3>
                <p>
                  Upon termination, your right to use the Platform will immediately cease. Any pending transactions will be handled on a case-by-case basis. Sections of these Terms that by their nature should survive termination will survive, including intellectual property provisions, disclaimers, and limitations of liability.
                </p>
              </div>
            </div>
          </section>

          {/* Section 12: Dispute Resolution */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">12.</span> Dispute Resolution
            </h2>
            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Gavel className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div className="space-y-4 text-neutral-300">
                  <p>
                    <strong>12.1 Informal Resolution:</strong> We encourage you to contact us first to resolve any disputes informally. Many issues can be resolved quickly through our customer support team.
                  </p>
                  <p>
                    <strong>12.2 Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of Zimbabwe, without regard to its conflict of law provisions.
                  </p>
                  <p>
                    <strong>12.3 Jurisdiction:</strong> Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Zimbabwe.
                  </p>
                  <p>
                    <strong>12.4 Arbitration:</strong> For disputes that cannot be resolved informally, you and ToraShaout agree to submit to binding arbitration in Harare, Zimbabwe, in accordance with the Arbitration Act [Chapter 7:15] of Zimbabwe.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 13: General Provisions */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">13.</span> General Provisions
            </h2>
            <div className="space-y-4">
              {[
                { title: '13.1 Entire Agreement', content: 'These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and ToraShaout regarding the use of the Platform.' },
                { title: '13.2 Severability', content: 'If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.' },
                { title: '13.3 Waiver', content: 'Our failure to enforce any right or provision of these Terms shall not be considered a waiver of those rights. Any waiver must be in writing and signed by ToraShaout.' },
                { title: '13.4 Assignment', content: 'You may not assign or transfer your rights or obligations under these Terms without our prior written consent. ToraShaout may assign its rights and obligations without restriction.' },
                { title: '13.5 Force Majeure', content: 'ToraShaout shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, strikes, or government actions.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-neutral-900 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">{item.title}</h4>
                  <p className="text-neutral-300">{item.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 14: Changes to Terms */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">14.</span> Changes to These Terms
            </h2>
            <div className="bg-neutral-900 rounded-xl p-6">
              <p className="text-neutral-300 mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by:
              </p>
              <ul className="space-y-2 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Posting the updated Terms on our Platform with a new "Last Updated" date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Sending you an email notification if the changes are significant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Displaying a prominent notice on our Platform</span>
                </li>
              </ul>
              <p className="text-neutral-300 mt-4">
                Your continued use of the Platform after the changes take effect constitutes your acceptance of the revised Terms. If you do not agree to the new Terms, you must stop using the Platform.
              </p>
            </div>
          </section>

          {/* Section 15: Contact Us */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">15.</span> Contact Us
            </h2>
            <p className="text-neutral-300 mb-4">
              If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us:
            </p>
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">
                <span className="text-purple-400">TORA</span><span className="text-pink-400">SHAOUT</span>
              </h3>
              <p className="font-semibold text-lg mb-4">ToraShaout (Pvt) Ltd</p>
              <div className="space-y-2 text-neutral-300">
                <p className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  7514 Kuwadzana3, Harare, Zimbabwe
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  Email: <a href="mailto:info@torashout.com" className="text-purple-400 hover:underline">info@torashout.com</a>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  Website: <a href="https://torashout.com" className="text-purple-400 hover:underline">torashout.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="text-center">
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6">
              <p className="text-neutral-300 italic">
                By using ToraShaout, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
            <p className="text-neutral-500 text-sm mt-4">
              Document Version: 1.0 | Effective: 17 January 2026
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
