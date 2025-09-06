"use client"


import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminNavbar from '@/components/layout/AdminNavbar';
import ExportReportButton from '@/components/admin/ExportReportButton';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalContributions: 0,
    totalExpenses: 0,
    activeMembers: 0,
    pendingReceipts: 0,
    availableContributions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [stateCodeQuery, setStateCodeQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [recentReceipts, setRecentReceipts] = useState<any[] | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/reports/dashboard?admin=1');
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalContributions: data.totalContributions || 0,
          totalExpenses: data.totalExpenses || 0,
          activeMembers: data.activeMembers || 0,
          pendingReceipts: data.pendingReceipts || 0,
          availableContributions: (data.totalContributions || 0) - (data.totalExpenses || 0),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!stateCodeQuery.trim()) {
      setResults([]);
      setSearchError('');
      return;
    }
    try {
      setSearching(true);
      setSearchError('');
      const res = await fetch(`/api/users?stateCode=${encodeURIComponent(stateCodeQuery.trim())}&include=receipts`);
      if (!res.ok) {
        setSearchError('Failed to search users');
        setResults([]);
        return;
      }
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setSearchError('Error performing search');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const toggleTimeline = async () => {
    const next = !timelineOpen;
    setTimelineOpen(next);
    if (next && recentReceipts === null && !timelineLoading) {
      try {
        setTimelineLoading(true);
        const res = await fetch('/api/receipts');
        if (!res.ok) return;
        const receipts = await res.json();
        const data = Array.isArray(receipts) ? receipts : [];
        setRecentReceipts(data.slice(0, 20));
      } finally {
        setTimelineLoading(false);
      }
    }
  };

  const archiveExpiredContributions = async () => {
    try {
      setArchiving(true);
      const res = await fetch('/api/archive-expired', {
        method: 'POST',
      });
      
      if (res.ok) {
        const result = await res.json();
        alert(`Archived ${result.archived} contributions and deleted ${result.deleted} empty contributions.`);
        // Refresh stats
        fetchStats();
      } else {
        alert('Failed to archive expired contributions');
      }
    } catch (error) {
      alert('Error archiving expired contributions');
    } finally {
      setArchiving(false);
    }
  };

  const sendReminderEmails = async () => {
    try {
      setSendingEmails(true);
      const res = await fetch('/api/send-reminders', {
        method: 'POST',
      });
      
      if (res.ok) {
        const result = await res.json();
        alert(`Reminder emails sent successfully!\n\nSent: ${result.sent}\nFailed: ${result.failed}\nUsers with pending contributions: ${result.usersWithPendingContributions}`);
      } else {
        alert('Failed to send reminder emails');
      }
    } catch (error) {
      alert('Error sending reminder emails');
    } finally {
      setSendingEmails(false);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* <AdminNavbar hideTitle hideProfile /> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-8 space-y-4">
            {/* Header + Controls (responsive) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage CDS finances and members</p>
              </div>
              <div className="flex w-full sm:w-auto items-stretch sm:items-center gap-3">
                {/* Search Bar - Full width on mobile, compact on desktop */}
                <div className="relative w-full sm:w-72">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {/* Search Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.243 11.94l4.784 4.783a.75.75 0 1 0 1.06-1.06l-4.783-4.784A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={stateCodeQuery}
                    onChange={(e) => setStateCodeQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') searchUsers(); }}
                    placeholder="Search by state code..."
                    className="w-full pr-28 pl-10 py-2.5 rounded-xl border border-gray-200 bg-white/80 backdrop-blur text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <button
                    onClick={searchUsers}
                    disabled={searching}
                    className={`absolute right-1 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg text-white text-sm font-medium shadow-sm transition ${searching ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                  >
                    {searching ? 'Go...' : 'Search'}
                  </button>
                </div>
                {/* Export Button - Full width on mobile, auto on desktop */}
                <div className="w-full sm:w-auto">
                  <ExportReportButton small />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Total Contributions</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700">₦{stats.totalContributions.toLocaleString()}</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Total Expenses</h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">₦{stats.totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Available Funds</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">₦{stats.availableContributions.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Contributions - Expenses</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Active Members</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700">{stats.activeMembers}</p>
              <p className="text-sm text-gray-500">Current members</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Pending Receipts</h3>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pendingReceipts}</p>
              <p className="text-sm text-gray-500">Awaiting approval</p>
            </div>
          </div>

          {searchError && (
            <div className="mb-4 text-sm text-red-600">{searchError}</div>
          )}

          {/* Search Results - Mobile responsive */}
          {results.length > 0 && (
            <div className="mb-8 bg-white rounded-lg shadow p-4 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Search Results</h4>
              <ul className="divide-y divide-gray-200">
                {results.map((u) => (
                  <li key={u.id} className="py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Link href={`/admin/members/${u.id}`} className="text-blue-700 hover:text-blue-800 font-medium truncate">
                        {u.displayName || u.username || u.email}
                      </Link>
                      {u.stateCode && (
                        <span className="text-sm text-gray-500 sm:ml-2">({u.stateCode})</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="/admin/contributions/new" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                  Add New Contribution
                </a>
                <a href="/admin/expenses/new" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                  Record New Expense
                </a>
                <a href="/admin/expenses" className="block w-full text-left px-4 py-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
                  View Expenses
                </a>
                <Link href="/admin/receipts" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                  Review Receipts
                </Link>
                <Link href="/admin/members" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                  Manage Members
                </Link>
                <Link href="/admin/contributors" className="block w-full text-left px-4 py-3 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100">
                  View Contributors
                </Link>
                <Link href="/admin/cash-contributions" className="block w-full text-left px-4 py-3 text-sm font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100">
                  Record Cash Payment
                </Link>
                <Link href="/admin/past-contributions" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                  View Past Contributions
                </Link>
                <button
                  onClick={archiveExpiredContributions}
                  disabled={archiving}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-orange-700 bg-orange-50 rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {archiving ? 'Archiving...' : 'Archive Expired Contributions'}
                </button>
                <button
                  onClick={sendReminderEmails}
                  disabled={sendingEmails}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingEmails ? 'Sending Emails...' : '📧 Send Reminder Emails'}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</h3>
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
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {r.user?.displayName || r.user?.username || 'Member'}
                                  </p>
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
    </AdminProtectedRoute>
  );
}
