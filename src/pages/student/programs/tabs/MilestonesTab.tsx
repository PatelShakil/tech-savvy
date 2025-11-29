import React from 'react';
import {
    FlagIcon,
    CheckCircleIcon,
    ClockIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';

interface Milestone {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    order: number;
    status?: 'pending' | 'completed' | 'overdue';
}

interface MilestonesTabProps {
    program: any;
}

const MilestonesTab: React.FC<MilestonesTabProps> = ({ program }) => {
    const milestones: Milestone[] = program.milestones || [];

    // Calculate milestone stats
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const progressPercentage = totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;

    const getStatusBadge = (milestone: Milestone) => {
        // Check if milestone is completed
        if (milestone.status === 'completed') {
            return {
                text: 'Completed',
                class: 'bg-green-100 text-green-800',
                icon: CheckCircleIcon
            };
        }

        // Check if overdue
        const dueDate = new Date(milestone.dueDate);
        const today = new Date();
        if (dueDate < today) {
            return {
                text: 'Overdue',
                class: 'bg-red-100 text-red-800',
                icon: ClockIcon
            };
        }

        // Pending
        return {
            text: 'Pending',
            class: 'bg-yellow-100 text-yellow-800',
            icon: ClockIcon
        };
    };

    return (
        <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
                        <p className="text-gray-600 mt-1">
                            {completedMilestones} of {totalMilestones} milestones completed
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-blue-600">{progressPercentage}%</div>
                        <div className="text-sm text-gray-600">Complete</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FlagIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{totalMilestones}</div>
                            <div className="text-sm text-gray-600">Total Milestones</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{completedMilestones}</div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <ClockIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {totalMilestones - completedMilestones}
                            </div>
                            <div className="text-sm text-gray-600">Remaining</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Milestones Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Milestones</h3>

                {milestones.length === 0 ? (
                    <div className="text-center py-12">
                        <FlagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No milestones defined</h3>
                        <p className="text-gray-600">Milestones will be added by your instructor</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {milestones.map((milestone, index) => {
                            const badge = getStatusBadge(milestone);
                            const StatusIcon = badge.icon;
                            const isLast = index === milestones.length - 1;

                            return (
                                <div key={milestone.id} className="relative">
                                    {/* Timeline Line */}
                                    {!isLast && (
                                        <div className="absolute left-6 top-14 w-0.5 h-full bg-gray-200" />
                                    )}

                                    {/* Milestone Card */}
                                    <div className="flex gap-4">
                                        {/* Timeline Dot */}
                                        <div className="relative flex-shrink-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                milestone.status === 'completed'
                                                    ? 'bg-green-100'
                                                    : 'bg-gray-100'
                                            }`}>
                        <span className="text-lg font-bold text-gray-700">
                          {milestone.order}
                        </span>
                                            </div>
                                            {milestone.status === 'completed' && (
                                                <div className="absolute -top-1 -right-1 bg-green-600 rounded-full p-1">
                                                    <CheckCircleIcon className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {milestone.title}
                                                    </h4>
                                                    <p className="text-gray-600 text-sm mb-2">
                                                        {milestone.description}
                                                    </p>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.class} ml-4`}>
                          <StatusIcon className="w-4 h-4" />
                                                    {badge.text}
                        </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>Due: {milestone.dueDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Tips Section */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3">💡 Tips for Success</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Complete milestones before the due date to stay on track</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Coordinate with your group members for collaborative tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Reach out to support if you're facing any challenges</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MilestonesTab;
