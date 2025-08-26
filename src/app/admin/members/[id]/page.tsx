"use client"

import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ReceiptItem {
  id: string;
  amount: number | string;
  status: string;
  createdAt: string;
  description?: string;
  imageUrl?: string;
  contribution?: { title?: string };
}

interface UserProfile {
  id: string;
  username?: string | null;
  displayName?: string | null;
  email: string;
  stateCode?: string | null;
  isActive: boolean;
  createdAt: string;
  receipts?: ReceiptItem[];
}

export default function AdminMemberProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
        setUser(data);
      } catch (e: any) {
        setError(e?.message || 'Error fetching user');
    } finally {
      setLoading(false);
    }
  };
    load();
  }, [id]);

  if (loading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </AdminProtectedRoute>
    );
  }

  if (error || !user) {
  return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white shadow rounded-lg p-6 max-w-md text-center">
            <p className="text-red-600 font-medium mb-2">Unable to load user</p>
            <p className="text-gray-600 mb-4">{error || 'User not found'}</p>
            <Link href="/admin/dashboard" className="text-blue-700 hover:text-blue-800">Back to Admin Dashboard</Link>
          </div>
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.displayName || user.username || 'Member'}</h1>
              <p className="text-gray-600">State Code: {user.stateCode || '—'}</p>
            </div>
            <Link href="/admin/dashboard" className="text-sm text-blue-700 hover:text-blue-800">Back to Dashboard</Link>
                </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="text-gray-900 font-medium">{user.displayName || user.username || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium break-all">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${user.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>{user.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div>
                  <p className="text-gray-500">Member Since</p>
                  <p className="text-gray-900 font-medium">{new Date(user.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Receipts</h2>
              {Array.isArray(user.receipts) && user.receipts.length > 0 ? (
                <div className="space-y-3">
                  {user.receipts.map((r) => (
                    <div key={r.id} className="flex gap-3 p-3 rounded border border-gray-200">
                      <div className="w-28 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                            {r.imageUrl ? (
                          <img src={r.imageUrl} alt="receipt" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{r.contribution?.title || 'Receipt'}</p>
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${r.status === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-200' : r.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{r.status}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600 flex items-center gap-3">
                          <span>₦{Number(r.amount).toLocaleString()}</span>
                          <span>•</span>
                          <span>{new Date(r.createdAt).toLocaleString()}</span>
                        </div>
                        {r.description && (
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{r.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No receipts found for this user.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
