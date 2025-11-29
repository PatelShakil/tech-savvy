import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import {
    DocumentTextIcon,
    ArrowDownTrayIcon,
    DocumentArrowDownIcon,
    AcademicCapIcon,
    NewspaperIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Document {
    id: string;
    programId: string;
    studentId: string;
    studentName: string;
    type: 'offer_letter' | 'certificate';
    title: string;
    downloadUrl: string;
    createdAt: any;
}
interface DocumentsTabProps {
    programId: string;
    studentId: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ programId, studentId }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        if (programId && studentId) {
            fetchDocuments();
        }
    }, [programId, studentId]);

    const fetchDocuments = async () => {
        try {
            // Fetch program-wide documents
            const programDocsQuery = query(
                collection(db, 'documents'),
                where('programId', '==', programId),
                where('studentId', '==', null),

                // orderBy('uploadedAt', 'desc')
            );
            const programDocsSnap = await getDocs(programDocsQuery);

            // Fetch student-specific documents
            const studentDocsQuery = query(
                collection(db, 'documents'),
                where('studentId', '==', studentId),
                where('programId', '==', programId),
            );
            const studentDocsSnap = await getDocs(studentDocsQuery);

            const allDocs = [
                ...programDocsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                ...studentDocsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            ] as Document[];

            setDocuments(allDocs);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocuments = documents.filter(doc => {
        if (filter === 'all') return true;
        return doc.type === filter;
    });

    const getDocumentIcon = (type: string) => {
        const icons = {
            certificate: AcademicCapIcon,
            'offer_letter': NewspaperIcon
        };
        return icons[type as keyof typeof icons] || DocumentTextIcon;
    };

    const getDocumentColor = (type: string) => {
        const colors = {
            certificate: 'text-purple-600 bg-purple-100',
            'offer_letter': 'text-blue-600 bg-blue-100',
            'study_material': 'text-green-600 bg-green-100',
            assignment: 'text-orange-600 bg-orange-100',
            other: 'text-gray-600 bg-gray-100'
        };
        return colors[type as keyof typeof colors] || colors.other;
    };

    const handleDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const documentsByType = {
        certificate: documents.filter(d => d.type === 'certificate'),
        'offer_letter': documents.filter(d => d.type === 'offer_letter')
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
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-100 transition"
                     onClick={() => setFilter(filter === 'certificate' ? 'all' : 'certificate')}>
                    <AcademicCapIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{documentsByType.certificate.length}</div>
                    <div className="text-xs text-gray-600">Certificates</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-100 transition"
                     onClick={() => setFilter(filter === 'offer_letter' ? 'all' : 'offer_letter')}>
                    <NewspaperIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{documentsByType['offer_letter'].length}</div>
                    <div className="text-xs text-gray-600">Offer Letters</div>
                </div>


                <div className="bg-gray-50 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition"
                     onClick={() => setFilter('all')}>
                    <DocumentArrowDownIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-600">{documents.length}</div>
                    <div className="text-xs text-gray-600">Total Docs</div>
                </div>
            </div>

            {/* Filter Info */}
            {filter !== 'all' && (
                <div className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
          <span className="text-sm text-gray-700">
            Showing: <strong className="capitalize">{filter.replace('_', ' ')}</strong>
          </span>
                    <button
                        onClick={() => setFilter('all')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Clear Filter
                    </button>
                </div>
            )}

            {/* Documents List */}
            {filteredDocuments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600">
                        {filter === 'all'
                            ? 'Documents will appear here once they are uploaded'
                            : `No ${filter.replace('-', ' ')} available yet`}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredDocuments.map((doc) => {
                        const Icon = getDocumentIcon(doc.type);
                        const colorClass = getDocumentColor(doc.type);
                        const isAvailable = true;

                        return (
                            <div
                                key={doc.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icon */}
                                    <div className={`p-3 rounded-lg ${colorClass}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                                {doc.title}
                                            </h4>
                                            {isAvailable ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                          <CheckCircleIcon className="w-3 h-3" />
                          Available
                        </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold">
                          <ClockIcon className="w-3 h-3" />
                          Pending
                        </span>
                                            )}
                                        </div>
                                        {/*<p className="text-sm text-gray-600 mb-2">{doc.description}</p>*/}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            {/*<span className="capitalize">{doc.type.replace('-', ' ')}</span>*/}
                                            {/*{doc.fileSize && <span>{doc.fileSize}</span>}*/}
                                            <span>
                        {doc.createdAt?.toDate().toLocaleDateString()}
                      </span>
                                        </div>
                                    </div>

                                    {/* Download Button */}
                                    {isAvailable && (
                                        <button
                                            onClick={() => handleDownload(doc.downloadUrl, doc.title)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium shrink-0"
                                        >
                                            <ArrowDownTrayIcon className="w-5 h-5" />
                                            <span className="hidden sm:inline">Download</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Important Certificates Section */}
            {documentsByType.certificate.length > 0 && filter === 'all' && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AcademicCapIcon className="w-6 h-6 text-purple-600" />
                        Your Certificates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documentsByType.certificate.map((cert) => (
                            <div key={cert.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">{cert.title}</h4>
                                        {/*<p className="text-sm text-gray-600 mb-2">{cert.description}</p>*/}
                                        <div className="text-xs text-gray-500">
                                            Issued: {cert.createdAt?.toDate().toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(cert.downloadUrl, cert.title)}
                                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                                    >
                                        <ArrowDownTrayIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3">📄 Document Information</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span><strong>Certificates:</strong> Completion certificates and achievement awards</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span><strong>Offer Letters:</strong> Internship or program enrollment letters</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span><strong>Study Materials:</strong> Course notes, presentations, and resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span><strong>Assignments:</strong> Project guidelines and submission templates</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DocumentsTab;
