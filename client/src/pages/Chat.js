import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch conversation messages
  const { data: messages, isLoading, error } = useQuery(
    ['chatMessages', userId],
    () => api.get(`/messages/${userId}`).then(res => res.data),
    {
      enabled: !!userId,
      refetchInterval: 5000, // Poll for new messages every 5 seconds
    }
  );

  // Fetch other user info
  const { data: otherUser } = useQuery(
    ['user', userId],
    () => api.get(`/users/${userId}`).then(res => res.data),
    {
      enabled: !!userId,
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    (msg) => api.post('/messages', { recipient: userId, content: msg }),
    {
      onSuccess: () => {
        setMessage('');
        queryClient.invalidateQueries(['chatMessages', userId]);
      },
    }
  );

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Listen for real-time messages via socket
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg) => {
      if (msg.sender === userId || msg.recipient === userId) {
        queryClient.invalidateQueries(['chatMessages', userId]);
      }
    };
    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, userId, queryClient]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600">Error loading chat</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col h-[70vh]">
      {/* Chat Header */}
      <div className="bg-white rounded-t-lg shadow-md p-4 flex items-center mb-0">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
          <span className="text-lg font-bold text-gray-600">{otherUser?.name?.charAt(0)}</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{otherUser?.name || 'User'}</h2>
          <p className="text-sm text-gray-500">{otherUser?.email}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-gray-50 px-4 py-4 overflow-y-auto border-x border-b border-gray-200">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                  msg.sender._id === user._id
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-900 rounded-bl-none border'
                }`}
              >
                <div>{msg.content}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">No messages yet. Say hello!</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="bg-white rounded-b-lg shadow-md p-4 flex items-center border-x border-b border-gray-200">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          disabled={sendMessageMutation.isLoading}
        />
        <button
          type="submit"
          disabled={sendMessageMutation.isLoading || !message.trim()}
          className="ml-3 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat; 