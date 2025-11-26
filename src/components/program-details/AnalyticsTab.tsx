import React, {useState, useEffect} from 'react';
import {collection, query, where, getDocs} from 'firebase/firestore';
import {db} from '../../firebase';
import {
    BanknotesIcon,
    UsersIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

interface AnalyticsTabProps {
    programId: string;
    program: any;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({programId, program}) => {
    const [analytics, setAnalytics] = useState({
        totalStudents: 0,
        totalGroups: 0,
        totalEnrollments: 0,
        totalSessions: 0,
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        feesCollected: 0,
        feesPending: 0,
        totalExpectedRevenue: 0,
        collectionRate: 0,
        studentsWithPaidFees: 0,
        studentsWithPendingFees: 0,
        averageGroupSize: 0,
        openSupportTickets: 0,
        resolvedSupportTickets: 0,
        totalMessages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [groupStats, setGroupStats] = useState<any[]>([]);
    // const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        fetchAnalytics();
    }, [programId]);

    const fetchAnalytics = async () => {
        try {
            // Fetch enrollments
            const enrollmentsQuery = query(
                collection(db, 'programEnrollments'),
                where('programId', '==', programId)
            );
            const enrollmentsSnap = await getDocs(enrollmentsQuery);

            let feesCollected = 0;
            let feesPending = 0;
            let studentsWithPaidFees = 0;
            let studentsWithPendingFees = 0;

            enrollmentsSnap.forEach(doc => {
                const data = doc.data();
                if (data.feeStatus === 'paid') {
                    feesCollected += data.feeAmount;
                    studentsWithPaidFees++;
                } else {
                    feesPending += data.feeAmount;
                    studentsWithPendingFees++;
                }
            });

            const totalExpectedRevenue = feesCollected + feesPending;
            const collectionRate = totalExpectedRevenue > 0
                ? ((feesCollected / totalExpectedRevenue) * 100)
                : 0;

            // Fetch groups
            const groupsQuery = query(
                collection(db, 'groups'),
                where('programId', '==', programId)
            );
            const groupsSnap = await getDocs(groupsQuery);

            const groupsData: any[] = [];
            let totalMembers = 0;

            for (const groupDoc of groupsSnap.docs) {
                const groupData = groupDoc.data();
                const groupEnrollments = enrollmentsSnap.docs.filter(
                    e => e.data().groupId === groupDoc.id
                );

                const groupFeesCollected = groupEnrollments
                    .filter(e => e.data().feeStatus === 'paid')
                    .reduce((sum, e) => sum + e.data().feeAmount, 0);

                const groupFeesPending = groupEnrollments
                    .filter(e => e.data().feeStatus === 'pending')
                    .reduce((sum, e) => sum + e.data().feeAmount, 0);

                groupsData.push({
                    id: groupDoc.id,
                    name: groupData.groupName,
                    members: groupData.members.length,
                    feesCollected: groupFeesCollected,
                    feesPending: groupFeesPending,
                    projectTitle: groupData.projectTitle,
                });

                totalMembers += groupData.members.length;
            }

            const averageGroupSize = groupsSnap.size > 0 ? totalMembers / groupsSnap.size : 0;

            // Fetch sessions
            const sessionsQuery = query(
                collection(db, 'sessions'),
                where('programId', '==', programId)
            );
            const sessionsSnap = await getDocs(sessionsQuery);

            // Fetch applications
            const applicationsQuery = query(
                collection(db, 'applications'),
                where('programId', '==', programId)
            );
            const applicationsSnap = await getDocs(applicationsQuery);

            let pendingApplications = 0;
            let approvedApplications = 0;
            let rejectedApplications = 0;

            applicationsSnap.forEach(doc => {
                const status = doc.data().status;
                if (status === 'pending') pendingApplications++;
                else if (status === 'approved') approvedApplications++;
                else if (status === 'rejected') rejectedApplications++;
            });

            // Fetch support tickets
            const ticketsQuery = query(
                collection(db, 'supportTickets'),
                where('programId', '==', programId)
            );
            const ticketsSnap = await getDocs(ticketsQuery);

            let openSupportTickets = 0;
            let resolvedSupportTickets = 0;

            ticketsSnap.forEach(doc => {
                if (doc.data().status === 'open') openSupportTickets++;
                else resolvedSupportTickets++;
            });

            // Fetch group chat messages
            const messagesQuery = query(
                collection(db, 'groupChat'),
                where('programId', '==', programId)
            );
            const messagesSnap = await getDocs(messagesQuery);

            setAnalytics({
                totalStudents: enrollmentsSnap.size,
                totalGroups: groupsSnap.size,
                totalEnrollments: enrollmentsSnap.size,
                totalSessions: sessionsSnap.size,
                totalApplications: applicationsSnap.size,
                pendingApplications,
                approvedApplications,
                rejectedApplications,
                feesCollected,
                feesPending,
                totalExpectedRevenue,
                collectionRate,
                studentsWithPaidFees,
                studentsWithPendingFees,
                averageGroupSize,
                openSupportTickets,
                resolvedSupportTickets,
                totalMessages: messagesSnap.size,
            });

            setGroupStats(groupsData.sort((a, b) => b.feesCollected - a.feesCollected));

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading analytics...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Overview Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Students"
                        value={analytics.totalStudents}
                        icon={UsersIcon}
                        color="blue"
                    />
                    <StatCard
                        title="Total Groups"
                        value={analytics.totalGroups}
                        icon={UserGroupIcon}
                        color="purple"
                    />
                    <StatCard
                        title="Sessions Conducted"
                        value={analytics.totalSessions}
                        icon={CalendarIcon}
                        color="green"
                    />
                    <StatCard
                        title="Total Applications"
                        value={analytics.totalApplications}
                        icon={ClipboardDocumentCheckIcon}
                        color="orange"
                    />
                </div>
            </div>

            {/* Financial Analytics */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <BanknotesIcon className="w-8 h-8"/>
                            <p className="text-sm opacity-90">Fees Collected</p>
                        </div>
                        <p className="text-3xl font-bold">₹{analytics.feesCollected.toLocaleString()}</p>
                        <p className="text-sm opacity-90 mt-1">{analytics.studentsWithPaidFees} students paid</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <BanknotesIcon className="w-8 h-8"/>
                            <p className="text-sm opacity-90">Fees Pending</p>
                        </div>
                        <p className="text-3xl font-bold">₹{analytics.feesPending.toLocaleString()}</p>
                        <p className="text-sm opacity-90 mt-1">{analytics.studentsWithPendingFees} students pending</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <ChartBarIcon className="w-8 h-8"/>
                            <p className="text-sm opacity-90">Collection Rate</p>
                        </div>
                        <p className="text-3xl font-bold">{analytics.collectionRate.toFixed(1)}%</p>
                        <p className="text-sm opacity-90 mt-1">of ₹{analytics.totalExpectedRevenue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Collection Progress Bar */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Fee Collection Progress</span>
                        <span className="text-sm font-bold text-gray-800">
              ₹{analytics.feesCollected.toLocaleString()} / ₹{analytics.totalExpectedRevenue.toLocaleString()}
            </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                            style={{width: `${analytics.collectionRate}%`}}
                        >
                            {analytics.collectionRate > 10 && (
                                <span
                                    className="text-xs font-bold text-white">{analytics.collectionRate.toFixed(0)}%</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Analytics */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">Pending Applications</p>
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <ClipboardDocumentCheckIcon className="w-6 h-6 text-yellow-600"/>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{analytics.pendingApplications}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">Approved Applications</p>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <ClipboardDocumentCheckIcon className="w-6 h-6 text-green-600"/>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{analytics.approvedApplications}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">Rejected Applications</p>
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <ClipboardDocumentCheckIcon className="w-6 h-6 text-red-600"/>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{analytics.rejectedApplications}</p>
                    </div>
                </div>
            </div>

            {/* Group Performance */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Group Performance</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fees
                                Collected
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fees
                                Pending
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {groupStats.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No groups created yet
                                </td>
                            </tr>
                        ) : (
                            groupStats.map((group) => (
                                <tr key={group.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{group.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{group.members}</td>
                                    <td className="px-6 py-4 text-gray-600">{group.projectTitle || 'Not assigned'}</td>
                                    <td className="px-6 py-4 text-green-600 font-medium">₹{group.feesCollected.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-orange-600 font-medium">₹{group.feesPending.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Communication Stats */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Communication Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <p className="text-sm text-gray-600 mb-2">Open Support Tickets</p>
                        <p className="text-3xl font-bold text-orange-600">{analytics.openSupportTickets}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <p className="text-sm text-gray-600 mb-2">Resolved Tickets</p>
                        <p className="text-3xl font-bold text-green-600">{analytics.resolvedSupportTickets}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <p className="text-sm text-gray-600 mb-2">Group Chat Messages</p>
                        <p className="text-3xl font-bold text-blue-600">{analytics.totalMessages}</p>
                    </div>
                </div>
            </div>

            {/* Additional Metrics */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Metrics</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700">Average Group Size</span>
                        <span
                            className="font-bold text-gray-800">{analytics.averageGroupSize.toFixed(1)} students</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700">Fee Per Student</span>
                        <span className="font-bold text-gray-800">₹{program.feePerStudent?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700">Capacity Utilization</span>
                        <span className="font-bold text-gray-800">
              {program.maxStudents > 0
                  ? ((analytics.totalStudents / program.maxStudents) * 100).toFixed(1)
                  : 0}%
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Component
const StatCard: React.FC<{ title: string; value: number; icon: any; color: string }> = ({
                                                                                            title,
                                                                                            value,
                                                                                            icon: Icon,
                                                                                            color
                                                                                        }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
        green: 'bg-green-100 text-green-600',
        orange: 'bg-orange-100 text-orange-600',
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{title}</p>
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6"/>
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    );
};

export default AnalyticsTab;
