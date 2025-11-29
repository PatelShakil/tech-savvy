import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import {
    VideoCameraIcon,
    PlayIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';

interface Recording {
    id: string;
    programId: string;
    title: string;
    description: string;
    youtubeUrl: string;
    thumbnailUrl?: string;
    duration?: string;
    tags: string[];
    uploadedAt: any;
    views: number;
}

interface RecordingsTabProps {
    programId: string;
}

const RecordingsTab: React.FC<RecordingsTabProps> = ({ programId }) => {
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecordings();
    }, [programId]);

    const fetchRecordings = async () => {
        try {
            const recordingsQuery = query(
                collection(db, 'recordings'),
                where('programId', '==', programId),
                orderBy('uploadedAt', 'desc')
            );
            const recordingsSnap = await getDocs(recordingsQuery);
            const recordingsData = recordingsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Recording[];

            setRecordings(recordingsData);
        } catch (error) {
            console.error('Error fetching recordings:', error);
        } finally {
            setLoading(false);
        }
    };

    const extractYouTubeId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
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
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">Session Recordings</h2>
                <p className="text-gray-600 mt-1">Watch recorded sessions anytime</p>
            </div>

            {/* Recordings Grid */}
            {recordings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <VideoCameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No recordings yet</h3>
                    <p className="text-gray-600">Session recordings will appear here</p>
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
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group"
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
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition"
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
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {recording.title}
                                    </h3>

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

                                        <a
                                            href={recording.youtubeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Watch →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecordingsTab;
