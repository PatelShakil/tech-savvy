import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { FiShield, FiLock, FiEye, FiMail, FiPhone } from "react-icons/fi";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

const PrivacyPolicyPage = () => {
    const lastUpdated = "December 25, 2025";

    return (
        <div className="min-h-screen bg-gray-950">
            <Helmet>
                <title>Privacy Policy | Tech Savvy Solution</title>
                <meta name="description" content="Privacy Policy for Tech Savvy Solution. Learn how we collect, use, and protect your personal information." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 to-gray-950 pt-32 pb-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <FiShield className="text-white text-4xl" />
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text" style={{ backgroundImage: gradient }}>
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-gray-300 mb-4">
                        Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                    </p>
                    <p className="text-sm text-gray-500">
                        Last Updated: {lastUpdated}
                    </p>
                </motion.div>
            </section>

            {/* Content */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-900 rounded-2xl p-8 md:p-12 border border-gray-800 space-y-8"
                    >
                        {/* Introduction */}
                        <Section icon={<FiShield />} title="Introduction">
                            <p>Welcome to Tech Savvy Solution ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy applies to all information collected through our website (techsavvysolution.in), mobile applications, and any related services (collectively, the "Services").</p>
                            <p>We are an MSME-registered IT solution provider based in Surat, Gujarat, India, specializing in microservices architecture, SaaS platforms, and mobile applications.</p>
                        </Section>

                        {/* Information We Collect */}
                        <Section icon={<FiEye />} title="Information We Collect">
                            <h4 className="font-semibold text-white mb-2">Personal Information</h4>
                            <p>We collect personal information that you voluntarily provide to us when you:</p>
                            <ul>
                                <li>Register for our internship or mentorship programs</li>
                                <li>Fill out contact forms or request quotes</li>
                                <li>Subscribe to our newsletter</li>
                                <li>Create an account on our student portal</li>
                                <li>Communicate with us via email or phone</li>
                            </ul>
                            <p className="mt-4">This information may include:</p>
                            <ul>
                                <li>Name, email address, phone number</li>
                                <li>Educational background and qualifications</li>
                                <li>Resume/CV and portfolio links</li>
                                <li>Payment information (processed securely through third-party gateways)</li>
                                <li>Any other information you choose to provide</li>
                            </ul>

                            <h4 className="font-semibold text-white mb-2 mt-6">Automatically Collected Information</h4>
                            <p>When you visit our website, we automatically collect certain information about your device, including:</p>
                            <ul>
                                <li>IP address and browser type</li>
                                <li>Operating system and device information</li>
                                <li>Pages visited and time spent on pages</li>
                                <li>Referring website addresses</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </Section>

                        {/* How We Use Your Information */}
                        <Section icon={<FiLock />} title="How We Use Your Information">
                            <p>We use the information we collect for the following purposes:</p>
                            <ul>
                                <li><strong>To provide our services:</strong> Process applications, manage internship programs, deliver training materials</li>
                                <li><strong>To communicate with you:</strong> Send updates, respond to inquiries, provide customer support</li>
                                <li><strong>To improve our services:</strong> Analyze usage patterns, conduct research, enhance user experience</li>
                                <li><strong>To send marketing communications:</strong> Share news, updates, and promotional materials (with your consent)</li>
                                <li><strong>To comply with legal obligations:</strong> Maintain records, respond to legal requests, prevent fraud</li>
                                <li><strong>To process payments:</strong> Handle transactions for our paid programs and services</li>
                            </ul>
                        </Section>

                        {/* Information Sharing */}
                        <Section icon={<FiUsers />} title="Information Sharing and Disclosure">
                            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                            <ul>
                                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (e.g., payment processors, email service providers, hosting services)</li>
                                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, property, or safety</li>
                                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                            </ul>
                            <p className="mt-4">We work with trusted third-party services including:</p>
                            <ul>
                                <li>Google Analytics (website analytics)</li>
                                <li>Firebase (authentication and database)</li>
                                <li>Payment gateways (secure payment processing)</li>
                                <li>Email service providers (communication)</li>
                            </ul>
                        </Section>

                        {/* Cookies */}
                        <Section icon={<FiCode />} title="Cookies and Tracking Technologies">
                            <p>We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:</p>
                            <ul>
                                <li>Remember your preferences and settings</li>
                                <li>Understand how you use our website</li>
                                <li>Improve website performance and functionality</li>
                                <li>Provide personalized content and advertisements</li>
                            </ul>
                            <p className="mt-4">You can control cookies through your browser settings. However, disabling cookies may limit some website functionality.</p>
                        </Section>

                        {/* Data Security */}
                        <Section icon={<FiShield />} title="Data Security">
                            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
                            <ul>
                                <li>Encryption of data in transit and at rest</li>
                                <li>Secure server infrastructure and firewalls</li>
                                <li>Regular security audits and updates</li>
                                <li>Access controls and authentication</li>
                                <li>Employee training on data protection</li>
                            </ul>
                            <p className="mt-4">However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.</p>
                        </Section>

                        {/* Your Rights */}
                        <Section icon={<FiCheckCircle />} title="Your Privacy Rights">
                            <p>You have the following rights regarding your personal information:</p>
                            <ul>
                                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                                <li><strong>Objection:</strong> Object to our processing of your personal information</li>
                                <li><strong>Restriction:</strong> Request restriction of processing your information</li>
                                <li><strong>Portability:</strong> Request transfer of your information to another service</li>
                                <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
                            </ul>
                            <p className="mt-4">To exercise these rights, please contact us using the information provided below.</p>
                        </Section>

                        {/* Data Retention */}
                        <Section icon={<FiClock />} title="Data Retention">
                            <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Retention periods vary based on:</p>
                            <ul>
                                <li>The nature of the information</li>
                                <li>The purposes for which it was collected</li>
                                <li>Legal, regulatory, or contractual obligations</li>
                            </ul>
                            <p className="mt-4">When information is no longer needed, we securely delete or anonymize it.</p>
                        </Section>

                        {/* Children's Privacy */}
                        <Section icon={<FiUsers />} title="Children's Privacy">
                            <p>Our Services are intended for users aged 18 and above. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will delete such information.</p>
                        </Section>

                        {/* International Data Transfers */}
                        <Section icon={<FiGlobe />} title="International Data Transfers">
                            <p>Your information may be transferred to and maintained on servers located outside of your country. By using our Services, you consent to the transfer of information to India and other countries where we operate.</p>
                            <p className="mt-4">We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.</p>
                        </Section>

                        {/* Updates to Policy */}
                        <Section icon={<FiRefreshCw />} title="Changes to This Privacy Policy">
                            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. We will notify you of any material changes by:</p>
                            <ul>
                                <li>Posting the updated policy on our website</li>
                                <li>Updating the "Last Updated" date</li>
                                <li>Sending you an email notification (for significant changes)</li>
                            </ul>
                            <p className="mt-4">We encourage you to review this Privacy Policy periodically.</p>
                        </Section>

                        {/* Contact */}
                        <Section icon={<FiMail />} title="Contact Us">
                            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
                            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                                <p className="font-semibold text-white mb-2">Tech Savvy Solution</p>
                                <p className="flex items-center gap-2 text-gray-400 mb-2">
                                    <FiMail className="text-blue-400" />
                                    <a href="mailto:info@techsavvysolution.in" className="hover:text-white transition-colors">info@techsavvysolution.in</a>
                                </p>
                                <p className="flex items-center gap-2 text-gray-400 mb-2">
                                    <FiPhone className="text-green-400" />
                                    <a href="tel:+919510634082" className="hover:text-white transition-colors">+91 9510634082</a>
                                </p>
                                <p className="flex items-center gap-2 text-gray-400">
                                    <FiMapPin className="text-purple-400" />
                                    Surat, Gujarat, India
                                </p>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                MSME Registered Company | Registration Number: [Your MSME Number]
                            </p>
                        </Section>

                        {/* Consent */}
                        <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                            <p className="text-white text-center">
                                By using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

// Section Component
const Section = ({ icon, title, children }: any) => {
    return (
        <div className="border-b border-gray-800 last:border-0 pb-8 last:pb-0">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
                    {icon}
                </div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="text-gray-400 space-y-4">
                {children}
            </div>
        </div>
    );
};

// Additional imports needed
import { FiUsers, FiCode, FiCheckCircle, FiClock, FiGlobe, FiRefreshCw, FiMapPin } from "react-icons/fi";

export default PrivacyPolicyPage;
