import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

const USER_STORAGE_KEY = "doctor-user";
const TOKEN_STORAGE_KEY = "doctor-token";

const initialUser = {
  id: 1,
  name: "Dr. Maya Chen",
  email: "maya@hokuhealth.com",
  role: "doctor",
  specialty: "Cardiology",
  avatar:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const getStoredToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);

    try {
      // Temporary delay for demo authentication
      await new Promise((resolve) => {
        setTimeout(resolve, 600);
      });

      // Replace this section with the backend login API later.
      const authenticatedUser = {
        ...initialUser,
        email: credentials?.email || initialUser.email,
      };

      const demoToken = "demo-jwt-token";

      setUser(authenticatedUser);
      setToken(demoToken);

      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(authenticatedUser)
      );

      localStorage.setItem(
        TOKEN_STORAGE_KEY,
        demoToken
      );

      toast.success("Signed in successfully");

      return {
        user: authenticatedUser,
        token: demoToken,
      };
    } catch (error) {
      toast.error("Unable to sign in");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    toast.success("You have been logged out");
  };

  const updateUser = (updatedData) => {
    setUser((currentUser) => {
      if (!currentUser) return null;

      const updatedUser = {
        ...currentUser,
        ...updatedData,
      };

      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      updateUser,
      isAuthenticated: Boolean(user && token),
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};