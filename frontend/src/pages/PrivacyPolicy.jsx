import { useEffect } from 'react';
import { ShieldCheckIcon, EyeIcon, LockClosedIcon, UserGroupIcon, DocumentTextIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-[#157145]">
              Fetchr
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-[#157145] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0f5533] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#157145] bg-opacity-10 rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-[#157145]" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-xl text-gray-600 mt-2">How we collect, use, and protect your information</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 bg-white px-6 py-3 rounded-lg inline-block shadow-sm border border-gray-200">
            Last updated: June 2025
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
            
            {/* Introduction */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to Fetchr, a lead generation and outreach platform designed to help businesses connect with potential customers efficiently. We are committed to protecting your privacy and ensuring transparency about how we handle your personal information.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This Privacy Policy explains how Fetchr ("we," "our," or "us") collects, uses, processes, and protects information when you use our platform, including our web application, services, and related functionalities.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information You Provide</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Account Information:</strong> Name, email address, password, and other registration details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Profile Information:</strong> Job title, company name, industry, and professional details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Email Integration:</strong> When you connect your Gmail account via Gmail API for campaign management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Campaign Content:</strong> Email templates, campaign data, and marketing materials you create</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Lead and Business Data</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Company Information:</strong> Business names, registration numbers, addresses, and industry classifications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Contact Details:</strong> Business email addresses, phone numbers, and website URLs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Social Media Profiles:</strong> LinkedIn, Facebook, Instagram, and Twitter/X business profiles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Business Analytics:</strong> Employee count, founding dates, industry categories, and profitability indicators</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Usage and Technical Data</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Platform Usage:</strong> How you navigate and use our platform, features accessed, and time spent</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Email Analytics:</strong> Email open rates, click-through rates, and campaign performance metrics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Location Data:</strong> General geographic location based on IP address for analytics purposes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#157145] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <EyeIcon className="w-5 h-5 text-[#157145]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Service Provision</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Provide and maintain our lead generation platform</li>
                      <li>• Process and manage your email campaigns</li>
                      <li>• Generate analytics and performance reports</li>
                      <li>• Enable lead search and filtering functionality</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Communication</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Send service-related notifications</li>
                      <li>• Provide customer support and assistance</li>
                      <li>• Share platform updates and new features</li>
                      <li>• Process your inquiries and feedback</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Platform Improvement</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Analyze usage patterns and optimize performance</li>
                      <li>• Develop new features and enhancements</li>
                      <li>• Improve user experience and interface design</li>
                      <li>• Enhance data accuracy and verification</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Legal and Security</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Comply with applicable laws and regulations</li>
                      <li>• Protect against fraud and security threats</li>
                      <li>• Enforce our Terms of Service</li>
                      <li>• Respond to legal requests and court orders</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Information Sharing and Disclosure</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  We do not sell, rent, or trade your personal information to third parties. We may share information only in the following circumstances:
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium text-gray-900">Service Providers</h3>
                    <p className="text-gray-700 text-sm">
                      We work with trusted third-party service providers who assist us in operating our platform, including cloud hosting (Hetzner), Gmail API for email services, and analytics providers. These partners are bound by strict confidentiality agreements.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-medium text-gray-900">Legal Requirements</h3>
                    <p className="text-gray-700 text-sm">
                      We may disclose information when required by law, such as in response to valid legal requests from public authorities, court orders, or to protect our rights and safety.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-medium text-gray-900">Business Transfers</h3>
                    <p className="text-gray-700 text-sm">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction, subject to equivalent privacy protections.
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-medium text-gray-900">AI Enhancement Services</h3>
                    <p className="text-gray-700 text-sm">
                      When you use our AI-powered email enhancement features, content may be processed by Google's Gemini API. This data is processed according to Google's privacy policies and is not used to train their models.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#157145] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <LockClosedIcon className="w-5 h-5 text-[#157145]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Data Security and Protection</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  We implement comprehensive security measures to protect your information:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Technical Safeguards</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• End-to-end encryption for data transmission</li>
                      <li>• Secure database storage with encryption at rest</li>
                      <li>• Multi-factor authentication support</li>
                      <li>• Regular security audits and penetration testing</li>
                      <li>• Laravel Sanctum for API authentication</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Operational Safeguards</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Limited access to personal data on need-to-know basis</li>
                      <li>• Employee training on data protection practices</li>
                      <li>• Incident response procedures</li>
                      <li>• Regular backup and recovery testing</li>
                      <li>• Compliance with industry security standards</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> While we implement robust security measures, no system is completely secure. We encourage you to use strong passwords and keep your account credentials confidential.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <GlobeAltIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Your Rights and Choices</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Access and Portability</h3>
                      <p className="text-gray-700 text-sm">Request a copy of your personal data and receive it in a structured, machine-readable format.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Correction and Updates</h3>
                      <p className="text-gray-700 text-sm">Update or correct inaccurate personal information through your account settings or by contacting us.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Deletion</h3>
                      <p className="text-gray-700 text-sm">Request deletion of your personal data, subject to legal and contractual retention requirements.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Restrict Processing</h3>
                      <p className="text-gray-700 text-sm">Limit how we process your information in certain circumstances.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 font-semibold text-sm">5</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Object to Processing</h3>
                      <p className="text-gray-700 text-sm">Object to certain types of processing, including direct marketing communications.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    To exercise any of these rights, please contact us at <a href="mailto:privacy@fetchr.pro" className="font-medium hover:underline">privacy@fetchr.pro</a> or through your account settings.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Retention</h2>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We retain your information for as long as necessary to provide our services and comply with legal obligations:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Account Data</h3>
                      <p className="text-gray-700 text-sm">Retained while your account is active and for 90 days after account deletion for recovery purposes.</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Campaign Data</h3>
                      <p className="text-gray-700 text-sm">Maintained for 2 years after campaign completion for analytics and compliance purposes.</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Lead Information</h3>
                      <p className="text-gray-700 text-sm">Business data sourced from public records may be retained indefinitely as it constitutes publicly available information.</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Usage Analytics</h3>
                      <p className="text-gray-700 text-sm">Aggregated and anonymized usage data may be retained indefinitely for service improvement.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Fetchr is designed for business use and is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.
                </p>
                <p className="text-gray-700">
                  If you believe we have inadvertently collected information from a child under 16, please contact us immediately at <a href="mailto:privacy@fetchr.pro" className="text-blue-600 hover:underline">privacy@fetchr.pro</a>, and we will take steps to delete such information.
                </p>
              </div>
            </section>

            {/* International Transfers */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Our services are primarily operated from Latvia within the European Union. However, some of our service providers may be located in other countries, including the United States.
                </p>
                <p className="text-gray-700">
                  When we transfer your data outside the EU, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses or adequacy decisions by the European Commission, to protect your privacy rights.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Privacy Questions</h3>
                    <div className="space-y-2 text-gray-700">
                      <p>Email: <a href="mailto:privacy@fetchr.pro" className="text-blue-600 hover:underline">privacy@fetchr.pro</a></p>
                      <p>Response time: Within 72 hours</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">General Support</h3>
                    <div className="space-y-2 text-gray-700">
                      <p>Email: <a href="mailto:support@fetchr.pro" className="text-blue-600 hover:underline">support@fetchr.pro</a></p>
                      <p>Business hours: Monday-Friday, 9:00-18:00 EET</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Fetchr</strong><br/>
                    Data Protection Officer<br/>
                    Jēkabpils, Latvia<br/>
                    European Union
                  </p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
                </p>
                <p className="text-gray-700 mb-4">
                  When we make material changes, we will notify you by email and through a prominent notice on our platform at least 30 days before the changes take effect.
                </p>
                <p className="text-gray-700">
                  Your continued use of Fetchr after the effective date of any changes constitutes your acceptance of the updated Privacy Policy.
                </p>
              </div>
            </section>

        </div>
      </main>
    </div>
  );
}

export default PrivacyPolicy;