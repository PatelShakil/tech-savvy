import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs,  } from 'firebase/firestore';
import { db } from '../../firebase';
import { PlusIcon, BanknotesIcon, CheckCircleIcon, ClockIcon  } from '@heroicons/react/24/outline';
import AddPaymentModal from "./AddPaymentModal.tsx";

interface Payment {
    id: string;
    programId: string;
    studentId: string;
    studentName: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    status: 'completed' | 'pending';
    notes: string;
    createdAt: any;
}

interface Student {
    id: string;
    name: string;
    email: string;
}

interface Enrollment {
    id: string;
    studentId: string;
    feeStatus: string;
    feeAmount: number;
}

interface PaymentsTabProps {
    programId: string;
    feePerStudent: number;
    onUpdate: () => void;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ programId, onUpdate }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

    useEffect(() => {
        fetchPayments();
        fetchStudentsAndEnrollments();
    }, [programId]);

    const fetchPayments = async () => {
        try {
            const paymentsQuery = query(
                collection(db, 'payments'),
                where('programId', '==', programId)
            );
            const paymentsSnap = await getDocs(paymentsQuery);
            const paymentsData = paymentsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Payment[];

            // Sort by date (newest first)
            paymentsData.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB.getTime() - dateA.getTime();
            });

            setPayments(paymentsData);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const fetchStudentsAndEnrollments = async () => {
        try {
            const enrollmentsQuery = query(
                collection(db, 'programEnrollments'),
                where('programId', '==', programId)
            );
            const enrollmentsSnap = await getDocs(enrollmentsQuery);
            const enrollmentsData = enrollmentsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Enrollment[];

            setEnrollments(enrollmentsData);

            const studentsData = [];
            for (const enrollment of enrollmentsData) {
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
        } finally {
            setLoading(false);
        }
    };

    const getTotalPaid = (studentId: string) => {
        return payments
            .filter(p => p.studentId === studentId && p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
    };

    const getEnrollment = (studentId: string) => {
        return enrollments.find(e => e.studentId === studentId);
    };

    const calculateStats = () => {
        const totalExpected = enrollments.reduce((sum, e) => sum + e.feeAmount, 0);
        const totalCollected = payments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
        const totalPending = totalExpected - totalCollected;

        return { totalExpected, totalCollected, totalPending };
    };

    const stats = calculateStats();

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading payment data...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <BanknotesIcon className="w-8 h-8" />
                        <p className="text-sm opacity-90">Total Expected</p>
                    </div>
                    <p className="text-3xl font-bold">₹{stats.totalExpected.toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircleIcon className="w-8 h-8" />
                        <p className="text-sm opacity-90">Total Collected</p>
                    </div>
                    <p className="text-3xl font-bold">₹{stats.totalCollected.toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <ClockIcon className="w-8 h-8" />
                        <p className="text-sm opacity-90">Total Pending</p>
                    </div>
                    <p className="text-3xl font-bold">₹{stats.totalPending.toLocaleString()}</p>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Payment Transactions</h3>
                    <p className="text-sm text-gray-600 mt-1">Track and manage student fee payments</p>
                </div>
                <button
                    onClick={() => setShowAddPaymentModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="w-5 h-5" />
                    Record Payment
                </button>
            </div>

            {/* Students Payment Status */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Fee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {students.map((student) => {
                        const enrollment = getEnrollment(student.id);
                        const totalPaid = getTotalPaid(student.id);
                        const pending = (enrollment?.feeAmount || 0) - totalPaid;
                        const isPaid = pending <= 0;

                        return (
                            <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-800">{student.name}</p>
                                        <p className="text-sm text-gray-500">{student.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    ₹{enrollment?.feeAmount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-green-600 font-medium">
                                    ₹{totalPaid.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-orange-600 font-medium">
                                    ₹{pending.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                    }`}>
                      {isPaid ? 'Fully Paid' : 'Pending'}
                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Recent Transactions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                {payments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <BanknotesIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">No payment transactions yet</p>
                        <button
                            onClick={() => setShowAddPaymentModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Record First Payment
                        </button>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {payment.createdAt?.toDate ?
                                            new Date(payment.createdAt.toDate()).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) :
                                            'Recently'}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{payment.studentName}</td>
                                    <td className="px-6 py-4 font-bold text-green-600">₹{payment.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{payment.paymentMethod}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{payment.transactionId}</td>
                                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{payment.notes || '-'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Payment Modal */}
            {showAddPaymentModal && (
                <AddPaymentModal
                    programId={programId}
                    students={students}
                    enrollments={enrollments}
                    onClose={() => setShowAddPaymentModal(false)}
                    onSuccess={() => {
                        fetchPayments();
                        fetchStudentsAndEnrollments();
                        onUpdate();
                        setShowAddPaymentModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default PaymentsTab;
