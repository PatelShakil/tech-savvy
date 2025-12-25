import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { auth } from "../firebase.ts";
import { Link, useLocation } from "react-router-dom";
import { animate, motion, useMotionTemplate, useMotionValue, useScroll, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import {RotatingLogo} from "./utils/RotatingLogo.tsx";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

interface NavItem {
    name: string;
    path: string;
    dropdown?: { name: string; path: string }[];
}

const Navbar = () => {
    const navListData: NavItem[] = [
        {
            name: "Services",
            path: "/services"
        },
        {
            name: "Projects",
            path: "/projects"
        },
        {
            name: "Programs",
            path: "/programs"
        },
        {
            name: "About Us",
            path: "/aboutus"
        },
        {
            name: "Contact Us",
            path: "/contactus"
        }
    ];

    const location = useLocation();
    const { scrollYProgress } = useScroll();
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const color = useMotionValue(COLORS_TOP[0]);

    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileDrawerOpen(false);
    }, [location]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileDrawerOpen]);

    const toggleNavbar = () => {
        setIsMobileDrawerOpen(!isMobileDrawerOpen);
    };

    const backgroundImage = useMotionTemplate`linear-gradient(90deg, ${color}, #fff)`;

    // Hide navbar on admin/student routes
    if (window.location.pathname.includes("/admin") || window.location.pathname.includes("/student")) return null;

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed z-50 w-full top-0 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-800'
                        : 'bg-gray-900 border-b border-gray-800/50'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 md:h-18">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                                <RotatingLogo/>
                            <div className="hidden sm:block">
                                <motion.span
                                    className="text-xl md:text-2xl font-bold bg-clip-text text-transparent"
                                    style={{ backgroundImage }}
                                >
                                    Tech Savvy Solution
                                </motion.span>
                                <p className="text-xs text-gray-400 -mt-1">MSME Registered</p>
                            </div>
                            <motion.span
                                className="block sm:hidden text-lg font-bold bg-clip-text text-transparent"
                                style={{ backgroundImage }}
                            >
                                Tech Savvy Solution
                            </motion.span>
                        </Link>

                        {/* Desktop Navigation */}
                        <ul className="hidden lg:flex items-center space-x-1">
                            {navListData.map((item, i) => (
                                <NavMenuItem
                                    key={i}
                                    item={item}
                                    isActive={location.pathname === item.path}
                                    activeDropdown={activeDropdown}
                                    setActiveDropdown={setActiveDropdown}
                                />
                            ))}
                        </ul>

                        {/* Desktop CTA */}
                        <div className="hidden lg:flex items-center gap-4">
                            {auth.currentUser ? (
                                <Link
                                    to="/student/dashboard"
                                    className="px-6 py-2.5 bg-gradient-to-r from-teal-950 to-gray-950 hover:from-teal-800 hover:to-gray-800 rounded-full text-white font-semibold transition-all hover:shadow-lg"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/student/login"
                                        className="px-6 py-2.5 text-gray-300 hover:text-white font-semibold transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/contactus"
                                        className="px-6 py-2.5 bg-gradient-to-r from-teal-950 to-gray-950 hover:from-teal-800 hover:to-gray-800  rounded-full text-white font-semibold transition-all hover:shadow-lg"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleNavbar}
                            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {isMobileDrawerOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X size={24} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu size={24} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <motion.div
                    className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    style={{
                        scaleX: scrollYProgress,
                        transformOrigin: 'left'
                    }}
                />
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleNavbar}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            style={{ marginTop: isScrolled ? '64px' : '80px' }}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-16 md:top-20 bottom-0 w-80 max-w-full bg-gray-900 shadow-2xl z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="p-6 space-y-6">
                                {/* Navigation Links */}
                                <div className="space-y-2">
                                    {navListData.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Link
                                                to={item.path}
                                                onClick={toggleNavbar}
                                                className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                                                    location.pathname === item.path
                                                        ? 'bg-gradient-to-r from-teal-950 to-gray-950 hover:from-teal-800 hover:to-gray-800  text-white shadow-lg'
                                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                }`}
                                            >
                                                {item.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mobile CTA */}
                                <div className="pt-6 border-t border-gray-800 space-y-3">
                                    {auth.currentUser ? (
                                        <Link
                                            to="/student/dashboard"
                                            onClick={toggleNavbar}
                                            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold transition-all"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                to="/student/login"
                                                onClick={toggleNavbar}
                                                className="block w-full text-center px-6 py-3 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white font-semibold transition-all"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/contactus"
                                                onClick={toggleNavbar}
                                                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-teal-950 to-gray-950 hover:from-teal-800 hover:to-gray-800  rounded-lg text-white font-semibold transition-all"
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Mobile Footer Info */}
                                <div className="pt-6 border-t border-gray-800">
                                    <p className="text-xs text-gray-500 text-center">
                                        MSME Registered Company<br />
                                        Based in Surat, Gujarat
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

// ============ DESKTOP NAV MENU ITEM ============
const NavMenuItem = ({ item, isActive, activeDropdown, setActiveDropdown }: any) => {
    const hasDropdown = item.dropdown && item.dropdown.length > 0;

    return (
        <li
            className="relative"
            onMouseEnter={() => hasDropdown && setActiveDropdown(item.name)}
            onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
        >
            <Link
                to={item.path}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    isActive
                        ? 'text-white bg-gray-800'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
            >
                {item.name}
                {hasDropdown && (
                    <motion.div
                        animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FiChevronDown size={16} />
                    </motion.div>
                )}
            </Link>

            {/* Dropdown Menu */}
            {hasDropdown && (
                <AnimatePresence>
                    {activeDropdown === item.name && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700"
                        >
                            {item.dropdown.map((subItem: any, i: number) => (
                                <Link
                                    key={i}
                                    to={subItem.path}
                                    className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                                >
                                    {subItem.name}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </li>
    );
};

export default Navbar;
