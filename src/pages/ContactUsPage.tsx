import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { Helmet } from "react-helmet";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiSend,
    FiLinkedin,
    FiInstagram,
    FiYoutube,
    FiGithub,
    FiCheckCircle,
    FiClock,
    FiGlobe
} from "react-icons/fi";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

const services = [
    'Microservices Architecture',
    'SaaS Development',
    'Android Development',
    'Web Development',
    'Backend & API Development',
    'Cloud & DevOps',
    'Cross-Platform Mobile',
    'Enterprise Solutions'
];

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        selectedServices: [] as string[]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleServiceToggle = (service: string) => {
        setFormData(prev => ({
            ...prev,
            selectedServices: prev.selectedServices.includes(service)
                ? prev.selectedServices.filter(s => s !== service)
                : [...prev.selectedServices, service]
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        if (formData.name.trim() === '') {
            setStatusMessage('Please enter your name');
            return false;
        }
        if (formData.email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setStatusMessage('Please enter a valid email address');
            return false;
        }
        if (formData.subject.trim() === '') {
            setStatusMessage('Please enter a subject');
            return false;
        }
        if (formData.message.trim() === '') {
            setStatusMessage('Please enter your message');
            return false;
        }
        if (formData.selectedServices.length === 0) {
            setStatusMessage('Please select at least one service');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setSubmitStatus('error');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contactus.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                    services: formData.selectedServices.join(', ')
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitStatus('success');
                setStatusMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                    selectedServices: []
                });
            } else {
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error) {
            setSubmitStatus('error');
            setStatusMessage('Failed to send message. Please try again or contact us directly via email.');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-950 min-h-screen">
            <Helmet>
                <title>Contact Us | Tech Savvy Solution - Get In Touch</title>
                <meta name="description" content="Contact Tech Savvy Solution for enterprise software development, microservices architecture, SaaS platforms, and mobile applications. Based in Surat, Gujarat." />
                <meta property="og:title" content="Contact Us | Tech Savvy Solution" />
                <meta property="og:description" content="Get in touch with our team for your next software project" />
            </Helmet>

            {/* Hero Section */}
            <HeroSection />

            {/* Main Content */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12 items-start">

                        {/* Left Side - Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-2 space-y-8"
                        >
                            {/* Intro Text */}
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Let's Build Something Amazing Together
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    Have a project in mind? We'd love to hear about it. Whether you need microservices architecture, SaaS platforms, or mobile applications, our team is ready to turn your vision into reality.
                                </p>
                            </div>

                            {/* Contact Cards */}
                            <div className="space-y-4">
                                <ContactCard
                                    icon={<FiMail className="text-2xl" />}
                                    title="Email Us"
                                    content="info@techsavvysolution.in"
                                    link="mailto:info@techsavvysolution.in"
                                    color="from-blue-500 to-cyan-500"
                                />
                                <ContactCard
                                    icon={<FiPhone className="text-2xl" />}
                                    title="Call Us"
                                    content="+91 9510634082"
                                    link="tel:+919510634082"
                                    color="from-green-500 to-emerald-500"
                                />
                                <ContactCard
                                    icon={<FiMapPin className="text-2xl" />}
                                    title="Visit Us"
                                    content="Surat, Gujarat, India"
                                    link="https://maps.app.goo.gl/gccuSpkzeJY19D4q9"
                                    color="from-purple-500 to-pink-500"
                                />
                            </div>

                            {/* Business Hours */}
                            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                        <FiClock className="text-white text-2xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Business Hours</h3>
                                </div>
                                <div className="space-y-2 text-gray-400">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="text-white font-semibold">9:00 AM - 7:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="text-white font-semibold">10:00 AM - 5:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="text-gray-500">Closed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    <SocialButton
                                        icon={<FiLinkedin />}
                                        link="https://linkedin.com/company/tech-savvy-it-solution"
                                        color="bg-blue-600 hover:bg-blue-700"
                                    />
                                    <SocialButton
                                        icon={<FiInstagram />}
                                        link="https://instagram.com/tech_savvy_solution"
                                        color="bg-pink-600 hover:bg-pink-700"
                                    />
                                    <SocialButton
                                        icon={<FiYoutube />}
                                        link="https://www.youtube.com/@tech-savvy-solution"
                                        color="bg-red-600 hover:bg-red-700"
                                    />
                                    <SocialButton
                                        icon={<FiGithub />}
                                        link="https://github.com/PatelShakil/tech-savvy"
                                        color="bg-gray-700 hover:bg-gray-600"
                                    />
                                    <SocialButton
                                        icon={<FiGlobe />}
                                        link="https://techsavvysolution.patelshakil.tech"
                                        color="bg-purple-600 hover:bg-purple-700"
                                    />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-6 rounded-xl border border-blue-500/30">
                                <h3 className="text-lg font-bold text-white mb-4">Why Choose Us?</h3>
                                <div className="space-y-3">
                                    {[
                                        'MSME Registered Company',
                                        'Young Developer 2024 Winner',
                                        '2+ Years Production Experience',
                                        '20+ Projects Delivered',
                                        '10K+ Active Users Served'
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <FiCheckCircle className="text-green-400 flex-shrink-0" />
                                            <span className="text-gray-300 text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-3"
                        >
                            <div className="bg-gray-900 rounded-2xl p-8 md:p-10 border border-gray-800 shadow-2xl">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Send Us a Message</h3>
                                <p className="text-gray-400 mb-8">Fill out the form below and we'll get back to you within 24 hours</p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Services Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-3">
                                            I'm interested in... <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {services.map((service) => (
                                                <button
                                                    key={service}
                                                    type="button"
                                                    onClick={() => handleServiceToggle(service)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                        formData.selectedServices.includes(service)
                                                            ? 'bg-gradient-to-r from-teal-950 to-gray-950 text-white shadow-lg scale-105'
                                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {service}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Name & Email Row */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-white mb-2">
                                                Your Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-white mb-2">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone & Subject Row */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-white mb-2">
                                                Phone Number <span className="text-gray-500">(Optional)</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+91 9876543210"
                                                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-white mb-2">
                                                Subject <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                placeholder="Project Inquiry"
                                                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-2">
                                            Your Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Tell us about your project requirements..."
                                            rows={6}
                                            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                                            required
                                        />
                                    </div>

                                    {/* Status Message */}
                                    {submitStatus !== 'idle' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-lg ${
                                                submitStatus === 'success'
                                                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                                                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {submitStatus === 'success' ? (
                                                    <FiCheckCircle className="text-xl flex-shrink-0 mt-0.5" />
                                                ) : (
                                                    <span className="text-xl flex-shrink-0">⚠️</span>
                                                )}
                                                <p className="text-sm">{statusMessage}</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                                            isSubmitting
                                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message <FiSend />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-500 text-center">
                                        By submitting this form, you agree to our Privacy Policy and Terms of Service
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section (Optional) */}
            <section className="py-12 px-4 bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Us</h2>
                        <p className="text-gray-400">Based in Surat, Gujarat - Serving clients nationwide</p>
                    </motion.div>
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        whileInView={{opacity: 1, scale: 1}}
                        viewport={{once: true}}
                        className="rounded-2xl overflow-hidden border border-gray-800 h-96"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d426.3830654002307!2d72.82201183672346!3d21.20041684685114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e8a11a61c17%3A0x5cbba30c6722cf28!2sSodagerwad%2C%20Surat%2C%20Gujarat%20395003!5e0!3m2!1sen!2sin!4v1766646115400!5m2!1sen!2sin"
                         height={"100%"} width={"100%"}
                            style={{border:"0"}}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

// ============ HERO SECTION ============
const HeroSection = () => {
    return (
        <section
            className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 pt-32 pb-20 px-4">
            <motion.div
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8 }}
                className="max-w-4xl mx-auto text-center"
            >
                <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text"
                    style={{ backgroundImage: gradient }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    Get In Touch
                </motion.h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                    Have a project in mind? Let's discuss how we can help bring your vision to life with production-grade software solutions.
                </p>
            </motion.div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

// ============ CONTACT CARD COMPONENT ============
const ContactCard = ({ icon, title, content, link, color }: any) => {
    return (
        <a
            href={link}
            target={link.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="block group"
        >
            <div className="flex items-center gap-4 p-5 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all group-hover:shadow-lg">
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-white">{icon}</span>
                </div>
                <div>
                    <div className="text-xs text-gray-500 mb-1">{title}</div>
                    <div className="text-white font-semibold">{content}</div>
                </div>
            </div>
        </a>
    );
};

// ============ SOCIAL BUTTON COMPONENT ============
const SocialButton = ({ icon, link, color }: any) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-xl transition-all hover:scale-110 hover:shadow-lg`}
        >
            {icon}
        </a>
    );
};

export default ContactUsPage;
