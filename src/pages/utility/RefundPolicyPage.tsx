import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
    FiDollarSign,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiMail,
    FiPhone,
    FiMapPin,
    FiAlertCircle,
    FiRefreshCw
} from "react-icons/fi";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

const RefundPolicyPage = () => {
    const lastUpdated = "December 25, 2025";

    return (
        <div className="min-h-screen bg-gray-950">
            <Helmet>
                <title>Refund & Cancellation Policy | Tech Savvy Solution</title>
                <meta name="description" content="Refund and cancellation policy for Tech Savvy Solution programs and services. Learn about our refund terms and conditions." />
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
                        <FiRefreshCw className="text-white text-4xl" />
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text" style={{ backgroundImage: gradient }}>
                        Refund & Cancellation Policy
                    </h1>
                    <p className="text-xl text-gray-300 mb-4">
                        Transparent and fair refund terms for our programs and services
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
                        {/* Overview */}
                        <Section icon={<FiDollarSign />} title="Policy Overview">
                            <p>At Tech Savvy Solution, we strive to provide the best learning experience for our students. We understand that circumstances may change, and we have created this refund policy to ensure fairness for both our students and our organization.</p>
                            <p className="mt-4">This policy applies to:</p>
                            <ul>
                                <li>Internship programs</li>
                                <li>Mentorship programs</li>
                                <li>Workshop sessions</li>
                                <li>Custom training programs</li>
                                <li>Software development services (project-based)</li>
                            </ul>
                        </Section>

                        {/* Program Cancellation by Student */}
                        <Section icon={<FiXCircle />} title="Cancellation by Student">
                            <div className="space-y-6">
                                {/* Before Start */}
                                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                                    <div className="flex items-start gap-3 mb-3">
                                        <FiCheckCircle className="text-green-400 text-2xl flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">Before Program Starts</h4>
                                            <p className="text-gray-300">Cancellation requested 7 or more days before the program start date</p>
                                        </div>
                                    </div>
                                    <div className="ml-11 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-gray-300"><strong className="text-white">100% refund</strong> minus processing fees (₹500 or 5%, whichever is less)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-gray-300">Refund processed within <strong className="text-white">7-10 business days</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-gray-300">Original payment method will be used</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Within First Week */}
                                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                                    <div className="flex items-start gap-3 mb-3">
                                        <FiAlertCircle className="text-yellow-400 text-2xl flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">Within First Week</h4>
                                            <p className="text-gray-300">Cancellation requested within 7 days of program start</p>
                                        </div>
                                    </div>
                                    <div className="ml-11 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                            <span className="text-gray-300"><strong className="text-white">50% refund</strong> of the program fee</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                            <span className="text-gray-300">No processing fees deducted</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                            <span className="text-gray-300">Refund processed within <strong className="text-white">10-15 business days</strong></span>
                                        </div>
                                    </div>
                                </div>

                                {/* After First Week */}
                                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                                    <div className="flex items-start gap-3 mb-3">
                                        <FiXCircle className="text-red-400 text-2xl flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">After First Week</h4>
                                            <p className="text-gray-300">Cancellation requested after 7 days of program start</p>
                                        </div>
                                    </div>
                                    <div className="ml-11 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                            <span className="text-gray-300"><strong className="text-white">No refund</strong> will be provided</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                            <span className="text-gray-300">Access to course materials will be revoked</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                            <span className="text-gray-300">Certificate will not be issued</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Cancellation by Company */}
                        <Section icon={<FiAlertCircle />} title="Cancellation by Tech Savvy Solution">
                            <p>We reserve the right to cancel or reschedule a program in the following circumstances:</p>
                            <ul>
                                <li><strong>Insufficient Enrollment:</strong> Minimum number of participants not met</li>
                                <li><strong>Technical Issues:</strong> Unforeseen technical problems that prevent program delivery</li>
                                <li><strong>Force Majeure:</strong> Natural disasters, pandemics, or other events beyond our control</li>
                                <li><strong>Instructor Unavailability:</strong> Unexpected absence of the assigned mentor/instructor</li>
                            </ul>

                            <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                                <h4 className="font-semibold text-white mb-3">If We Cancel Your Program:</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="text-blue-400 flex-shrink-0" />
                                        <span className="text-gray-300">You will receive a <strong className="text-white">100% full refund</strong> (no deductions)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="text-blue-400 flex-shrink-0" />
                                        <span className="text-gray-300">Or option to <strong className="text-white">transfer to another program</strong> of equal or lesser value</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="text-blue-400 flex-shrink-0" />
                                        <span className="text-gray-300">Priority enrollment in the <strong className="text-white">next batch</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="text-blue-400 flex-shrink-0" />
                                        <span className="text-gray-300">Notification at least <strong className="text-white">48 hours in advance</strong></span>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Special Circumstances */}
                        <Section icon={<FiClock />} title="Special Circumstances">
                            <p>We understand that genuine emergencies can occur. Refunds or deferrals may be considered on a case-by-case basis for:</p>
                            <ul>
                                <li><strong>Medical Emergencies:</strong> Supported by medical certificate</li>
                                <li><strong>Family Emergencies:</strong> Death or critical illness in immediate family</li>
                                <li><strong>Job Relocation:</strong> Documented proof of sudden job transfer</li>
                                <li><strong>Technical Issues:</strong> Inability to access program due to our platform issues</li>
                            </ul>
                            <p className="mt-4">To request consideration under special circumstances:</p>
                            <ul>
                                <li>Contact us within 48 hours of the event</li>
                                <li>Provide supporting documentation</li>
                                <li>Submit a written request explaining the situation</li>
                                <li>Decision will be made within 5 business days</li>
                            </ul>
                        </Section>

                        {/* Software Development Projects */}
                        <Section icon={<FiCode />} title="Software Development Services">
                            <p>For custom software development projects, different terms apply:</p>

                            <h4 className="font-semibold text-white mb-2 mt-4">Milestone-Based Projects</h4>
                            <ul>
                                <li>Refunds are based on completed milestones</li>
                                <li>Payment for completed milestones is non-refundable</li>
                                <li>Remaining milestone payments can be refunded if project is cancelled before work begins</li>
                                <li>Client must provide written cancellation notice</li>
                            </ul>

                            <h4 className="font-semibold text-white mb-2 mt-4">Fixed-Price Projects</h4>
                            <ul>
                                <li><strong>Before Work Starts:</strong> 100% refund minus initial consultation fees</li>
                                <li><strong>After Work Starts:</strong> Prorated refund based on work completed</li>
                                <li><strong>After 50% Completion:</strong> No refund available</li>
                            </ul>
                        </Section>

                        {/* Refund Process */}
                        <Section icon={<FiRefreshCw />} title="Refund Process">
                            <h4 className="font-semibold text-white mb-3">How to Request a Refund:</h4>
                            <ol className="space-y-3">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</span>
                                    <div>
                                        <p className="text-white font-semibold">Submit Request</p>
                                        <p className="text-gray-400">Email info@techsavvysolution.in with subject "Refund Request - [Your Name]"</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</span>
                                    <div>
                                        <p className="text-white font-semibold">Provide Information</p>
                                        <p className="text-gray-400">Include enrollment ID, program name, payment receipt, and reason for cancellation</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</span>
                                    <div>
                                        <p className="text-white font-semibold">Review & Approval</p>
                                        <p className="text-gray-400">Our team will review your request within 3 business days</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">4</span>
                                    <div>
                                        <p className="text-white font-semibold">Refund Processing</p>
                                        <p className="text-gray-400">Approved refunds will be processed within 7-15 business days</p>
                                    </div>
                                </li>
                            </ol>

                            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                                <h5 className="font-semibold text-white mb-2">Refund Timeline:</h5>
                                <ul className="text-gray-400 text-sm space-y-1">
                                    <li>• UPI/Bank Transfer: 5-7 business days</li>
                                    <li>• Credit/Debit Card: 7-10 business days</li>
                                    <li>• Net Banking: 7-10 business days</li>
                                    <li>• Wallet: 3-5 business days</li>
                                </ul>
                                <p className="text-xs text-gray-500 mt-3">*Timeline may vary depending on your bank's processing time</p>
                            </div>
                        </Section>

                        {/* Non-Refundable Items */}
                        <Section icon={<FiXCircle />} title="Non-Refundable Items">
                            <p>The following are non-refundable under all circumstances:</p>
                            <ul>
                                <li><strong>Registration Fees:</strong> One-time fees paid during enrollment</li>
                                <li><strong>Materials Already Provided:</strong> Downloaded resources, books, or kits</li>
                                <li><strong>Completed Sessions:</strong> Classes or mentorship sessions already attended</li>
                                <li><strong>Certificate Fees:</strong> If certificate has been issued</li>
                                <li><strong>Late Cancellation Penalty:</strong> Fees for cancellations after the first week</li>
                                <li><strong>Third-Party Services:</strong> External platform subscriptions or tools</li>
                            </ul>
                        </Section>

                        {/* Important Notes */}
                        <Section icon={<FiAlertCircle />} title="Important Notes">
                            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                                <h4 className="font-semibold text-yellow-400 mb-3">Please Note:</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• All refund requests must be submitted in writing via email</li>
                                    <li>• Refunds will be processed to the original payment method only</li>
                                    <li>• We do not provide refunds for "change of mind" after the first week</li>
                                    <li>• Participation in the program indicates acceptance of this policy</li>
                                    <li>• Refund eligibility is determined based on the program start date, not payment date</li>
                                    <li>• Group enrollments follow the same refund policy per student</li>
                                    <li>• Deferral to next batch may be offered as an alternative to refund</li>
                                </ul>
                            </div>
                        </Section>

                        {/* Contact */}
                        <Section icon={<FiMail />} title="Contact for Refund Queries">
                            <p>For any questions or to initiate a refund request, please contact us:</p>
                            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                                <p className="font-semibold text-white mb-3">Tech Savvy Solution - Refund Department</p>
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2 text-gray-400">
                                        <FiMail className="text-blue-400" />
                                        <a href="mailto:info@techsavvysolution.in" className="hover:text-white transition-colors">info@techsavvysolution.in</a>
                                    </p>
                                    <p className="flex items-center gap-2 text-gray-400">
                                        <FiPhone className="text-green-400" />
                                        <a href="tel:+919510634082" className="hover:text-white transition-colors">+91 9510634082</a>
                                    </p>
                                    <p className="flex items-center gap-2 text-gray-400">
                                        <FiMapPin className="text-purple-400" />
                                        Surat, Gujarat, India
                                    </p>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">Business Hours: Monday - Friday, 9:00 AM - 7:00 PM IST</p>
                            </div>
                        </Section>

                        {/* Policy Changes */}
                        <Section icon={<FiRefreshCw />} title="Changes to This Policy">
                            <p>We reserve the right to modify this Refund & Cancellation Policy at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes constitutes acceptance of the modified policy.</p>
                            <p className="mt-4">We will notify enrolled students of material changes via email.</p>
                        </Section>

                        {/* Acknowledgment */}
                        <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                            <p className="text-white text-center font-semibold mb-2">
                                Acknowledgment
                            </p>
                            <p className="text-gray-300 text-center text-sm">
                                By enrolling in any Tech Savvy Solution program or service, you acknowledge that you have read, understood, and agree to this Refund & Cancellation Policy.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

// Section Component (reuse from previous pages)
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

// Additional import
import { FiCode } from "react-icons/fi";

export default RefundPolicyPage;
