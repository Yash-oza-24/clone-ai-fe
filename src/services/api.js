import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (message, conversationId) => {
  const response = await api.post('/chat/send', {
    message,
    conversationId
  });
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get('/conversations');
  return response.data;
};

export const getConversation = async (id) => {
  const response = await api.get(`/conversations/${id}`);
  return response.data;
};

export const deleteConversation = async (id) => {
  const response = await api.delete(`/conversations/${id}`);
  return response.data;
};

export const createConversation = async () => {
  const response = await api.post('/conversations');
  return response.data;
};