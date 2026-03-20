import { createContext, useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

export const AuthContext = createContext(null);

const storageKey = "agendaproai.auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(storageKey));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await http.request("/auth/me", { token });
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem(storageKey);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const saveSession = (session) => {
    localStorage.setItem(storageKey, session.token);
    setToken(session.token);
    setUser(session.user);
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      authenticated: Boolean(token && user),
      saveSession,
      logout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

