import React, { useState } from 'react';
import { ChatBubbleLeftRightIcon, LifebuoyIcon } from '@heroicons/react/24/outline';
import SupportPanel from './SupportPanel';
import ProgramGroupChat from './ProgramGroupChat';

interface CommunicationsTabProps {
    programId: string;
}

const CommunicationsTab: React.FC<CommunicationsTabProps> = ({ programId }) => {
    const [activeView, setActiveView] = useState<'support' | 'groupchat'>('support');

    return (
        <div className="space-y-6">
            {/* Sub-tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveView('support')}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
                        activeView === 'support'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                >
                    <LifebuoyIcon className="w-5 h-5" />
                    Support Panel
                </button>
                <button
                    onClick={() => setActiveView('groupchat')}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
                        activeView === 'groupchat'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                >
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    Program Group Chat
                </button>
            </div>

            {/* Content */}
            <div>
                {activeView === 'support' && <SupportPanel programId={programId} />}
                {activeView === 'groupchat' && <ProgramGroupChat programId={programId} />}
            </div>
        </div>
    );
};

export default CommunicationsTab;
