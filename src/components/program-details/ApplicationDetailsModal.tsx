import React from 'react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

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

interface ApplicationDetailsModalProps {
    application: Application;
    onClose: () => void;
    onApprove: (application: Application) => void;
    onReject: (application: Application) => void;
    processing: boolean;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
                                                                             application,
                                                                             onClose,
                                                                             onApprove,
                                                                             onReject,
                                                                             processing,
                                                                         }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Application Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                application.status === 'approved' ? 'bg-green-100 text-green-800' :
                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
            }`}>
              {application.status.toUpperCase()}
            </span>
                    </div>

                    {/* Personal Information */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Personal Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                                <p className="text-gray-800">{application.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Email</p>
                                <p className="text-gray-800">{application.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Phone</p>
                                <p className="text-gray-800">{application.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Year of Study</p>
                                <p className="text-gray-800">{application.year}</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Academic Information</h4>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">College/Institution</p>
                            <p className="text-gray-800">{application.college}</p>
                        </div>
                    </div>

                    {/* Motivation */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Why do you want to join?</h4>
                        <p className="text-gray-700 whitespace-pre-line">{application.reason}</p>
                    </div>

                    {/* Portfolio */}
                    {application.portfolio && (
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Portfolio/GitHub</h4>
                            <a
                                href={application.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all"
                            >
                                {application.portfolio}
                            </a>
                        </div>
                    )}

                    {/* Submission Details */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Submission Details</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Submitted At:</span>
                                <span className="text-gray-800 font-medium">
                  {application.submittedAt?.toDate ?
                      new Date(application.submittedAt.toDate()).toLocaleString('en-IN') :
                      'Recently'}
                </span>
                            </div>
                            {application.reviewedAt && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Reviewed At:</span>
                                        <span className="text-gray-800 font-medium">
                      {application.reviewedAt?.toDate ?
                          new Date(application.reviewedAt.toDate()).toLocaleString('en-IN') :
                          'Recently'}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Reviewed By:</span>
                                        <span className="text-gray-800 font-medium">{application.reviewedBy}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {application.status === 'pending' && (
                        <div className="flex gap-3 pt-4 border-t">
                            <button
                                onClick={() => onApprove(application)}
                                disabled={processing}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircleIcon className="w-5 h-5" />
                                Approve & Create Account
                            </button>
                            <button
                                onClick={() => onReject(application)}
                                disabled={processing}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <XCircleIcon className="w-5 h-5" />
                                Reject Application
                            </button>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsModal;
