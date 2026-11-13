'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Database,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Server,
  HardDrive,
  FileText,
  Key,
  Power,
  Activity,
  Cpu,
  Lock,
  Unlock,
  Radio,
  Clock,
  Sparkles,
  History,
  Check,
} from 'lucide-react';
import { Article } from '@/lib/types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Tabs & Controls
  const [activeTab, setActiveTab] = useState<'maintenance' | 'diagnostics' | 'articles' | 'new-article'>('maintenance');

  // Diagnostics State
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [diagData, setDiagData] = useState<any>(null);

  // Maintenance State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState(
    "Astronomia is currently under maintenance. We'll be back soon with your daily dose of space blogs!! "
  );
  const [reconnectionReport, setReconnectionReport] = useState<any>(null);
  const [turnedOffAt, setTurnedOffAt] = useState<string | null>(null);
  const [lastNewsDateBeforeOff, setLastNewsDateBeforeOff] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Articles & Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleSaved, setArticleSaved] = useState(false);

  // Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Astrophysics');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('Kartik (Lead Editor)');
  const [newCover, setNewCover] = useState('https://images-assets.nasa.gov/image/PIA25442/PIA25442~orig.jpg');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      // Check session
      const savedAuth = sessionStorage.getItem('astronomia_admin_auth');
      if (savedAuth === 'granted') {
        setIsAuthenticated(true);
        loadAdminData();
      }
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const loadAdminData = () => {
    // Load maintenance state & catch-up report
    fetch('/api/admin/maintenance')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMaintenanceMode(Boolean(data.maintenanceMode));
          if (data.maintenanceMessage) setMaintenanceMsg(data.maintenanceMessage);
          if (data.lastReconnectionReport) setReconnectionReport(data.lastReconnectionReport);
          if (data.turnedOffAt) setTurnedOffAt(data.turnedOffAt);
          if (data.lastNewsDateBeforeOff) setLastNewsDateBeforeOff(data.lastNewsDateBeforeOff);
        }
      })
      .catch(() => {});

    // Load diagnostics
    loadDiagnostics();

    // Load articles from server db
    fetch('/api/admin/articles')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.articles) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});
  };

  const loadDiagnostics = () => {
    setDiagnosticsLoading(true);
    fetch('/api/admin/status')
      .then(res => res.json())
      .then(data => {
        if (data.success) setDiagData(data);
      })
      .catch(() => {})
      .finally(() => setDiagnosticsLoading(false));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('astronomia_admin_auth', 'granted');
        setPasswordInput('');
        loadAdminData();
      } else {
        setAuthError(data.error || 'Incorrect password.');
      }
    } catch {
      setAuthError('Connection error verifying password.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleToggleMaintenance = async () => {
    setMaintenanceLoading(true);
    setStatusNotification(null);
    const targetMode = !maintenanceMode;
    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maintenanceMode: targetMode,
          maintenanceMessage: maintenanceMsg,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const isOff = Boolean(data.maintenanceMode);
        setMaintenanceMode(isOff);

        // Immediate client-side propagation to cookies & storage
        if (typeof window !== 'undefined') {
          localStorage.setItem('astronomia_maintenance_mode', isOff ? '1' : '0');
          document.cookie = `astronomia_maintenance_mode=${isOff ? '1' : '0'}; path=/; max-age=${isOff ? '31536000' : '0'}; SameSite=Lax`;
          window.dispatchEvent(
            new CustomEvent('astronomia_maintenance_change', {
              detail: {
                maintenanceMode: isOff,
                report: data.reconnectionReport,
              },
            })
          );
        }

        if (data.reconnectionReport) {
          setReconnectionReport(data.reconnectionReport);
        }
        if (data.turnedOffAt) {
          setTurnedOffAt(data.turnedOffAt);
        } else {
          setTurnedOffAt(null);
        }
        if (data.lastNewsDateBeforeOff) {
          setLastNewsDateBeforeOff(data.lastNewsDateBeforeOff);
        }

        if (isOff) {
          setStatusNotification('🌑 Site is now turned OFF. Maintenance blackout is ACTIVE.');
          // Auto close modal after 1.5s so user immediately sees the maintenance blackout screen
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          const report = data.reconnectionReport;
          const msg = report
            ? `☀️ Site is back ONLINE! Offline for ${report.offlineDurationFormatted}. Synced ${report.newArticlesSynced} new articles published since shutdown!`
            : '☀️ Site is now LIVE and fully accessible!';
          setStatusNotification(msg);
          loadDiagnostics();
        }
      } else {
        alert('Error updating site status: ' + (data.error || 'Server error'));
      }
    } catch (e: any) {
      alert('Error updating maintenance mode: ' + e.message);
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/sync');
      const data = await res.json();
      if (data.success) {
        setSyncResult(`Synced ${data.stats?.newsCount || 'latest'} articles at ${new Date().toLocaleTimeString()}!`);
        loadDiagnostics();
      } else {
        setSyncResult('Sync encountered an issue: ' + (data.error || 'Check logs'));
      }
    } catch (e: any) {
      setSyncResult('Sync failed: ' + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newExcerpt || !newContent) return;

    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newArt: Article = {
      id: 'custom-' + Date.now(),
      slug,
      title: newTitle,
      excerpt: newExcerpt,
      content: newContent,
      category: newCategory,
      author: {
        name: newAuthor,
        role: 'Verified Editor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      },
      publishedAt: new Date().toISOString().split('T')[0],
      readingTime: `${Math.ceil(newContent.split(/\s+/).length / 200)} min read`,
      coverImage: newCover,
      featured: false,
      tags: [newCategory, 'Editorial', 'Database'],
    };

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArt),
      });
      const data = await res.json();
      if (data.success) {
        setArticles([newArt, ...articles.filter(a => a.slug !== slug)]);
        setArticleSaved(true);
        setNewTitle('');
        setNewExcerpt('');
        setNewContent('');
        setTimeout(() => {
          setArticleSaved(false);
          setActiveTab('articles');
        }, 1500);
      }
    } catch (err: any) {
      alert('Failed to save to local database: ' + err.message);
    }
  };

  const handleDeleteArticle = async (slug: string) => {
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles(articles.filter(a => a.slug !== slug));
      }
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('astronomia_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-space-900 border border-cosmic-cyan/40 rounded-3xl shadow-2xl shadow-cosmic-cyan/20 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-space-950">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-cosmic-cyan font-bold">
                  RESTRICTED ACCESS
                </span>
                {isAuthenticated && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                Astronomia Admin & Local Database
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono border border-white/10 cursor-pointer"
              >
                Log Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1. PASSWORD GATE (When not authenticated) */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="p-4 rounded-3xl bg-cosmic-purple/15 text-cosmic-purple border border-cosmic-purple/30 shadow-glow-purple">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-white">Security Verification Required</h3>
              <p className="text-xs text-slate-400 font-mono">
                Enter your administrative key to unlock the database & controls.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm space-y-4">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Enter Admin Password..."
                  autoFocus
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-space-950 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cosmic-cyan transition-colors"
                />
              </div>

              {authError && (
                <div className="text-xs font-mono text-rose-400 flex items-center justify-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 px-4 rounded-xl bg-cosmic-cyan text-space-950 font-mono font-bold text-xs hover:bg-cosmic-cyan/90 transition-all shadow-glow-cyan disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{isVerifying ? 'Authenticating...' : 'Unlock Control Panel'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* 2. AUTHENTICATED COMMAND CENTER */
          <>
            {/* Tab navigation */}
            <div className="flex items-center space-x-2 px-6 pt-3 border-b border-white/10 bg-space-950/40 text-xs font-mono overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`pb-3 px-3 flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'maintenance'
                    ? 'border-cosmic-cyan text-cosmic-cyan font-bold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>Site Switch & Maintenance</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('diagnostics');
                  loadDiagnostics();
                }}
                className={`pb-3 px-3 flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'diagnostics'
                    ? 'border-cosmic-cyan text-cosmic-cyan font-bold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>API & DB Status</span>
              </button>

              <button
                onClick={() => setActiveTab('articles')}
                className={`pb-3 px-3 flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'articles'
                    ? 'border-cosmic-cyan text-cosmic-cyan font-bold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Articles ({articles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('new-article')}
                className={`pb-3 px-3 flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'new-article'
                    ? 'border-cosmic-cyan text-cosmic-cyan font-bold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Article</span>
              </button>
            </div>

            {/* Tab contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: SITE POWER / MAINTENANCE SWITCH */}
              {activeTab === 'maintenance' && (
                <div className="space-y-6">
                  {statusNotification && (
                    <div className="p-4 rounded-2xl bg-cosmic-cyan/15 border border-cosmic-cyan/40 text-xs font-mono text-cyan-200 flex items-center space-x-2 animate-in fade-in">
                      <Sparkles className="w-4 h-4 text-cosmic-cyan shrink-0" />
                      <span>{statusNotification}</span>
                    </div>
                  )}

                  {/* Maintenance Mode Card */}
                  <div
                    className={`p-6 rounded-3xl border transition-all ${
                      maintenanceMode
                        ? 'bg-amber-950/30 border-amber-500/50 shadow-2xl shadow-amber-500/10'
                        : 'bg-space-950 border-white/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              maintenanceMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                            }`}
                          />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                            {maintenanceMode ? 'STATUS: SITE OFF / MAINTENANCE ACTIVE' : 'STATUS: SITE LIVE (NOMINAL)'}
                          </span>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-white">
                          Turn Off Site (Maintenance Blackout)
                        </h3>
                        <p className="text-xs text-slate-400 max-w-lg">
                          When switched ON, visitors to any page see the full-screen maintenance message instead of the blog.
                        </p>
                      </div>

                      <button
                        onClick={handleToggleMaintenance}
                        disabled={maintenanceLoading}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-mono text-xs font-bold transition-all shadow-lg cursor-pointer ${
                          maintenanceMode
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-space-950 shadow-emerald-500/30'
                            : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        <span>{maintenanceMode ? 'TURN SITE BACK ON' : 'TURN SITE OFF NOW'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Automatic Reconnection & Time-Difference Engine */}
                  <div className="p-5 rounded-2xl bg-space-950/80 border border-cosmic-purple/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-cosmic-purple" />
                        <span className="text-xs font-mono text-cosmic-purple font-bold uppercase tracking-wider">
                          Time-Delta Reconnection & Catch-Up Engine
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-cosmic-purple/15 text-cosmic-purple text-[10px] font-mono border border-cosmic-purple/30">
                        AUTOMATIC SYNC
                      </span>
                    </div>

                    {maintenanceMode ? (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-mono space-y-1">
                        <div className="font-bold flex items-center space-x-1.5">
                          <History className="w-3.5 h-3.5 text-amber-400" />
                          <span>STANDBY MODE: TIME-DELTA ARMED</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Turned off at: <span className="text-white font-bold">{turnedOffAt ? new Date(turnedOffAt).toLocaleString() : 'Just now'}</span>
                        </p>
                        <p className="text-[11px] text-slate-300">
                          Last news publication baseline: <span className="text-cosmic-cyan font-bold">{lastNewsDateBeforeOff ? new Date(lastNewsDateBeforeOff).toLocaleString() : 'Saved in database'}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 italic pt-1">
                          💡 When you click &quot;TURN SITE BACK ON&quot;, Astronomia will calculate the exact hours/minutes the site was offline and automatically fetch all space news published during that window!
                        </p>
                      </div>
                    ) : reconnectionReport ? (
                      <div className="p-3 rounded-xl bg-cosmic-purple/10 border border-cosmic-purple/20 text-xs text-slate-300 font-mono space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Latest Catch-Up Audit Report</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(reconnectionReport.reconnectedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                            <span className="text-slate-400 block text-[10px]">Offline Window:</span>
                            <span className="text-cosmic-cyan font-bold">{reconnectionReport.offlineDurationFormatted || 'Brief'}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                            <span className="text-slate-400 block text-[10px]">News Caught Up:</span>
                            <span className="text-emerald-400 font-bold">+{reconnectionReport.newArticlesSynced} new stories</span>
                          </div>
                          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                            <span className="text-slate-400 block text-[10px]">Total in Archive:</span>
                            <span className="text-white font-bold">{reconnectionReport.totalArticlesInDb} articles</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-mono">
                        Ready on standby. Turning off the site will log the exact shutdown time. Turning it back on will automatically scan all NASA feeds for news published in the interim and backfill your archive.
                      </p>
                    )}
                  </div>

                  {/* Message Preview */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-xs font-mono text-cosmic-cyan uppercase font-bold block">
                      Visitor Maintenance Screen Message
                    </span>
                    <p className="text-sm font-serif italic text-slate-200 p-3 rounded-xl bg-black/40 border border-white/5">
                      &quot;{maintenanceMsg}&quot;
                    </p>
                    <span className="text-[11px] font-mono text-slate-400 block pt-1">
                      💡 Even during maintenance mode, clicking the hidden telescope icon 6 times at the bottom lets you log back in and switch the site on!
                    </span>
                  </div>

                  {/* Quick Sync Card */}
                  <div className="p-5 rounded-2xl bg-space-950 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-serif">Force Ingestion & Refresh</h4>
                      <p className="text-xs text-slate-400">Poll live NASA RSS and update local PC database.</p>
                    </div>
                    <button
                      onClick={handleForceSync}
                      disabled={isSyncing}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cosmic-cyan/15 hover:bg-cosmic-cyan text-cosmic-cyan hover:text-space-950 border border-cosmic-cyan/30 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync NASA Now'}</span>
                    </button>
                  </div>

                  {syncResult && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{syncResult}</span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: API & DATABASE STATUS DIAGNOSTICS */}
              {activeTab === 'diagnostics' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono text-slate-400 uppercase">Live Infrastructure Health</h3>
                    <button
                      onClick={loadDiagnostics}
                      disabled={diagnosticsLoading}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/10 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${diagnosticsLoading ? 'animate-spin' : ''}`} />
                      <span>Re-Check APIs</span>
                    </button>
                  </div>

                  {/* API Status Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {diagData?.apis ? (
                      Object.entries(diagData.apis).map(([key, api]: [string, any]) => (
                        <div
                          key={key}
                          className="p-4 rounded-2xl bg-space-950 border border-white/10 space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono text-white font-bold">{api.name}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                  api.ok
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {api.ok ? `200 OK (${api.latencyMs}ms)` : api.error || 'Failed'}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 truncate block mt-1">
                              {api.url}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-xs font-mono text-slate-400">
                        Running real-time network latency probes...
                      </div>
                    )}
                  </div>

                  {/* Local PC Database Folder Diagnostics */}
                  <div className="p-5 rounded-2xl bg-space-950 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-cosmic-cyan">
                      <span className="font-bold flex items-center space-x-2">
                        <HardDrive className="w-4 h-4" />
                        <span>LOCAL PC DATABASE FOLDER ON DISK</span>
                      </span>
                      <span className="text-slate-400">{diagData?.database?.totalSizeKb || '0'} KB Total</span>
                    </div>

                    <div className="text-xs font-mono text-slate-300 p-3 rounded-xl bg-black/50 border border-white/5 break-all">
                      Path: {diagData?.database?.dbPath || 'd:\\Coding\\Space blog\\database'}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-slate-400 text-[10px] block">Archived News</span>
                        <span className="text-lg font-bold text-white font-serif">{diagData?.database?.newsCount || 0}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-slate-400 text-[10px] block">Custom Articles</span>
                        <span className="text-lg font-bold text-white font-serif">{diagData?.database?.articlesCount || 0}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-slate-400 text-[10px] block">Database Files</span>
                        <span className="text-lg font-bold text-white font-serif">{diagData?.database?.fileCount || 0}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-slate-400 text-[10px] block">Server Memory</span>
                        <span className="text-lg font-bold text-white font-serif">{diagData?.system?.memoryRssMb || 0} MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ARTICLES IN LOCAL DATABASE */}
              {activeTab === 'articles' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono text-slate-400 uppercase">Articles in Database ({articles.length})</h3>
                    <button
                      onClick={() => setActiveTab('new-article')}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs font-mono cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Write Article</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {articles.map(art => (
                      <div
                        key={art.id}
                        className="p-4 rounded-xl bg-space-950 border border-white/10 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center space-x-2 text-[10px] font-mono text-cosmic-cyan">
                            <span>{art.category}</span>
                            <span>&bull;</span>
                            <span>{art.publishedAt}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white font-serif">{art.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{art.excerpt}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteArticle(art.slug)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer shrink-0"
                          title="Delete from local database"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PUBLISH ARTICLE */}
              {activeTab === 'new-article' && (
                <form onSubmit={handleSaveArticle} className="space-y-4">
                  {articleSaved && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Article written to local PC database file successfully!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">Title</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        required
                        placeholder="Article Headline..."
                        className="w-full px-3 py-2 bg-space-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cosmic-cyan"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">Category</label>
                      <select
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-space-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cosmic-cyan font-mono"
                      >
                        <option value="Astrophysics">Astrophysics</option>
                        <option value="Astrobiology">Astrobiology</option>
                        <option value="Cosmology">Cosmology</option>
                        <option value="Planetary Science">Planetary Science</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Excerpt</label>
                    <input
                      type="text"
                      value={newExcerpt}
                      onChange={e => setNewExcerpt(e.target.value)}
                      required
                      placeholder="Brief teaser..."
                      className="w-full px-3 py-2 bg-space-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cosmic-cyan"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Full Content</label>
                    <textarea
                      value={newContent}
                      onChange={e => setNewContent(e.target.value)}
                      required
                      rows={5}
                      placeholder="Article body content..."
                      className="w-full px-3 py-2 bg-space-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cosmic-cyan leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs font-mono hover:bg-cosmic-cyan/90 transition-all shadow-glow-cyan cursor-pointer"
                    >
                      Save to PC Database Folder
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
