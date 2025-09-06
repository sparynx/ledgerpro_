"use client"

import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import { useState, useEffect } from 'react';

interface PastContribution {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  dueDate: string;
  userId: string | null;
  originalId: string;
  archivedAt: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    displayName: string | null;
    username: string | null;
    stateCode: string | null;
  } | null;
}

export default function PastContributionsPage() {
  const [pastContributions, setPastContributions] = useState<PastContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPastContributions();
  }, []);

  const fetchPastContributions = async () => {
    try {
      const res = await fetch('/api/past-contributions');
      if (res.ok) {
        const data = await res.json();
        setPastContributions(data);
      } else {
        setError('Failed to fetch past contributions');
      }
    } catch (err) {
      setError('Error loading past contributions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminProtectedRoute>
    );
  }

  if (error) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="text-red-600">{error}</div>
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Past Contributions</h1>
            <p className="text-gray-600">View archived contributions that have expired</p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Archived Contributions ({pastContributions.length} total)
              </h2>
            </div>

            {pastContributions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No past contributions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contribution
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Archived
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pastContributions.map((contribution) => (
                      <tr key={contribution.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contribution.title}
                            </div>
                            {contribution.description && (
                              <div className="text-sm text-gray-500">
                                {contribution.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contribution.user ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {contribution.user.displayName || contribution.user.username || 'No name'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {contribution.user.email}
                                {contribution.user.stateCode && ` • ${contribution.user.stateCode}`}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Global Contribution</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            ₦{contribution.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(contribution.dueDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(contribution.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(contribution.archivedAt).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {pastContributions.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Total Archived: {pastContributions.length}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    Total Amount: ₦{pastContributions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}


