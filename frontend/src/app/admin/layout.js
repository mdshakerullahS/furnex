import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import AdminProvider from "@/providers/adminProvider";

const AdminLayout = ({ children }) => {
  return (
    <AdminProvider>
      <AdminHeader />
      <div className="w-full h-[58px]" />
      <div className="w-full h-[calc(100vh-58px)] flex">
        <AdminSidebar />
        <div className="w-full h-[calc(100vh-58px)] overflow-y-auto px-4 hide-scrollbar">
          {children}
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
