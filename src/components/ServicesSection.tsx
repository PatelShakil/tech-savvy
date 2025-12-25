import { motion } from "framer-motion";
import {useEffect, useState} from "react";
import {
    FiServer,
    FiCloud,
    FiSmartphone,
    FiGlobe,
    FiDatabase,
    FiLayers,
    FiCode,
    FiShield,
    FiTrendingUp,
    FiCheckCircle,
    FiArrowRight
} from "react-icons/fi";
import {
    SiSpringboot as SiJakartaee,
    SiApachekafka,
    SiDocker,
    SiReact,
    SiKotlin,
    SiPostgresql,
    SiMongodb,
    SiNodedotjs,
    SiDotnet,
    SiLaravel,
    SiFlutter,
    SiAzuredevops,
    SiTailwindcss, SiFirebase
} from "react-icons/si";
import { useNavigate } from "react-router-dom";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

// ============ SERVICES DATA ============
const servicesData = [
    {
        id: 1,
        icon: <FiLayers className="w-8 h-8" />,
        name: 'Microservices Architecture',
        tagline: 'Enterprise-Grade Distributed Systems',
        color: '#3B82F6',
        gradient: 'from-blue-500 to-indigo-600',
        description: 'Design and deploy scalable event-driven microservices with Apache Kafka, domain-driven design (DDD), and polyglot persistence for enterprise-grade systems handling thousands of concurrent users.',
        technologies: [
            { name: 'Jakarta EE 10', icon: <SiJakartaee /> },
            { name: 'Apache Kafka', icon: <SiApachekafka /> },
            { name: 'Docker', icon: <SiDocker /> },
            { name: 'PostgreSQL', icon: <SiPostgresql /> },
            { name: 'MongoDB', icon: <SiMongodb /> }
        ],
        features: [
            'Event-driven architecture (EDA)',
            'Domain-driven design (DDD)',
            'CQRS pattern implementation',
            'Polyglot persistence strategy',
            'Service mesh & API gateway',
            'Real-time event streaming',
            'Sub-200ms API response times',
            'Independent service scaling'
        ],
        useCases: [
            'Government feedback platforms',
            'Multi-tenant SaaS systems',
            'Real-time data processing',
            'Complex enterprise workflows'
        ]
    },
    {
        id: 2,
        icon: <FiCloud className="w-8 h-8" />,
        name: 'SaaS Platform Development',
        tagline: 'Multi-Tenant Cloud Solutions',
        color: '#10B981',
        gradient: 'from-emerald-500 to-teal-600',
        description: 'Build production-ready multi-tenant SaaS platforms with role-based access control, subscription management, and cloud deployment on Azure/AWS with complete CI/CD pipelines.',
        technologies: [
            { name: '.NET Core', icon: <SiDotnet /> },
            { name: 'Laravel', icon: <SiLaravel /> },
            { name: 'React.js', icon: <SiReact /> },
            { name: 'Azure Cloud', icon: <SiAzuredevops /> },
            { name: 'PostgreSQL', icon: <SiPostgresql /> }
        ],
        features: [
            'Multi-tenant architecture',
            'Role-based access control (RBAC)',
            'Subscription & billing integration',
            'Data isolation & security',
            'Automated CI/CD pipelines',
            'Analytics & reporting dashboards',
            'API-first design',
            'High availability setup'
        ],
        useCases: [
            'Inventory management systems',
            'Personal branding platforms',
            'Business management tools',
            'Educational platforms'
        ]
    },
    {
        id: 3,
        icon: <FiSmartphone className="w-8 h-8" />,
        name: 'Native Android Development',
        tagline: 'Modern Kotlin & Jetpack Compose',
        color: '#88cc2e',
        gradient: 'from-green-500 to-lime-600',
        description: 'Native Android apps using Jetpack Compose, Material Design 3, offline-first architecture, and Google ML Kit integration delivering exceptional user experiences.',
        technologies: [
            { name: 'Kotlin', icon: <SiKotlin /> },
            { name: 'Jetpack Compose', icon: <SiReact /> },
            { name: 'Firebase', icon: <FiDatabase /> },
            { name: 'ML Kit', icon: <FiCode /> },
            { name: 'Material Design 3', icon: <FiLayers /> }
        ],
        features: [
            'Jetpack Compose UI',
            'Material Design 3',
            'Offline-first architecture',
            'Real-time synchronization',
            'Barcode scanning (ML Kit)',
            'Push notifications',
            'Secure authentication',
            'Play Store optimization'
        ],
        useCases: [
            'Educational apps (500+ users)',
            'Inventory management',
            'School management systems',
            'Government distributor apps'
        ]
    },
    {
        id: 4,
        icon: <FiGlobe className="w-8 h-8" />,
        name: 'Full-Stack Web Development',
        tagline: 'Modern Responsive Applications',
        color: '#ed9c1f',
        gradient: 'from-orange-500 to-amber-600',
        description: 'Full-stack web applications with React.js, Node.js, and Laravel. Responsive, SEO-optimized, and built with modern frameworks like Tailwind CSS for stunning user interfaces.',
        technologies: [
            { name: 'React.js', icon: <SiReact /> },
            { name: 'Node.js', icon: <SiNodedotjs /> },
            { name: 'Laravel', icon: <SiLaravel /> },
            { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
            { name: 'MySQL', icon: <SiPostgresql /> }
        ],
        features: [
            'Server-side rendering (SSR)',
            'SEO optimization',
            'Responsive design',
            'Progressive Web Apps (PWA)',
            'Real-time features',
            'Admin dashboards',
            'Payment gateway integration',
            'Google Maps integration'
        ],
        useCases: [
            'Corporate websites',
            'CSR management portals',
            'Travel booking systems',
            'E-commerce platforms'
        ]
    },
    {
        id: 5,
        icon: <FiDatabase className="w-8 h-8" />,
        name: 'Backend & API Development',
        tagline: 'RESTful & Event-Driven APIs',
        color: '#8b56f1',
        gradient: 'from-purple-500 to-violet-600',
        description: 'RESTful APIs and backend systems using Jakarta EE, .NET Core, Express.js with JWT authentication, audit trails, OpenAPI documentation, and production monitoring.',
        technologies: [
            { name: 'Jakarta EE', icon: <SiJakartaee /> },
            { name: '.NET Core', icon: <SiDotnet /> },
            { name: 'Node.js', icon: <SiNodedotjs /> },
            { name: 'PostgreSQL', icon: <SiPostgresql /> },
            { name: 'MongoDB', icon: <SiMongodb /> }
        ],
        features: [
            'RESTful API design',
            'JWT authentication',
            'OpenAPI/Swagger specs',
            'Database optimization',
            'Audit trails & logging',
            'Rate limiting & security',
            'Health checks & monitoring',
            'Microservices communication'
        ],
        useCases: [
            'Mobile app backends',
            'Third-party integrations',
            'Legacy system modernization',
            'API marketplace platforms'
        ]
    },
    {
        id: 6,
        icon: <FiServer className="w-8 h-8" />,
        name: 'Cloud & DevOps',
        tagline: 'Containerization & CI/CD',
        color: '#39a4e5',
        gradient: 'from-sky-500 to-blue-600',
        description: 'Docker containerization, GitHub Actions CI/CD, Azure Cloud deployment, health monitoring, and production-grade infrastructure setup with automated workflows.',
        technologies: [
            { name: 'Docker', icon: <SiDocker /> },
            { name: 'GitHub Actions', icon: <FiCloud /> },
            { name: 'Azure Cloud', icon: <SiAzuredevops /> },
            { name: 'Kubernetes', icon: <FiServer /> },
            { name: 'Nginx', icon: <FiServer /> }
        ],
        features: [
            'Docker containerization',
            'CI/CD pipeline setup',
            'Cloud deployment (Azure/AWS)',
            'Infrastructure as Code',
            'Auto-scaling configuration',
            'Load balancing',
            'Monitoring & alerting',
            'Backup & disaster recovery'
        ],
        useCases: [
            'Microservices deployment',
            'SaaS platform hosting',
            'Production environment setup',
            'Development automation'
        ]
    },
    {
        id: 7,
        icon: <FiSmartphone className="w-8 h-8" />,
        name: 'Cross-Platform Mobile',
        tagline: 'Flutter for iOS & Android',
        color: '#3fc563',
        gradient: 'from-cyan-500 to-green-600',
        description: 'Flutter applications with comprehensive state management, backend API integration, and deployment to Play Store/App Store with optimized performance (<3s load times).',
        technologies: [
            { name: 'Flutter', icon: <SiFlutter /> },
            { name: 'Dart', icon: <SiFlutter /> },
            { name: 'Laravel Backend', icon: <SiLaravel /> },
            { name: 'REST APIs', icon: <FiCode /> },
            { name: 'Firebase', icon: <FiDatabase /> }
        ],
        features: [
            'Single codebase (iOS + Android)',
            'State management (Bloc/Provider)',
            'Custom animations',
            'Offline functionality',
            'Push notifications',
            'Payment gateway integration',
            'App Store optimization',
            '4.5+ star ratings'
        ],
        useCases: [
            'Consumer mobile apps',
            'Business management apps',
            'Social networking apps',
            'On-demand services'
        ]
    },
    {
        id: 8,
        icon: <FiShield className="w-8 h-8" />,
        name: 'Enterprise Solutions',
        tagline: 'Custom ERP, CRM & Management',
        color: '#d23aea',
        gradient: 'from-pink-500 to-fuchsia-600',
        description: 'Custom ERP, CRM, inventory management, and CSR platforms tailored for corporate workflows with role-based hierarchies, reporting, and compliance tracking.',
        technologies: [
            { name: 'Laravel', icon: <SiLaravel /> },
            { name: 'React.js', icon: <SiReact /> },
            { name: 'MySQL', icon: <SiPostgresql /> },
            { name: 'Google Maps', icon: <FiGlobe /> },
            { name: 'Payment Gateway', icon: <FiShield /> }
        ],
        features: [
            'Custom workflow automation',
            'Role-based dashboards',
            'Invoice & billing systems',
            'Geolocation tracking',
            'Document management',
            'Compliance reporting',
            'Multi-location support',
            'Advanced analytics'
        ],
        useCases: [
            'CSR management (500+ users)',
            'Retail inventory systems',
            'Travel booking platforms',
            'School management systems'
        ]
    }
];

// ============ TECH STACK DATA ============
const techStackData = {
    'Backend': [
        { name: 'Jakarta EE 10', icon: <SiJakartaee />, color: '#E76F00' },
        { name: 'Node.js', icon: <SiNodedotjs />, color: '#339933' },
        { name: '.NET Core', icon: <SiDotnet />, color: '#512BD4' },
        { name: 'Laravel', icon: <SiLaravel />, color: '#FF2D20' }
    ],
    'Frontend': [
        { name: 'React.js', icon: <SiReact />, color: '#61DAFB' },
        { name: 'Tailwind CSS', icon: <SiTailwindcss />, color: '#06B6D4' },
        { name: 'Jetpack Compose', icon: <SiKotlin />, color: '#7F52FF' }
    ],
    'Mobile': [
        { name: 'Kotlin', icon: <SiKotlin />, color: '#7F52FF' },
        { name: 'Flutter', icon: <SiFlutter />, color: '#02569B' },
        { name: 'Jetpack Compose', icon: <SiKotlin />, color: '#7F52FF' },
        { name: 'React Native', icon: <SiReact />, color: '#4285F4' }
    ],
    'Database': [
        { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#4169E1' },
        { name: 'MongoDB', icon: <SiMongodb />, color: '#47A248' },
        { name: 'MySQL', icon: <SiPostgresql />, color: '#4479A1' },
        { name: 'Firebase', icon: <SiFirebase />, color: '#a65706' }
    ],
    'Cloud & DevOps': [
        { name: 'Docker', icon: <SiDocker />, color: '#2496ED' },
        { name: 'Apache Kafka', icon: <SiApachekafka />, color: '#7a797a' },
        { name: 'Azure Cloud', icon: <SiAzuredevops />, color: '#0078D4' },
        { name: 'GitHub Actions', icon: <FiCloud />, color: '#2088FF' }
    ]
};

// ============ MAIN SERVICES PAGE ============
const ServicesPage = () => {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState<number | null>(null);

    // ✅ Cleanup on unmount
    useEffect(() => {
        return () => {
            // Cleanup function
            setSelectedService(null);
        };
    }, []);

    return (
        <div className="bg-gray-950 min-h-screen">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 pt-32 pb-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto text-center"
                >
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-transparent bg-clip-text"
                        style={{ backgroundImage: gradient }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        Our Expertise
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
                    >
                        Comprehensive software development services powered by <span className="text-blue-400 font-bold">cutting-edge technologies</span> and <span className="text-purple-400 font-bold">production-grade architecture</span>
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-wrap gap-4 justify-center text-sm"
                    >
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                2+ Years Experience
            </span>
                        <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                20+ Projects Delivered
            </span>
                        <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                10K+ Active Users
            </span>
                    </motion.div>
                </motion.div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.5, 1]
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {servicesData.map((service, idx) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                index={idx}
                                isSelected={selectedService === service.id}
                                onToggle={() => setSelectedService(selectedService === service.id ? null : service.id)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="py-20 px-4 bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Our Tech Stack
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Production-tested technologies powering enterprise-grade solutions
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.entries(techStackData).map(([category, techs], idx) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-800 p-6 rounded-xl"
                            >
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <FiCode className="text-blue-400" />
                                    {category}
                                </h3>
                                <div className="space-y-3">
                                    {techs.map((tech, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <span style={{ color: tech.color }} className="text-2xl">
                                                {tech.icon}
                                            </span>
                                            <span className="text-gray-300 font-medium">{tech.name}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 px-4 bg-gray-950">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Our Development Process
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            From concept to deployment, we follow industry best practices
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Discovery', desc: 'Requirements analysis & system design', icon: <FiTrendingUp /> },
                            { step: '02', title: 'Development', desc: 'Agile sprints with CI/CD integration', icon: <FiCode /> },
                            { step: '03', title: 'Testing', desc: 'API testing & quality assurance', icon: <FiCheckCircle /> },
                            { step: '04', title: 'Deployment', desc: 'Production launch & monitoring', icon: <FiCloud /> }
                        ].map((process, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center"
                            >
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-950 to-gray-950 rounded-full flex items-center justify-center text-3xl text-white">
                                        {process.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center border-2 border-blue-500 text-blue-400 font-bold">
                                        {process.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{process.title}</h3>
                                <p className="text-gray-400">{process.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-teal-950 to-gray-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Start Your Project?
                    </h2>
                    <p className="text-xl text-gray-100 mb-8">
                        Let's build something amazing together with production-grade architecture
                    </p>
                    <button
                        onClick={() => navigate('/contactus')}
                        className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                    >
                        Get Started <FiArrowRight />
                    </button>
                </motion.div>
            </section>
        </div>
    );
};

// ============ SERVICE CARD COMPONENT ============
const ServiceCard = ({ service, index, isSelected, onToggle }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
        >
            {/* Shadow Layer */}
            <div
                className={`absolute top-0 left-0 w-full h-full rounded-xl transition-transform ${
                    isSelected ? 'translate-x-2 translate-y-2' : 'translate-x-1 translate-y-1'
                }`}
                style={{ backgroundColor: service.color }}
            />

            {/* Main Card */}
            <div
                className={`relative bg-gray-900 border-2 rounded-xl p-8 transition-all duration-300 ${
                    isSelected ? '-translate-x-2 -translate-y-2' : 'group-hover:-translate-x-1 group-hover:-translate-y-1'
                }`}
                style={{ borderColor: service.color }}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center text-white`}>
                        {service.icon}
                    </div>
                    <motion.button
                        onClick={onToggle}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full text-sm font-semibold transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isSelected ? 'Show Less' : 'Learn More'}
                    </motion.button>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{service.tagline}</p>

                {/* Divider */}
                <div className="w-16 h-1 mb-4" style={{ backgroundColor: service.color }} />

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-6">
                    {service.description}
                </p>

                {/* Technologies */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Core Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech: any, i: number) => (
                            <span
                                key={i}
                                className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm"
                            >
                                <span className="text-lg">{tech.icon}</span>
                                {tech.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Expandable Content */}
                {isSelected && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-800 pt-6"
                    >
                        {/* Key Features */}
                        <div className="mb-6">
                            <h4 className="text-lg font-bold text-white mb-3">Key Features</h4>
                            <div className="grid md:grid-cols-2 gap-2">
                                {service.features.map((feature: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-start gap-2"
                                    >
                                        <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Use Cases */}
                        <div>
                            <h4 className="text-lg font-bold text-white mb-3">Use Cases</h4>
                            <div className="flex flex-wrap gap-2">
                                {service.useCases.map((useCase: string, i: number) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-sm"
                                    >
                                        {useCase}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ServicesPage;
