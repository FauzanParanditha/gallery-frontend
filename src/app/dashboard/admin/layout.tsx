import { Layout } from "@/components/dashboard/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Layout>{children}</Layout>
      </ProtectedRoute>
    </AuthProvider>
  );
}
