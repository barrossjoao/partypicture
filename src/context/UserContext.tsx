import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();

    const userId = session?.session?.user?.id;

    if (userId) {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role, company_id")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setUser(data);
      } else {
        console.error("Erro ao buscar dados do usuário:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);