import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  // Fetch user data if token exists
  const { data: userData, isLoading } = useQuery(
    ['user', state.token],
    () => authAPI.getCurrentUser(),
    {
      enabled: !!state.token,
      retry: false,
      onSuccess: (data) => {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: data, token: state.token },
        });
      },
      onError: () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
      },
    }
  );

  useEffect(() => {
    if (!state.token) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.token]);

  const loginWithOTP = async (email, otp) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.verifyOTP(email, otp);
      
      localStorage.setItem('token', response.token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response,
      });
      
      return response;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const sendOTP = async (data) => {
    try {
      const response = await authAPI.sendOTP(data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await authAPI.resendOTP(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    queryClient.clear();
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value = {
    ...state,
    loginWithOTP,
    sendOTP,
    resendOTP,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 