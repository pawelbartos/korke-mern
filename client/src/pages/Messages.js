import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ChatBubbleLeftIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Messages = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch user's conversations
  const { data: conversations, isLoading, error } = useQuery(
    'conversations',
    () => api.get('/messages/conversations').then(res => res.data),
    {
      enabled: !!user,
      refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    }
  );

  const filteredConversations = conversations?.filter(conversation => {
    const otherUser = conversation.participants.find(p => p._id !== user?._id);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           otherUser?.email.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  const getOtherUser = (conversation) => {
    return conversation.participants.find(p => p._id !== user?._id);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600">Error loading messages</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Your conversations with teachers and students</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search conversations..."
          />
          <ChatBubbleLeftIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <div className="text-center py-12">
          <ChatBubbleLeftIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
          <p className="text-gray-600 mb-4">Start a conversation by contacting a teacher or student</p>
          <Link
            to="/tutoring"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Tutoring Ads
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredConversations.map((conversation) => {
            const otherUser = getOtherUser(conversation);
            const lastMessage = conversation.lastMessage;
            
            return (
              <Link
                key={conversation._id}
                to={`/chat/${otherUser._id}`}
                className="block border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    
                    {/* Conversation Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {otherUser.name}
                        </h3>
                        {lastMessage && (
                          <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {formatLastMessageTime(lastMessage.createdAt)}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage ? (
                          <>
                            <span className="font-medium">
                              {lastMessage.sender._id === user?._id ? 'You: ' : `${otherUser.name}: `}
                            </span>
                            {lastMessage.content}
                          </>
                        ) : (
                          'No messages yet'
                        )}
                      </p>
                      
                      {/* User Role */}
                      <p className="text-xs text-gray-500 mt-1">
                        {otherUser.role === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Messages; 