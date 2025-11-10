"use client";

import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  // Mock user data - would come from auth context in production
  const username = "demo_user";
  const avatarUrl = "";

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    // Mock logout - in production would clear auth state
    alert("Logout clicked - would sign out user");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full">
          <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="ml-4 text-lg font-semibold">
                Photo Album Manager
              </h1>
            </div>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{username}</p>
                    <p className="text-xs text-muted-foreground">
                      demo@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/admin/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/admin/profile")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
