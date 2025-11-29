import React, { useEffect, useState, useRef } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import {
    PaperAirplaneIcon,
    UserGroupIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { GroupChatMessage } from "../../../../types/program.ts";

interface GroupChatTabProps {
    programId: string;
    student: any;
    group: any;
}

const GroupChatTab: React.FC<GroupChatTabProps> = ({ programId, student, group }) => {
    const [messages, setMessages] = useState<GroupChatMessage[]>([]);
    const [pinnedMessages, setPinnedMessages] = useState<GroupChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!group?.id) {
            setLoading(false);
            return;
        }

        // Real-time listener for messages
        const messagesQuery = query(
            collection(db, 'groupChat'),
            where('programId', '==', programId),
            where('isHidden', '==', false), // Only show non-hidden messages
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as GroupChatMessage[];

            // Separate pinned and regular messages
            const pinned = messagesData.filter(msg => msg.isPinned);
            const regular = messagesData.filter(msg => !msg.isPinned);

            setPinnedMessages(pinned);
            setMessages(regular);
            setLoading(false);

            // Scroll to bottom
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return () => unsubscribe();
    }, [group?.id, programId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !group?.id || !student?.id) return;

        try {
            await addDoc(collection(db, 'groupChat'), {
                groupId: group.id,
                programId: programId,
                message: newMessage.trim(),
                senderId: student.id,
                isHidden: false,
                isPinned: false,
                senderName: student.name + " (Web)",
                timestamp: serverTimestamp()
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString();
    };

    if (!group) {
        return (
            <div className="text-center py-12">
                <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Group Assigned</h3>
                <p className="text-gray-600">You will be assigned to a group soon</p>
            </div>
        );
    }

    const MessageBubble = ({ message, isOwnMessage }: { message: GroupChatMessage, isOwnMessage: boolean }) => (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                {!isOwnMessage && (
                    <div className="text-xs font-semibold text-gray-700 mb-1 px-1">
                        {message.senderName}
                    </div>
                )}
                <div
                    className={`rounded-2xl px-4 py-2 ${
                        isOwnMessage
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                >
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 px-1 ${
                    isOwnMessage ? 'text-right' : 'text-left'
                }`}>
                    {formatTimestamp(message.timestamp)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Group Info Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{group.groupName}</h2>
                        <p className="text-gray-600">
                            {group.members?.length || 0} members • Project: {group.projectTitle || 'Not assigned'}
                        </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <UserGroupIcon className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Messages Area */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            {/* Pinned Messages Section */}
                            {pinnedMessages.length > 0 && (
                                <div className="mb-4 pb-4 border-b-2 border-yellow-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <StarIconSolid className="w-5 h-5 text-yellow-500" />
                                        <span className="text-sm font-semibold text-gray-700">
                                            Pinned Messages
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {pinnedMessages.map((message) => (
                                            <div
                                                key={message.id}
                                                className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <StarIconSolid className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <div className="text-xs font-semibold text-gray-700 mb-1">
                                                            {message.senderName}
                                                        </div>
                                                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                                            {message.message}
                                                        </p>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {formatTimestamp(message.timestamp)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Regular Messages */}
                            {messages.length === 0 && pinnedMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                                    <p className="text-gray-600">Start the conversation with your group!</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                        isOwnMessage={message.senderId === student?.id}
                                    />
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Message Input */}
                <form
                    onSubmit={handleSendMessage}
                    className="border-t border-gray-200 p-4 bg-white"
                >
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <span>Send</span>
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Group Members */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Members</h3>
                <div className="space-y-2">
                    {group.members?.map((memberId: string, index: number) => (
                        <div
                            key={memberId}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {index + 1}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Member {index + 1}</div>
                                <div className="text-sm text-gray-600">ID: {memberId.substring(0, 8)}...</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroupChatTab;
