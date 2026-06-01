"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus, Trash2, ShieldCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/stores/userStore";

export default function TeamPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuth((state) => state.user);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager"); // default to manager
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admins`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
      }
    } catch (err) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admins`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, email, password, role }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Admin created successfully");
        setName("");
        setEmail("");
        setPassword("");
        setRole("manager");
        fetchAdmins();
      } else {
        toast.error(data.message || "Failed to create admin");
      }
    } catch (err) {
      toast.error("Error creating admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admins/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (res.ok) {
        toast.success("Admin deleted");
        fetchAdmins();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting admin");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Double check client side role
  const userRole = user?.role;
  if (userRole !== "super_admin") {
    return (
      <div className="p-8 text-center text-muted-foreground">
        You do not have permission to view this page.
      </div>
    );
  }

  const formatRoleName = (r) => {
    if (r === "super_admin") return "Super Admin";
    if (r === "manager") return "Store Manager";
    if (r === "staff") return "Staff";
    return r;
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-serif font-bold text-primary">
          Team Management
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage admin accounts and their access roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="bg-white p-6 rounded-8 border border-gray-100 shadow-sm h-fit">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add New Member
          </h3>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Name
              </label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="h-12"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Email
              </label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@furnex.com"
                className="h-12"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Password
              </label>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-12 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="manager">Store Manager</option>
                <option value="staff">Staff</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 font-bold uppercase tracking-widest mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-8 border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Active Admins ({admins.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-xs uppercase text-muted-foreground font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-foreground">
                          {admin.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {admin.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          admin.role === "super_admin"
                            ? "bg-purple-100 text-purple-700"
                            : admin.role === "manager"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formatRoleName(admin.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user?.id !== admin._id && user?._id !== admin._id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
