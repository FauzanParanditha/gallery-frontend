"use client";

import Auth from "@/components/dashboard/Auth";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthClient() {
  const { user, isLoadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingAuth && user) router.replace("/dashboard/admin");
  }, [isLoadingAuth, user, router]);

  if (isLoadingAuth) return <FullScreenLoader />;
  if (!user) return <Auth />;
  return null;
}
