import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Import tab components (we'll create these next)
import DashboardTab from './tabs/DashboardTab';
import SessionsTab from './tabs/SessionsTab';
import RecordingsTab from './tabs/RecordingsTab';
import MilestonesTab from './tabs/MilestonesTab';
import GroupChatTab from './tabs/GroupChatTab';
import SupportTab from './tabs/SupportTab';
import DocumentsTab from './tabs/DocumentsTab';
import {Group} from "../../../types/program.ts";

interface Program {
    id: string;
    name: string;
    description: string;
    category: string;
    status: string;
    startDate: string;
    endDate: string;
    milestones: any[];
}

interface Student {
    id: string;
    name: string;
    email: string;
}


const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'sessions', name: 'Sessions', icon: '📅' },
    { id: 'recordings', name: 'Recordings', icon: '🎥' },
    { id: 'milestones', name: 'Milestones', icon: '🎯' },
    { id: 'chat', name: 'Group Chat', icon: '💬' },
    { id: 'support', name: 'Support', icon: '🎧' },
    { id: 'documents', name: 'Documents', icon: '📄' }
];

const ProgramDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user] = useAuthState(auth);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [program, setProgram] = useState<Program | null>(null);
    const [student, setStudent] = useState<Student | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id && user) {
            fetchData();
        }
    }, [id, user]);

    const fetchData = async () => {
        try {
            // Fetch program
            const programDoc = await getDoc(doc(db, 'programs', id!));
            if (programDoc.exists()) {
                setProgram({ id: programDoc.id, ...programDoc.data() } as Program);
            }

            // Fetch student info
            const studentsQuery = query(
                collection(db, 'students'),
                where('email', '==', user?.email)
            );
            const studentsSnap = await getDocs(studentsQuery);
            if (!studentsSnap.empty) {
                const studentData = { id: studentsSnap.docs[0].id, ...studentsSnap.docs[0].data() } as Student;
                setStudent(studentData);

                // Fetch group
                const groupsQuery = query(
                    collection(db, 'groups'),
                    where('programId', '==', id),
                    where('members', 'array-contains', user?.uid)
                );
                const groupsSnap = await getDocs(groupsQuery);
                if (!groupsSnap.empty) {
                    setGroup({ id: groupsSnap.docs[0].id, ...groupsSnap.docs[0].data() } as Group);
                }
                console.log(group);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Program not found</h2>
                <Link to="/student/programs" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                    ← Back to Programs
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to="/student/programs"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Programs
                </Link>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-3 capitalize">
                {program.category}
              </span>
                            <h1 className="text-3xl font-bold mb-2">{program.name}</h1>
                            <p className="text-blue-100">{program.description}</p>
                        </div>
                        <div className="text-right">
                            <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <div className="text-sm opacity-90">Status</div>
                                <div className="text-lg font-bold capitalize">{program.status}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-200 overflow-x-auto">
                    <div className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="lg:p-6 p-1">
                    {activeTab === 'dashboard' && <DashboardTab program={program} student={student} group={group} />}
                    {activeTab === 'sessions' && <SessionsTab programId={id!} />}
                    {activeTab === 'recordings' && <RecordingsTab programId={id!} />}
                    {activeTab === 'milestones' && <MilestonesTab program={program} />}
                    {activeTab === 'chat' && <GroupChatTab programId={id!} student={student} group={group} />}
                    {activeTab === 'support' && <SupportTab programId={id!} student={student} />}
                    {activeTab === 'documents' && <DocumentsTab programId={id!} studentId={student?.id || ''} />}
                </div>
            </div>
        </div>
    );
};

export default ProgramDetails;
