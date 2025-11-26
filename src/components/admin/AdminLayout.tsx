import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    AcademicCapIcon,
    UsersIcon,
    DocumentTextIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';
import { useAuthState } from '../../pages/admin/states/UseAuthState';
import { getAuth, signOut } from 'firebase/auth';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = "Admin Panel" }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthState();
    const auth = getAuth();

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
        <div className="flex mt-14 min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white fixed h-screen overflow-y-auto">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">Tech Savvy Admin</h1>
                    <p className="text-gray-400 text-sm mt-1">Management Portal</p>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-medium">{user?.email}</p>
                            <p className="text-xs text-gray-400">Administrator</p>
                        </div>
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

            {/* Main Content */}
            <div className="ml-64 flex-1">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="px-6 py-4">
                        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
