import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";

export function withProtectedRoute<P>(
  WrappedComponent: React.ComponentType<React.PropsWithChildren<P>>,
): React.ComponentType<React.PropsWithChildren<P>> {
  const ComponentWithAuth = (props: React.PropsWithChildren<P>) => {
    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const navigate = useNavigate();

    useEffect(() => {
      if (!accessToken) {
        navigate("/auth/signin", { replace: true });
      }
    }, [accessToken]);

    if (!accessToken) {
      return <Navigate to="/auth/signin" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  const wrappedName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  ComponentWithAuth.displayName = `withProtectedRoute(${wrappedName})`;

  Object.defineProperty(ComponentWithAuth, "name", {
    value: `withProtectedRoute(${wrappedName})`,
    writable: false,
  });

  return ComponentWithAuth;
}
