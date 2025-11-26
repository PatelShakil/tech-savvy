import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs,deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { PlusIcon, PencilIcon, TrashIcon, LinkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import SessionModal from "./SessionModal.tsx";

interface Session {
    id: string;
    programId: string;
    sessionName: string;
    description: string;
    tags: string[];
    meetingLink: string;
    dateTime: string;
    attachments?: string[];
    attendance: string[];
    createdAt: Date;
}

interface SessionsTabProps {
    programId: string;
}

const SessionsTab: React.FC<SessionsTabProps> = ({ programId }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

    useEffect(() => {
        fetchSessions();
    }, [programId]);

    const fetchSessions = async () => {
        try {
            const sessionsQuery = query(
                collection(db, 'sessions'),
                where('programId', '==', programId),
                orderBy('dateTime', 'desc')
            );
            const sessionsSnap = await getDocs(sessionsQuery);
            const sessionsData = sessionsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Session[];

            setSessions(sessionsData);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async (sessionId: string, sessionName: string) => {
        if (window.confirm(`Are you sure you want to delete session "${sessionName}"?`)) {
            try {
                await deleteDoc(doc(db, 'sessions', sessionId));
                fetchSessions();
                alert('Session deleted successfully');
            } catch (error) {
                console.error('Error deleting session:', error);
                alert('Failed to delete session');
            }
        }
    };

    const getFilteredSessions = () => {
        const now = new Date();

        switch (filter) {
            case 'upcoming':
                return sessions.filter(s => new Date(s.dateTime) >= now);
            case 'past':
                return sessions.filter(s => new Date(s.dateTime) < now);
            default:
                return sessions;
        }
    };

    const filteredSessions = getFilteredSessions();

    const isUpcoming = (dateTime: string) => {
        return new Date(dateTime) >= new Date();
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading sessions...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Sessions Management</h3>
                    <p className="text-sm text-gray-600 mt-1">Total: {sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Session
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {['all', 'upcoming', 'past'].map((filterOption) => (
                    <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption as any)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                            filter === filterOption
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {filterOption}
                    </button>
                ))}
            </div>

            {filteredSessions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No sessions found</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add First Session
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredSessions.map((session) => (
                        <div
                            key={session.id}
                            className={`bg-white border rounded-lg overflow-hidden hover:shadow-md transition ${
                                isUpcoming(session.dateTime) ? 'border-blue-300' : 'border-gray-200'
                            }`}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${
                                                isUpcoming(session.dateTime) ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}>
                                                <CalendarIcon className={`w-6 h-6 ${
                                                    isUpcoming(session.dateTime) ? 'text-blue-600' : 'text-gray-600'
                                                }`} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-800">{session.sessionName}</h4>
                                                <p className="text-gray-600 text-sm mt-1">{session.description}</p>

                                                {/* Date and Time */}
                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="w-4 h-4" />
                                                        <span>{new Date(session.dateTime).toLocaleDateString('en-IN', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <ClockIcon className="w-4 h-4" />
                                                        <span>{new Date(session.dateTime).toLocaleTimeString('en-IN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}</span>
                                                    </div>
                                                    {isUpcoming(session.dateTime) && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Upcoming
                            </span>
                                                    )}
                                                </div>

                                                {/* Tags */}
                                                {session.tags && session.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {session.tags.map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded"
                                                            >
                                {tag}
                              </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Meeting Link */}
                                                {session.meetingLink && (
                                                    <div className="mt-3">
                                                        <a
                                                            href={session.meetingLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                        >
                                                            <LinkIcon className="w-4 h-4" />
                                                            Join Meeting
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Attendance */}
                                                {session.attendance && session.attendance.length > 0 && (
                                                    <div className="mt-3 text-sm text-gray-600">
                                                        <span className="font-medium">Attendance:</span> {session.attendance.length} student{session.attendance.length !== 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => setEditingSession(session)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit Session"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSession(session.id, session.sessionName)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete Session"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Session Modal */}
            {(showAddModal || editingSession) && (
                <SessionModal
                    programId={programId}
                    session={editingSession}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingSession(null);
                    }}
                    onSuccess={() => {
                        fetchSessions();
                        setShowAddModal(false);
                        setEditingSession(null);
                    }}
                />
            )}
        </div>
    );
};

export default SessionsTab;
