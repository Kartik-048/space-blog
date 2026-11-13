'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Database, RefreshCw, Plus, Trash2, CheckCircle2, AlertCircle, X, Server, HardDrive, FileText, ExternalLink, Key } from 'lucide-react';
import { NewsItem, Article } from '@/lib/types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'articles' | 'sync' | 'new-article'>('status');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [newsCount, setNewsCount] = useState<number>(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [deletedSlugs, setDeletedSlugs] = useState<string[]>([]);

  // New Article Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Astrophysics');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('Editor in Chief');
  const [newCover, setNewCover] = useState('https://images-assets.nasa.gov/image/PIA25442/PIA25442~orig.jpg');
  const [articleSaved, setArticleSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Fetch current database counts
      fetch('/api/news?limit=100')
        .then(res => res.json())
        .then(json => {
          if (json.data) setNewsCount(json.data.length);
        })
        .catch(() => {});

      // Load articles from local storage or api
      const localArticles = localStorage.getItem('astronomia_custom_articles');
      if (localArticles) {
        try {
          setArticles(JSON.parse(localArticles));
        } catch {}
      }
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleForceSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/sync');
      const data = await res.json();
      if (data.success) {
        setSyncResult(`Successfully synced ${data.stats?.newsCount || 'latest'} articles and APOD at ${new Date().toLocaleTimeString()}!`);
        setNewsCount(data.stats?.newsCount || newsCount);
      } else {
        setSyncResult('Sync encountered an issue: ' + (data.error || 'Check server logs'));
      }
    } catch (e: any) {
      setSyncResult('Sync failed: ' + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveArticle = (e: React.FormEvent) => {
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
      tags: [newCategory, 'Editorial', 'Custom'],
    };

    const updated = [newArt, ...articles];
    setArticles(updated);
    localStorage.setItem('astronomia_custom_articles', JSON.stringify(updated));

    setArticleSaved(true);
    setNewTitle('');
    setNewExcerpt('');
    setNewContent('');
    setTimeout(() => {
      setArticleSaved(false);
      setActiveTab('articles');
    }, 1500);
  };

  const handleDeleteArticle = (slug: string) => {
    const updated = articles.filter(a => a.slug !== slug);
    setArticles(updated);
    localStorage.setItem('astronomia_custom_articles', JSON.stringify(updated));
    setDeletedSlugs([...deletedSlugs, slug]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-space-900 border border-cosmic-cyan/40 rounded-3xl shadow-2xl shadow-cosmic-cyan/20 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-space-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-cosmic-cyan font-semibold">
                  RESTRICTED COMMAND CENTER
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                Astronomia Core Admin & Local Database
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Exit Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center space-x-2 px-6 pt-3 border-b border-white/10 bg-space-950/40 text-xs font-mono">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 px-3 flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-cosmic-cyan text-cosmic-cyan font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Status</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-3 px-3 flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sync'
                ? 'border-cosmic-cyan text-cosmic-cyan font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Live Feeds & Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 px-3 flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'articles'
                ? 'border-cosmic-cyan text-cosmic-cyan font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Articles Manager ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new-article')}
            className={`pb-3 px-3 flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'new-article'
                ? 'border-cosmic-cyan text-cosmic-cyan font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish New Article</span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Telemetry Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-space-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>LOCAL PC DATABASE</span>
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">{newsCount + articles.length} Items</div>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active on Local Drive</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-space-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>NASA RSS PIPELINE</span>
                    <Server className="w-4 h-4 text-cosmic-cyan" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">Online</div>
                  <span className="text-[11px] font-mono text-slate-400">NASA & ESA Feeds Connected</span>
                </div>

                <div className="p-4 rounded-2xl bg-space-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>SHUTDOWN RESILIENCE</span>
                    <Shield className="w-4 h-4 text-cosmic-purple" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">Safe (Zero Loss)</div>
                  <span className="text-[11px] font-mono text-slate-400">Auto-catches up on boot</span>
                </div>
              </div>

              {/* How local PC database works explanation */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 className="text-sm font-mono text-cosmic-cyan uppercase font-bold flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>How Your PC Works as the Database</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Why have a database if news updates automatically?</strong>
                  <br />
                  1. <strong>Permanent Historical Archive:</strong> Live RSS feeds only keep the last 15–20 news stories. As NASA publishes new stories, older ones get erased from NASA&apos;s feed. With your PC database, every article fetched is saved locally so you build a permanent, searchable historical library over time.
                  <br />
                  2. <strong>Instant Offline Speed:</strong> When you open the website, it instantly reads from your local storage without making you wait for external network handshakes.
                  <br />
                  3. <strong>Shutdown Behavior:</strong> When you shut down your PC for 8–9 hours, the database simply pauses. The moment you turn your PC on and launch the site, it queries NASA, detects whatever was published during your sleep, and appends the new stories to your local collection!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-space-950 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-serif font-bold text-white">Manual Ingestion Trigger</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Poll NASA News Release RSS, NASA Missions RSS, and ESA feeds immediately.
                    </p>
                  </div>
                  <button
                    onClick={handleForceSync}
                    disabled={isSyncing}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cosmic-cyan hover:bg-cosmic-cyan/90 text-space-950 font-bold text-xs font-mono transition-all disabled:opacity-50 shadow-glow-cyan cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing Feeds...' : 'Force Sync Now'}</span>
                  </button>
                </div>

                {syncResult && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-cosmic-cyan/30 text-xs font-mono text-cosmic-cyan flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>{syncResult}</span>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-slate-400 space-y-2">
                <div className="text-white font-bold mb-1">CONNECTED DATA PIPELINES:</div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span>NASA News Releases</span>
                  <span className="text-emerald-400">https://www.nasa.gov/news-release/feed/</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span>NASA Missions Feed</span>
                  <span className="text-emerald-400">https://www.nasa.gov/feed/</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span>NASA Astronomy Picture of the Day (APOD)</span>
                  <span className="text-emerald-400">https://api.nasa.gov/planetary/apod</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>NASA Image & Video Library</span>
                  <span className="text-emerald-400">https://images-api.nasa.gov</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-mono text-slate-400 uppercase">Your Custom Published Articles</h3>
                <button
                  onClick={() => setActiveTab('new-article')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/30 text-xs font-mono cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Article</span>
                </button>
              </div>

              {articles.length === 0 ? (
                <div className="py-12 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50 text-cosmic-cyan" />
                  <p className="text-sm font-serif text-white">No custom articles created yet</p>
                  <p className="text-xs font-mono text-slate-400 mt-1">Use the &quot;Publish New Article&quot; tab to author your own space essays.</p>
                </div>
              ) : (
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
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PUBLISH NEW ARTICLE */}
          {activeTab === 'new-article' && (
            <form onSubmit={handleSaveArticle} className="space-y-4">
              {articleSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Article published to your local database successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Article Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g. The Discovery of Habitable Super-Earths"
                    className="w-full px-3 py-2 bg-space-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cosmic-cyan"
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
                    <option value="Space Exploration">Space Exploration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Short Excerpt / Teaser</label>
                <input
                  type="text"
                  value={newExcerpt}
                  onChange={e => setNewExcerpt(e.target.value)}
                  required
                  placeholder="One or two sentences summarizing the premise..."
                  className="w-full px-3 py-2 bg-space-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cosmic-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Article Content (Markdown / Text)</label>
                <textarea
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required
                  rows={6}
                  placeholder="Write your scientific analysis or space essay here..."
                  className="w-full px-3 py-2 bg-space-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cosmic-cyan leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-space-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cosmic-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={newCover}
                    onChange={e => setNewCover(e.target.value)}
                    className="w-full px-3 py-2 bg-space-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cosmic-cyan"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs font-mono hover:bg-cosmic-cyan/90 transition-all shadow-glow-cyan cursor-pointer"
                >
                  Publish to Local Database
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
