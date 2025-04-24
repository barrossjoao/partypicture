import React, { JSX, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../api/supabaseClient";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data?.session);
    };

    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return <div>Verificando sessão...</div>;
  }

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;