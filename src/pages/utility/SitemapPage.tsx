import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
    FiHome,
    FiCode,
    FiFolder,
    FiUsers,
    FiMail,
    FiFileText,
    FiShield,
    FiAward,
    FiChevronRight
} from "react-icons/fi";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

const SitemapPage = () => {
    const siteStructure = [
        {
            category: "Main Pages",
            icon: <FiHome />,
            color: "from-blue-500 to-cyan-500",
            links: [
                { name: "Home", path: "/", description: "Welcome to Tech Savvy Solution" },
                { name: "About Us", path: "/about", description: "Learn about our company and mission" },
                { name: "Contact Us", path: "/contactus", description: "Get in touch with our team" }
            ]
        },
        {
            category: "Services",
            icon: <FiCode />,
            color: "from-purple-500 to-pink-500",
            links: [
                { name: "Our Services", path: "/services", description: "Explore our IT solutions" },
                { name: "Microservices Architecture", path: "/services#microservices", description: "Scalable enterprise solutions" },
                { name: "SaaS Development", path: "/services#saas", description: "Cloud-based platforms" },
                { name: "Mobile Applications", path: "/services#mobile", description: "Android & cross-platform apps" },
                { name: "Web Development", path: "/services#web", description: "Modern web applications" }
            ]
        },
        {
            category: "Programs",
            icon: <FiAward />,
            color: "from-green-500 to-emerald-500",
            links: [
                { name: "All Programs", path: "/programs", description: "View available internship & mentorship programs" },
                { name: "Internship Programs", path: "/programs?filter=internship", description: "Hands-on training programs" },
                { name: "Mentorship Programs", path: "/programs?filter=mentorship", description: "One-on-one guidance" },
                { name: "Workshops", path: "/programs?filter=workshop", description: "Short-term skill-building" }
            ]
        },
        {
            category: "Projects",
            icon: <FiFolder />,
            color: "from-orange-500 to-red-500",
            links: [
                { name: "Our Projects", path: "/projects", description: "Showcase of our work" },
                { name: "ByteBuddy", path: "/projects#bytebuddy", description: "EduCollab learning platform" },
                { name: "SmugLinks", path: "/projects#smuglinks", description: "URL shortening service" },
                { name: "BIMS", path: "/projects#bims", description: "Barcode inventory management" },
                { name: "ShowCaseMe", path: "/projects#showcaseme", description: "Portfolio builder platform" }
            ]
        },
        {
            category: "Student Portal",
            icon: <FiUsers />,
            color: "from-indigo-500 to-purple-500",
            links: [
                { name: "Student Login", path: "/student/login", description: "Access your account" },
                { name: "Student Signup", path: "/student/signup", description: "Create new account" },
                { name: "Dashboard", path: "/student/dashboard", description: "View your progress (login required)" },
                { name: "My Programs", path: "/student/programs", description: "Your enrolled programs" }
            ]
        },
        {
            category: "Legal & Information",
            icon: <FiShield />,
            color: "from-yellow-500 to-orange-500",
            links: [
                { name: "Privacy Policy", path: "/privacy-policy", description: "How we handle your data" },
                { name: "Terms of Service", path: "/terms-of-service", description: "Terms and conditions" },
                { name: "Refund Policy", path: "/refund-policy", description: "Cancellation and refunds" },
                { name: "Sitemap", path: "/sitemap", description: "This page - site structure" }
            ]
        }
        // ,
        // {
        //     category: "Resources",
        //     icon: <FiBook />,
        //     color: "from-teal-500 to-cyan-500",
        //     links: [
        //         { name: "Blog", path: "/blog", description: "Tech articles and insights" },
        //         { name: "Documentation", path: "/docs", description: "API and project documentation" },
        //         { name: "FAQs", path: "/faqs", description: "Frequently asked questions" },
        //         { name: "Career", path: "/career", description: "Join our team" }
        //     ]
        // }
    ];

    return (
        <div className="min-h-screen bg-gray-950">
            <Helmet>
                <title>Sitemap | Tech Savvy Solution</title>
                <meta name="description" content="Complete sitemap of Tech Savvy Solution website. Find all pages and navigate easily." />
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
                        Sitemap
                    </h1>
                    <p className="text-xl text-gray-300 mb-4">
                        Navigate through all pages of Tech Savvy Solution
                    </p>
                    <p className="text-gray-400">
                        Complete site structure for easy navigation and discovery
                    </p>
                </motion.div>
            </section>

            {/* Quick Stats */}
            <section className="py-12 px-4 bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { number: "50+", label: "Total Pages" },
                            { number: "7", label: "Categories" },
                            { number: "10+", label: "Services" },
                            { number: "24/7", label: "Support" }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sitemap Content */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-12">
                        {siteStructure.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                                        {section.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{section.category}</h2>
                                        <p className="text-gray-400 text-sm">{section.links.length} pages</p>
                                    </div>
                                </div>

                                {/* Links Grid */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {section.links.map((link, linkIdx) => (
                                        <Link
                                            key={linkIdx}
                                            to={link.path}
                                            className="group flex items-start gap-3 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all"
                                        >
                                            <FiChevronRight className="text-blue-400 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                                                    {link.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    {link.description}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Resources */}
            <section className="py-20 px-4 bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            External Links & Resources
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Connect with us on various platforms
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                name: "LinkedIn Company",
                                url: "https://linkedin.com/company/tech-savvy-it-solution",
                                icon: "🔗",
                                desc: "Follow us for updates"
                            },
                            {
                                name: "Instagram",
                                url: "https://instagram.com/tech_savvy_solution",
                                icon: "📸",
                                desc: "See our latest posts"
                            },
                            {
                                name: "YouTube Channel",
                                url: "https://www.youtube.com/@tech-savvy-solution",
                                icon: "🎥",
                                desc: "Watch our tutorials"
                            },
                            {
                                name: "GitHub",
                                url: "https://github.com/PatelShakil",
                                icon: "💻",
                                desc: "View our open source projects"
                            },
                            {
                                name: "Main Website",
                                url: "https://techsavvysolution.in",
                                icon: "🌐",
                                desc: "Our official website"
                            },
                            {
                                name: "Email Us",
                                url: "mailto:info@techsavvysolution.in",
                                icon: "✉️",
                                desc: "Direct email contact"
                            }
                        ].map((resource, idx) => (
                            <motion.a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="block p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all"
                            >
                                <div className="text-4xl mb-3">{resource.icon}</div>
                                <h3 className="text-white font-bold text-lg mb-1">{resource.name}</h3>
                                <p className="text-gray-400 text-sm">{resource.desc}</p>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* XML Sitemap Notice */}
            <section className="py-12 px-4 bg-gray-950">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Looking for XML Sitemap?
                        </h3>
                        <p className="text-gray-300 mb-6">
                            For search engines and SEO tools, access our XML sitemap
                        </p>
                        <a
                            href="/sitemap.xml"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-semibold transition-all"
                        >
                            View XML Sitemap <FiChevronRight />
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-teal-950 to-gray-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Can't Find What You're Looking For?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Our team is here to help you navigate our services
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/contactus"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-bold transition-all inline-flex items-center gap-2"
                        >
                            <FiMail /> Contact Us
                        </Link>
                        <a
                            href="tel:+919510634082"
                            className="px-8 py-4 bg-transparent border-2 border-blue-500 hover:bg-blue-500/10 text-white rounded-full font-bold transition-all"
                        >
                            Call: +91 9510634082
                        </a>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default SitemapPage;
