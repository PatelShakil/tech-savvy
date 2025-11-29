import React, {useState} from 'react';
import {Outlet, Link, useNavigate} from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../../../firebase';
import {signOut} from 'firebase/auth';
import {
    HomeIcon,
    AcademicCapIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon, ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import {usePwaInstall} from "../../../utils/usePwaInstall.tsx";
import {DownloadIcon, SearchIcon} from "lucide-react";

const StudentLayout: React.FC = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isInstallable, installApp } = usePwaInstall();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/student/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navigation = [
        {name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon},
        {name: 'My Programs', href: '/student/programs', icon: AcademicCapIcon},
        {name: 'Profile', href: '/student/profile', icon: UserCircleIcon},
        {name: 'Settings', href: '/student/settings', icon: Cog6ToothIcon},
        {name: 'Other Programs', href: '/programs', icon: SearchIcon},
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
                <div
                    className={`fixed inset-0 bg-gray-900/80 transition-opacity ${
                        sidebarOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                />

                <div
                    className={`fixed inset-y-0 left-0 w-72 bg-white transform transition-transform ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <span className="text-xl font-bold text-blue-600">Tech Savvy Solution</span>
                        <button onClick={() => setSidebarOpen(false)}>
                            <XMarkIcon className="w-6 h-6"/>
                        </button>
                    </div>

                    <nav className="p-4 space-y-1">
                        {navigation.map((item) =>{
                            const isActive = location.pathname === item.href || (item.href !== '/student/dashboard' && location.pathname.startsWith(item.href));
                            return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg  ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 "}  hover:bg-blue-50 hover:text-blue-600 transition`}
                            >
                                <item.icon className="w-5 h-5"/>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                        })}
                        {isInstallable && (
                            <button
                                onClick={installApp}
                                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 transition"
                            >
                                <DownloadIcon className="w-5 h-5" />
                                <span className="font-medium">Install App</span>
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                            <span className="font-medium">Logout</span>
                        </button>

                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                    <div className="flex items-center h-16 px-6 border-b">
                        <span className="text-xl font-bold text-blue-600">Tech Savvy Solution</span>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) =>{
                            const isActive = location.pathname === item.href || (item.href !== '/student/dashboard' && location.pathname.startsWith(item.href));
                            return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 "} hover:bg-blue-50 hover:text-blue-600 transition`}
                            >
                                <item.icon className="w-5 h-5"/>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )}
                        )}
                    </nav>

                    <div className="p-4 border-t">
                        {isInstallable && (
                            <button
                                onClick={installApp}
                                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 transition"
                            >
                                <DownloadIcon className="w-5 h-5" />
                                <span className="font-medium">Install App</span>
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                            <span className="font-medium">Logout</span>
                        </button>

                    </div>


                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="pl-4 text-gray-500 lg:hidden"
                    >
                        <Bars3Icon className="w-6 h-6"/>
                    </button>

                    <div className="flex items-center justify-between flex-1 px-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-semibold text-gray-900">Student Portal</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{user?.email}</span>
                            <UserCircleIcon
                                className="w-8 h-8 rounded-full text-blue-600 cursor-pointer hover:text-blue-700 transition"
                                onClick={() => setSidebarOpen(true)}
                            />
                            {isInstallable && (
                            <ArrowDownTrayIcon
                                onClick={installApp}
                                className="w-7 h-7 text-gray-600 cursor-pointer hover:text-blue-600 transition"
                                title="Install App"
                            />
                        )}
                        </div>


                    </div>
                </div>

                {/* Page content */}
                <main className="lg:p-6 p-1">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
