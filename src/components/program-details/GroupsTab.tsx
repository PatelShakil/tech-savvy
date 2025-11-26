import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {db} from "../../firebase.ts";
// import { getDoc } from 'firebase/firestore';
import GroupModal from "./GroupModal.tsx"; // Add this at the top

interface Group {
    id: string;
    groupName: string;
    members: string[];
    projectTitle: string;
    mentorId?: string;
    totalFee: number;
    createdAt: Date;
}

interface Student {
    id: string;
    name: string;
    email: string;
}

interface Enrollment {
    id: string;
    studentId: string;
    groupId: string;
    feeStatus: string;
    feeAmount: number;
}

interface GroupsTabProps {
    programId: string;
    feePerStudent: number;
    onUpdate: () => void;
}

const GroupsTab: React.FC<GroupsTabProps> = ({ programId, feePerStudent, onUpdate }) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [students, setStudents] = useState<{ [key: string]: Student }>({});
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);

    useEffect(() => {
        fetchGroups();
    }, [programId]);

    const fetchGroups = async () => {
        try {
            // Fetch groups
            const groupsQuery = query(
                collection(db, 'groups'),
                where('programId', '==', programId)
            );
            const groupsSnap = await getDocs(groupsQuery);
            const groupsData = groupsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Group[];

            setGroups(groupsData);

            // Fetch enrollments
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

            // Fetch all students
            const allStudentIds = new Set<string>();
            groupsData.forEach(group => group.members.forEach(id => allStudentIds.add(id)));

            if (allStudentIds.size > 0) {
                const studentsMap: { [key: string]: Student } = {};
                for (const studentId of allStudentIds) {
                    const studentDoc = await getDocs(query(collection(db, 'students'), where('__name__', '==', studentId)));
                    if (!studentDoc.empty) {
                        const studentData = studentDoc.docs[0].data();
                        studentsMap[studentId] = {
                            id: studentId,
                            name: studentData.name,
                            email: studentData.email,
                        };
                    }
                }
                setStudents(studentsMap);
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = async (groupId: string, groupName: string) => {
        if (window.confirm(`Are you sure you want to delete "${groupName}"? This will also remove student enrollments.`)) {
            try {
                // Delete enrollments first
                const enrollmentsToDelete = enrollments.filter(e => e.groupId === groupId);
                for (const enrollment of enrollmentsToDelete) {
                    await deleteDoc(doc(db, 'programEnrollments', enrollment.id));
                }

                // Delete group
                await deleteDoc(doc(db, 'groups', groupId));

                fetchGroups();
                onUpdate();
                alert('Group deleted successfully');
            } catch (error) {
                console.error('Error deleting group:', error);
                alert('Failed to delete group');
            }
        }
    };

    const getGroupFeeStatus = (groupId: string) => {
        const groupEnrollments = enrollments.filter(e => e.groupId === groupId);
        const paidCount = groupEnrollments.filter(e => e.feeStatus === 'paid').length;
        const totalCount = groupEnrollments.length;
        const totalCollected = groupEnrollments
            .filter(e => e.feeStatus === 'paid')
            .reduce((sum, e) => sum + e.feeAmount, 0);
        const totalPending = groupEnrollments
            .filter(e => e.feeStatus === 'pending')
            .reduce((sum, e) => sum + e.feeAmount, 0);

        return { paidCount, totalCount, totalCollected, totalPending };
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading groups...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Project Groups</h3>
                    <p className="text-sm text-gray-600 mt-1">Total: {groups.length} group{groups.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Group
                </button>
            </div>

            {groups.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600 mb-4">No groups created yet</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create First Group
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => {
                        const feeStatus = getGroupFeeStatus(group.id);
                        return (
                            <div key={group.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                                    <h4 className="text-white font-semibold text-lg">{group.groupName}</h4>
                                    {group.projectTitle && (
                                        <p className="text-blue-100 text-sm mt-1">{group.projectTitle}</p>
                                    )}
                                </div>

                                <div className="p-4 space-y-4">
                                    {/* Members */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Members ({group.members.length})</p>
                                        <div className="space-y-1">
                                            {group.members.length === 0 ? (
                                                <p className="text-sm text-gray-400 italic">No members yet</p>
                                            ) : (
                                                group.members.map((memberId) => {
                                                    const student = students[memberId];
                                                    const enrollment = enrollments.find(e => e.studentId === memberId && e.groupId === group.id);
                                                    return (
                                                        <div key={memberId} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">
                                {student?.name || 'Loading...'}
                              </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                enrollment?.feeStatus === 'paid'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-orange-100 text-orange-700'
                                                            }`}>
                                {enrollment?.feeStatus === 'paid' ? '✓' : '₹'}
                              </span>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* Fee Summary */}
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Fees Collected:</span>
                                            <span className="font-medium text-green-600">₹{feeStatus.totalCollected.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Fees Pending:</span>
                                            <span className="font-medium text-orange-600">₹{feeStatus.totalPending.toLocaleString()}</span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>Payment Status</span>
                                                <span>{feeStatus.paidCount}/{feeStatus.totalCount} paid</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${feeStatus.totalCount > 0 ? (feeStatus.paidCount / feeStatus.totalCount) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-3 border-t">
                                        <button
                                            onClick={() => setEditingGroup(group)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteGroup(group.id, group.groupName)}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Group Modal */}
            {(showAddModal || editingGroup) && (
                <GroupModal
                    programId={programId}
                    feePerStudent={feePerStudent}
                    group={editingGroup}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingGroup(null);
                    }}
                    onSuccess={() => {
                        fetchGroups();
                        onUpdate();
                        setShowAddModal(false);
                        setEditingGroup(null);
                    }}
                />
            )}
        </div>
    );
};

export default GroupsTab;
