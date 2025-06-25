"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/components/layout/MainLayout";
import { CheckCircle, XCircle } from "lucide-react"; // Make sure this is at the top of your file


export default function TravelersListPage() {
  const [loading, setLoading] = useState(true);
  const [travelers, setTravelers] = useState<any[]>([]);
  const [roles, setRoles] = useState<{ text: string; value: string }[]>([]);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roleId: "",
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const fetchRoles = async () => {
    try {
      const res = await api.get("/security/roles"); // adjust endpoint if needed
      const items = res.data?.data || [];
      setRoles(items.map((r: any) => ({ text: r.text, value: r.value })));
    } catch (err) {
      console.error("Failed to load roles:", err);
    }
  };

  const fetchTravelers = async (page = 0, filtersOverride = filters, pageSizeOverride = pagination.pageSize) => {
    setLoading(true);
    try {
      const res = await api.post("/travelers/search", {
        ...filtersOverride,
        roleId: filtersOverride.roleId ? parseInt(filtersOverride.roleId) : undefined,
        pageIndex: page,
        pageSize: pageSizeOverride,
      });

      const data = res.data?.data;
      setTravelers(data?.travelers || []);
      setPagination({
        pageIndex: data.pageIndex,
        pageSize: data.pageSize,
        totalItems: data.totalItems,
        hasPreviousPage: data.hasPreviousPage,
        hasNextPage: data.hasNextPage,
      });
    } catch (err) {
      console.error("Failed to load travelers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTravelers(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTravelers(0);
      fetchRoles();
    }, 300);

    return () => clearTimeout(timer);
  }, []);



  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        <h1 className="text-2xl font-semibold">Travelers</h1>

        {/* Search Box (separate card) */}
        <div className="bg-white rounded-xl border px-6 py-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <Input
              placeholder="First Name"
              value={filters.firstName}
              onChange={(e) => setFilters({ ...filters, firstName: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              value={filters.lastName}
              onChange={(e) => setFilters({ ...filters, lastName: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            />
            <Input
              placeholder="Phone Number"
              value={filters.phoneNumber}
              onChange={(e) => setFilters({ ...filters, phoneNumber: e.target.value })}
            />
            <Select
              value={filters.roleId || "all"}
              onValueChange={(value) =>
                setFilters({ ...filters, roleId: value === "all" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-end gap-2 col-span-full sm:col-span-2 md:col-span-1">
              <Button type="submit" className="bg-[#004aad] text-white px-6">Search</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  const reset = {
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    roleId: "",
                  };
                  setFilters(reset);
                  fetchTravelers(0, reset);
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl border px-6 py-4">
          {loading ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">Full Name</th>
                    <th className="px-4 py-2 font-medium">Email</th>
                    <th className="px-4 py-2 font-medium">Role</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-2"><Skeleton className="h-4 w-28" /></td>
                      <td className="px-4 py-2"><Skeleton className="h-4 w-48" /></td>
                      <td className="px-4 py-2"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-2"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-2 text-right"><Skeleton className="h-8 w-20 rounded-full" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          ) : travelers.length === 0 ? (
            <p className="text-muted-foreground text-sm">No travelers found.</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                Total records: {pagination.totalItems}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="p-2">Full Name</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Status</th>
                      <th className="p-2 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {travelers.map((t) => (
                      <tr key={t.id} className="border-t hover:bg-gray-50 transition">
                        <td className="px-4 py-2">{t.firstName} {t.lastName}</td>
                        <td className="px-4 py-2">{t.email}</td>
                        <td className="px-4 py-2">{t.roleName}</td>
                        <td className="px-4 py-2 flex items-center gap-2">
                          {t.status === "A" ? (
                            <>
                              <span className="text-green-600 font-medium">✔ Active</span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-600 font-medium">✖ Inactive</span>
                            </>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Link
                            href={`/travelers/${t.id}/edit`}
                            className="inline-flex items-center gap-2 px-4 py-1.5 text-sm bg-[#f1f5f9] rounded-full hover:bg-gray-200"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                <span className="text-sm text-muted-foreground">
                  Page {pagination.pageIndex + 1} of {Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize))} | Total records: {pagination.totalItems}
                </span>

                <div className="flex items-center gap-2">
                  <label className="text-sm">Page size:</label>
                  <Select
                    value={pagination.pageSize.toString()}
                    onValueChange={(value) => {
                      const size = parseInt(value);
                      setPagination((prev) => ({ ...prev, pageSize: size }));
                      fetchTravelers(0, filters, size);
                    }}
                  >
                    <SelectTrigger className="w-[80px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => fetchTravelers(pagination.pageIndex - 1)}
                    disabled={!pagination.hasPreviousPage || loading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fetchTravelers(pagination.pageIndex + 1)}
                    disabled={!pagination.hasNextPage || loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>


  );
}