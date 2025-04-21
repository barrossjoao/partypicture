import React, { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSessionAndSports = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Erro ao obter sessão:", sessionError);
        }

        if (!session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

      } catch (err) {
        console.error("Erro inesperado:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSessionAndSports();
  }, []);

  if (isLoading) {
    return <div>Verificando sessão...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }



  return children;
};

export default PrivateRoute;
