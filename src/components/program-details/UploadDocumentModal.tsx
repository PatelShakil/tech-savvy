import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface UploadDocumentModalProps {
    programId: string;
    students: any[];
    onClose: () => void;
    onSuccess: () => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
                                                                     programId,
                                                                     students,
                                                                     onClose,
                                                                     onSuccess
                                                                 }) => {
    const [selectedStudent, setSelectedStudent] = useState('');
    const [documentType, setDocumentType] = useState<'offer_letter' | 'certificate'>('offer_letter');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [bulkUpload, setBulkUpload] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || (!bulkUpload && !selectedStudent) || !title) {
            alert('Please fill all required fields');
            return;
        }

        setUploading(true);

        try {
            const studentsToUpload = bulkUpload ? students : students.filter(s => s.id === selectedStudent);

            for (const student of studentsToUpload) {
                const documentId = `${programId}_${student.id}_${documentType}_${Date.now()}`;
                const storageRef = ref(storage, `documents/${programId}/${documentId}`);

                const uploadTask = uploadBytesResumable(storageRef, file);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(progress);
                        },
                        (error) => reject(error),
                        async () => {
                            try {
                                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

                                await addDoc(collection(db, 'documents'), {
                                    programId: programId,
                                    studentId: student.id,
                                    studentName: student.name,
                                    type: documentType,
                                    title: bulkUpload ? `${title} - ${student.name}` : title,
                                    downloadUrl: downloadUrl,
                                    createdAt: serverTimestamp()
                                });

                                resolve(true);
                            } catch (error) {
                                reject(error);
                            }
                        }
                    );
                });
            }

            alert('Document(s) uploaded successfully!');
            onSuccess();
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Upload Document</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Document Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="offer_letter">Offer Letter</option>
                            <option value="certificate">Certificate</option>
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Document Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="e.g., Full Stack Development Internship Certificate"
                        />
                    </div>

                    {/* Bulk Upload Toggle */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="bulkUpload"
                            checked={bulkUpload}
                            onChange={(e) => setBulkUpload(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="bulkUpload" className="text-sm text-gray-700">
                            Upload for all students in this program
                        </label>
                    </div>

                    {/* Student Selection (if not bulk) */}
                    {!bulkUpload && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Student *</label>
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="">Choose a student</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload File (PDF) *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="fileInput"
                            />
                            <label
                                htmlFor="fileInput"
                                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Choose PDF file
                            </label>
                            {file && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Selected: {file.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                        <div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-600 mt-2 text-center">
                                Uploading... {uploadProgress.toFixed(0)}%
                            </p>
                        </div>
                    )}

                    {/* Summary */}
                    {bulkUpload && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> This document will be uploaded for all {students.length} students in this program.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            onClick={handleUpload}
                            disabled={uploading || !file || (!bulkUpload && !selectedStudent) || !title}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Uploading...' : 'Upload Document'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadDocumentModal;
