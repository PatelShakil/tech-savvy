import { motion, AnimatePresence } from "framer-motion";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState} from "react";
import {
    FiChevronDown,
    FiExternalLink,
    FiGithub,
    FiAward,
    FiCalendar,
    FiCode
} from "react-icons/fi";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

// ============ PROJECT DATA ============
const projectsData = [
    {
        id: 1,
        name: "BoloIndia",
        tagline: "Government Feedback Management Platform",
        shortDesc: "Complete microservices-based citizen feedback system democratizing government feedback channels via QR codes and voice & video first interfaces",
        fullDesc: "Architected 7-microservice ecosystem (auth, org, service, feedback, response, qr, analytics) with 50+ Kafka event topics for asynchronous communication. Deployed polyglot persistence (PostgreSQL for relational data + MongoDB for dynamic schemas) with independent database scaling per service. Built 2 React.js admin panels (Platform Admin & Org roles, Citizen Portal) and Android Jetpack Compose Distributor App with 4-tier RBAC hierarchy. Designed for thousands concurrent users with sub-200ms API response times.",
        platform: ["Web", "Android", "Microservices"],
        technology: ["Jakarta EE 10", "Apache Kafka", "PostgreSQL", "MongoDB", "React.js", "Jetpack Compose", "Docker", "Payara", "MinIO"],
        features: [
            "7 independent microservices with event-driven architecture",
            "50+ Kafka topics for real-time communication",
            "Dynamic form builder with 17+ field types",
            "Hierarchical service management system",
            "Voice & video feedback support",
            "QR code-based feedback collection",
            "Multi-role admin panels (Platform & Org)",
            "JWT authentication with audit trails"
        ],
        metrics: {
            users: "Designed for 1000s+",
            services: "7 Microservices",
            performance: "<200ms API Response"
        },
        year: "2025",
        status: "Production",
        category: "Government Tech",
        banner: "/assets/projects/boloindia-banner.jpg",
        url: "https://docs.boloindia.techsavvysolution.in",
        github: null,
        awards: [],
        gradient: "from-green-400 via-emerald-500 to-teal-600"
    },
    {
        id: 2,
        name: "BIMS",
        tagline: "SaaS Barcode Inventory Management System",
        shortDesc: "Multi-tenant SaaS for inventory management with barcode generation, real-time stock tracking, and audit logging",
        fullDesc: "Created a SaaS for multi-tenant inventory management that includes audit logging, barcode production, and real-time stock tracking. Implemented custom barcode scanning procedures and role-based access for employees, administrators, and organizations. Produced a production-ready solution with adjustable permissions and segregated data that supports numerous companies.",
        platform: ["Web", "Android"],
        technology: ["Laravel", "React.js", "MySQL", "Jetpack Compose", "Google ML Kit", "REST APIs"],
        features: [
            "Multi-tenant architecture with data isolation",
            "Real-time barcode generation & scanning",
            "Role-based access control (Org/Admin/Employee)",
            "Inventory audit trails and reporting",
            "Stock alerts and notifications",
            "Mobile app with ML Kit barcode scanner",
            "Advanced analytics dashboard",
            "Export to Excel/PDF"
        ],
        metrics: {
            tenants: "Multi-Tenant",
            scanning: "ML-Powered",
            deployment: "Production-Ready"
        },
        year: "2024",
        status: "Production",
        category: "SaaS Platform",
        banner: "/assets/projects/bims-banner.jpg",
        url: "https://bims.techsavvysolution.in",
        github: null,
        awards: [],
        gradient: "from-yellow-400 via-orange-500 to-red-500"
    },
    {
        id: 3,
        name: "ByteBuddy",
        tagline: "The EduCollab Learning Platform",
        shortDesc: "🏆 Award-winning educational platform with text-to-speech, translation, notes, FAQs, and real-time chat serving 500+ active users",
        fullDesc: "Revolutionary Android learning platform for BCA, MSC ICT & programming students. Educational platform with text-to-speech, translation, notes, FAQs, and real-time chat. Developed native Android app using Kotlin and Jetpack Compose with Firebase Firestore for real-time synchronization. Implemented multi-language translation engine and interactive FAQ system. Achieved 500+ active users on Play Store.",
        platform: ["Android"],
        technology: ["Kotlin", "Jetpack Compose", "Firebase", "Firestore", "Cloud Storage", "Authentication"],
        features: [
            "Read notes like physical books with pinch-to-zoom",
            "Text-to-speech with multi-language translation",
            "Real-time peer-to-peer messaging",
            "Q&A forum with code snippets & upvoting",
            "PDF upload & text extraction",
            "Organized semester-wise content (BCA/MSC ICT)",
            "Message editing & deletion",
            "Online status tracking"
        ],
        metrics: {
            users: "500+ Active",
            rating: "4.5+ Stars",
            downloads: "1000+"
        },
        year: "2024",
        status: "Live on Play Store",
        category: "Education",
        banner: "/assets/projects/bytebuddy-banner.jpg",
        url: "https://play.google.com/store/apps/details?id=com.shakilpatel.bytebuddy",
        github: null,
        awards: ["🏆 1st Prize - Young Developer 2024 (VNSGU)"],
        gradient: "from-purple-400 via-pink-500 to-red-500"
    },
    {
        id: 4,
        name: "ShowCaseMe",
        tagline: "Personal Branding SaaS Platform",
        shortDesc: "Multi-tenant SaaS platform for personal branding with dynamic profiles, blogs, analytics, and secure file uploads",
        fullDesc: "Using React.js and .NET Core Web API, developed a multi-tenant SaaS platform for personal branding that supports blogs, analytics, dynamic profile pages, and safe file uploads. Created a modular backend with role-based access control, JWT authentication, and more than 55 EF Core entities. Deployed CI/CD pipelines with production-grade dependability and high availability by utilizing Azure services and GitHub Actions.",
        platform: ["Web"],
        technology: [".NET Core", "React.js", "Azure Cloud", "SQL Server", "EF Core", "GitHub Actions", "CI/CD"],
        features: [
            "Dynamic personal profile pages",
            "Blog management system",
            "Analytics dashboard",
            "Secure file upload & management",
            "55+ EF Core entities",
            "JWT authentication & authorization",
            "Role-based access control",
            "Azure cloud deployment with CI/CD"
        ],
        metrics: {
            entities: "55+ Models",
            cloud: "Azure Hosted",
            cicd: "Automated"
        },
        year: "2025",
        status: "Production",
        category: "SaaS Platform",
        banner: "/assets/projects/showcaseme-banner.jpg",
        url: "https://patelshakil.techsavvysolution.in/showcaseme.html",
        github: null,
        awards: [],
        gradient: "from-cyan-400 via-blue-500 to-indigo-600"
    },
    {
        id: 5,
        name: "KP CSR Management Portal",
        tagline: "Enterprise CSR Tracking System",
        shortDesc: "Enterprise CSR management system digitizing impact tracking, fund disbursement, vendor onboarding, and project planning for corporate groups",
        fullDesc: "Developed an enterprise CSR management system for a big corporate group that digitizes impact tracking, fund disbursement, vendor onboarding, and project planning. Created RESTful APIs with geotagged milestone reporting and role-based access for field workers, NGOs, and administrators. 500+ active users were served by secure dashboards and reporting workflows that were delivered.",
        platform: ["Web"],
        technology: ["Laravel", "React.js", "MySQL", "Google Maps API", "REST APIs", "Geolocation"],
        features: [
            "Digital CSR project planning & tracking",
            "Fund disbursement workflow",
            "Vendor & NGO onboarding",
            "Geotagged milestone reporting",
            "Role-based dashboards (Admin/NGO/Field Worker)",
            "Impact analytics & reporting",
            "Document management",
            "Compliance tracking"
        ],
        metrics: {
            users: "500+ Active",
            clients: "Corporate Group",
            tracking: "Geo-tagged"
        },
        year: "2025",
        status: "Production",
        category: "Enterprise",
        banner: "/assets/projects/kp-csr-banner.jpg",
        url: "https://admin.kpgroup.co",
        github: null,
        awards: [],
        gradient: "from-indigo-400 via-purple-500 to-pink-600"
    },
    {
        id: 6,
        name: "myCampus Admin App",
        tagline: "School Management Platform - Android",
        shortDesc: "Android app for leading school management platform serving 50,000+ admins with professional UI and real-time sync",
        fullDesc: "Designed Android app for leading school management platform serving 50,000+ admins. Built professional UI with Material Design 3 and intuitive UX patterns. Developed billing app integrating payment gateway management. Implemented real-time data synchronization with backend services.",
        platform: ["Android"],
        technology: ["Kotlin", "Jetpack Compose", "Material Design 3", "REST APIs", "Firebase"],
        features: [
            "Material Design 3 UI",
            "Real-time data synchronization",
            "Billing & payment gateway integration",
            "Admin dashboard",
            "Student management",
            "Attendance tracking",
            "Fee management",
            "Notifications system"
        ],
        metrics: {
            admins: "50,000+",
            schools: "Multiple",
            rating: "High Performance"
        },
        year: "2024",
        status: "Production",
        category: "Education",
        banner: "/assets/projects/mycampus-banner.jpg",
        url: "https://play.google.com/store/apps/details?id=com.mycampus.smsapp",
        github: null,
        awards: [],
        gradient: "from-blue-400 via-cyan-500 to-teal-500"
    },
    {
        id: 7,
        name: "WBVF Mobile App",
        tagline: "Flutter App with Laravel Backend",
        shortDesc: "Full-stack mobile application with Flutter frontend and Laravel backend APIs ensuring seamless communication",
        fullDesc: "Architected Flutter mobile application with comprehensive state management. Developed Laravel backend APIs ensuring seamless mobile-backend communication. Implemented custom authentication and authorization flows. Deployed to Play Store with 4.5+ ratings and optimized performance (<3s load times).",
        platform: ["Android", "iOS"],
        technology: ["Flutter", "Laravel", "REST APIs", "State Management", "Firebase"],
        features: [
            "Cross-platform Flutter app",
            "Custom authentication flows",
            "State management architecture",
            "Laravel REST API backend",
            "Optimized performance (<3s load)",
            "4.5+ Play Store rating",
            "Push notifications",
            "Offline support"
        ],
        metrics: {
            rating: "4.5+ Stars",
            performance: "<3s Load Time",
            platform: "Cross-Platform"
        },
        year: "2025",
        status: "Live on Play Store",
        category: "Mobile App",
        banner: "/assets/projects/wbvf-banner.jpg",
        url: "https://play.google.com/store/apps/details?id=com.wbvf.wbvf_app",
        github: null,
        awards: [],
        gradient: "from-rose-400 via-pink-500 to-purple-600"
    },
    {
        id: 8,
        name: "SmugLinks",
        tagline: "URL Shortener & Link Management",
        shortDesc: "Smart URL shortening service with analytics, custom aliases, and link management dashboard",
        fullDesc: "A comprehensive URL shortening and link management platform with analytics tracking, custom short links, QR code generation, and detailed click analytics. Built with modern web technologies for high performance and scalability.",
        platform: ["Web"],
        technology: ["Node.js", "React.js", "MongoDB", "Express.js", "REST APIs"],
        features: [
            "Custom short URL aliases",
            "QR code generation",
            "Click analytics & tracking",
            "Link management dashboard",
            "Bulk URL shortening",
            "API access for developers",
            "Link expiration settings",
            "Geo-location tracking"
        ],
        metrics: {
            links: "Unlimited",
            analytics: "Real-time",
            speed: "Instant Redirect"
        },
        year: "2024",
        status: "Production",
        category: "Web Service",
        banner: "/assets/projects/smuglinks-banner.jpg",
        url: "https://smug.link",
        github: null,
        awards: [],
        gradient: "from-green-400 via-lime-500 to-yellow-500"
    },
    {
        id: 9,
        name: "Spectrum Travel Tracking",
        tagline: "Tour Operations Management System",
        shortDesc: "Travel tracking system revolutionizing tour operations management with seamless customer communication",
        fullDesc: "The Travel Tracking system revolutionized how Spectrum Tour & Travels manages tour operations. Seamless customer communication, booking management, itinerary tracking, and payment processing - all in one platform.",
        platform: ["Web"],
        technology: ["Laravel", "React.js", "MySQL", "Google Maps API", "Payment Gateway"],
        features: [
            "Tour booking management",
            "Real-time location tracking",
            "Customer communication portal",
            "Itinerary management",
            "Payment processing",
            "Invoice generation",
            "Staff management",
            "Reports & analytics"
        ],
        metrics: {
            client: "Spectrum Group",
            tracking: "Real-time",
            operations: "Streamlined"
        },
        year: "2024",
        status: "Production",
        category: "Travel Tech",
        banner: "/assets/projects/spectrum-banner.jpg",
        url: "https://spectrumgroupgujarat.com",
        github: null,
        awards: [],
        gradient: "from-amber-400 via-orange-500 to-red-600"
    },
    {
        id: 10,
        name: "Najmi Kitchenware Inventory",
        tagline: "Retail Inventory Management",
        shortDesc: "Scalable SaaS solution handling entire retail operations with inventory tracking and billing",
        fullDesc: "Outstanding work on retail inventory system. The team delivered a scalable SaaS solution that handles entire retail operations seamlessly with barcode scanning, billing, and stock management.",
        platform: ["Web"],
        technology: ["Laravel", "React.js", "MySQL", "Barcode Scanner"],
        features: [
            "Product inventory management",
            "Barcode-based tracking",
            "Billing & invoicing",
            "Stock alerts",
            "Sales reports",
            "Supplier management",
            "Multi-location support",
            "GST compliance"
        ],
        metrics: {
            client: "Najmi Kitchenware",
            type: "Retail SaaS",
            status: "Operational"
        },
        year: "2024",
        status: "Production",
        category: "Retail",
        banner: "/assets/projects/najmi-banner.jpg",
        url: null,
        github: null,
        awards: [],
        gradient: "from-violet-400 via-purple-500 to-fuchsia-600"
    }
];

