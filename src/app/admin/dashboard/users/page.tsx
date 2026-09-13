"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useGetAllUsersQuery } from "@/store/api/adminApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Search, ArrowRight, Shield, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { BlockUserModal } from "@/components/admin/modals/BlockUserModal";
import type { User } from "@/types/user";

export default function UsersPage() {
  const t = useTranslations();
  
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"" | "user" | "admin">("");
  const [status, setStatus] = useState<"" | "active" | "blocked">("");
  const [page, setPage] = useState(1);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useGetAllUsersQuery({
    search: search || undefined,
    role: role || undefined,
    isActive: status === "active" ? true : status === "blocked" ? false : undefined,
    page,
    limit: 20,
  });

  const users = data?.data?.users || [];
  const total = data?.data?.total || 0;
  const pageCount = data?.data?.pageCount || 1;

  const handleBlockUser = (user: User) => {
    setSelectedUser(user);
    setIsBlockModalOpen(true);
  };

  const getRoleBadge = (userRole: string) => {
    if (userRole === "admin") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Shield className="w-3 h-3" />
          {t("admin.users.admin")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <UserIcon className="w-3 h-3" />
        {t("admin.users.user")}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {t("admin.users.active")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        {t("admin.users.blocked")}
      </span>
    );
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("admin.users.title")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {t("admin.users.description")}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">
              <ArrowRight className="w-4 h-4 ml-2" />
              {t("admin.backToDashboard")}
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <Label htmlFor="search">{t("admin.users.search")}</Label>
              <div className="relative mt-1.5">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("admin.users.searchPlaceholder")}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <Label htmlFor="role">{t("admin.users.role")}</Label>
              <Select value={role} onValueChange={(value) => setRole(value as typeof role)}>
                <SelectTrigger id="role" className="mt-1.5">
                  <SelectValue placeholder={t("admin.users.allRoles")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin.users.allRoles")}</SelectItem>
                  <SelectItem value="user">{t("admin.users.user")}</SelectItem>
                  <SelectItem value="admin">{t("admin.users.admin")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="status">{t("admin.status")}</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
                <SelectTrigger id="status" className="mt-1.5">
                  <SelectValue placeholder={t("admin.users.allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin.users.allStatuses")}</SelectItem>
                  <SelectItem value="active">{t("admin.users.active")}</SelectItem>
                  <SelectItem value="blocked">{t("admin.users.blocked")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setRole("");
                  setStatus("");
                  setPage(1);
                }}
                className="w-full"
              >
                {t("admin.users.resetFilters")}
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Table/List */}
        <Card>
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">{t("common.loading")}</div>
          ) : error ? (
            <ErrorState
              title={t("admin.users.errorTitle")}
              message={t("admin.users.errorMessage")}
              onRetry={() => refetch()}
              retryLabel={t("common.tryAgain")}
            />
          ) : users.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t("admin.users.noUsers")}
              description={t("admin.users.noUsersDesc")}
            />
          ) : (
            <>
              {/* Header Info */}
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {t("admin.users.totalUsers", { count: total })}
                </p>
                <p className="text-xs text-gray-500">
                  {t("admin.users.pageInfo", { current: page, total: pageCount })}
                </p>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.users.name")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.users.email")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.users.phone")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.users.role")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.status")}
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        {t("admin.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {t("admin.users.joinedAt", {
                                date: new Date(user.createdAt).toLocaleDateString("ar-EG"),
                              })}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{user.email}</td>
                        <td className="py-4 px-6 text-gray-700">{user.phone}</td>
                        <td className="py-4 px-6">{getRoleBadge(user.role)}</td>
                        <td className="py-4 px-6">{getStatusBadge(user.isActive)}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/dashboard/users/${user._id}`}>
                                {t("admin.view")}
                              </Link>
                            </Button>
                            {user.role !== "admin" && (
                              <Button
                                variant={user.isActive ? "destructive" : "default"}
                                size="sm"
                                onClick={() => handleBlockUser(user)}
                              >
                                {user.isActive
                                  ? t("admin.users.block")
                                  : t("admin.users.unblock")}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y">
                {users.map((user) => (
                  <div key={user._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">{user.email}</p>
                        <p className="text-sm text-gray-600">{user.phone}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.isActive)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/admin/dashboard/users/${user._id}`}>
                          {t("admin.view")}
                        </Link>
                      </Button>
                      {user.role !== "admin" && (
                        <Button
                          variant={user.isActive ? "destructive" : "default"}
                          size="sm"
                          className="flex-1"
                          onClick={() => handleBlockUser(user)}
                        >
                          {user.isActive ? t("admin.users.block") : t("admin.users.unblock")}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="p-4 border-t flex items-center justify-between">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    {t("admin.previous")}
                  </Button>
                  <span className="text-sm text-gray-600">
                    {t("admin.users.pageInfo", { current: page, total: pageCount })}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  >
                    {t("admin.next")}
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Block/Unblock User Modal */}
      <BlockUserModal
        user={selectedUser}
        isOpen={isBlockModalOpen}
        onClose={() => {
          setIsBlockModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </>
  );
}
