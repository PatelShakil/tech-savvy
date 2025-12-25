import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {FiFileText, FiAlertCircle, FiCheckCircle, FiMail, FiPhone, FiMapPin, FiAward} from "react-icons/fi";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

const TermsOfServicePage = () => {
    const lastUpdated = "December 25, 2025";
    const effectiveDate = "January 1, 2024";

    return (
        <div className="min-h-screen bg-gray-950">
            <Helmet>
                <title>Terms of Service | Tech Savvy Solution</title>
                <meta name="description" content="Terms of Service for Tech Savvy Solution. Read our terms and conditions for using our services." />
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
                        <FiFileText className="text-white text-4xl" />
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text" style={{ backgroundImage: gradient }}>
                        Terms of Service
                    </h1>
                    <p className="text-xl text-gray-300 mb-4">
                        Please read these terms carefully before using our services
                    </p>
                    <p className="text-sm text-gray-500">
                        Last Updated: {lastUpdated} | Effective Date: {effectiveDate}
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
                        {/* Agreement to Terms */}
                        <Section icon={<FiCheckCircle />} title="1. Agreement to Terms">
                            <p>By accessing or using the services of Tech Savvy Solution ("Company," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.</p>
                            <p className="mt-4">These Terms apply to:</p>
                            <ul>
                                <li>Our website (techsavvysolution.in)</li>
                                <li>Mobile applications</li>
                                <li>Internship and mentorship programs</li>
                                <li>Software development services</li>
                                <li>Any other services we provide</li>
                            </ul>
                        </Section>

                        {/* Eligibility */}
                        <Section icon={<FiUsers />} title="2. Eligibility">
                            <p>To use our Services, you must:</p>
                            <ul>
                                <li>Be at least 18 years of age</li>
                                <li>Have the legal capacity to enter into binding contracts</li>
                                <li>Not be prohibited from accessing our Services under applicable laws</li>
                                <li>Provide accurate and complete information during registration</li>
                            </ul>
                            <p className="mt-4">By registering for our programs or services, you represent and warrant that you meet these requirements.</p>
                        </Section>

                        {/* Services Description */}
                        <Section icon={<FiCode />} title="3. Description of Services">
                            <p>Tech Savvy Solution is an MSME-registered IT solution provider offering:</p>
                            <ul>
                                <li><strong>Internship Programs:</strong> Hands-on training with real-world projects</li>
                                <li><strong>Mentorship Programs:</strong> One-on-one guidance from industry experts</li>
                                <li><strong>Software Development:</strong> Custom applications, microservices, and SaaS platforms</li>
                                <li><strong>Technical Workshops:</strong> Short-term skill-building sessions</li>
                                <li><strong>Consulting Services:</strong> Technical advice and system architecture design</li>
                            </ul>
                            <p className="mt-4">We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time with reasonable notice.</p>
                        </Section>

                        {/* User Accounts */}
                        <Section icon={<FiUser />} title="4. User Accounts and Registration">
                            <p>To access certain Services, you may need to create an account. You agree to:</p>
                            <ul>
                                <li>Provide accurate, current, and complete information</li>
                                <li>Maintain and promptly update your account information</li>
                                <li>Keep your password secure and confidential</li>
                                <li>Notify us immediately of any unauthorized use</li>
                                <li>Accept responsibility for all activities under your account</li>
                            </ul>
                            <p className="mt-4">We reserve the right to suspend or terminate accounts that violate these Terms.</p>
                        </Section>

                        {/* Program Enrollment */}
                        <Section icon={<FiAward />} title="5. Program Enrollment and Fees">
                            <h4 className="font-semibold text-white mb-2">Enrollment Process</h4>
                            <p>When you enroll in our programs:</p>
                            <ul>
                                <li>You must complete the application form with accurate information</li>
                                <li>Your application will be reviewed by our team</li>
                                <li>You will receive confirmation of acceptance via email</li>
                                <li>Payment must be completed before the program start date</li>
                            </ul>

                            <h4 className="font-semibold text-white mb-2 mt-6">Fees and Payment</h4>
                            <ul>
                                <li>All fees are listed in Indian Rupees (INR)</li>
                                <li>Payment must be made through our authorized payment gateways</li>
                                <li>Fees are non-refundable except as stated in our Refund Policy</li>
                                <li>We reserve the right to change fees with reasonable notice</li>
                                <li>Group discounts may be available for institutional enrollments</li>
                            </ul>
                        </Section>

                        {/* User Responsibilities */}
                        <Section icon={<FiAlertCircle />} title="6. User Responsibilities and Conduct">
                            <p>You agree not to:</p>
                            <ul>
                                <li>Use our Services for any illegal or unauthorized purpose</li>
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe on intellectual property rights of others</li>
                                <li>Transmit viruses, malware, or harmful code</li>
                                <li>Harass, abuse, or harm other users</li>
                                <li>Impersonate any person or entity</li>
                                <li>Collect or harvest data from our Services without permission</li>
                                <li>Interfere with the proper functioning of our Services</li>
                                <li>Share your account credentials with others</li>
                            </ul>
                        </Section>

                        {/* Intellectual Property */}
                        <Section icon={<FiShield />} title="7. Intellectual Property Rights">
                            <h4 className="font-semibold text-white mb-2">Our Content</h4>
                            <p>All content on our website and Services, including but not limited to:</p>
                            <ul>
                                <li>Text, graphics, logos, images, and videos</li>
                                <li>Software code and applications</li>
                                <li>Training materials and course content</li>
                                <li>Documentation and guides</li>
                            </ul>
                            <p className="mt-4">are owned by Tech Savvy Solution or our licensors and are protected by Indian and international copyright, trademark, and other intellectual property laws.</p>

                            <h4 className="font-semibold text-white mb-2 mt-6">Your Content</h4>
                            <p>For content you submit (e.g., project submissions, feedback):</p>
                            <ul>
                                <li>You retain ownership of your original content</li>
                                <li>You grant us a license to use it for program evaluation and improvement</li>
                                <li>You represent that you have the right to submit such content</li>
                                <li>We may showcase exemplary student work (with permission)</li>
                            </ul>
                        </Section>

                        {/* Certificates and Credentials */}
                        <Section icon={<FiAward />} title="8. Certificates and Credentials">
                            <p>Upon successful completion of our programs, you will receive:</p>
                            <ul>
                                <li>A digital certificate issued by Tech Savvy Solution</li>
                                <li>Verification through our website or LinkedIn</li>
                                <li>Recognition as an MSME-registered company credential</li>
                            </ul>
                            <p className="mt-4">Certificates are issued only to participants who:</p>
                            <ul>
                                <li>Complete all required coursework and projects</li>
                                <li>Meet attendance requirements (if applicable)</li>
                                <li>Have cleared all payment obligations</li>
                                <li>Maintain good standing throughout the program</li>
                            </ul>
                        </Section>

                        {/* Cancellation and Refunds */}
                        <Section icon={<FiRefreshCw />} title="9. Cancellation and Refund Policy">
                            <h4 className="font-semibold text-white mb-2">By You (Student)</h4>
                            <ul>
                                <li><strong>Before Program Starts:</strong> Full refund minus processing fees (if requested 7+ days before start)</li>
                                <li><strong>Within First Week:</strong> 50% refund (if requested within 7 days of program start)</li>
                                <li><strong>After First Week:</strong> No refund</li>
                            </ul>

                            <h4 className="font-semibold text-white mb-2 mt-6">By Us</h4>
                            <p>We may cancel a program if:</p>
                            <ul>
                                <li>Minimum enrollment is not met</li>
                                <li>Unforeseen circumstances prevent delivery</li>
                                <li>Technical issues cannot be resolved</li>
                            </ul>
                            <p className="mt-4">In such cases, you will receive a full refund or the option to transfer to another program.</p>
                        </Section>

                        {/* Liability and Disclaimers */}
                        <Section icon={<FiAlertCircle />} title="10. Limitation of Liability">
                            <p className="uppercase font-semibold text-yellow-400">IMPORTANT - PLEASE READ CAREFULLY</p>
                            <p className="mt-4">To the maximum extent permitted by law:</p>
                            <ul>
                                <li>Our Services are provided "AS IS" and "AS AVAILABLE"</li>
                                <li>We make no warranties, express or implied, regarding our Services</li>
                                <li>We do not guarantee employment or specific career outcomes</li>
                                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                                <li>Our total liability shall not exceed the amount you paid for the Services</li>
                            </ul>
                            <p className="mt-4">This limitation applies to:</p>
                            <ul>
                                <li>Errors or inaccuracies in content</li>
                                <li>Personal injury or property damage</li>
                                <li>Unauthorized access to our servers</li>
                                <li>Interruption or cessation of Services</li>
                                <li>Bugs, viruses, or harmful components</li>
                            </ul>
                        </Section>

                        {/* Indemnification */}
                        <Section icon={<FiShield />} title="11. Indemnification">
                            <p>You agree to indemnify, defend, and hold harmless Tech Savvy Solution, its officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:</p>
                            <ul>
                                <li>Your use or misuse of our Services</li>
                                <li>Your violation of these Terms</li>
                                <li>Your violation of any third-party rights</li>
                                <li>Any content you submit or transmit</li>
                            </ul>
                        </Section>

                        {/* Dispute Resolution */}
                        <Section icon={<FiMessageCircle />} title="12. Dispute Resolution">
                            <h4 className="font-semibold text-white mb-2">Informal Resolution</h4>
                            <p>Before filing any formal claim, you agree to contact us and attempt to resolve the dispute informally by contacting us at info@techsavvysolution.in.</p>

                            <h4 className="font-semibold text-white mb-2 mt-6">Governing Law</h4>
                            <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>

                            <h4 className="font-semibold text-white mb-2 mt-6">Jurisdiction</h4>
                            <p>Any disputes arising from these Terms or our Services shall be subject to the exclusive jurisdiction of the courts in Surat, Gujarat, India.</p>
                        </Section>

                        {/* Changes to Terms */}
                        <Section icon={<FiRefreshCw />} title="13. Changes to Terms">
                            <p>We reserve the right to modify these Terms at any time. We will notify you of changes by:</p>
                            <ul>
                                <li>Posting the updated Terms on our website</li>
                                <li>Updating the "Last Updated" date</li>
                                <li>Sending email notifications for material changes</li>
                            </ul>
                            <p className="mt-4">Your continued use of our Services after changes take effect constitutes acceptance of the new Terms.</p>
                        </Section>

                        {/* Termination */}
                        <Section icon={<FiXCircle />} title="14. Termination">
                            <p>We may terminate or suspend your access to our Services immediately, without prior notice, for:</p>
                            <ul>
                                <li>Violation of these Terms</li>
                                <li>Fraudulent or illegal activity</li>
                                <li>Requests by law enforcement</li>
                                <li>Prolonged inactivity</li>
                            </ul>
                            <p className="mt-4">Upon termination:</p>
                            <ul>
                                <li>Your right to use our Services ceases immediately</li>
                                <li>You must stop using any materials obtained through our Services</li>
                                <li>Provisions that by their nature should survive will remain in effect</li>
                            </ul>
                        </Section>

                        {/* Miscellaneous */}
                        <Section icon={<FiFileText />} title="15. Miscellaneous">
                            <ul>
                                <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Tech Savvy Solution</li>
                                <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in effect</li>
                                <li><strong>Waiver:</strong> Failure to enforce any right does not constitute a waiver</li>
                                <li><strong>Assignment:</strong> You may not assign these Terms without our written consent</li>
                                <li><strong>Third-Party Rights:</strong> These Terms do not create rights for third parties</li>
                            </ul>
                        </Section>

                        {/* Contact */}
                        <Section icon={<FiMail />} title="16. Contact Information">
                            <p>For questions about these Terms, please contact:</p>
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
                                MSME Registered Company | Registration Number: <a href={"https://udyamregistration.gov.in/verifyudyambarcode.aspx?verifyudrn=3PkFihstw9USoYKgagEDGC9aI1xQT9RwXhX7pXQ84Uc="}>UDYAM-GJ-22-0530241</a>
                            </p>
                        </Section>

                        {/* Acknowledgment */}
                        <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                            <p className="text-white text-center font-semibold mb-2">
                                Acknowledgment of Terms
                            </p>
                            <p className="text-gray-300 text-center text-sm">
                                By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
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
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
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

// Additional imports
import { FiUsers, FiCode, FiUser, FiShield, FiRefreshCw, FiMessageCircle, FiXCircle } from "react-icons/fi";

export default TermsOfServicePage;
