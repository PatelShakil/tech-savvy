import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { XMarkIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import {db} from "../../firebase.ts";

interface GroupModalProps {
    programId: string;
    feePerStudent: number;
    group?: any;
    onClose: () => void;
    onSuccess: () => void;
}

interface AvailableStudent {
    id: string;
    name: string;
    email: string;
    groupId?: string;
}

const GroupModal: React.FC<GroupModalProps> = ({ programId, feePerStudent, group, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        groupName: group?.groupName || '',
        projectTitle: group?.projectTitle || '',
    });
    const [selectedMembers, setSelectedMembers] = useState<string[]>(group?.members || []);
    const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAvailableStudents();
    }, []);

    const fetchAvailableStudents = async () => {
        try {
            // Get all enrollments for this program
            const enrollmentsQuery = query(
                collection(db, 'programEnrollments'),
                where('programId', '==', programId)
            );
            const enrollmentsSnap = await getDocs(enrollmentsQuery);

            const studentData: AvailableStudent[] = [];

            for (const enrollDoc of enrollmentsSnap.docs) {
                const enrollment = enrollDoc.data();
                const studentDoc = await getDocs(query(
                    collection(db, 'students'),
                    where('__name__', '==', enrollment.studentId)
                ));

                if (!studentDoc.empty) {
                    const student = studentDoc.docs[0].data();
                    studentData.push({
                        id: enrollment.studentId,
                        name: student.name,
                        email: student.email,
                        groupId: enrollment.groupId,
                    });
                }
            }

            setAvailableStudents(studentData);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleMember = (studentId: string) => {
        if (selectedMembers.includes(studentId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== studentId));
        } else {
            setSelectedMembers([...selectedMembers, studentId]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedMembers.length === 0) {
            alert('Please select at least one member');
            return;
        }

        setLoading(true);

        try {
            if (group) {
                // Update existing group
                await updateDoc(doc(db, 'groups', group.id), {
                    groupName: formData.groupName,
                    projectTitle: formData.projectTitle,
                    members: selectedMembers,
                    totalFee: selectedMembers.length * feePerStudent,
                });

                // Update enrollments
                const enrollmentsQuery = query(
                    collection(db, 'programEnrollments'),
                    where('programId', '==', programId)
                );
                const enrollmentsSnap = await getDocs(enrollmentsQuery);

                for (const enrollDoc of enrollmentsSnap.docs) {
                    const enrollment = enrollDoc.data();
                    if (selectedMembers.includes(enrollment.studentId)) {
                        await updateDoc(doc(db, 'programEnrollments', enrollDoc.id), {
                            groupId: group.id,
                        });
                    } else if (enrollment.groupId === group.id) {
                        await updateDoc(doc(db, 'programEnrollments', enrollDoc.id), {
                            groupId: '',
                        });
                    }
                }

                alert('Group updated successfully!');
            } else {
                // Create new group
                const groupRef = await addDoc(collection(db, 'groups'), {
                    programId: programId,
                    groupName: formData.groupName,
                    projectTitle: formData.projectTitle,
                    members: selectedMembers,
                    totalFee: selectedMembers.length * feePerStudent,
                    createdAt: serverTimestamp(),
                });

                // Update enrollments with new group ID
                const enrollmentsQuery = query(
                    collection(db, 'programEnrollments'),
                    where('programId', '==', programId)
                );
                const enrollmentsSnap = await getDocs(enrollmentsQuery);

                for (const enrollDoc of enrollmentsSnap.docs) {
                    const enrollment = enrollDoc.data();
                    if (selectedMembers.includes(enrollment.studentId)) {
                        await updateDoc(doc(db, 'programEnrollments', enrollDoc.id), {
                            groupId: groupRef.id,
                        });
                    }
                }

                alert('Group created successfully!');
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving group:', error);
            alert('Failed to save group. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {group ? 'Edit Group' : 'Create New Group'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Group Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Group Name *</label>
                            <input
                                type="text"
                                name="groupName"
                                value={formData.groupName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., Team Alpha"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                            <input
                                type="text"
                                name="projectTitle"
                                value={formData.projectTitle}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., E-commerce Platform"
                            />
                        </div>
                    </div>

                    {/* Member Selection */}
                    <div className="border-t pt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Members * ({selectedMembers.length} selected)
                        </label>

                        <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                            {availableStudents.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No students available</p>
                            ) : (
                                availableStudents.map((student) => {
                                    const isSelected = selectedMembers.includes(student.id);
                                    const isInOtherGroup = student.groupId && student.groupId !== group?.id;

                                    return (
                                        <div
                                            key={student.id}
                                            onClick={() => !isInOtherGroup && toggleMember(student.id)}
                                            className={`flex items-center justify-between p-3 rounded-lg border-2 transition cursor-pointer ${
                                                isSelected
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : isInOtherGroup
                                                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                        >
                                            <div>
                                                <p className="font-medium text-gray-800">{student.name}</p>
                                                <p className="text-sm text-gray-600">{student.email}</p>
                                                {isInOtherGroup && (
                                                    <p className="text-xs text-orange-600 mt-1">Already in another group</p>
                                                )}
                                            </div>
                                            {isSelected && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-blue-600 font-medium text-sm">Selected</span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMember(student.id);
                                                        }}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <UserMinusIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Fee Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-blue-900">Total Group Fee:</span>
                            <span className="text-lg font-bold text-blue-900">
                ₹{(selectedMembers.length * feePerStudent).toLocaleString()}
              </span>
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                            {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} × ₹{feePerStudent.toLocaleString()} per student
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={loading || selectedMembers.length === 0}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : group ? 'Update Group' : 'Create Group'}
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

export default GroupModal;
