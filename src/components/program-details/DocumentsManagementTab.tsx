import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref,  deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import {  TrashIcon, DocumentArrowDownIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import UploadDocumentModal from "./UploadDocumentModal.tsx";

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

interface DocumentsManagementTabProps {
    programId: string;
}

const DocumentsManagementTab: React.FC<DocumentsManagementTabProps> = ({ programId }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        fetchDocuments();
        fetchEnrolledStudents();
    }, [programId]);

    const fetchDocuments = async () => {
        try {
            const docsQuery = query(
                collection(db, 'documents'),
                where('programId', '==', programId)
            );
            const docsSnap = await getDocs(docsQuery);
            const docsData = docsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Document[];

            setDocuments(docsData);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrolledStudents = async () => {
        try {
            const enrollmentsQuery = query(
                collection(db, 'programEnrollments'),
                where('programId', '==', programId)
            );
            const enrollmentsSnap = await getDocs(enrollmentsQuery);

            const studentsData = [];
            for (const enrollDoc of enrollmentsSnap.docs) {
                const enrollment = enrollDoc.data();
                const studentDoc = await getDocs(query(
                    collection(db, 'students'),
                    where('__name__', '==', enrollment.studentId)
                ));

                if (!studentDoc.empty) {
                    const student = studentDoc.docs[0].data();
                    studentsData.push({
                        id: enrollment.studentId,
                        name: student.name,
                        email: student.email
                    });
                }
            }

            setStudents(studentsData);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleDeleteDocument = async (document: Document) => {
        if (window.confirm(`Are you sure you want to delete "${document.title}"?`)) {
            try {
                // Delete from Storage
                const storageRef = ref(storage, `documents/${programId}/${document.id}`);
                await deleteObject(storageRef);

                // Delete from Firestore
                await deleteDoc(doc(db, 'documents', document.id));

                fetchDocuments();
                alert('Document deleted successfully');
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Failed to delete document');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading documents...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Documents Management</h3>
                    <p className="text-sm text-gray-600 mt-1">Upload and manage offer letters & certificates</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <CloudArrowUpIcon className="w-5 h-5" />
                    Upload Document
                </button>
            </div>

            {/* Documents Table */}
            {documents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <DocumentArrowDownIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">No documents uploaded yet</p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <CloudArrowUpIcon className="w-5 h-5" />
                        Upload First Document
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {documents.map((document) => (
                            <tr key={document.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-800">{document.studentName}</p>
                                </td>
                                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        document.type === 'offer_letter'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                    }`}>
                      {document.type === 'offer_letter' ? 'Offer Letter' : 'Certificate'}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{document.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {document.createdAt?.toDate ?
                                        new Date(document.createdAt.toDate()).toLocaleDateString() :
                                        'Recently'}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <a
                                        href={document.downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        <DocumentArrowDownIcon className="w-4 h-4" />
                                        View
                                    </a>
                                    <button
                                        onClick={() => handleDeleteDocument(document)}
                                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <UploadDocumentModal
                    programId={programId}
                    students={students}
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={() => {
                        fetchDocuments();
                        setShowUploadModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default DocumentsManagementTab;
