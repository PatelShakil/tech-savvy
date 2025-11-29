import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    AcademicCapIcon,
    CalendarIcon,
    UserGroupIcon,
    ArrowRightIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Program {
    id: string;
    name: string;
    description: string;
    category: string;
    status: string;
    startDate: string;
    endDate: string;
    maxStudents: number;
    enrolledCount?: number;
}

interface Enrollment {
    id: string;
    programId: string;
    studentId: string;
    studentEmail: string;
    studentName: string;
    status: string;
    enrolledAt: any;
    groupId?: string;
}

const ProgramsList: React.FC = () => {
    const [user] = useAuthState(auth);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

    useEffect(() => {
        if (user) {
            fetchData();
            enrollments
        }
    }, [user]);

    const fetchData = async () => {
        try {
            // Fetch enrollments for current student
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

            // Fetch programs for enrolled program IDs
            const programIds = enrollmentsData.map(e => e.programId);
            if (programIds.length > 0) {
                const programsSnap = await getDocs(collection(db, 'programs'));
                const programsData = programsSnap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(program => programIds.includes(program.id)) as Program[];

                setPrograms(programsData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrograms = programs.filter(program => {
        const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || program.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            internship: 'bg-blue-100 text-blue-800',
            mentorship: 'bg-purple-100 text-purple-800',
            workshop: 'bg-green-100 text-green-800',
            training: 'bg-orange-100 text-orange-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-100 text-green-800',
            upcoming: 'bg-blue-100 text-blue-800',
            completed: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Programs</h1>
                <p className="text-gray-600 mt-2">Access all your enrolled programs and resources</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search programs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {['all', 'active', 'completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status as any)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition ${
                                    filterStatus === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Programs Grid */}
            {filteredPrograms.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No programs found</h3>
                    <p className="text-gray-600">
                        {searchQuery || filterStatus !== 'all'
                            ? 'Try adjusting your filters'
                            : 'You are not enrolled in any programs yet'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map((program) => (
                        <Link
                            key={program.id}
                            to={`/student/programs/${program.id}`}
                            className="group"
                        >
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                                {/* Header with gradient */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(program.category)} bg-white/20 text-white`}>
                                            {program.category}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(program.status)} bg-white/20 text-white`}>
                                            {program.status}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-100 transition">
                                        {program.name}
                                    </h3>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {program.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>{program.startDate} - {program.endDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <UserGroupIcon className="w-4 h-4" />
                                            <span>{program.enrolledCount || 0} / {program.maxStudents} students</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-sm font-medium text-gray-900">View Details</span>
                                        <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Stats Footer */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{programs.length}</div>
                        <div className="text-sm text-gray-600 mt-1">Total Programs</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {programs.filter(p => p.status === 'active').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Active Programs</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {programs.filter(p => p.status === 'completed').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Completed</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramsList;
