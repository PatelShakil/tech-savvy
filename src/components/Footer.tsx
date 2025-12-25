import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiLinkedin,
    FiInstagram,
    FiYoutube,
    FiGithub,
    FiGlobe,
    FiArrowRight,
    FiAward
} from "react-icons/fi";
import {useEffect, useState} from "react";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text" style={{ backgroundImage: gradient }}>
                            Tech Savvy Solution
                        </h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            MSME registered IT solution provider delivering enterprise-grade microservices, SaaS platforms, and mobile applications across India.
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                <FiAward className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Award Winning</p>
                                <p className="text-sm font-semibold text-yellow-400">Young Developer 2024</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>MSME Registered Company</span>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <FooterLink to="/" label="Home" />
                            <FooterLink to="/aboutus" label="About Us" />
                            <FooterLink to="/projects" label="Projects" />
                            <FooterLink to="/services" label="Services" />
                            <FooterLink to="/programs" label="Internship Programs" />
                            <FooterLink to="/contactus" label="Contact Us" />
                        </ul>
                    </motion.div>

                    {/* Our Services */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <h3 className="text-lg font-bold mb-6">Our Services</h3>
                        <ul className="space-y-3">
                            <li className="text-gray-400 hover:text-blue-400 transition-colors text-sm cursor-default">Microservices Architecture</li>
                            <li className="text-gray-400 hover:text-blue-400 transition-colors text-sm cursor-default">SaaS Development</li>
                            <li className="text-gray-400 hover:text-blue-400 transition-colors text-sm cursor-default">Android Development</li>
                            <li className="text-gray-400 hover:text-blue-400 transition-colors text-sm cursor-default">Web Development</li>
                            <li className="text-gray-400 hover:text-blue-400 transition-colors text-sm cursor-default">Cloud & DevOps</li>
                            <li className="text-gray-400 hover:text-blue-400 transition-colors text-sm cursor-default">Enterprise Solutions</li>
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-1"
                    >
                        <h3 className="text-lg font-bold mb-6">Get In Touch</h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="mailto:info@techsavvysolution.in"
                                    className="flex items-start gap-3 text-gray-400 hover:text-blue-400 transition-colors group"
                                >
                                    <FiMail className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm break-all">info@techsavvysolution.in</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+919510634082"
                                    className="flex items-start gap-3 text-gray-400 hover:text-blue-400 transition-colors group"
                                >
                                    <FiPhone className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">+91 9510634082</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://maps.app.goo.gl/gccuSpkzeJY19D4q9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 text-gray-400 hover:text-blue-400 transition-colors group"
                                >
                                    <FiMapPin className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">Surat, Gujarat, India</span>
                                </a>
                            </li>
                        </ul>

                        {/* Social Media */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold mb-4">Follow Us</h4>
                            <div className="flex gap-3">
                                <SocialIcon
                                    icon={<FiLinkedin />}
                                    link="https://linkedin.com/company/tech-savvy-it-solution"
                                    color="hover:bg-blue-600"
                                />
                                <SocialIcon
                                    icon={<FiInstagram />}
                                    link="https://instagram.com/tech_savvy_solution"
                                    color="hover:bg-pink-600"
                                />
                                <SocialIcon
                                    icon={<FiYoutube />}
                                    link="https://www.youtube.com/@tech-savvy-solution"
                                    color="hover:bg-red-600"
                                />
                                <SocialIcon
                                    icon={<FiGithub />}
                                    link="https://github.com/PatelShakil/tech-savvy"
                                    color="hover:bg-gray-700"
                                />
                                <SocialIcon
                                    icon={<FiGlobe />}
                                    link="https://techsavvysolution.patelshakil.tech"
                                    color="hover:bg-purple-600"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Newsletter/CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 p-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl border border-blue-500/30"
                >
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-3">
                                Ready to Start Your Project?
                            </h3>
                            <p className="text-gray-300">
                                Let's discuss how we can bring your vision to life with production-grade software solutions.
                            </p>
                        </div>
                        <div className="flex justify-start md:justify-end">
                            <Link
                                to="/contactus"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-950 to-gray-950 hover:from-teal-800 hover:to-gray-800 rounded-full font-bold transition-all hover:shadow-lg hover:scale-105"
                            >
                                Get Started <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <div className="text-gray-500 text-sm text-center md:text-left">
                            <p>© {currentYear} <span className="text-white font-semibold">Tech Savvy Solution</span>. All rights reserved.</p>
                            <p className="text-xs mt-1">MSME Registered | Surat, Gujarat, India</p>
                        </div>

                        {/* Legal Links */}
                        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                            <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms-of-service" className="hover:text-blue-400 transition-colors">
                                Terms of Service
                            </Link>
                            <Link to="/sitemap" className="hover:text-blue-400 transition-colors">
                                Sitemap
                            </Link>
                        </div>
                    </div>

                    {/* Credits */}
                    <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                        <p className="text-xs text-gray-600">
                            Designed & Developed with <span className="text-red-500">❤️</span> by <a href="https://patelshakil.techsavvysolution.in" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">MuhammadShakil Patel</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button (Optional) */}
            <ScrollToTopButton />
        </footer>
    );
};

// ============ FOOTER LINK COMPONENT ============
const FooterLink = ({ to, label }: { to: string; label: string }) => {
    return (
        <li>
            <Link
                to={to}
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group text-sm"
            >
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300" />
                {label}
            </Link>
        </li>
    );
};

// ============ SOCIAL ICON COMPONENT ============
const SocialIcon = ({ icon, link, color }: { icon: React.ReactNode; link: string; color: string }) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 bg-gray-800 ${color} rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg`}
        >
            {icon}
        </a>
    );
};

// ============ SCROLL TO TOP BUTTON ============
const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-teal-950 to-gray-950 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </motion.button>
            )}
        </>
    );
};

export default Footer;
