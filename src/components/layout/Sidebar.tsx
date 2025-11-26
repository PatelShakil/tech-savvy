import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    AcademicCapIcon,
    UsersIcon,
    DocumentTextIcon,
    ChartBarIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
        { name: 'Programs', path: '/dashboard/programs', icon: AcademicCapIcon },
        { name: 'Users', path: '/dashboard/users', icon: UsersIcon },
        { name: 'Applications', path: '/dashboard/applications', icon: DocumentTextIcon },
        { name: 'Analytics', path: '/dashboard/analytics', icon: ChartBarIcon },
        { name: 'Settings', path: '/dashboard/settings', icon: Cog6ToothIcon },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold">Tech Savvy Admin</h1>
                <p className="text-gray-400 text-sm mt-1">Management Portal</p>
            </div>

            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

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
        </div>
    );
};

export default Sidebar;
