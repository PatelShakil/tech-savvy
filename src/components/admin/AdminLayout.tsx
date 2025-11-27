import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    AcademicCapIcon,
    UsersIcon,
    DocumentTextIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    BookOpenIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuthState } from '../../pages/admin/states/UseAuthState';
import { getAuth, signOut } from 'firebase/auth';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin Panel' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthState();
    const auth = getAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
        { name: 'Programs', path: '/admin/programs', icon: AcademicCapIcon },
        { name: 'Classes', path: '/admin/classes', icon: BookOpenIcon },
        { name: 'Students', path: '/admin/students', icon: UsersIcon },
        { name: 'Applications', path: '/admin/applications', icon: DocumentTextIcon },
        { name: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
        { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon },
    ];

    return (
        <div className="flex flex-col relative min-h-screen bg-gray-50">
            {/* Sidebar for large screens */}
            <aside className="hidden fixed lg:flex lg:w-64 bg-gray-900 text-white  h-screen overflow-y-auto flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">Tech Savvy Admin</h1>
                    <p className="text-gray-400 text-sm mt-1">Management Portal</p>
                </div>

                <nav className="p-4 space-y-2 flex-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            location.pathname === item.path ||
                            (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="mb-3">
                        <p className="text-sm font-medium break-words">{user?.email}</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile header */}
            <header className="lg:hidden fixed inset-x-0 bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="p-2 rounded-md hover:bg-gray-100 transition"
                            aria-label="Open menu"
                        >
                            <Bars3Icon className="w-6 h-6 text-gray-700" />
                        </button>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-30">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-72 bg-gray-900 text-white p-4 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-lg font-bold">Tech Savvy Admin</h1>
                                <p className="text-xs text-gray-300">{user?.email}</p>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md hover:bg-gray-800">
                                <XMarkIcon className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        <nav className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    location.pathname === item.path ||
                                    (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                                            isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileOpen(false);
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main content: note lg:ml-64 (space for the fixed sidebar) */}
            <div className="flex-1 lg:ml-64 ml-0">
                {/* Header visible on large screens (keeps title consistent) */}
                <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="px-6 py-4">
                        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    </div>
                </header>

                <main className="px-4 py-6">
                    <div className="max-w-screen-xl mx-auto w-full overflow-x-hidden">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
