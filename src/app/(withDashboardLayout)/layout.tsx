import { AppSidebar } from '@/components/modules/dashboard/sidebar/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getCurrentUser } from '@/services/AuthService';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRole = await getCurrentUser(); // Get the current user's role
  console.log('userRole', userRole); // Log the user role for debugging

  const { role } = userRole || {}; // Destructure the role from the user object

  return (
    <SidebarProvider>
      {/* Pass the user role dynamically to AppSidebar */}
      <AppSidebar role={role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="p-4 pt-0 min-h-screen">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
