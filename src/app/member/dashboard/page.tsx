"use client"

import UserProtectedRoute from '@/components/auth/UserProtectedRoute';
import ContributionsList from '@/components/contributions/ContributionsList';

import { useState, useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [recentReceipts, setRecentReceipts] = useState<any[] | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalPaid: 0,
    pendingAmount: 0,
    receiptsSubmitted: 0,
    receiptsApproved: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.uid) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [user?.uid]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`/api/reports/dashboard?firebaseUid=${user?.uid}`);
      if (res.ok) {
        const data = await res.json();
        setDashboardData({
          totalPaid: data.totalPaid || 0,
          pendingAmount: data.pendingAmount || 0,
          receiptsSubmitted: data.receiptsSubmitted || 0,
          receiptsApproved: data.receiptsApproved || 0,
        });
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const toggleTimeline = async () => {
    const next = !timelineOpen;
    setTimelineOpen(next);
    if (next && recentReceipts === null && user?.uid && !timelineLoading) {
      try {
        setTimelineLoading(true);
        const res = await fetch(`/api/receipts?firebaseUid=${encodeURIComponent(user.uid)}`);
        if (res.ok) {
          const data = await res.json();
          setRecentReceipts(Array.isArray(data) ? data.slice(0, 20) : []);
        } else {
          setRecentReceipts([]);
        }
      } finally {
        setTimelineLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <style>{`
          .spinner {
            position: relative;
            width: 15.7px;
            height: 15.7px;
            background: transparent !important;
          }
          .spinner div {
            animation: spinner-4t3wzl 1.875s infinite backwards;
            background-color: #474bff;
            border-radius: 50%;
            height: 100%;
            position: absolute;
            width: 100%;
          }
          .spinner div:nth-child(1) {
            animation-delay: 0.15s;
            background-color: rgba(71,75,255,0.9);
          }
          .spinner div:nth-child(2) {
            animation-delay: 0.3s;
            background-color: rgba(71,75,255,0.8);
          }
          .spinner div:nth-child(3) {
            animation-delay: 0.45s;
            background-color: rgba(71,75,255,0.7);
          }
          .spinner div:nth-child(4) {
            animation-delay: 0.6s;
            background-color: rgba(71,75,255,0.6);
          }
          .spinner div:nth-child(5) {
            animation-delay: 0.75s;
            background-color: rgba(71,75,255,0.5);
          }
          @keyframes spinner-4t3wzl {
            0% {
              transform: rotate(0deg) translateY(-200%);
            }
            60%, 100% {
              transform: rotate(360deg) translateY(-200%);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <UserProtectedRoute>
      {/* ...existing code... */}
      <div className="min-h-screen bg-gray-50">
        {/* ...existing code... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ...existing code... */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
            <p className="text-gray-600">View available contributions and upload receipts</p>
          </div>
          {/* ...existing code... */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">My Contributions</h3>
              <p className="text-3xl font-bold text-green-600">₦{dashboardData.totalPaid.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total paid</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Pending Amount</h3>
              <p className="text-3xl font-bold text-red-600">₦{dashboardData.pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Outstanding</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Receipts Submitted</h3>
              <p className="text-3xl font-bold text-blue-600">{dashboardData.receiptsSubmitted}</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Receipts Approved</h3>
              <p className="text-3xl font-bold text-yellow-600">{dashboardData.receiptsApproved}</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
          </div>
          {/* ...existing code... */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Contributions</h2>
            <ContributionsList />
          </div>
          {/* ...existing code... */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="/member/contributions" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                  View My Contributions
                </a>
                <a href="/member/receipts/new" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                  Upload Receipt
                </a>
                <a href="/member/history" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                  Payment History
                </a>
                <a href="/member/profile" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                  My Profile
                </a>
              </div>
            </div>
            {/* ...existing code... */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
                <button
                  onClick={toggleTimeline}
                  className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {timelineOpen ? 'Hide' : 'View'} Timeline
                </button>
              </div>
              {timelineOpen ? (
                timelineLoading ? (
                  <div className="py-6 flex justify-center"><div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
                ) : recentReceipts && recentReceipts.length > 0 ? (
                  <div className="mt-3 max-h-80 overflow-auto pr-1">
                    <ol className="relative border-s border-gray-200">
                      {recentReceipts.map((r: any) => {
                        const color = r.status === 'APPROVED' ? 'green' : r.status === 'PENDING' ? 'yellow' : 'red';
                        return (
                          <li key={r.id} className="ms-4 pb-6">
                            <span className={`absolute -start-1.5 mt-2 h-3 w-3 rounded-full border bg-${color}-500 border-${color}-500`}></span>
                            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow transition">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-${color}-50 text-${color}-700 border border-${color}-200`}>{r.status}</span>
                                  <p className="text-sm font-medium text-gray-900 truncate">You</p>
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</span>
                              </div>
                              <div className="mt-1 flex items-center justify-between">
                                <p className="text-sm text-gray-600 truncate">
                                  {r.status === 'APPROVED' ? 'Approved' : r.status === 'PENDING' ? 'Submitted' : 'Rejected'} receipt for {r.contribution?.title || 'a contribution'}
                                </p>
                                <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                  ₦{Number(r.amount).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )
              ) : (
                <p className="text-sm text-gray-500">Toggle to view timeline</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ...existing code... */}
    </UserProtectedRoute>
  );
}
