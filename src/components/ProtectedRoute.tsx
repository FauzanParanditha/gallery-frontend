"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import FullScreenLoader from "./FullScreenLoader";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoadingAuth, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      router.replace("/auth");
    }
  }, [isLoadingAuth, user, router]);

  if (isLoadingAuth) {
    return <FullScreenLoader />;
  }

  // Jangan render UI sebelum authorized
  if (!user) return null;

  return <>{children}</>;
}
