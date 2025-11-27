import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
    AcademicCapIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    CalendarIcon,
    DocumentTextIcon,
    ChartBarIcon,
    PencilIcon,
    BanknotesIcon,
    ClipboardDocumentCheckIcon,
    Bars3Icon,
    CheckIcon, VideoCameraIcon
} from '@heroicons/react/24/outline';
import DashboardTab from '../../../components/program-details/DashboardTab';
import StudentsTab from '../../../components/program-details/StudentsTab';
import GroupsTab from '../../../components/program-details/GroupsTab';
import SessionsTab from '../../../components/program-details/SessionsTab';
import AttendanceTab from '../../../components/program-details/AttendanceTab';
import PaymentsTab from '../../../components/program-details/PaymentsTab';
import CommunicationsTab from '../../../components/program-details/CommunicationsTab';
import ApplicationsTab from '../../../components/program-details/ApplicationsTab';
import DocumentsManagementTab from '../../../components/program-details/DocumentsManagementTab';
import AnalyticsTab from '../../../components/program-details/AnalyticsTab';
import RecordingsTab from "../../../components/program-details/RecordingsTab.tsx";

type TabType =
    | 'dashboard'
    | 'students'
    | 'groups'
    | 'sessions'
    | 'attendance'
    | 'payments'
    | 'communications'
    | 'applications'
    | 'documents'
    | 'analytics'
    | 'recordings';

interface TabConfig {
    id: TabType;
    name: string;
    icon: any;
    badge?: number;
}

const ProgramDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [program, setProgram] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalGroups: 0,
        feesCollected: 0,
        feesPending: 0,
        pendingApplications: 0
    });

    useEffect(() => {
        if (!id) return;
        fetchProgramDetails();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProgramDetails = async () => {
        try {
            const docRef = doc(db, 'programs', id!);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProgram({ id: docSnap.id, ...docSnap.data() });
            } else {
                setProgram(null);
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
            const enrollmentsQuery = query(collection(db, 'programEnrollments'), where('programId', '==', id));
            const enrollmentsSnap = await getDocs(enrollmentsQuery);

            let feesCollected = 0;
            let feesPending = 0;

            enrollmentsSnap.forEach((d) => {
                const data = d.data() as any;
                const amount = Number(data.feeAmount) || 0;
                if (data.feeStatus === 'paid') {
                    feesCollected += amount;
                } else {
                    feesPending += amount;
                }
            });

            // Fetch groups
            const groupsQuery = query(collection(db, 'groups'), where('programId', '==', id));
            const groupsSnap = await getDocs(groupsQuery);

            // Fetch pending applications
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
                pendingApplications: applicationsSnap.size
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const tabs: TabConfig[] = [
        { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
        { id: 'students', name: 'Students', icon: UsersIcon },
        { id: 'groups', name: 'Groups', icon: AcademicCapIcon },
        { id: 'sessions', name: 'Sessions', icon: CalendarIcon },
        { id: 'recordings', name: 'Recordings', icon: VideoCameraIcon }, // ADD THIS
        { id: 'attendance', name: 'Attendance', icon: ClipboardDocumentCheckIcon },
        { id: 'payments', name: 'Payments', icon: BanknotesIcon },
        { id: 'communications', name: 'Communications', icon: ChatBubbleLeftRightIcon },
        { id: 'applications', name: 'Applications', icon: DocumentTextIcon, badge: stats.pendingApplications },
        { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
        { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
    ];

    const currentTabConfig = tabs.find((t) => t.id === activeTab);

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
            <div className="overflow-x-hidden">
                <div className={"max-w-screen mx-auto w-full space-y-6"}>
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{program.name}</h1>
                            <p className="text-gray-600 mt-2">{program.description}</p>
                            <div className="flex gap-4 mt-4 text-sm">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">{program.category}</span>
                                <span
                                    className={`px-3 py-1 rounded-full capitalize ${
                                        program.status === 'active' ? 'bg-green-100 text-green-800' : program.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
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

                {/* Tabs container (sticky + scrollable) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {/* Mobile View - Dropdown */}
                    <div className="lg:hidden border-b border-gray-200 p-4">
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                        >
                            <div className="flex items-center gap-3">
                                {currentTabConfig && (
                                    (() => {
                                        const Icon = currentTabConfig.icon;
                                        return <Icon className="w-5 h-5 text-blue-600" />;
                                    })()
                                )}
                                <span className="font-medium text-gray-800">{currentTabConfig?.name}</span>
                                {typeof currentTabConfig?.badge === 'number' && currentTabConfig.badge > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{currentTabConfig.badge}</span>
                                )}
                            </div>
                            <Bars3Icon className="w-5 h-5 text-gray-600" />
                        </button>

                        {showMobileMenu && (
                            <div className="mt-2 bg-white flex flex-col border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setShowMobileMenu(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-3 transition ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                                                <span className="font-medium text-black">{tab.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {typeof tab.badge === 'number' && tab.badge > 0 && (
                                                    <span className="bg-red-500 text-xs font-bold px-2 py-1 rounded-full">{tab.badge}</span>
                                                )}
                                                {isActive && <CheckIcon className="w-5 h-5" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Desktop View - Horizontal Tabs with Scroll */}
                    <div className="hidden lg:flex flex-col">
                        <div className="border-b bg-white sticky top-0 z-10 no-scrollbar">
                            <div className="flex max-w-[79vw] overflow-x-auto min-w-0 no-scrollbar">
                                <nav className="flex space-x-2 px-6 no-scrollbar" aria-label="Tabs">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                // IMPORTANT: prevent shrinking so tabs scroll instead of compressing
                                                className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition whitespace-nowrap flex-shrink-0 ${
                                                    isActive
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                {tab.name}
                                                {typeof tab.badge === 'number' && tab.badge > 0 && (
                                                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{tab.badge}</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </nav>

                                {/* small right padding to ensure last tab is reachable when scrolling */}
                                <div className="pr-6 flex-shrink-0" />
                            </div>
                        </div>
                    </div>


                    {/* Tab Content */}
                    <div className="px-6 pt-6 pb-2 min-w-0">
                        {activeTab === 'dashboard' && <DashboardTab program={program} stats={stats} />}
                        {activeTab === 'students' && <StudentsTab programId={program.id} feePerStudent={program.feePerStudent} onUpdate={fetchStats} />}
                        {activeTab === 'groups' && <GroupsTab programId={program.id} feePerStudent={program.feePerStudent} onUpdate={fetchStats} />}
                        {activeTab === 'sessions' && <SessionsTab programId={program.id} />}
                        {activeTab === 'recordings' && <RecordingsTab programId={program.id} />}

                        {activeTab === 'attendance' && <AttendanceTab programId={program.id} />}
                        {activeTab === 'payments' && <PaymentsTab programId={program.id} feePerStudent={program.feePerStudent} onUpdate={fetchStats} />}
                        {activeTab === 'communications' && <CommunicationsTab programId={program.id} />}
                        {activeTab === 'applications' && <ApplicationsTab programId={program.id} feePerStudent={program.feePerStudent} onUpdate={fetchStats} />}
                        {activeTab === 'documents' && <DocumentsManagementTab programId={program.id} />}
                        {activeTab === 'analytics' && <AnalyticsTab programId={program.id} program={program} />}
                    </div>
                </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProgramDetails;
