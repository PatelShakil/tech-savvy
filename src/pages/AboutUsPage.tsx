import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
    FiAward,
    FiUsers,
    FiTrendingUp,
    FiCheckCircle,
    FiMapPin,
    FiMail,
    FiPhone,
    FiLinkedin,
    FiGithub,
    FiTarget,
    FiHeart,
    FiCode, FiArrowRight
} from "react-icons/fi";
import {
    SiSpring as SiJakartaee,
    SiReact,
    SiKotlin,
    SiDocker,
    SiApachekafka,
    SiPostgresql
} from "react-icons/si";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

const AboutUsPage = () => {
    return (
        <div className="bg-gray-950 min-h-screen">
            <Helmet>
                <title>About Us | Tech Savvy Solution - MSME Registered IT Company Surat</title>
                <meta property="og:url" content="https://techsavvysolution.in/about" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="About Us | Tech Savvy Solution" />
                <meta property="og:description" content="MSME registered IT solution provider in Surat, Gujarat. Founded by Young Developer 2024 Winner MuhammadShakil Patel. Delivering enterprise-grade microservices, SaaS platforms, and mobile applications across government, education, and corporate sectors." />
                <meta property="og:image" content="https://techsavvysolution.in/assets/preview_image.png" />
                <meta name="keywords" content="Tech Savvy Solution, MSME registered, IT company Surat, MuhammadShakil Patel, Microservices, SaaS, Android Development, Young Developer 2024" />
            </Helmet>

            {/* Hero Section */}
            <HeroSection />

            {/* Company Story */}
            <StorySection />

            {/* Founder Section */}
            <FounderSection />

            {/* Mission & Vision */}
            <MissionVisionSection />

            {/* Credentials & Recognition */}
            <CredentialsSection />

            {/* Our Values */}
            <ValuesSection />

            {/* Team Culture */}
            <CultureSection />

            {/* Stats & Achievements */}
            <AchievementsSection />

            {/* Why Choose Us */}
            <WhyChooseUsSection />

            {/* Contact Info */}
            <ContactInfoSection />
        </div>
    );
};

