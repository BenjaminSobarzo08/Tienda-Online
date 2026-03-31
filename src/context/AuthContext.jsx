import { createContext, useState, useContext, useEffect } from "react";
import {
  RegisterRequest,
  LoginRequest,
  verifyToken,
  UpdateProfileRequest,
  LogoutRequest,
} from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado con un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const SignUp = async (userData) => {
    try {
      const res = await RegisterRequest(userData);
      setUser(res);
      setIsAuthenticated(true);
      setErrors([]);
    } catch (error) {
      setErrors([error.message]);
    }
  };

  const SignIn = async (userData) => {
    try {
      const res = await LoginRequest(userData);
      setIsAuthenticated(true);
      setUser(res);
      setErrors([]);
    } catch (error) {
      setErrors([error.message]);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const res = await UpdateProfileRequest(userData);
      setUser(res.user);
      setErrors([]);
      return res;
    } catch (error) {
      setErrors([error.message]);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await LogoutRequest();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setErrors([]);
    }
  };

  useEffect(() => {
    if (errors && errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyToken();
        if (!res) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setUser(res);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        SignUp,
        SignIn,
        updateProfile,
        logout,
        loading,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
