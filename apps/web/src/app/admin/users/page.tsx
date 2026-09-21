'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await fetchApi('/admin/users');
      setUsers(res || []);
    } catch (err: any) {
      toast.error('Failed to load users (Admin permissions required)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await fetchApi(`/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole })
      });
      toast.success('User role updated');
      loadUsers();
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="space-y-6 pb-12 p-6 max-w-[1600px] mx-auto">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">User & RBAC Administration</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Manage team member access privileges, roles (Engineer, Incident Manager, Admin), and operational status.
        </p>
      </div>

      <div className="rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[10px] font-mono uppercase bg-neutral-50 dark:bg-neutral-900/50">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-neutral-900 dark:text-neutral-100 flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded bg-neutral-800 text-neutral-200 font-mono text-xs flex items-center justify-center font-semibold">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400 font-mono">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-terracotta-500/10 text-terracotta-500 border border-terracotta-500/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u._id, e.target.value)}
                      className="bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs rounded px-2 py-1 border border-neutral-200 dark:border-neutral-800 focus:outline-none"
                    >
                      <option value="ENGINEER">ENGINEER</option>
                      <option value="INCIDENT_MANAGER">INCIDENT_MANAGER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

