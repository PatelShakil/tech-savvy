import React, { useState, useEffect } from 'react';
import {collection, query, where, getDocs, updateDoc, addDoc, doc, serverTimestamp, setDoc} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline';
import ApplicationDetailsModal from "./ApplicationDetailsModal.tsx";

interface Application {
    id: string;
    programId: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    reason: string;
    portfolio?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: any;
    reviewedAt?: any;
    reviewedBy?: string;
}

interface ApplicationsTabProps {
    programId: string;
    feePerStudent: number;
    onUpdate: () => void;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ programId, feePerStudent, onUpdate }) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, [programId]);

    const fetchApplications = async () => {
        try {
            const applicationsQuery = query(
                collection(db, 'applications'),
                where('programId', '==', programId)
            );
            const applicationsSnap = await getDocs(applicationsQuery);
            const applicationsData = applicationsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Application[];

            // Sort by submission date (newest first)
            applicationsData.sort((a, b) => {
                const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(0);
                const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(0);
                return dateB.getTime() - dateA.getTime();
            });

            setApplications(applicationsData);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (application: Application) => {
        if (processing) return;

        const groupName = prompt('Enter group name for this student (or leave empty to add later):');
        if (groupName === null) return; // User cancelled

        setProcessing(true);
        try {
            // Generate a temporary password
            const tempPassword = `${application.name.split(' ')[0].toLowerCase()}${Math.floor(Math.random() * 10000)}`;

            // Create Firebase Auth account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                application.email,
                tempPassword
            );
            const userId = userCredential.user.uid;

            // Add to students collection
            // const studentRef = await addDoc(collection(db, 'students'), {
            //     uid: userId,
            //     name: application.name,
            //     email: application.email,
            //     phone: application.phone,
            //     college: application.college,
            //     year: application.year,
            //     status: 'active',
            //     createdAt: serverTimestamp(),
            // });
            await setDoc(doc(db, "students", userId), {
                name: application.name,
                email: application.email,
                phone: application.phone,
                college: application.college,
                year: application.year,
                status: "active",
                uid: userId,
                createdAt: serverTimestamp(),
            }, { merge: true });

            let groupId = '';

            // Create group if name provided
            if (groupName && groupName.trim()) {
                const groupRef = await addDoc(collection(db, 'groups'), {
                    programId: programId,
                    groupName: groupName.trim(),
                    members: [userId],
                    projectTitle: '',
                    totalFee: feePerStudent,
                    createdAt: serverTimestamp(),
                });
                groupId = groupRef.id;
            }

            // Add enrollment
            await addDoc(collection(db, 'programEnrollments'), {
                programId: programId,
                studentId: userId,
                groupId: groupId,
                feeStatus: 'pending',
                feeAmount: feePerStudent,
                joinedAt: serverTimestamp(),
            });

            // Update application status
            await updateDoc(doc(db, 'applications', application.id), {
                status: 'approved',
                reviewedAt: serverTimestamp(),
                reviewedBy: auth.currentUser?.email || 'Admin',
            });

            alert(`Application approved!\n\nLogin Credentials:\nEmail: ${application.email}\nPassword: ${tempPassword}\n\nPlease share these credentials with the student.`);

            fetchApplications();
            onUpdate();
            setSelectedApplication(null);
        } catch (error: any) {
            console.error('Error approving application:', error);
            alert('Failed to approve application: ' + error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (application: Application) => {
        const reason = prompt('Enter reason for rejection (optional):');
        if (reason === null) return; // User cancelled

        setProcessing(true);
        try {
            await updateDoc(doc(db, 'applications', application.id), {
                status: 'rejected',
                reviewedAt: serverTimestamp(),
                reviewedBy: auth.currentUser?.email || 'Admin',
                rejectionReason: reason || 'Not specified',
            });

            alert('Application rejected successfully');
            fetchApplications();
            setSelectedApplication(null);
        } catch (error) {
            console.error('Error rejecting application:', error);
            alert('Failed to reject application');
        } finally {
            setProcessing(false);
        }
    };

    const getFilteredApplications = () => {
        switch (filter) {
            case 'pending':
                return applications.filter(a => a.status === 'pending');
            case 'approved':
                return applications.filter(a => a.status === 'approved');
            case 'rejected':
                return applications.filter(a => a.status === 'rejected');
            default:
                return applications;
        }
    };

    const filteredApplications = getFilteredApplications();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
            case 'rejected':
                return <XCircleIcon className="w-5 h-5 text-red-600" />;
            default:
                return <ClockIcon className="w-5 h-5 text-yellow-600" />;
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading applications...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Program Applications</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Total: {applications.length} • Pending: {applications.filter(a => a.status === 'pending').length}
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                                filter === f
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {filteredApplications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600">No applications found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredApplications.map((application) => (
                        <div
                            key={application.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        {getStatusIcon(application.status)}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800">{application.name}</h4>
                                            <p className="text-sm text-gray-600">{application.email} • {application.phone}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">College/Institution</p>
                                            <p className="text-sm text-gray-800">{application.college}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Year of Study</p>
                                            <p className="text-sm text-gray-800">{application.year}</p>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 font-medium mb-1">Why do you want to join?</p>
                                        <p className="text-sm text-gray-700">{application.reason}</p>
                                    </div>

                                    {application.portfolio && (
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-500 font-medium mb-1">Portfolio</p>
                                            <a
                                                href={application.portfolio}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {application.portfolio}
                                            </a>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Submitted: {application.submittedAt?.toDate ?
                        new Date(application.submittedAt.toDate()).toLocaleString('en-IN') :
                        'Recently'}
                    </span>
                                        {application.reviewedAt && (
                                            <span>
                        Reviewed: {application.reviewedAt?.toDate ?
                                                new Date(application.reviewedAt.toDate()).toLocaleString('en-IN') :
                                                'Recently'}
                      </span>
                                        )}
                                        {application.reviewedBy && (
                                            <span>By: {application.reviewedBy}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 ml-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>

                                    {application.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(application)}
                                                disabled={processing}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <CheckCircleIcon className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(application)}
                                                disabled={processing}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <XCircleIcon className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setSelectedApplication(application)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Application Details Modal */}
            {selectedApplication && (
                <ApplicationDetailsModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    processing={processing}
                />
            )}
        </div>
    );
};

export default ApplicationsTab;
