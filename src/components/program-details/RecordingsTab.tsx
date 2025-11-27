import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { VideoCameraIcon, PlusIcon, TrashIcon, PlayIcon, EyeIcon } from '@heroicons/react/24/outline';
import AddRecordingModal from "./AddRecordingModal.tsx";

interface Recording {
    id: string;
    programId: string;
    sessionId?: string;
    title: string;
    description: string;
    youtubeUrl: string;
    thumbnailUrl?: string;
    duration?: string;
    tags: string[];
    uploadedAt: any;
    uploadedBy: string;
    views: number;
}

interface RecordingsTabProps {
    programId: string;
}

const RecordingsTab: React.FC<RecordingsTabProps> = ({ programId }) => {
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchRecordings();
    }, [programId]);

    const fetchRecordings = async () => {
        try {
            const recordingsQuery = query(
                collection(db, 'recordings'),
                where('programId', '==', programId)
            );
            const recordingsSnap = await getDocs(recordingsQuery);
            const recordingsData = recordingsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Recording[];

            // Sort by upload date (newest first)
            recordingsData.sort((a, b) => {
                const dateA = a.uploadedAt?.toDate ? a.uploadedAt.toDate() : new Date(0);
                const dateB = b.uploadedAt?.toDate ? b.uploadedAt.toDate() : new Date(0);
                return dateB.getTime() - dateA.getTime();
            });

            setRecordings(recordingsData);
        } catch (error) {
            console.error('Error fetching recordings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (recordingId: string) => {
        if (window.confirm('Are you sure you want to delete this recording?')) {
            try {
                await deleteDoc(doc(db, 'recordings', recordingId));
                fetchRecordings();
                alert('Recording deleted successfully');
            } catch (error) {
                console.error('Error deleting recording:', error);
                alert('Failed to delete recording');
            }
        }
    };

    const extractYouTubeId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading recordings...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Session Recordings</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage recorded sessions for students</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Recording
                </button>
            </div>

            {/* Recordings Grid */}
            {recordings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <VideoCameraIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">No recordings uploaded yet</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Upload First Recording
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recordings.map((recording) => {
                        const videoId = extractYouTubeId(recording.youtubeUrl);
                        const thumbnailUrl = recording.thumbnailUrl ||
                            (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '');

                        return (
                            <div
                                key={recording.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gray-900">
                                    {thumbnailUrl ? (
                                        <img
                                            src={thumbnailUrl}
                                            alt={recording.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <VideoCameraIcon className="w-16 h-16 text-gray-600" />
                                        </div>
                                    )}

                                    {/* Play Overlay */}
                                    <a
                                        href={recording.youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition"
                                    >
                                        <div className="bg-red-600 rounded-full p-4">
                                            <PlayIcon className="w-8 h-8 text-white" />
                                        </div>
                                    </a>

                                    {/* Duration Badge */}
                                    {recording.duration && (
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                                            {recording.duration}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                        {recording.title}
                                    </h4>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {recording.description}
                                    </p>

                                    {/* Tags */}
                                    {recording.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {recording.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                >
                          {tag}
                        </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
                                        <div className="flex items-center gap-1">
                                            <EyeIcon className="w-4 h-4" />
                                            <span>{recording.views} views</span>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(recording.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Recording Modal */}
            {showAddModal && (
                <AddRecordingModal
                    programId={programId}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        fetchRecordings();
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default RecordingsTab;
