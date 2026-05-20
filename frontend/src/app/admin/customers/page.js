"use client";

import { useEffect, useState } from "react";
import { Search, FileDown, Mail, MapPin, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Page = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getCustomers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Assuming the API returns a 'users' array
      setCustomers(data.users || []);
    } catch (error) {
      toast.error(error.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            Customer Directory
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage relationships and view lifetime value of your clients.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-2 text-xs font-bold uppercase tracking-widest h-10 px-5"
        >
          <FileDown className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Overview (Optional but recommended for Boutique feel) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-8 border border-gray-100 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Total Clients
          </p>
          <p className="text-2xl font-bold text-primary mt-1">
            {customers.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-8 border border-gray-100 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Active This Month
          </p>
          <p className="text-2xl font-bold text-primary mt-1">
            {customers.filter((c) => c.ordersCount > 0).length}
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-8 border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/30 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/10">
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Client
                </th>
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Location
                </th>
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Orders
                </th>
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-secondary/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/5">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {user.address?.city || "Remote"},{" "}
                      {user.address?.country || "Global"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {user.ordersCount || 0}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-primary">
                      ${(user.totalSpent || 0).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && !loading && (
            <div className="p-20 text-center text-muted-foreground italic">
              No clients found in the directory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
