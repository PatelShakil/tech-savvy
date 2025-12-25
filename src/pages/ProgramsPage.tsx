import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import {
    FiCalendar,
    FiUsers,
    FiClock,
    FiArrowRight,
    FiAward,
    FiCheckCircle,
    FiDollarSign,
    FiCode,
    FiTarget,
    FiTrendingUp,
    FiStar,
    FiMessageCircle
} from 'react-icons/fi';

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

interface Program {
    id: string;
    name: string;
    description: string;
    category: string;
    status: string;
    startDate: string;
    endDate: string;
    applicationDeadline: string;
    maxStudents: number;
    feePerStudent: number;
    minGroupSize: number;
    maxGroupSize: number;
}

const ProgramsPage: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'internship' | 'mentorship' | 'workshop'>('all');

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const programsQuery = query(
                collection(db, 'programs'),
                where('status', 'in', ['active', 'upcoming']),
                orderBy('startDate', 'desc')
            );

            const programsSnap = await getDocs(programsQuery);
            const programsData = programsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Program[];

            setPrograms(programsData);
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrograms = filter === 'all'
        ? programs
        : programs.filter(p => p.category === filter);

    const isDeadlinePassed = (deadline: string) => {
        return new Date(deadline) < new Date();
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <Helmet>
                <title>Internship & Mentorship Programs | Tech Savvy Solution</title>
                <meta name="description" content="Join Tech Savvy Solution's internship and mentorship programs. Get hands-on experience with real-world projects, microservices architecture, and industry mentorship." />
            </Helmet>

            {/* Hero Section */}
            <HeroSection />

            {/* Stats Section */}
            <StatsSection />

            {/* Main Content */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Available Programs
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Choose the program that fits your goals and start your journey to becoming a production-ready developer
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-3 mb-12"
                    >
                        {['all', 'internship', 'mentorship', 'workshop'].map((category) => (
                            <motion.button
                                key={category}
                                onClick={() => setFilter(category as any)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 rounded-full font-semibold capitalize transition-all ${
                                    filter === category
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                                }`}
                            >
                                {category === 'all' ? 'All Programs' : category}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-20">
                            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-gray-400 text-lg">Loading programs...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredPrograms.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-teal-950 to-gray-950 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiAward className="text-white text-4xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No Programs Available</h3>
                            <p className="text-gray-400 text-lg mb-6">Check back soon for new opportunities!</p>
                            <Link
                                to="/contactus"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                            >
                                Contact Us for Updates <FiArrowRight />
                            </Link>
                        </motion.div>
                    )}

                    {/* Programs Grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredPrograms.map((program, idx) => (
                                <ProgramCard
                                    key={program.id}
                                    program={program}
                                    index={idx}
                                    isDeadlinePassed={isDeadlinePassed(program.applicationDeadline)}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <WhyChooseUsSection />


            {/* CTA Section */}
            <CTASection />
        </div>
    );
};

// ============ HERO SECTION ============
const HeroSection = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 to-gray-950 pt-32 pb-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="inline-block mb-6"
                >
                    <span className="px-6 py-3 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 font-semibold inline-flex items-center gap-2">
                        <FiCheckCircle /> Now Accepting Applications
                    </span>
                </motion.div>

                <motion.h1
                    className="text-5xl py-2 md:text-7xl font-bold mb-6 text-transparent bg-clip-text"
                    style={{ backgroundImage: gradient }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    Internship & Mentorship Programs
                </motion.h1>

                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                    Transform your career with <span className="text-blue-400 font-bold">production-grade training</span>,
                    <span className="text-purple-400 font-bold"> real-world projects</span>, and
                    <span className="text-green-400 font-bold"> industry mentorship</span> at India's MSME-registered tech company
                </p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30 text-sm">
                        🏆 Award-Winning Team
                    </span>
                    <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30 text-sm">
                        📍 MSME Registered
                    </span>
                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 text-sm">
                        🚀 Live Project Deployment
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

// ============ WHY CHOOSE US SECTION ============
const WhyChooseUsSection = () => {
    const benefits = [
        {
            icon: <FiCode />,
            title: "Production-Grade Training",
            desc: "Work on real microservices, event-driven systems, and SaaS platforms used by thousands"
        },
        {
            icon: <FiUsers />,
            title: "1-on-1 Mentorship",
            desc: "Personalized guidance from award-winning developers with 2+ years production experience"
        },
        {
            icon: <FiTarget />,
            title: "Live Project Deployment",
            desc: "Deploy your work to production and build a portfolio that impresses employers"
        },
        {
            icon: <FiAward />,
            title: "Industry-Recognized Certificates",
            desc: "MSME-registered company certificates valued by recruiters across India"
        },
        {
            icon: <FiTrendingUp />,
            title: "Career Growth Support",
            desc: "Resume building, interview prep, and job referrals to kickstart your career"
        },
        {
            icon: <FiStar />,
            title: "Modern Tech Stack",
            desc: "Jakarta EE, Apache Kafka, React, Kotlin, Docker - learn what companies actually use"
        }
    ];

    return (
        <section className="py-20 px-4 bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Why Choose Tech Savvy Solution?
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        We don't just teach theory - we build production-ready developers
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-teal-950 to-gray-950 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============ PROGRAM CARD COMPONENT ============
const ProgramCard = ({ program, index, isDeadlinePassed }: any) => {
    const categoryColors: any = {
        internship: 'from-blue-500 to-cyan-500',
        mentorship: 'from-purple-500 to-pink-500',
        workshop: 'from-green-500 to-emerald-500'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all shadow-xl hover:shadow-2xl"
        >
            {/* Header */}
            <div className={`bg-gradient-to-r ${categoryColors[program.category]} p-6`}>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-bold text-lg capitalize">{program.category}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        program.status === 'active'
                            ? 'bg-green-400 text-green-900'
                            : 'bg-yellow-400 text-yellow-900'
                    }`}>
                        {program.status === 'active' ? '🔥 Active' : '📅 Upcoming'}
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-white">{program.name}</h3>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">{program.description}</p>

                {/* Details Grid */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-300">
                        <FiCalendar className="text-blue-400 flex-shrink-0" />
                        <span className="text-sm">{program.startDate} to {program.endDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <FiClock className="text-orange-400 flex-shrink-0" />
                        <span className="text-sm">Apply by: <strong className="text-white">{program.applicationDeadline}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <FiUsers className="text-purple-400 flex-shrink-0" />
                        <span className="text-sm">Group Size: {program.minGroupSize}-{program.maxGroupSize} students</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <FiDollarSign className="text-green-400 flex-shrink-0" />
                        <span className="text-white font-bold text-lg">₹{program.feePerStudent.toLocaleString()} per student</span>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                    <h4 className="text-white font-semibold mb-3 text-sm">What You'll Get:</h4>
                    <div className="space-y-2">
                        {[
                            'Live project deployment',
                            'Industry-recognized certificate',
                            '1-on-1 mentorship sessions',
                            'Career guidance & placement prep',
                            'GitHub portfolio building'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <FiCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-400 text-xs">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Apply Button */}
                {isDeadlinePassed ? (
                    <button
                        disabled
                        className="w-full bg-gray-700 text-gray-500 py-4 rounded-lg font-bold cursor-not-allowed"
                    >
                        Applications Closed
                    </button>
                ) : (
                    <Link
                        to={`/programs/apply/${program.id}`}
                        className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center py-4 rounded-lg font-bold transition-all hover:shadow-lg group"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Apply Now
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                )}
            </div>
        </motion.div>
    );
};

// ============ STATS SECTION ============
const StatsSection = () => {
    const stats = [
        { number: "100+", label: "Students Trained" },
        { number: "20+", label: "Live Projects" },
        { number: "95%", label: "Completion Rate" },
        { number: "4.8/5", label: "Average Rating" }
    ];

    return (
        <section className="py-20 px-4 bg-gradient-to-br from-teal-950 to-gray-950">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============ CTA SECTION ============
const CTASection = () => {
    return (
        <section className="py-20 px-4 bg-gray-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-8 md:p-12 border border-blue-500/30"
            >
                <div className="text-center">
                    <FiMessageCircle className="w-16 h-16 mx-auto text-blue-400 mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Have Questions?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Our team is here to help you choose the right program for your career goals
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/contactus"
                            className="px-8 py-4 bg-gradient-to-r from-teal-950 to-gray-950 hover:from-teal-800 hover:to-gray-800 text-white rounded-full font-bold transition-all hover:shadow-lg inline-flex items-center gap-2"
                        >
                            Contact Us <FiArrowRight />
                        </Link>
                        <a
                            href="tel:+919510634082"
                            className="px-8 py-4 bg-transparent border-2 border-blue-500 hover:bg-blue-500/10 text-white rounded-full font-bold transition-all"
                        >
                            Call: +91 9510634082
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default ProgramsPage;