// ============ HERO SECTION ============
const HeroSection = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 pt-32 pb-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="inline-block mb-6"
                >
                    <span className="px-6 py-3 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 font-semibold inline-flex items-center gap-2">
                        <FiCheckCircle /> MSME Registered • Officially Recognized
                    </span>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-transparent bg-clip-text"
                    style={{ backgroundImage: gradient }}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    About Us
                </motion.h1>

                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                    An <span className="text-blue-400 font-bold">MSME registered</span> IT solution provider based in Surat, Gujarat, committed to delivering <span className="text-purple-400 font-bold">enterprise-grade software</span> that transforms businesses and empowers communities.
                </p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                        🏆 Award-Winning Team
                    </span>
                    <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                        📍 Surat, Gujarat
                    </span>
                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                        🚀 2+ Years Production Experience
                    </span>
                </motion.div>
            </motion.div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(25)].map((_, i) => (
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

// ============ STORY SECTION ============
const StorySection = () => {
    return (
        <section className="py-20 px-4 bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Story</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-teal-950 to-gray-950 mx-auto mb-8" />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                            <p>
                                Tech Savvy Solution was founded with a clear vision: to bridge the gap between cutting-edge technology and real-world business challenges. What started as a passion project has evolved into an <strong className="text-white">officially MSME registered company</strong> serving clients across government, education, and corporate sectors.
                            </p>
                            <p>
                                Based in <strong className="text-blue-400">Surat, Gujarat</strong>, we've built a reputation for delivering production-grade systems that don't just meet expectations—they exceed them. From microservices architectures handling thousands of concurrent users to award-winning mobile applications, we've proven that Indian tech talent can compete on a global stage.
                            </p>
                            <p>
                                Our journey has been marked by significant milestones: winning the <strong className="text-yellow-400">Young Developer 2024 Award</strong>, deploying systems for government feedback platforms, building SaaS solutions for enterprises, and mentoring the next generation of developers through our internship programs.
                            </p>
                            <p className="text-white font-semibold">
                                Today, we stand proud as a registered MSME entity, committed to excellence, innovation, and the belief that great software can transform lives.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 p-8 rounded-2xl border border-blue-500/20">
                            <FiTarget className="text-blue-400 text-4xl mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-3">Our Genesis</h3>
                            <p className="text-gray-400">
                                Born from a desire to build meaningful software, Tech Savvy Solution emerged as a response to the growing need for scalable, production-ready solutions in India's digital transformation journey.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 p-8 rounded-2xl border border-purple-500/20">
                            <FiHeart className="text-purple-400 text-4xl mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-3">Our Promise</h3>
                            <p className="text-gray-400">
                                Every line of code we write, every system we architect, and every client we serve receives the same level of dedication: production-grade quality, clean architecture, and real-world impact.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============ FOUNDER SECTION ============
const FounderSection = () => {
    return (
        <section className="py-20 px-4 bg-gray-950">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Meet Our Founder</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-teal-950 to-gray-950 mx-auto mb-8" />
                </motion.div>

                <div className="grid md:grid-cols-5 gap-8 items-center">
                    {/* Founder Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-2"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-950 to-gray-950 rounded-3xl blur-xl opacity-30" />
                            <img
                                src="/assets/shakil-founder.jpg"
                                alt="MuhammadShakil Patel - Founder"
                                className="relative w-full max-w-md mx-auto rounded-3xl border-4 border-blue-500 shadow-2xl"
                            />
                            <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg">
                                🏆 Young Developer 2024
                            </div>
                        </div>
                    </motion.div>

                    {/* Founder Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-3 space-y-6"
                    >
                        <div>
                            <h3 className="text-4xl font-bold text-white mb-2">MuhammadShakil Patel</h3>
                            <p className="text-xl text-blue-400 font-semibold mb-4">
                                Founder & Lead Software Architect
                            </p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                                    M.Sc. ICT (VNSGU) - In Progress
                                </span>
                                <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30">
                                    BCA - 89.03% (VNSGU)
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed">
                            A results-driven software engineer with <strong className="text-white">2+ years of hands-on experience</strong> designing and deploying enterprise-grade microservices, SaaS platforms, and mobile applications. Specialized in <strong className="text-blue-400">Jakarta EE, Apache Kafka, Kotlin/Jetpack Compose, React.js</strong>, and event-driven architectures.
                        </p>

                        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FiCode className="text-purple-400" /> Core Expertise
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { name: 'Jakarta EE', icon: <SiJakartaee /> },
                                    { name: 'Apache Kafka', icon: <SiApachekafka /> },
                                    { name: 'React.js', icon: <SiReact /> },
                                    { name: 'Kotlin', icon: <SiKotlin /> },
                                    { name: 'Docker', icon: <SiDocker /> },
                                    { name: 'PostgreSQL', icon: <SiPostgresql /> }
                                ].map((tech, i) => (
                                    <div key={i} className="flex items-center gap-2 text-gray-400">
                                        <span className="text-blue-400 text-xl">{tech.icon}</span>
                                        <span className="text-sm">{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 rounded-xl border border-yellow-500/20">
                            <div className="flex items-start gap-4">
                                <FiAward className="text-yellow-400 text-3xl flex-shrink-0" />
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Young Developer 2024 Winner</h4>
                                    <p className="text-gray-400">
                                        Awarded by Veer Narmad South Gujarat University (VNSGU) for innovative work on ByteBuddy - The EduCollab Learning Platform, serving 500+ active users.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/in/patelshakil" target="_blank" rel="noopener noreferrer"
                               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold inline-flex items-center gap-2 transition-colors">
                                <FiLinkedin /> LinkedIn
                            </a>
                            <a href="https://github.com/PatelShakil" target="_blank" rel="noopener noreferrer"
                               className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-semibold inline-flex items-center gap-2 transition-colors">
                                <FiGithub /> GitHub
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============ MISSION & VISION SECTION ============
const MissionVisionSection = () => {
    return (
        <section className="py-20 px-4 bg-gradient-to-br from-teal-950 to-gray-950">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                            <FiTarget className="text-white text-3xl" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Our Mission</h3>
                        <div className="w-16 h-1 bg-blue-500 mb-6" />
                        <p className="text-gray-300 text-lg leading-relaxed">
                            To democratize access to enterprise-grade technology by building scalable, production-ready software solutions that solve real-world problems. We empower businesses, government bodies, and educational institutions with systems designed for performance, security, and longevity.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                            <FiTrendingUp className="text-white text-3xl" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Our Vision</h3>
                        <div className="w-16 h-1 bg-purple-500 mb-6" />
                        <p className="text-gray-300 text-lg leading-relaxed">
                            To be recognized as India's leading software architecture firm, known for excellence in microservices design, event-driven systems, and developer mentorship. We envision a future where every team member we train and every system we build contributes to India's digital transformation.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============ CREDENTIALS SECTION ============
const CredentialsSection = () => {
    return (
        <section className="py-20 px-4 bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Credentials & Recognition</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-teal-950 to-gray-950 mx-auto mb-8" />
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Officially recognized and registered, committed to transparency and professionalism
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <FiCheckCircle className="text-4xl" />,
                            title: "MSME Registered",
                            desc: "Officially registered under the Ministry of Micro, Small and Medium Enterprises, Government of India",
                            color: "from-green-500 to-emerald-600"
                        },
                        {
                            icon: <FiAward className="text-4xl" />,
                            title: "Young Developer 2024",
                            desc: "1st Prize Winner at Veer Narmad South Gujarat University for ByteBuddy EduCollab Platform",
                            color: "from-yellow-500 to-orange-600"
                        },
                        {
                            icon: <FiMapPin className="text-4xl" />,
                            title: "Based in Surat, Gujarat",
                            desc: "Proudly serving clients locally and nationally from our base in Gujarat's commercial hub",
                            color: "from-blue-500 to-indigo-600"
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                            <div className="relative bg-gray-800 p-8 rounded-2xl border border-gray-700 group-hover:border-blue-500/50 transition-all">
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-6`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============ VALUES SECTION ============
const ValuesSection = () => {
    const values = [
        {
            icon: <FiCode />,
            title: "Clean Architecture",
            desc: "We follow SOLID principles, domain-driven design, and industry best practices in every project"
        },
        {
            icon: <FiCheckCircle />,
            title: "Production Quality",
            desc: "Every system we deliver is built for production—scalable, secure, and tested for real-world use"
        },
        {
            icon: <FiUsers />,
            title: "Client-Centric",
            desc: "Your success is our success. We listen, adapt, and deliver solutions that truly solve your problems"
        },
        {
            icon: <FiTrendingUp />,
            title: "Continuous Learning",
            desc: "Technology evolves, and so do we. We stay ahead with the latest tools, frameworks, and methodologies"
        },
        {
            icon: <FiHeart />,
            title: "Ethical Practices",
            desc: "Transparency, honesty, and integrity guide every client relationship and business decision"
        },
        {
            icon: <FiAward />,
            title: "Excellence First",
            desc: "Good is not enough. We strive for excellence in code quality, user experience, and system performance"
        }
    ];

    return (
        <section className="py-20 px-4 bg-gray-950">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Core Values</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-teal-950 to-gray-950 mx-auto mb-8" />
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        The principles that guide every decision, every line of code, and every client interaction
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {values.map((value, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-950 to-gray-950 rounded-lg flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============ CULTURE SECTION ============
const CultureSection = () => {
    return (
        <section className="py-20 px-4 bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Culture</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-teal-950 to-gray-950 mx-auto mb-8" />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 p-6 rounded-xl border border-blue-500/20">
                            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                                <FiUsers className="text-blue-400" /> Mentorship & Growth
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                We believe in giving back. Our internship and mentorship programs have trained dozens of developers, preparing them for real-world software engineering roles with hands-on project experience.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 p-6 rounded-xl border border-purple-500/20">
                            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                                <FiCode className="text-purple-400" /> Code-First Mindset
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                We're builders at heart. Clean code, proper documentation, comprehensive testing—these aren't optional, they're our standard operating procedure for every project, big or small.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 p-6 rounded-xl border border-green-500/20">
                            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                                <FiTrendingUp className="text-green-400" /> Innovation Driven
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                From microservices architecture to event-driven systems, we don't just use the latest technologies—we master them. Our projects showcase modern patterns like CQRS, DDD, and polyglot persistence.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/10 to-yellow-600/10 p-6 rounded-xl border border-orange-500/20">
                            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                                <FiHeart className="text-orange-400" /> Community Impact
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                Beyond commercial projects, we're committed to social impact—building government feedback platforms, educational apps, and CSR management systems that serve thousands of citizens.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============ ACHIEVEMENTS SECTION ============
const AchievementsSection = () => {
    const stats = [
        { number: "20+", label: "Projects Delivered", sublabel: "Across multiple sectors" },
        { number: "10K+", label: "Active Users", sublabel: "Served by our systems" },
        { number: "7", label: "Microservices", sublabel: "In production (BoloIndia)" },
        { number: "500+", label: "CSR Tracking", sublabel: "Users (KP Group)" },
        { number: "50K+", label: "School Admins", sublabel: "Using myCampus App" },
        { number: "89.03%", label: "Founder's BCA", sublabel: "Academic Excellence" }
    ];

    return (
        <section className="py-20 px-4 bg-gradient-to-br from-teal-950 to-gray-950">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">By The Numbers</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-teal-950 to-gray-950 mx-auto mb-8" />
                    <p className="text-gray-400 text-lg">
                        Measurable impact, proven results
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-center bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10"
                        >
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-white font-semibold mb-1">{stat.label}</div>
                            <div className="text-xs text-gray-400">{stat.sublabel}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============ WHY CHOOSE US SECTION ============
const WhyChooseUsSection = () => {
    const reasons = [
        {
            title: "MSME Registered & Legally Compliant",
            desc: "Official registration ensures transparency, accountability, and professionalism in every engagement"
        },
        {
            title: "Award-Winning Expertise",
            desc: "Young Developer 2024 recognition validates our technical excellence and innovative approach"
        },
        {
            title: "Production-Grade Systems",
            desc: "We don't build prototypes. Every system is designed to handle real-world scale and complexity"
        },
        {
            title: "Full-Stack Mastery",
            desc: "From microservices backends to modern mobile apps—we handle the entire technology stack"
        },
        {
            title: "Client Success Stories",
            desc: "Government platforms, corporate CSR systems, educational apps—our portfolio speaks for itself"
        },
        {
            title: "Transparent Communication",
            desc: "Regular updates, clear timelines, honest estimates—no surprises, just professional delivery"
        }
    ];

    return (
        <section className="py-20 px-4 bg-gray-950">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose Tech Savvy Solution?</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-teal-950 to-gray-950 mx-auto mb-8" />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {reasons.map((reason, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-4 p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-950 to-gray-950 rounded-lg flex items-center justify-center">
                                    <FiCheckCircle className="text-white text-xl" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">{reason.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{reason.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============ CONTACT INFO SECTION ============
const ContactInfoSection = () => {
    return (
        <section className="py-20 px-4 bg-gradient-to-r from-teal-950 to-gray-950">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Let's Build Something Great Together
                </h2>
                <p className="text-xl text-gray-100 mb-8">
                    Based in Surat, serving clients nationally. Ready to transform your vision into production-ready software.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                        <FiMapPin className="text-4xl text-white mx-auto mb-3" />
                        <div className="text-white font-semibold mb-1">Location</div>
                        <div className="text-gray-200 text-sm">Surat, Gujarat, India</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                        <FiMail className="text-4xl text-white mx-auto mb-3" />
                        <div className="text-white font-semibold mb-1">Email</div>
                        <a href={"mailto:info@techsavvysolution.in"} className="text-gray-200 text-sm">info@techsavvysolution.in</a>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                        <FiPhone className="text-4xl text-white mx-auto mb-3" />
                        <div className="text-white font-semibold mb-1">Phone</div>
                        <a href={"tel:919510634082"} className="text-gray-200 text-sm">+91 9510634082</a>
                    </div>
                </div>

                <button
                    onClick={() => window.location.href = '/contactus'}
                    className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                    Get In Touch <FiArrowRight />
                </button>
            </motion.div>
        </section>
    );
};

export default AboutUsPage;
