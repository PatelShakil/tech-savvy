import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, addDoc, updateDoc, deleteDoc, doc, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuthState } from '../../pages/admin/states/UseAuthState';
import { PaperAirplaneIcon, TrashIcon, EyeSlashIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface GroupChatMessage {
    id: string;
    programId: string;
    senderId: string;
    senderName: string;
    senderType: 'admin' | 'student';
    message: string;
    timestamp: any;
    isHidden: boolean;
    isPinned: boolean;
}

interface ProgramGroupChatProps {
    programId: string;
}

const ProgramGroupChat: React.FC<ProgramGroupChatProps> = ({ programId }) => {
    const [messages, setMessages] = useState<GroupChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthState();

    useEffect(() => {
        // Real-time listener for messages
        const messagesQuery = query(
            collection(db, 'groupChat'),
            where('programId', '==', programId),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as GroupChatMessage[];

            setMessages(messagesData);
            setLoading(false);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [programId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            await addDoc(collection(db, 'groupChat'), {
                programId: programId,
                senderId: user?.uid || 'admin',
                senderName: user?.email || 'Admin',
                senderType: 'admin',
                message: newMessage.trim(),
                timestamp: serverTimestamp(),
                isHidden: false,
                isPinned: false,
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await deleteDoc(doc(db, 'groupChat', messageId));
            } catch (error) {
                console.error('Error deleting message:', error);
                alert('Failed to delete message');
            }
        }
    };

    const handleHideMessage = async (messageId: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, 'groupChat', messageId), {
                isHidden: !currentStatus,
            });
        } catch (error) {
            console.error('Error hiding message:', error);
            alert('Failed to hide message');
        }
    };

    const handlePinMessage = async (messageId: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, 'groupChat', messageId), {
                isPinned: !currentStatus,
            });
        } catch (error) {
            console.error('Error pinning message:', error);
            alert('Failed to pin message');
        }
    };

    const pinnedMessages = messages.filter(m => m.isPinned && !m.isHidden);
    const regularMessages = messages.filter(m => !m.isPinned);

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading chat...</div>;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
                <h3 className="font-semibold text-white">Program Group Chat</h3>
                <p className="text-sm text-blue-100">All students can see this conversation</p>
            </div>

            {/* Pinned Messages */}
            {pinnedMessages.length > 0 && (
                <div className="bg-yellow-50 border-b border-yellow-200 p-3">
                    <p className="text-xs font-medium text-yellow-800 mb-2 flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        Pinned Messages
                    </p>
                    <div className="space-y-2">
                        {pinnedMessages.map((msg) => (
                            <div key={msg.id} className="bg-white relative border border-yellow-300 rounded p-2 text-sm">
                                <p className="font-medium text-gray-800">{msg.senderName}</p>
                                <p className="text-gray-700">{msg.message}</p>
                                <div className="flex right-0 z-20 absolute bottom-0  gap-1  group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => handlePinMessage(msg.id, msg.isPinned)}
                                        className={`p-1 rounded hover:bg-gray-200 ${
                                            msg.isPinned ? 'text-yellow-600' : 'text-gray-600'
                                        }`}
                                        title={msg.isPinned ? 'Unpin' : 'Pin'}
                                    >
                                        <MapPinIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleHideMessage(msg.id, msg.isHidden)}
                                        className="p-1 rounded hover:bg-gray-200 text-gray-600"
                                        title={msg.isHidden ? 'Unhide' : 'Hide'}
                                    >
                                        <EyeSlashIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        className="p-1 rounded hover:bg-red-200 text-red-600"
                                        title="Delete"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {regularMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    regularMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`group flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 relative ${
                                    msg.isHidden
                                        ? 'bg-gray-200 text-gray-500 border-2 border-dashed border-gray-400'
                                        : msg.senderType === 'admin'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-800 border border-gray-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-medium">
                                        {msg.senderName} {msg.senderType === 'admin' && '(Admin)'}
                                    </p>

                                    {/* Admin Actions */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                        <button
                                            onClick={() => handlePinMessage(msg.id, msg.isPinned)}
                                            className={`p-1 rounded hover:bg-gray-200 ${
                                                msg.isPinned ? 'text-yellow-600' : 'text-gray-600'
                                            }`}
                                            title={msg.isPinned ? 'Unpin' : 'Pin'}
                                        >
                                            <MapPinIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleHideMessage(msg.id, msg.isHidden)}
                                            className="p-1 rounded hover:bg-gray-200 text-gray-600"
                                            title={msg.isHidden ? 'Unhide' : 'Hide'}
                                        >
                                            <EyeSlashIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            className="p-1 rounded hover:bg-red-200 text-red-600"
                                            title="Delete"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm">{msg.message}</p>
                                {msg.isHidden && (
                                    <p className="text-xs italic mt-1">Hidden from students</p>
                                )}
                                <p className={`text-xs mt-1 ${
                                    msg.senderType === 'admin' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                    {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'Just now'}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                        placeholder="Type a message to all students..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        disabled={sending}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                        Send
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    💡 You can pin important announcements, hide inappropriate messages, or delete messages
                </p>
            </div>
        </div>
    );
};

export default ProgramGroupChat;
