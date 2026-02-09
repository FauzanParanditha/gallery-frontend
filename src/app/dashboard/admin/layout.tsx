import { Layout } from "@/components/dashboard/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { SWRConfig } from "swr";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, keepPreviousData: true }}>
      <AuthProvider>
        <ProtectedRoute>
          <Layout>{children}</Layout>
        </ProtectedRoute>
      </AuthProvider>
    </SWRConfig>
  );
}