// ============ MAIN PROJECTS PAGE ============
const ProjectsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const categories = ["All", "SaaS Platform", "Government Tech", "Education", "Enterprise", "Mobile App", "Web Service", "Travel Tech", "Retail"];

    const filteredProjects = selectedCategory === "All"
        ? projectsData
        : projectsData.filter(p => p.category === selectedCategory);

    return (
        <div className="bg-gray-950 min-h-screen">
            {/* Hero Section */}
            <section
                className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 pt-32 pb-20 px-4">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    className="max-w-7xl mx-auto text-center"
                >
                    <motion.h1
                        className="text-5xl py-3 md:text-7xl lg:text-8xl font-bold mb-6 text-transparent bg-clip-text"
                        style={{backgroundImage: gradient}}
                        initial={{scale: 0.5}}
                        animate={{scale: 1}}
                        transition={{duration: 0.8, ease: "easeOut"}}
                    >
                        Our Projects Portfolio
                    </motion.h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        Production-grade systems serving <span
                        className="text-green-400 font-bold">thousands of users</span> across government, education,
                        enterprise, and SaaS sectors
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

            {/* Category Filter */}
            <section className="hidden bg-gray-900 pt-8 px-4 sticky top-10 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                                    selectedCategory === cat
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                }`}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.5}}
                            className="grid grid-cols-1 gap-8"
                        >
                            {filteredProjects.map((project, idx) => (
                                <ProjectCard key={project.id} project={project} index={idx}/>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

// ============ PROJECT CARD COMPONENT ============
const ProjectCard = ({project, index}: { project: any; index: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: index * 0.1}}
            viewport={{once: true}}
            className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
        >
            {/* Banner Image */}
            <div className={`relative h-64 md:h-80 bg-gradient-to-r ${project.gradient} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center p-8">
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold text-white mb-3"
                            initial={{scale: 0.8, opacity: 0}}
                            whileInView={{scale: 1, opacity: 1}}
                            transition={{delay: 0.2}}
                        >
                            {project.name}
                        </motion.h2>
                        <p className="text-xl text-gray-200">{project.tagline}</p>

                        {project.awards.length > 0 && (
                            <motion.div
                                initial={{scale: 0}}
                                whileInView={{scale: 1}}
                                transition={{delay: 0.4, type: "spring"}}
                                className="mt-4"
                            >
                                {project.awards.map((award: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, i: Key | null | undefined) => (
                                    <span key={i} className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold text-sm">
                                        <FiAward /> {award}
                                    </span>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    <span className="flex items-center gap-2 text-gray-400">
                        <FiCalendar /> {project.year}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full font-semibold">
                        {project.status}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full font-semibold">
                        {project.category}
                    </span>
                </div>

                {/* Short Description */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {project.shortDesc}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(project.metrics).map(([key, value]: [string, any]) => (
                        <div key={key} className="text-center p-4 bg-gray-800 rounded-lg">
                            <div className="lg:text-2xl overflow-hidden text-sm text-clip  font-bold text-teal-400">{value}</div>
                            <div className="text-xs text-gray-400 uppercase mt-1">{key}</div>
                        </div>
                    ))}
                </div>

                {/* Platforms & Tech Stack */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                        <FiCode /> Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {project.platform.map((p: string) => (
                            <span key={p} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                                {p}
                            </span>
                        ))}
                        {project.technology.slice(0, 5).map((tech: string) => (
                            <span key={tech} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                                {tech}
                            </span>
                        ))}
                        {project.technology.length > 5 && (
                            <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-sm">
                                +{project.technology.length - 5} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Expandable Section */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="border-t border-gray-800 pt-6 mb-6">
                                {/* Full Description */}
                                <h4 className="text-xl font-bold text-white mb-3">Project Details</h4>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    {project.fullDesc}
                                </p>

                                {/* Key Features */}
                                <h4 className="text-xl font-bold text-white mb-3">Key Features</h4>
                                <div className="grid md:grid-cols-2 gap-3 mb-6">
                                    {project.features.map((feature: string, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg"
                                        >
                                            <span className="text-green-400 mt-1">✓</span>
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Full Tech Stack */}
                                <h4 className="text-xl font-bold text-white mb-3">Complete Tech Stack</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.technology.map((tech: string) => (
                                        <span key={tech} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    <motion.button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isExpanded ? "Show Less" : "Learn More"}
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FiChevronDown />
                        </motion.div>
                    </motion.button>

                    {project.url && (
                        <motion.a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-950 to-gray-950 hover:from-teal-700 hover:to-gray-700 text-white rounded-full transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Live <FiExternalLink />
                        </motion.a>
                    )}

                    {project.github && (
                        <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiGithub /> Source Code
                        </motion.a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectsPage;
