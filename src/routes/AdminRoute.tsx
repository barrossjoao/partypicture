import React, { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || data?.role !== "admin") {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }

      setIsLoading(false);
    };

    checkAdmin();
  }, []);

  if (isLoading) return <div>Verificando permissões...</div>;

  if (!isAdmin) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;