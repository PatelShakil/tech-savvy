import React, { useEffect, useState } from 'react';
import { collection,  getDocs } from 'firebase/firestore';
import AdminLayout from '../../../components/admin/AdminLayout';
import { AcademicCapIcon, UsersIcon, ClipboardDocumentCheckIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import {db} from "../../../firebase.ts";

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalPrograms: 0,
        activePrograms: 0,
        totalStudents: 0,
        totalApplications: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const programsSnapshot = await getDocs(collection(db, 'programs'));
            const activePrograms = programsSnapshot.docs.filter(
                doc => doc.data().status === 'active'
            );

            const studentsSnapshot = await getDocs(collection(db, 'users'));
            const applicationsSnapshot = await getDocs(collection(db, 'applications'));

            setStats({
                totalPrograms: programsSnapshot.size,
                activePrograms: activePrograms.length,
                totalStudents: studentsSnapshot.size,
                totalApplications: applicationsSnapshot.size,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Programs',
            value: stats.totalPrograms,
            icon: AcademicCapIcon,
            color: 'bg-blue-500',
            link: '/admin/programs'
        },
        {
            title: 'Active Programs',
            value: stats.activePrograms,
            icon: TrophyIcon,
            color: 'bg-green-500',
            link: '/admin/programs'
        },
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: UsersIcon,
            color: 'bg-purple-500',
            link: '/admin/students'
        },
        {
            title: 'Applications',
            value: stats.totalApplications,
            icon: ClipboardDocumentCheckIcon,
            color: 'bg-orange-500',
            link: '/admin/applications'
        },
    ];

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-600">Loading statistics...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard Overview">
            <div className="space-y-6">
                <div>
                    <p className="text-gray-600">Welcome back to Tech Savvy Solution Admin Panel</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={card.title}
                                to={card.link}
                                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                                        <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                                    </div>
                                    <div className={`${card.color} p-3 rounded-lg`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/admin/programs/add"
                            className="px-6 py-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium text-center"
                        >
                            + Add New Program
                        </Link>
                        <Link
                            to="/admin/students"
                            className="px-6 py-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-medium text-center"
                        >
                            Manage Students
                        </Link>
                        <Link
                            to="/admin/applications"
                            className="px-6 py-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition font-medium text-center"
                        >
                            View Applications
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                        <div className="space-y-3 text-gray-600">
                            <p className="text-sm">No recent activity to display</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
                        <div className="space-y-3 text-gray-600">
                            <p className="text-sm">No upcoming events scheduled</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
