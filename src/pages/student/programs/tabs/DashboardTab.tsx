import React from 'react';
import {
    CalendarIcon,
    UserGroupIcon,
    CheckCircleIcon,
    TrophyIcon,
    FlagIcon
} from '@heroicons/react/24/outline';

interface DashboardTabProps {
    program: any;
    student: any;
    group: any;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ program, student, group }) => {
    const stats = [
        {
            name: 'Program Status',
            value: program.status,
            icon: CheckCircleIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            name: 'Total Sessions',
            value: program.totalSessions || 0,
            icon: CalendarIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            name: 'Milestones',
            value: program.milestones?.length || 0,
            icon: FlagIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            name: 'Group Members',
            value: group?.members?.length || 0,
            icon: UserGroupIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome, {student?.name || 'Student'}! 👋
                </h2>
                <p className="text-gray-600">
                    Here's an overview of your progress in {program.name}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.name}</div>
                    </div>
                ))}
            </div>

            {/* Program Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Program Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-600">Category</span>
                            <span className="font-semibold text-gray-900 capitalize">{program.category}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-600">Start Date</span>
                            <span className="font-semibold text-gray-900">{program.startDate}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-600">End Date</span>
                            <span className="font-semibold text-gray-900">{program.endDate}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-semibold text-gray-900">
                {program.duration || 'N/A'}
              </span>
                        </div>
                    </div>
                </div>

                {/* Group Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Group</h3>
                    {group ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-gray-600">Group Name</span>
                                <span className="font-semibold text-gray-900">{group.groupName}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-gray-600">Members</span>
                                <span className="font-semibold text-gray-900">{group.members?.length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Project</span>
                                <span className="font-semibold text-gray-900">{group.projectTitle || 'Not assigned'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">No group assigned yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-left">
                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                        <div>
                            <div className="font-semibold text-gray-900">View Sessions</div>
                            <div className="text-sm text-gray-600">Check schedule</div>
                        </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-left">
                        <FlagIcon className="w-6 h-6 text-purple-600" />
                        <div>
                            <div className="font-semibold text-gray-900">Track Milestones</div>
                            <div className="text-sm text-gray-600">View progress</div>
                        </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-left">
                        <TrophyIcon className="w-6 h-6 text-green-600" />
                        <div>
                            <div className="font-semibold text-gray-900">Certificates</div>
                            <div className="text-sm text-gray-600">Download docs</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardTab;
