import { useEffect } from 'react';
import { DocumentTextIcon, ScaleIcon, ExclamationTriangleIcon, CurrencyDollarIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

function TermsOfService() {
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
              <DocumentTextIcon className="w-8 h-8 text-[#157145]" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-xl text-gray-600 mt-2">Legal terms and conditions for using Fetchr</p>
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to Fetchr! These Terms of Service ("Terms") constitute a legally binding agreement between you and Fetchr ("we," "our," or "us") regarding your use of our lead generation and outreach platform.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By creating an account, accessing, or using our services in any way, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use our services.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Important:</strong> Please read these Terms carefully before using our services. These Terms include important information about your legal rights, remedies, and obligations.
                  </p>
                </div>
              </div>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#157145] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-[#157145]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Description of Services</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  Fetchr provides a comprehensive lead generation and email marketing platform that includes:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Core Features</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Business lead database access and search</li>
                      <li>• Contact information discovery and verification</li>
                      <li>• Email template creation and management</li>
                      <li>• Automated email campaign orchestration</li>
                      <li>• Campaign analytics and performance tracking</li>
                      <li>• Lead management and organization tools</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Technology Stack</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• React-based web application interface</li>
                      <li>• Laravel backend with MySQL database</li>
                                             <li>• Gmail API integration for email services</li>
                      <li>• AI-powered content enhancement via Google Gemini</li>
                      <li>• Real-time email tracking and analytics</li>
                      <li>• Secure authentication using Laravel Sanctum</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Service Availability:</strong> We strive to maintain 99.9% uptime, but services may occasionally be unavailable due to maintenance, updates, or unforeseen circumstances.
                  </p>
                </div>
              </div>
            </section>

            {/* User Obligations */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">User Responsibilities and Prohibited Uses</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Account Responsibilities</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Provide accurate and complete registration information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Maintain the security and confidentiality of your account credentials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Promptly notify us of any unauthorized access to your account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Use the service only for legitimate business purposes</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Email Marketing Compliance</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Comply with applicable email marketing laws (CAN-SPAM, GDPR, CASL, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Include clear unsubscribe mechanisms in all marketing emails</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Obtain proper consent before sending marketing communications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Accurately identify yourself as the sender in all communications</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Prohibited Activities</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm mb-3">
                        <strong>You may NOT use our services for:</strong>
                      </p>
                      <ul className="space-y-1 text-red-700 text-sm">
                        <li>• Sending spam, unsolicited, or bulk communications</li>
                        <li>• Illegal activities, fraud, or deceptive practices</li>
                        <li>• Harassment, threats, or abusive content</li>
                        <li>• Distributing malware, viruses, or harmful code</li>
                        <li>• Attempting to gain unauthorized access to systems</li>
                        <li>• Reverse engineering or copying our technology</li>
                        <li>• Violating intellectual property rights</li>
                        <li>• Circumventing usage limits or restrictions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Data Usage and Lead Information</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Lead Database</h3>
                    <p className="text-gray-700 mb-4">
                      Our lead database contains business information compiled from publicly available sources, including government registries, corporate websites, and professional networks. This information is provided for legitimate business prospecting purposes.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Data Sources Include:</h4>
                      <ul className="text-blue-800 text-sm space-y-1">
                        <li>• Government business registries</li>
                        <li>• Publicly available corporate websites</li>
                        <li>• Professional social media profiles</li>
                        <li>• Industry directories and databases</li>
                        <li>• Web scraping of public information</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Acceptable Use of Lead Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <h4 className="font-medium text-green-900 mb-2">✓ Permitted Uses</h4>
                        <ul className="text-green-800 text-sm space-y-1">
                          <li>• B2B lead generation and prospecting</li>
                          <li>• Professional networking outreach</li>
                          <li>• Market research and analysis</li>
                          <li>• Business development activities</li>
                          <li>• Partnership and collaboration inquiries</li>
                        </ul>
                      </div>
                      
                      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <h4 className="font-medium text-red-900 mb-2">✗ Prohibited Uses</h4>
                        <ul className="text-red-800 text-sm space-y-1">
                          <li>• Reselling or redistributing data</li>
                          <li>• Personal or consumer marketing</li>
                          <li>• Creating competing databases</li>
                          <li>• Automated bulk downloading</li>
                          <li>• Identity theft or fraud</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Data Accuracy and Verification</h3>
                    <p className="text-gray-700 text-sm">
                      While we strive to maintain accurate and up-to-date information, we cannot guarantee the completeness or accuracy of all lead data. Users are responsible for verifying information before use and respecting opt-out requests.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <ScaleIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Intellectual Property Rights</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Our Rights</h3>
                    <p className="text-gray-700 mb-4">
                      Fetchr and its associated branding, software, algorithms, and methodologies are proprietary to us and protected by intellectual property laws. This includes:
                    </p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• The Fetchr platform, interface, and user experience</li>
                      <li>• Our data compilation methods and algorithms</li>
                      <li>• Proprietary software code and architecture</li>
                      <li>• Trademarks, logos, and brand elements</li>
                      <li>• Documentation, guides, and instructional materials</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Your Rights</h3>
                    <p className="text-gray-700 mb-4">
                      You retain all rights to the content you create using our platform, including:
                    </p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Email templates and campaign content you create</li>
                      <li>• Your own customer and prospect lists</li>
                      <li>• Business strategies and methodologies you develop</li>
                      <li>• Original creative works produced using our tools</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">License Grant</h3>
                    <p className="text-gray-700 text-sm">
                      We grant you a limited, non-exclusive, non-transferable license to use our services during your subscription period, subject to these Terms. You may not sublicense, distribute, or create derivative works based on our platform.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#157145] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="w-5 h-5 text-[#157145]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Payment Terms and Billing</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Subscription Model</h3>
                    <p className="text-gray-700 mb-4">
                      Fetchr operates on a subscription-based pricing model with various tiers to meet different business needs. Current pricing and features are available on our website and may be updated periodically.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Billing Policies</h3>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Subscriptions are billed in advance</li>
                        <li>• Payment is due at the start of each billing period</li>
                        <li>• All fees are non-refundable unless required by law</li>
                        <li>• Price changes will be communicated 30 days in advance</li>
                        <li>• Failed payments may result in service suspension</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Cancellation</h3>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Cancel anytime through your account settings</li>
                        <li>• Service continues until end of billing period</li>
                        <li>• No partial refunds for unused portions</li>
                        <li>• Data export available for 30 days after cancellation</li>
                        <li>• Account data deleted after grace period</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Free Trial:</strong> New users may be eligible for a free trial period. Trial limitations and conversion terms are specified during signup.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Disclaimers and Limitation of Liability</h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-red-900 mb-3">Important Legal Notice</h3>
                    <p className="text-red-800 text-sm mb-4">
                      <strong>SERVICE PROVIDED "AS IS":</strong> Fetchr is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.
                    </p>
                    <p className="text-red-800 text-sm">
                      We specifically disclaim all warranties including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Limitation of Liability</h3>
                    <p className="text-gray-700 text-sm mb-4">
                      To the maximum extent permitted by law, in no event shall Fetchr be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                    </p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Loss of profits or business opportunities</li>
                      <li>• Data loss or corruption</li>
                      <li>• Business interruption</li>
                      <li>• Reputational damage</li>
                      <li>• Third-party claims or actions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Maximum Liability</h3>
                    <p className="text-gray-700 text-sm">
                      Our total liability for any claims arising from or related to these Terms or your use of our services shall not exceed the amount you paid to us in the 12 months preceding the claim.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Termination</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Termination by You</h3>
                    <p className="text-gray-700 text-sm">
                      You may terminate your account at any time by canceling your subscription through your account settings or contacting our support team.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Termination by Us</h3>
                    <p className="text-gray-700 text-sm mb-4">
                      We may suspend or terminate your access to our services immediately, without prior notice, for any of the following reasons:
                    </p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Violation of these Terms of Service</li>
                      <li>• Non-payment of fees</li>
                      <li>• Suspected fraudulent or illegal activity</li>
                      <li>• Abuse of our systems or resources</li>
                      <li>• Threat to security or integrity of our services</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Effect of Termination</h3>
                    <p className="text-gray-700 text-sm">
                      Upon termination, your right to access and use our services immediately ceases. We will retain your data for 30 days for account recovery purposes, after which it will be permanently deleted unless legally required to retain it longer.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Governing Law and Dispute Resolution</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Applicable Law</h3>
                    <p className="text-gray-700 text-sm">
                      These Terms are governed by and construed in accordance with the laws of Latvia and the European Union, without regard to conflict of law principles.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Dispute Resolution</h3>
                    <p className="text-gray-700 text-sm mb-4">
                      We encourage resolution of disputes through direct communication. For formal disputes:
                    </p>
                    <ol className="space-y-2 text-gray-700 text-sm">
                      <li>1. <strong>Informal Resolution:</strong> Contact our support team within 30 days of the issue arising</li>
                      <li>2. <strong>Mediation:</strong> If informal resolution fails, disputes may be submitted to mediation</li>
                                             <li>3. <strong>Jurisdiction:</strong> Any legal proceedings shall be conducted in the courts of Jēkabpils, Latvia</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">EU Consumer Rights</h3>
                    <p className="text-gray-700 text-sm">
                      If you are a consumer in the European Union, you retain all rights provided by applicable EU consumer protection laws, and nothing in these Terms limits those rights.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Miscellaneous */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">General Provisions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Entire Agreement</h3>
                    <p className="text-gray-700 text-sm">
                      These Terms, together with our Privacy Policy, constitute the entire agreement between you and Fetchr regarding the use of our services.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Modifications</h3>
                    <p className="text-gray-700 text-sm">
                      We reserve the right to modify these Terms at any time. Material changes will be communicated via email and platform notifications at least 30 days before taking effect.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Severability</h3>
                    <p className="text-gray-700 text-sm">
                      If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Force Majeure</h3>
                    <p className="text-gray-700 text-sm">
                      We shall not be liable for any delay or failure to perform resulting from causes beyond our reasonable control, including natural disasters, acts of government, or technical failures.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Legal Inquiries</h3>
                    <div className="space-y-2 text-gray-700">
                                             <p>Email: <a href="mailto:legal@fetchr.pro" className="text-blue-600 hover:underline">legal@fetchr.pro</a></p>
                      <p>For terms-related questions and legal matters</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">General Support</h3>
                    <div className="space-y-2 text-gray-700">
                                             <p>Email: <a href="mailto:support@fetchr.pro" className="text-blue-600 hover:underline">support@fetchr.pro</a></p>
                      <p>For technical support and account assistance</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Fetchr</strong><br/>
                    Legal Department<br/>
                    Jēkabpils, Latvia<br/>
                    European Union
                  </p>
                </div>
              </div>
            </section>

        </div>
      </main>
    </div>
  );
}

export default TermsOfService;