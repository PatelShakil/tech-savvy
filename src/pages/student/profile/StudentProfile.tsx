import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    AcademicCapIcon,
    CalendarIcon,
    PencilIcon,
    TrophyIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    joinedAt: any;
    college?: string;
    degree?: string;
    year?: string;
    bio?: string;
    skills?: string[];
    photoURL?: string;
}

interface Enrollment {
    id: string;
    programId: string;
    programName: string;
    status: string;
    enrolledAt: any;
}

const StudentProfile: React.FC = () => {
    const [user] = useAuthState(auth);
    const [student, setStudent] = useState<Student | null>(null);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            // Fetch student info
            const studentsQuery = query(
                collection(db, 'students'),
                where('email', '==', user?.email)
            );
            const studentsSnap = await getDocs(studentsQuery);

            if (!studentsSnap.empty) {
                const studentData = {
                    id: studentsSnap.docs[0].id,
                    ...studentsSnap.docs[0].data()
                } as Student;
                setStudent(studentData);

                // Fetch enrollments
                const enrollmentsQuery = query(
                    collection(db, 'enrollments'),
                    where('studentId', '==', studentData.id)
                );
                const enrollmentsSnap = await getDocs(enrollmentsQuery);
                const enrollmentsData = enrollmentsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Enrollment[];

                setEnrollments(enrollmentsData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            name: 'Total Programs',
            value: enrollments.length,
            icon: AcademicCapIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            name: 'Active',
            value: enrollments.filter(e => e.status === 'active').length,
            icon: ClockIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            name: 'Completed',
            value: enrollments.filter(e => e.status === 'completed').length,
            icon: CheckCircleIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            name: 'Achievements',
            value: enrollments.filter(e => e.status === 'completed').length,
            icon: TrophyIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden">
                <div className="px-8 py-12">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            {student.photoURL ? (
                                <img
                                    src={student.photoURL}
                                    alt={student.name}
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center">
                                    <UserCircleIcon className="w-24 h-24 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left text-white">
                            <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
                            {student.college && (
                                <p className="text-blue-100 text-lg mb-3">
                                    {student.degree} • {student.college}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                                <div className="flex items-center gap-2">
                                    <EnvelopeIcon className="w-5 h-5" />
                                    <span>{student.email}</span>
                                </div>
                                {student.phone && (
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="w-5 h-5" />
                                        <span>{student.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5" />
                                    <span>Joined {student.joinedAt?.toDate().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <Link
                            to="/student/profile/edit"
                            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
                        >
                            <PencilIcon className="w-5 h-5" />
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.name}</div>
                    </div>
                ))}
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* About Me */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
                    {student.bio ? (
                        <p className="text-gray-600 leading-relaxed">{student.bio}</p>
                    ) : (
                        <p className="text-gray-400 italic">No bio added yet</p>
                    )}
                </div>

                {/* Academic Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-600">College/University</span>
                            <span className="font-semibold text-gray-900">
                {student.college || 'Not specified'}
              </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-600">Degree</span>
                            <span className="font-semibold text-gray-900">
                {student.degree || 'Not specified'}
              </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600">Year</span>
                            <span className="font-semibold text-gray-900">
                {student.year || 'Not specified'}
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills */}
            {student.skills && student.skills.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Interests</h2>
                    <div className="flex flex-wrap gap-2">
                        {student.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                {skill}
              </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Enrolled Programs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Enrolled Programs</h2>
                {enrollments.length === 0 ? (
                    <div className="text-center py-8">
                        <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No enrollments yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {enrollments.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{enrollment.programName}</h3>
                                        <p className="text-sm text-gray-600">
                                            Enrolled: {enrollment.enrolledAt?.toDate().toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                    enrollment.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                  {enrollment.status}
                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {enrollments.slice(0, 5).map((enrollment, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <p className="text-gray-900">
                                    Enrolled in <strong>{enrollment.programName}</strong>
                                </p>
                                <p className="text-sm text-gray-500">
                                    {enrollment.enrolledAt?.toDate().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
