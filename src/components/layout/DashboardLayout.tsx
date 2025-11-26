import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <Header />
            <main className="ml-64 pt-16 p-6">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
