import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import {
    CalendarIcon,
    ClockIcon,
    VideoCameraIcon,
    CheckCircleIcon,
    LinkIcon
} from '@heroicons/react/24/outline';

interface Session {
    id: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    meetingLink?: string;
    status: 'upcoming' | 'ongoing' | 'completed';
    recordingUrl?: string;
}

interface SessionsTabProps {
    programId: string;
}

const SessionsTab: React.FC<SessionsTabProps> = ({ programId }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

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

    const filteredSessions = sessions.filter(session => {
        if (filter === 'all') return true;
        return session.status === filter;
    });

    const getStatusBadge = (status: string) => {
        const badges = {
            upcoming: { text: 'Upcoming', class: 'bg-blue-100 text-blue-800', icon: ClockIcon },
            ongoing: { text: 'Live Now', class: 'bg-green-100 text-green-800 animate-pulse', icon: VideoCameraIcon },
            completed: { text: 'Completed', class: 'bg-gray-100 text-gray-800', icon: CheckCircleIcon }
        };
        return badges[status as keyof typeof badges] || badges.upcoming;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Filters */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">All Sessions</h2>
                <div className="flex gap-2">
                    {['all', 'upcoming', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status as any)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition ${
                                filter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sessions List */}
            {filteredSessions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
                    <p className="text-gray-600">
                        {filter === 'all'
                            ? 'No sessions scheduled yet'
                            : `No ${filter} sessions`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredSessions.map((session) => {
                        const statusBadge = getStatusBadge(session.status);
                        const StatusIcon = statusBadge.icon;

                        return (
                            <div
                                key={session.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                        <StatusIcon className="w-4 h-4" />
                                                {statusBadge.text}
                      </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{session.description}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>{session.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ClockIcon className="w-4 h-4" />
                                                <span>{session.startTime} - {session.endTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                                    {session.meetingLink && session.status !== 'completed' && (
                                        <a
                                            href={session.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            Join Meeting
                                        </a>
                                    )}
                                    {session.recordingUrl && (
                                        <a
                                            href={session.recordingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
                                        >
                                            <VideoCameraIcon className="w-4 h-4" />
                                            View Recording
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{sessions.length}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Sessions</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {sessions.filter(s => s.status === 'upcoming').length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Upcoming</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-600">
                        {sessions.filter(s => s.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Completed</div>
                </div>
            </div>
        </div>
    );
};

export default SessionsTab;
