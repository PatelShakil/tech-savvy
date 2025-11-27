import React, { useState } from 'react';
import { addDoc, collection, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddPaymentModalProps {
    programId: string;
    students: any[];
    enrollments: any[];
    onClose: () => void;
    onSuccess: () => void;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
                                                             programId,
                                                             students,
                                                             enrollments,
                                                             onClose,
                                                             onSuccess
                                                         }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        paymentMethod: 'cash',
        transactionId: '',
        status: 'completed' as 'completed' | 'pending',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const student = students.find(s => s.id === formData.studentId);
            if (!student) {
                alert('Student not found');
                return;
            }

            // Add payment record
            await addDoc(collection(db, 'payments'), {
                programId: programId,
                studentId: formData.studentId,
                studentName: student.name,
                amount: parseFloat(formData.amount),
                paymentMethod: formData.paymentMethod,
                transactionId: formData.transactionId || `TXN-${Date.now()}`,
                status: formData.status,
                notes: formData.notes,
                createdAt: serverTimestamp()
            });

            // Update enrollment fee status if fully paid
            const enrollment = enrollments.find(e => e.studentId === formData.studentId);
            if (enrollment && formData.status === 'completed') {
                const totalPaid = parseFloat(formData.amount);
                if (totalPaid >= enrollment.feeAmount) {
                    await updateDoc(doc(db, 'programEnrollments', enrollment.id), {
                        feeStatus: 'paid'
                    });
                }
            }

            alert('Payment recorded successfully!');
            onSuccess();
        } catch (error) {
            console.error('Error recording payment:', error);
            alert('Failed to record payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Record Payment</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Student Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Student *</label>
                        <select
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                        >
                            <option value="">Choose a student</option>
                            {students.map(student => {
                                const enrollment = enrollments.find(e => e.studentId === student.id);
                                return (
                                    <option key={student.id} value={student.id}>
                                        {student.name} - {enrollment?.feeStatus === 'paid' ? '✓ Paid' : 'Pending ₹' + enrollment?.feeAmount}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="10000"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="cash">Cash</option>
                                <option value="upi">UPI</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cheque">Cheque</option>
                                <option value="card">Card</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Transaction ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
                            <input
                                type="text"
                                name="transactionId"
                                value={formData.transactionId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Auto-generated if empty"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Any additional notes..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Recording...' : 'Record Payment'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPaymentModal;
