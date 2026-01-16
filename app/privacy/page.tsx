'use client';

import { useState } from 'react';
import { Shield, FileText, Eye, Lock, Globe, Bell, UserCheck, Clock, Mail, Phone, MapPin } from 'lucide-react';
import { Currency } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicyPage() {
  const [currency, setCurrency] = useState<Currency>('USD');

  const definitions = [
    { term: 'Personal Information', definition: 'Information relating to an identifiable person, including names, ID numbers, email addresses, phone numbers, IP addresses, online identifiers, and biometric data.' },
    { term: 'Data Subject', definition: 'The natural person to whom personal information relates (you, the user).' },
    { term: 'Data Controller', definition: 'The person or entity that determines the purposes and means of processing personal information (ToraShaout).' },
    { term: 'Processing', definition: 'Any operation performed on personal information, including collection, storage, use, transfer, or deletion.' },
    { term: 'Consent', definition: 'Any freely given, specific, informed, and unambiguous indication of your wishes regarding the processing of your personal information.' },
    { term: 'Biometric Data', definition: 'Physiological characteristics including fingerprints, facial recognition features, palm veins, and other unique biological identifiers.' },
  ];

  const rights = [
    { right: 'Right to be Informed', description: 'You have the right to know how your personal information is collected, used, and shared.' },
    { right: 'Right of Access', description: 'You may request a copy of the personal information we hold about you.' },
    { right: 'Right to Rectification', description: 'You may request correction of inaccurate or incomplete personal information.' },
    { right: 'Right to Erasure', description: 'You may request deletion of your personal information in certain circumstances.' },
    { right: 'Right to Object', description: 'You may object to processing of your personal information, including for direct marketing.' },
    { right: 'Right to Restrict Processing', description: 'You may request that we limit how we use your personal information.' },
    { right: 'Right to Data Portability', description: 'You may request to receive your personal information in a structured, commonly used format.' },
    { right: 'Right to Withdraw Consent', description: 'Where processing is based on consent, you may withdraw it at any time.' },
  ];

  const retentionPeriods = [
    { category: 'Account Information', period: 'Duration of account + 2 years after closure' },
    { category: 'Transaction Records', period: '7 years (legal/tax requirements)' },
    { category: 'Customer Support Communications', period: '3 years from resolution' },
    { category: 'Marketing Preferences', period: 'Until consent withdrawn' },
    { category: 'Video Content (Celebrities)', period: 'Duration of agreement + 1 year' },
    { category: 'Analytics Data', period: '2 years (anonymised thereafter)' },
    { category: 'Security Logs', period: '1 year' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient-brand">Privacy</span> Policy
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-8">
            Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-neutral-400">
            <span className="bg-neutral-800 px-4 py-2 rounded-lg">Effective Date: 17 January 2026</span>
            <span className="bg-neutral-800 px-4 py-2 rounded-lg">Last Updated: 17 January 2026</span>
          </div>
        </div>

        {/* Regulatory Compliance Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-3">Regulatory Compliance Notice</h2>
                <p className="text-neutral-300">
                  This Privacy Policy is drafted in compliance with the <strong>Cyber and Data Protection Act [Chapter 12:07]</strong> of Zimbabwe, the <strong>Statutory Instrument 155 of 2024</strong> (Cyber and Data Protection (Licensing of Data Controllers and Appointment of Data Protection Officers) Regulations), and the <strong>Constitution of Zimbabwe, Article 57</strong> (Right to Privacy). ToraShaout (Pvt) Ltd is registered as a Data Controller with the Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ).
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
              <span className="text-gradient-brand">1.</span> Introduction and Scope
            </h2>
            <div className="space-y-4 text-neutral-300">
              <p>
                Welcome to ToraShaout. We are a celebrity video marketplace platform that connects fans with their favourite celebrities through personalised video content. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our platform, mobile applications, and related services.
              </p>
              <p>
                ToraShaout (Pvt) Ltd (<strong>"ToraShaout", "we", "us", "our"</strong>), a subsidiary of StatoTech, is the Data Controller responsible for your personal information. We are committed to protecting your privacy and ensuring that your personal data is processed in accordance with Zimbabwean law and international best practices.
              </p>
            </div>
          </section>

          {/* Section 2: Data Controller */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">2.</span> Data Controller Information
            </h2>
            <div className="bg-neutral-900 rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody>
                  {[
                    ['Data Controller', 'ToraShaout (Pvt) Ltd'],
                    ['Parent Company', 'StatoTech'],
                    ['Registered Address', '7514 Kuwadzana3, Harare, Zimbabwe'],
                    ['Email', 'info@torashout.com'],
                    ['Data Protection Officer', 'To Be Appointed'],
                    ['DPO Email', 'dpo@torashout.com'],
                    ['POTRAZ Registration No.', 'To Be Assigned'],
                  ].map(([label, value], idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-neutral-800' : 'bg-neutral-900'}>
                      <td className="px-4 py-3 font-semibold text-purple-400 w-1/3">{label}</td>
                      <td className="px-4 py-3 text-neutral-300">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Definitions */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">3.</span> Key Definitions
            </h2>
            <p className="text-neutral-300 mb-4">As defined under the Cyber and Data Protection Act [Chapter 12:07]:</p>
            <div className="space-y-3">
              {definitions.map((item, idx) => (
                <div key={idx} className="bg-neutral-900 rounded-lg p-4">
                  <span className="font-semibold text-purple-400">{item.term}:</span>
                  <span className="text-neutral-300 ml-2">{item.definition}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Personal Information We Collect */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">4.</span> Personal Information We Collect
            </h2>
            <p className="text-neutral-300 mb-6">
              In accordance with the principle of <strong>data minimisation</strong>, we only collect personal information that is adequate, relevant, and necessary for our stated purposes.
            </p>

            <div className="space-y-6">
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  4.1 Information You Provide Directly
                </h3>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Account Registration:</strong> Full name, email address, phone number, date of birth, username, password (encrypted), profile photograph</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Identity Verification (for Celebrities):</strong> National ID number, passport details, proof of address, bank account or mobile money details for payments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Payment Information:</strong> Mobile money details (EcoCash, OneMoney), bank account information, transaction history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Communications:</strong> Messages, video requests, customer support inquiries, feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Content:</strong> Videos uploaded by celebrities, user reviews, comments</span>
                  </li>
                </ul>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  4.2 Information Collected Automatically
                </h3>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Device Information:</strong> IP address, device type, operating system, browser type, unique device identifiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns, search queries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Location Data:</strong> General location derived from IP address (we do not collect precise GPS location without explicit consent)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Cookies and Similar Technologies:</strong> Session cookies, preference cookies, analytics cookies</span>
                  </li>
                </ul>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-400" />
                  4.3 Sensitive Personal Information
                </h3>
                <p className="text-neutral-300 mb-3">We may process the following categories of sensitive personal information with your explicit consent:</p>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Biometric Data:</strong> Facial recognition data for celebrity verification (processed with explicit consent only)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Financial Information:</strong> Payment details necessary for transactions</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Legal Basis */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">5.</span> Legal Basis for Processing
            </h2>
            <p className="text-neutral-300 mb-4">Under the Cyber and Data Protection Act, we process your personal information based on the following lawful grounds:</p>
            <div className="bg-neutral-900 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <th className="px-4 py-3 text-left font-semibold">Legal Basis</th>
                    <th className="px-4 py-3 text-left font-semibold">Purpose Examples</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Consent', 'Marketing communications, non-essential cookies, processing of sensitive data'],
                    ['Contractual Necessity', 'Account creation, providing our services, processing transactions'],
                    ['Legal Obligation', 'Tax records, responding to lawful government requests, fraud prevention'],
                    ['Legitimate Interests', 'Platform security, analytics, fraud detection, service improvement'],
                  ].map(([basis, examples], idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-neutral-800' : 'bg-neutral-900'}>
                      <td className="px-4 py-3 font-semibold text-purple-400">{basis}</td>
                      <td className="px-4 py-3 text-neutral-300">{examples}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Purpose of Processing */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">6.</span> Purpose of Processing
            </h2>
            <p className="text-neutral-300 mb-4">
              In compliance with the principle of <strong>purpose limitation</strong>, we collect personal information for specific, explicit, and legitimate purposes:
            </p>
            <div className="bg-neutral-900 rounded-xl p-6">
              <ul className="space-y-2 text-neutral-300">
                {[
                  'To create and manage your account and verify your identity',
                  'To facilitate transactions between fans and celebrities',
                  'To process payments and prevent fraud',
                  'To provide customer support and respond to inquiries',
                  'To send service-related notifications and updates',
                  'To improve our platform, develop new features, and conduct analytics',
                  'To ensure platform security and prevent misuse',
                  'To comply with legal obligations and respond to lawful requests',
                  'To enforce our Terms of Service and protect our rights',
                  'To send marketing communications (only with your explicit consent)',
                ].map((purpose, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{purpose}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 7: Your Rights */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">7.</span> Your Rights Under Zimbabwean Law
            </h2>
            <p className="text-neutral-300 mb-4">
              Under <strong>Section 14 of the Cyber and Data Protection Act</strong>, you have the following rights regarding your personal information:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {rights.map((item, idx) => (
                <div key={idx} className="bg-neutral-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-5 h-5 text-purple-400" />
                    <h4 className="font-semibold">{item.right}</h4>
                  </div>
                  <p className="text-neutral-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
            <p className="text-neutral-300 mt-4">
              To exercise any of these rights, please contact our Data Protection Officer. We will respond to your request within <strong>30 days</strong> of receipt. There is no fee for exercising your rights, except where requests are manifestly unfounded or excessive.
            </p>
          </section>

          {/* Section 8: Children's Privacy */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">8.</span> Protection of Children's Data
            </h2>
            <p className="text-neutral-300 mb-4">ToraShaout takes the protection of children's personal information seriously, in compliance with the special provisions for children under the Cyber and Data Protection Act:</p>
            <div className="bg-neutral-900 rounded-xl p-6">
              <ul className="space-y-2 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Users between 13 and 18 years of age require verifiable parental or guardian consent before creating an account.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>We conduct regular Data Protection Impact Assessments (DPIAs) for any processing involving children's data, as required by SI 155 of 2024.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Parents or guardians may contact us to review, delete, or stop the collection of their child's personal information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>If we become aware that we have collected personal information from a child without appropriate consent, we will take immediate steps to delete that information.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 9: Data Sharing */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">9.</span> Disclosure of Personal Information
            </h2>
            <p className="text-neutral-300 mb-4">We may share your personal information with the following categories of recipients:</p>
            <div className="space-y-4">
              {[
                { title: '9.1 Service Providers', content: 'Third-party service providers who assist us in operating our platform, including payment processors, cloud hosting providers, analytics services, and customer support tools. All service providers are contractually bound to protect your data and process it only on our instructions.' },
                { title: '9.2 Legal Requirements', content: 'We may disclose personal information when required by law, court order, or government request, including to POTRAZ and other regulatory authorities.' },
                { title: '9.3 Business Transfers', content: 'In the event of a merger, acquisition, or sale of assets, your personal information may be transferred. We will notify you of any such change and your choices regarding your information.' },
                { title: '9.4 With Your Consent', content: 'We may share your information with third parties when you have given explicit consent to do so.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-neutral-900 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">{item.title}</h4>
                  <p className="text-neutral-300">{item.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 10: Cross-Border Transfers */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">10.</span> Cross-Border Data Transfers
            </h2>
            <p className="text-neutral-300 mb-4">
              In accordance with <strong>Sections 28-29 of the Cyber and Data Protection Act</strong>, we ensure adequate protection when transferring personal information outside Zimbabwe:
            </p>
            <div className="bg-neutral-900 rounded-xl p-6">
              <ul className="space-y-2 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>We will notify POTRAZ before any cross-border transfer of personal information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Transfers will only occur to countries or organisations that provide an adequate level of data protection as determined by POTRAZ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Where adequate protection is not assured, we will implement appropriate safeguards such as Standard Contractual Clauses or obtain your explicit consent.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Our primary data processing occurs within Zimbabwe. Where international cloud services are used, we ensure contractual protections are in place.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 11: Data Security */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">11.</span> Data Security Measures
            </h2>
            <p className="text-neutral-300 mb-4">
              We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, destruction, or alteration:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-neutral-900 rounded-xl p-6">
                <h4 className="font-semibold text-purple-400 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  11.1 Technical Measures
                </h4>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Encryption of data in transit (TLS 1.3) and at rest (AES-256)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Secure password hashing using industry-standard algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Regular security assessments and penetration testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Firewalls, intrusion detection systems, and access controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Secure development practices and code reviews</span>
                  </li>
                </ul>
              </div>
              <div className="bg-neutral-900 rounded-xl p-6">
                <h4 className="font-semibold text-purple-400 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  11.2 Organisational Measures
                </h4>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Staff training on data protection and security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Access controls based on the principle of least privilege</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Regular risk assessments as required by SI 155</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Documented security policies and procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Incident response and business continuity plans</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 12: Data Breach */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">12.</span> Data Breach Notification
            </h2>
            <p className="text-neutral-300 mb-4">In the event of a personal data breach, we will comply with the notification requirements under SI 155 of 2024:</p>
            <div className="bg-red-900/20 border border-red-700/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-red-900/50">
                    <th className="px-4 py-3 text-left font-semibold">Notification</th>
                    <th className="px-4 py-3 text-left font-semibold">Timeframe</th>
                    <th className="px-4 py-3 text-left font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-red-700/30">
                    <td className="px-4 py-3 font-semibold text-red-400">POTRAZ</td>
                    <td className="px-4 py-3 text-neutral-300">Within 24 hours</td>
                    <td className="px-4 py-3 text-neutral-300">We will report the breach to the Data Protection Authority (POTRAZ) within 24 hours of becoming aware of it.</td>
                  </tr>
                  <tr className="border-t border-red-700/30">
                    <td className="px-4 py-3 font-semibold text-red-400">Affected Data Subjects</td>
                    <td className="px-4 py-3 text-neutral-300">Within 72 hours</td>
                    <td className="px-4 py-3 text-neutral-300">If the breach poses a high risk to your rights and freedoms, we will notify you within 72 hours with details of the breach and steps you can take.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 13: Automated Decision-Making */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">13.</span> Automated Decision-Making
            </h2>
            <p className="text-neutral-300 mb-4">Where we use automated processing to make decisions that significantly affect your rights, we will:</p>
            <div className="bg-neutral-900 rounded-xl p-6">
              <ul className="space-y-2 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Obtain your explicit consent before such processing, as required by the Act.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Inform you of the logic involved and the significance of such processing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Provide you with the right to request human intervention and to challenge the decision.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Conduct regular reviews of automated systems to ensure fairness and accuracy.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 14: Data Retention */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">14.</span> Data Retention
            </h2>
            <p className="text-neutral-300 mb-4">
              We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, in accordance with the principle of <strong>storage limitation</strong>:
            </p>
            <div className="bg-neutral-900 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <th className="px-4 py-3 text-left font-semibold">Data Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  {retentionPeriods.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-neutral-800' : 'bg-neutral-900'}>
                      <td className="px-4 py-3 text-neutral-300">{item.category}</td>
                      <td className="px-4 py-3 text-neutral-300">{item.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-neutral-300 mt-4">
              After the retention period expires, we will securely delete or anonymise your personal information unless retention is required by law.
            </p>
          </section>

          {/* Section 15: Cookies */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">15.</span> Cookies and Tracking Technologies
            </h2>
            <p className="text-neutral-300">
              We use cookies and similar technologies to enhance your experience. For detailed information, please refer to our separate Cookie Policy. You may manage your cookie preferences through your browser settings or our cookie consent tool.
            </p>
          </section>

          {/* Section 16: Direct Marketing */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">16.</span> Direct Marketing
            </h2>
            <p className="text-neutral-300 mb-4">
              We will only send you marketing communications with your explicit opt-in consent. You have the right to object to direct marketing at any time by:
            </p>
            <div className="bg-neutral-900 rounded-xl p-6">
              <ul className="space-y-2 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Clicking the "unsubscribe" link in any marketing email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Updating your preferences in your account settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Contacting our Data Protection Officer</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 17: Third-Party Links */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">17.</span> Third-Party Links and Services
            </h2>
            <p className="text-neutral-300">
              Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.
            </p>
          </section>

          {/* Section 18: Changes */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">18.</span> Changes to This Privacy Policy
            </h2>
            <p className="text-neutral-300 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by:
            </p>
            <div className="bg-neutral-900 rounded-xl p-6">
              <ul className="space-y-2 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Posting the updated policy on our platform with a new "Last Updated" date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Sending you an email notification if the changes are significant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Displaying a prominent notice on our platform</span>
                </li>
              </ul>
            </div>
            <p className="text-neutral-300 mt-4">
              Your continued use of our platform after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Section 19: Complaints */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">19.</span> Complaints and Regulatory Authority
            </h2>
            <p className="text-neutral-300 mb-4">
              If you believe your data protection rights have been violated, you have the right to lodge a complaint with:
            </p>
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-3">Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ)</h4>
              <div className="space-y-2 text-neutral-300">
                <p>Block A, Emerald Business Park</p>
                <p>30 The Chase (West), Emerald Hill, Harare</p>
                <p>Phone: +263 (4) 333311</p>
                <p>Website: www.potraz.gov.zw</p>
              </div>
            </div>
            <p className="text-neutral-300 mt-4">
              We encourage you to contact us first so we can try to resolve your concerns directly.
            </p>
          </section>

          {/* Section 20: Contact Us */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="text-gradient-brand">20.</span> Contact Us
            </h2>
            <p className="text-neutral-300 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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
                  <Mail className="w-4 h-4 text-purple-400" />
                  DPO Email: <a href="mailto:dpo@torashout.com" className="text-purple-400 hover:underline">dpo@torashout.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="text-center">
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6">
              <p className="text-neutral-300 italic">
                By using ToraShaout, you acknowledge that you have read, understood, and agree to this Privacy Policy.
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
