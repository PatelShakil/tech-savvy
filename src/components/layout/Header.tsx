import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
            <div className="h-full px-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Program Management</h2>

                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{user?.email}</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
