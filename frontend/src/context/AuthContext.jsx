import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiKeyApi } from '../api/apiKeyApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('commerce_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('commerce_token') || null;
  });

  const [activeApiKey, setActiveApiKeyState] = useState(() => {
    return localStorage.getItem('commerce_active_api_key') || null;
  });

  const [userApiKeys, setUserApiKeys] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(false);

  // Set active API Key
  const setActiveApiKey = (key) => {
    if (key) {
      localStorage.setItem('commerce_active_api_key', key);
      setActiveApiKeyState(key);
    } else {
      localStorage.removeItem('commerce_active_api_key');
      setActiveApiKeyState(null);
    }
  };

  // Login handler
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('commerce_user', JSON.stringify(userData));
    localStorage.setItem('commerce_token', userToken);
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    setActiveApiKey(null);
    setUserApiKeys([]);
    localStorage.removeItem('commerce_user');
    localStorage.removeItem('commerce_token');
    localStorage.removeItem('commerce_active_api_key');
  };

  // Fetch list of user's API keys when logged in
  const refreshApiKeys = async () => {
    if (!token) return [];
    try {
      setLoadingKeys(true);
      const res = await apiKeyApi.list();
      const keys = res.data?.data || [];
      setUserApiKeys(keys);

      // Auto select first active API key if current activeApiKey is not found or empty
      const activeKeys = keys.filter(k => k.is_active);
      if (activeKeys.length > 0) {
        const keyExists = activeKeys.some(k => k.api_key === activeApiKey);
        if (!activeApiKey || !keyExists) {
          setActiveApiKey(activeKeys[0].api_key);
        }
      } else {
        setActiveApiKey(null);
      }
      return keys;
    } catch (err) {
      console.error('Failed to fetch api keys:', err);
      return [];
    } finally {
      setLoadingKeys(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshApiKeys();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeApiKey,
        setActiveApiKey,
        userApiKeys,
        loadingKeys,
        refreshApiKeys,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
