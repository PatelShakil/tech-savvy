import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { AcademicCapIcon, UsersIcon, ClipboardDocumentCheckIcon, TrophyIcon } from '@heroicons/react/24/outline';
import {db} from "../../../firebase.ts";

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalPrograms: 0,
        activePrograms: 0,
        totalUsers: 0,
        totalApplications: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const programsSnapshot = await getDocs(collection(db, 'programs'));
            const activePrograms = programsSnapshot.docs.filter(
                doc => doc.data().status === 'active'
            );

            const usersSnapshot = await getDocs(collection(db, 'users'));
            const applicationsSnapshot = await getDocs(collection(db, 'applications'));

            setStats({
                totalPrograms: programsSnapshot.size,
                activePrograms: activePrograms.length,
                totalUsers: usersSnapshot.size,
                totalApplications: applicationsSnapshot.size,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const statCards = [
        {
            title: 'Total Programs',
            value: stats.totalPrograms,
            icon: AcademicCapIcon,
            color: 'bg-blue-500'
        },
        {
            title: 'Active Programs',
            value: stats.activePrograms,
            icon: TrophyIcon,
            color: 'bg-green-500'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: UsersIcon,
            color: 'bg-purple-500'
        },
        {
            title: 'Applications',
            value: stats.totalApplications,
            icon: ClipboardDocumentCheckIcon,
            color: 'bg-orange-500'
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Welcome back to Tech Savvy Solution Admin Panel</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                                        <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                                    </div>
                                    <div className={`${card.color} p-3 rounded-lg`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="px-6 py-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium">
                            + Add New Program
                        </button>
                        <button className="px-6 py-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-medium">
                            Manage Users
                        </button>
                        <button className="px-6 py-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition font-medium">
                            View Applications
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
