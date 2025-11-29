import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    AcademicCapIcon,
    ClockIcon,
    CheckCircleIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import {Enrollment} from "../../../types/program.ts";


const StudentDashboard: React.FC = () => {
    const [user] = useAuthState(auth);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchEnrollments();
        }
    }, [user]);

    const fetchEnrollments = async () => {
        try {
            const enrollmentsQuery = query(
                collection(db, 'programEnrollments'),
                where('studentId', '==', user?.uid)
            );
            const enrollmentsSnap = await getDocs(enrollmentsQuery);

            const enrollmentsData = enrollmentsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Enrollment[];



            setEnrollments(enrollmentsData);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            name: 'Total Programs',
            value: enrollments.length,
            icon: AcademicCapIcon,
            color: 'bg-blue-500'
        },
        {
            name: 'Active',
            value: enrollments.length,
            icon: ClockIcon,
            color: 'bg-green-500'
        },
        {
            name: 'Completed',
            value: 0,
            icon: CheckCircleIcon,
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
                <p className="text-gray-600 mt-2">Here's what's happening with your programs</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{stat.name}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Programs List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">My Programs</h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="p-12 text-center">
                        <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No programs enrolled yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {enrollments.map((enrollment) => (
                            <Link
                                key={enrollment.id}
                                to={`/student/programs/${enrollment.programId}`}
                                className="block p-6 hover:bg-gray-50 transition group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                                            {enrollment.programId}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Enrolled on { enrollment.joinedAt?.toDate().toDateString() || "N/A"}
                                        </p>
                                    </div>
                                    <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
