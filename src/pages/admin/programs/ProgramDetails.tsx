import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
    AcademicCapIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    CalendarIcon,
    DocumentTextIcon,
    ChartBarIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import DashboardTab from '../../../components/program-details/DashboardTab';
import StudentsTab from '../../../components/program-details/StudentsTab';
import GroupsTab from '../../../components/program-details/GroupsTab';
import SessionsTab from '../../../components/program-details/SessionsTab';
import CommunicationsTab from '../../../components/program-details/CommunicationsTab';
import ApplicationsTab from '../../../components/program-details/ApplicationsTab';
import AnalyticsTab from '../../../components/program-details/AnalyticsTab';
import {db} from "../../../firebase.ts";

type TabType = 'dashboard' | 'students' | 'groups' | 'sessions' | 'communications' | 'applications' | 'analytics';

const ProgramDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [program, setProgram] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalGroups: 0,
        feesCollected: 0,
        feesPending: 0,
        pendingApplications: 0,
    });

    useEffect(() => {
        if (id) {
            fetchProgramDetails();
            fetchStats();
        }
    }, [id]);

    const fetchProgramDetails = async () => {
        try {
            const docRef = doc(db, 'programs', id!);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProgram({ id: docSnap.id, ...docSnap.data() });
            }
        } catch (error) {
            console.error('Error fetching program:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Fetch enrollments
            const enrollmentsQuery = query(
                collection(db, 'programEnrollments'),
                where('programId', '==', id)
            );
            const enrollmentsSnap = await getDocs(enrollmentsQuery);

            let feesCollected = 0;
            let feesPending = 0;

            enrollmentsSnap.forEach(doc => {
                const data = doc.data();
                if (data.feeStatus === 'paid') {
                    feesCollected += data.feeAmount;
                } else {
                    feesPending += data.feeAmount;
                }
            });

            // Fetch groups
            const groupsQuery = query(
                collection(db, 'groups'),
                where('programId', '==', id)
            );
            const groupsSnap = await getDocs(groupsQuery);

            // Fetch applications
            const applicationsQuery = query(
                collection(db, 'applications'),
                where('programId', '==', id),
                where('status', '==', 'pending')
            );
            const applicationsSnap = await getDocs(applicationsQuery);

            setStats({
                totalStudents: enrollmentsSnap.size,
                totalGroups: groupsSnap.size,
                feesCollected,
                feesPending,
                pendingApplications: applicationsSnap.size,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
        { id: 'students', name: 'Students', icon: UsersIcon },
        { id: 'groups', name: 'Groups', icon: AcademicCapIcon },
        { id: 'sessions', name: 'Sessions', icon: CalendarIcon },
        { id: 'communications', name: 'Communications', icon: ChatBubbleLeftRightIcon },
        { id: 'applications', name: 'Applications', icon: DocumentTextIcon, badge: stats.pendingApplications },
        { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }, // ADD THIS

    ];

    if (loading) {
        return (
            <AdminLayout title="Program Details">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-600">Loading program...</div>
                </div>
            </AdminLayout>
        );
    }

    if (!program) {
        return (
            <AdminLayout title="Program Details">
                <div className="text-center py-12">
                    <p className="text-gray-600">Program not found</p>
                    <Link to="/admin/programs" className="text-blue-600 hover:underline mt-4 inline-block">
                        Back to Programs
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={program.name}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{program.name}</h1>
                            <p className="text-gray-600 mt-2">{program.description}</p>
                            <div className="flex gap-4 mt-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                  {program.category}
                </span>
                                <span className={`px-3 py-1 rounded-full capitalize ${
                                    program.status === 'active' ? 'bg-green-100 text-green-800' :
                                        program.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                }`}>
                  {program.status}
                </span>
                                <span className="text-gray-600">
                  {program.startDate} to {program.endDate}
                </span>
                            </div>
                        </div>
                        <Link
                            to={`/admin/programs/edit/${program.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <PencilIcon className="w-5 h-5" />
                            Edit Program
                        </Link>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <p className="text-sm text-gray-600">Total Students</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalStudents}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <p className="text-sm text-gray-600">Groups</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalGroups}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <p className="text-sm text-gray-600">Fees Collected</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">₹{stats.feesCollected.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <p className="text-sm text-gray-600">Fees Pending</p>
                        <p className="text-2xl font-bold text-orange-600 mt-1">₹{stats.feesPending.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <p className="text-sm text-gray-600">Applications</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{stats.pendingApplications}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabType)}
                                        className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition relative
                      ${isActive
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                    `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.name}
                                        {tab.badge !== undefined && tab.badge > 0 && (
                                            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {tab.badge}
                      </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'dashboard' && <DashboardTab program={program} stats={stats} />}
                        {activeTab === 'students' && <StudentsTab programId={program.id} feePerStudent={program.feePerStudent} onUpdate={fetchStats} />}
                        {activeTab === 'groups' && <GroupsTab programId={program.id} feePerStudent={program.feePerStudent} onUpdate={fetchStats} />}
                        {activeTab === 'sessions' && <SessionsTab programId={program.id} />}
                        {activeTab === 'communications' && <CommunicationsTab programId={program.id} />}
                        {activeTab === 'applications' && <ApplicationsTab programId={program.id} feePerStudent={program.feePerStudent} onUpdate={fetchStats} />}
                        {activeTab === 'analytics' && <AnalyticsTab programId={program.id} program={program} />}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProgramDetails;
