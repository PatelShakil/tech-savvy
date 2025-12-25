import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FiArrowRight, FiCode, FiUsers, FiAward, FiTrendingUp } from "react-icons/fi";
import {
    useMotionTemplate,
    useMotionValue,
    motion,
    animate
} from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectItemCard from "../components/utils/ProjectItemCard.tsx";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <StatsSection />
            <ProjectsSection />
            <ServicesSection />
            <MentorshipSection />
            <TestimonialsSection />
            <CTASection />
        </>
    );
};

// ============ HERO SECTION ============
const HeroSection = () => {
    const color = useMotionValue(COLORS_TOP[0]);
    const navigate = useNavigate();

    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);

    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

    return (
        <motion.section
            style={{ backgroundImage }}
            className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
        >
            <div className="relative z-10 flex flex-col items-center">
                <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
                    🎓 Internship & Mentorship Programs Open
                </span>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide ">
                    Shaping Your Future with
                    <span className="text-transparent bg-clip-text  mt-2" style={{ backgroundImage: gradient }}>
                        {" "}Our Code
                    </span>
                </h1>
                <p className="my-6 max-w-3xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
                    Tech Savvy Solution is a Surat-based software development company specializing in <strong>microservices architecture</strong>, <strong>SaaS platforms</strong>, and <strong>enterprise-grade mobile applications</strong>. We deliver scalable, production-ready solutions across government, finance, education, and corporate sectors with a proven track record of handling thousands of concurrent users.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <motion.button
                        style={{ border, boxShadow }}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => navigate('/contactus')}
                        className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-950/50"
                    >
                        Get Started
                        <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => navigate('/student/login')}
                        className="px-6 py-3 rounded-full border border-gray-600 hover:border-gray-400 transition-colors"
                    >
                        Student Portal Login
                    </motion.button>
                </div>
            </div>

            <div className="absolute inset-0 z-0">
                <Canvas>
                    <Stars radius={50} count={2500} factor={4} fade speed={2} />
                </Canvas>
            </div>
        </motion.section>
    );
};
// ============ ABOUT SECTION ============
const AboutSection = () => {
    return (
        <section className="bg-gray-950 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    {/* Founder Photo */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="flex justify-center mb-6"
                    >
                        <img
                            src="/assets/shakil-founder.jpg" // adjust path
                            alt="MuhammadShakil Patel"
                            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-center border-4 border-blue-600 shadow-xl"
                        />
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Who We Are
                    </h2>

                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        Founded and led by <strong className="text-white">MuhammadShakil Patel</strong>
                        {" "}. we are an officially registered IT solution
                        provider committed to delivering cutting-edge software with clean architecture,
                        scalability, and real-world impact.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <FiCode className="w-8 h-8" />,
                            title: "Production-Grade Code",
                            desc: "Built with Jakarta EE, Node.js, React.js, and Kotlin following microservices & event-driven patterns"
                        },
                        {
                            icon: <FiUsers className="w-8 h-8" />,
                            title: "Client-Centric Approach",
                            desc: "Serving government bodies, corporates, NGOs, and startups with tailored solutions"
                        },
                        {
                            icon: <FiAward className="w-8 h-8" />,
                            title: "Award-Winning Team",
                            desc: "Recognized for innovation and excellence in educational technology & system design"
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
                        >
                            <div className="text-blue-600 mb-4">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============ STATS SECTION ============
const StatsSection = () => {
    const stats = [
        { number: "20+", label: "Projects Deployed" },
        { number: "10K+", label: "Active Users" },
        { number: "7+", label: "Microservices Architected" },
        { number: "2+ Years", label: "Production Experience" }
    ];

    return (
        <section className="bg-gradient-to-br from-teal-950 to-gray-950 py-16 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                        <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

// ============ PROJECTS SECTION ============
const ProjectsSection = () => {
    const projects = [
        {
            id: 1,
            name: "BoloIndia",
            shortDesc: "Microservices-based government feedback platform democratizing citizen engagement via QR codes",
            platform: ["Web", "Android"],
            technology: ["Jakarta EE", "Kafka", "React.js", "Jetpack Compose"],
            gradient: "from-green-400 to-blue-500",
            year: "2025"
        },
        {
            id: 2,
            name: "BIMS",
            shortDesc: "Multi-tenant SaaS barcode inventory management system with real-time tracking & audit trails",
            platform: ["Web", "Android"],
            technology: ["Laravel", "React.js", "Jetpack Compose", "ML Kit"],
            gradient: "from-yellow-400 to-orange-500",
            year: "2024"
        },
        {
            id: 3,
            name: "ByteBuddy",
            shortDesc: "🏆 Award-winning EduCollab learning platform with 500+ active users on Play Store",
            platform: ["Android"],
            technology: ["Kotlin", "Jetpack Compose", "Firebase", "Firestore"],
            gradient: "from-purple-400 to-pink-500",
            year: "2024"
        },
        {
            id: 4,
            name: "ShowCaseMe",
            shortDesc: "Personal branding SaaS with dynamic profiles, blogs, analytics & secure file uploads",
            platform: ["Web"],
            technology: [".NET Core", "React.js", "Azure", "SQL Server"],
            gradient: "from-cyan-400 to-blue-500",
            year: "2025"
        }
    ];

    const  navigate  = useNavigate();

    return (
        <section id="projects" className="bg-gray-900 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    className="text-center py-3 font-bold text-4xl md:text-6xl lg:text-7xl mb-4 text-transparent bg-clip-text"
                    style={{ backgroundImage: gradient }}
                    initial={{ scale: 0.2, x: 0 }}
                    whileInView={{ scale: 1, x: [0, -100, 100, 0] }}
                    transition={{ duration: 1, ease: 'easeIn' }}
                    viewport={{ once: false, amount: 0.5 }}
                >
                    Flagship Projects
                </motion.h2>
                <p className="text-center text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
                    Production-grade systems serving thousands of users across government, education, and enterprise sectors
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {projects.map((project, idx) => (
                        <ProjectItemCard key={project.id} item={project} index={idx} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <button
                        onClick={()=>navigate('/projects')}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-shadow">
                        View All Projects
                    </button>
                </motion.div>
            </div>
        </section>
    );
};
// ============ SERVICES SECTION ============
const ServicesSection = () => {
    const services = [
        {
            id: 1,
            name: 'Microservices Architecture',
            color: '#3B82F6',
            description: 'Design and deploy scalable event-driven microservices with Apache Kafka, domain-driven design, and polyglot persistence for enterprise-grade systems.'
        },
        {
            id: 2,
            name: 'SaaS Development',
            color: '#10B981',
            description: 'Build multi-tenant SaaS platforms with role-based access, subscription management, and cloud deployment on Azure/AWS with CI/CD pipelines.'
        },
        {
            id: 3,
            name: 'Android Development',
            color: '#88cc2e',
            description: 'Native Android apps using Jetpack Compose, Material Design 3, offline-first architecture, and Google ML Kit integration for modern mobile experiences.'
        },
        {
            id: 4,
            name: 'Web Development',
            color: '#ed9c1f',
            description: 'Full-stack web applications with React.js, Node.js, and Laravel. Responsive, SEO-optimized, and built with modern frameworks like Tailwind CSS.'
        },
        {
            id: 5,
            name: 'Backend & API Development',
            color: '#8b56f1',
            description: 'RESTful APIs and backend systems using Jakarta EE, .NET Core, Express.js with JWT authentication, audit trails, and OpenAPI documentation.'
        },
        {
            id: 6,
            name: 'Cloud & DevOps',
            color: '#39a4e5',
            description: 'Docker containerization, GitHub Actions CI/CD, Azure Cloud deployment, health monitoring, and production-grade infrastructure setup.'
        },
        {
            id: 7,
            name: 'Mobile Cross-Platform',
            color: '#3fc563',
            description: 'Flutter applications with comprehensive state management, backend API integration, and deployment to Play Store with optimized performance.'
        },
        {
            id: 8,
            name: 'Enterprise Solutions',
            color: '#d23aea',
            description: 'Custom ERP, CRM, inventory management, and CSR platforms tailored for corporate workflows with role-based hierarchies and reporting.'
        }
    ];

    return (
        <section id="services" className="bg-gray-950 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    className="text-center font-bold text-4xl md:text-6xl lg:text-7xl mb-4 text-transparent bg-clip-text"
                    style={{ backgroundImage: gradient }}
                    initial={{ scale: 0.2, x: 0 }}
                    whileInView={{ scale: 1, x: [0, -100, 100, 0] }}
                    transition={{ duration: 1, ease: 'easeIn' }}
                    viewport={{ once: false, amount: 0.5 }}
                >
                    Our Expertise
                </motion.h2>
                <p className="text-center text-lg text-gray-600 mb-12">
                    Comprehensive software development services powered by modern tech stacks
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, idx) => (
                        <ServiceCard key={service.id} service={service} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="relative group"
        >
            <span
                className="absolute top-0 left-0 w-full h-full mt-1 ml-1 rounded-lg"
                style={{ backgroundColor: service.color }}
            />
            <div
                className="relative h-full p-6 bg-white border-2 rounded-lg transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1"
                style={{ borderColor: service.color }}
            >
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h3>
                <div className="w-12 h-1 mb-3" style={{ backgroundColor: service.color }} />
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>
        </motion.div>
    );
};

// ============ MENTORSHIP SECTION ============
const MentorshipSection = () => {
    const navigate = useNavigate();
    return (
        <section className="bg-gradient-to-br from-teal-950 to-pink-950 py-20 px-4 text-white">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Internship & Mentorship Program</h2>
                    <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                        Empowering the next generation of developers with real-world skills, project-based learning, and industry-standard practices
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {[
                        {
                            icon: <FiCode className="w-12 h-12" />,
                            title: "Live Project Training",
                            points: ["Work on production codebases", "Deploy to real users", "Learn microservices & clean architecture"]
                        },
                        {
                            icon: <FiUsers className="w-12 h-12" />,
                            title: "1-on-1 Mentorship",
                            points: ["Personalized guidance", "Code reviews & best practices", "Career & placement prep"]
                        },
                        {
                            icon: <FiTrendingUp className="w-12 h-12" />,
                            title: "Certificates & Growth",
                            points: ["Industry-recognized certificates", "GitHub portfolio building", "Job referrals & opportunities"]
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white/10 backdrop-blur-md p-6 rounded-xl"
                        >
                            <div className="mb-4">{item.icon}</div>
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <ul className="space-y-2">
                                {item.points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span className="text-gray-200">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <button
                        onClick={()=>navigate('/projects')}
                        className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold hover:bg-gray-100 transition-colors text-lg">
                        Apply for Internship 2026
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

// ============ TESTIMONIALS SECTION ============
const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "MohammadSarik Ghanchi",
            role: "Intern → Application Developer",
            text: "The mentorship at Tech Savvy Solution transformed my career. I went from college student to deploying production apps in just 6 months!",
            rating: 5
        },
        {
            name: "Mr. Husain Najmi",
            role: "Client - Najmi Kitchenware",
            text: "Outstanding work on our inventory system. The team delivered a scalable SaaS solution that handles our entire operations seamlessly.",
            rating: 5
        },
        {
            name: "Mr. Idrees Shaikh",
            role: "Director - Spectrum Group Gujarat",
            text: "The Travel Tracking system revolutionized how we manage our tour operations at Spectrum Tour & Travels. Seamless customer communication - all in one platform. Highly professional team!",
            rating: 5
        }
    ];

    return (
        <section className="bg-gray-900 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-center mb-12"
                >
                    Client Success Stories
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 p-6 rounded-xl shadow-md"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-xl">★</span>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                            <div>
                                <p className="font-bold text-gray-900">{testimonial.name}</p>
                                <p className="text-sm text-gray-600">{testimonial.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============ CTA SECTION ============
const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-gradient-to-r from-teal-950 to-gray-950 py-20 px-4 text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to Build Something Amazing?
                </h2>
                <p className="text-xl mb-8 text-gray-100">
                    Let's discuss how we can bring your ideas to life with scalable, production-ready solutions
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/contactus')}
                        className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-100 transition-colors text-lg"
                    >
                        Start Your Project
                    </button>
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-8 py-4 border-2 border-white rounded-full font-bold hover:bg-white/10 transition-colors text-lg"
                    >
                        View Portfolio
                    </button>
                </div>
            </motion.div>
        </section>
    );
};

export default HomePage;
