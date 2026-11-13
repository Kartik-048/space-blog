import fs from 'fs';
import path from 'path';
import { Article, NewsItem } from './types';

// Primary DB dir in project root; fallback to /tmp if filesystem is read-only (e.g. serverless/Netlify)
const PRIMARY_DB_DIR = path.join(process.cwd(), 'database');
const FALLBACK_DB_DIR = path.join(process.platform === 'win32' ? process.env.TEMP || 'C:\\temp' : '/tmp', 'astronomia_db');

let activeDbDir = PRIMARY_DB_DIR;

export interface ReconnectionReport {
  reconnectedAt: string;
  wasOfflineSince?: string;
  offlineDurationFormatted?: string;
  lastNewsDateBeforeOff?: string;
  newArticlesSynced: number;
  totalArticlesInDb: number;
}

export interface DbConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  adminPassword?: string;
  autoSync: boolean;
  lastSync: string;
  turnedOffAt?: string | null;
  lastNewsDateBeforeOff?: string | null;
  lastReconnectionReport?: ReconnectionReport | null;
}

// In-memory cache fallback to ensure mutations never fail even on restricted hosts
let inMemoryConfig: DbConfig | null = null;
let inMemoryNews: NewsItem[] | null = null;
let inMemoryArticles: Article[] | null = null;

export function ensureDbDir(): string {
  try {
    if (!fs.existsSync(activeDbDir)) {
      fs.mkdirSync(activeDbDir, { recursive: true });
    }
    // Test write permission
    const testFile = path.join(activeDbDir, '.write-test');
    fs.writeFileSync(testFile, 'ok', 'utf-8');
    fs.unlinkSync(testFile);
    return activeDbDir;
  } catch {
    // Switch to fallback temp directory
    activeDbDir = FALLBACK_DB_DIR;
    try {
      if (!fs.existsSync(activeDbDir)) {
        fs.mkdirSync(activeDbDir, { recursive: true });
      }
    } catch {
      // Memory fallback only
    }
    return activeDbDir;
  }
}

function getFilePath(filename: string): string {
  ensureDbDir();
  return path.join(activeDbDir, filename);
}

export function getDbConfig(): DbConfig {
  const defaultConfig: DbConfig = {
    maintenanceMode: false,
    maintenanceMessage: "Astronomia is currently under maintenance. We'll be back soon with your daily dose of space blogs!! ",
    adminPassword: 'Kartik040708@@',
    autoSync: true,
    lastSync: new Date().toISOString(),
    turnedOffAt: null,
    lastNewsDateBeforeOff: null,
    lastReconnectionReport: null,
  };

  try {
    const configFile = getFilePath('config.json');
    if (fs.existsSync(configFile)) {
      const data = fs.readFileSync(configFile, 'utf-8');
      const parsed = JSON.parse(data);
      const loaded: DbConfig = { ...defaultConfig, ...parsed };
      inMemoryConfig = loaded;
      return loaded;
    }
  } catch (err) {
    console.warn('Error reading config file, using memory/fallback:', err);
  }

  if (inMemoryConfig) return inMemoryConfig;
  inMemoryConfig = defaultConfig;
  return defaultConfig;
}

export function saveDbConfig(config: Partial<DbConfig>): DbConfig {
  const current = getDbConfig();
  const updated: DbConfig = { ...current, ...config };
  inMemoryConfig = updated;

  try {
    const configFile = getFilePath('config.json');
    fs.writeFileSync(configFile, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write config.json to disk, retained in memory:', err);
  }

  return updated;
}

export function getDbArticles(): Article[] {
  try {
    const articlesFile = getFilePath('articles.json');
    if (fs.existsSync(articlesFile)) {
      const data = fs.readFileSync(articlesFile, 'utf-8');
      inMemoryArticles = JSON.parse(data);
      return inMemoryArticles || [];
    }
  } catch (err) {
    console.warn('Error reading articles file:', err);
  }
  return inMemoryArticles || [];
}

export function saveDbArticles(articles: Article[]): void {
  inMemoryArticles = articles;
  try {
    const articlesFile = getFilePath('articles.json');
    fs.writeFileSync(articlesFile, JSON.stringify(articles, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write articles.json to disk, retained in memory:', err);
  }
}

export function getDbNews(): NewsItem[] {
  try {
    const newsFile = getFilePath('news_archive.json');
    if (fs.existsSync(newsFile)) {
      const data = fs.readFileSync(newsFile, 'utf-8');
      inMemoryNews = JSON.parse(data);
      return inMemoryNews || [];
    }
  } catch (err) {
    console.warn('Error reading news file:', err);
  }
  return inMemoryNews || [];
}

export function saveDbNews(news: NewsItem[]): void {
  inMemoryNews = news;
  try {
    const newsFile = getFilePath('news_archive.json');
    fs.writeFileSync(newsFile, JSON.stringify(news, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write news_archive.json to disk, retained in memory:', err);
  }
}

export function getLatestNewsPubDate(): string | null {
  const news = getDbNews();
  if (!news || news.length === 0) return null;
  const sorted = [...news].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return sorted[0].pubDate;
}

export function formatDurationMs(ms: number): string {
  if (ms <= 0) return 'less than a minute';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hr' : 'hrs'}`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} ${minutes === 1 ? 'min' : 'mins'}`);

  return parts.join(', ');
}

export function getDatabaseDiagnostics() {
  let totalSizeBytes = 0;
  let fileCount = 0;
  const files: { name: string; size: number }[] = [];

  try {
    ensureDbDir();
    const dirEntries = fs.readdirSync(activeDbDir);
    for (const entry of dirEntries) {
      const fullPath = path.join(activeDbDir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isFile()) {
        fileCount++;
        totalSizeBytes += stat.size;
        files.push({ name: entry, size: stat.size });
      }
    }
  } catch (err) {
    console.warn('Diagnostics error reading dir:', err);
  }

  const articles = getDbArticles();
  const news = getDbNews();
  const config = getDbConfig();

  return {
    dbPath: activeDbDir,
    fileCount,
    totalSizeBytes,
    totalSizeKb: (totalSizeBytes / 1024).toFixed(2),
    articlesCount: articles.length,
    newsCount: news.length,
    maintenanceMode: config.maintenanceMode,
    lastSync: config.lastSync,
    turnedOffAt: config.turnedOffAt,
    lastNewsDateBeforeOff: config.lastNewsDateBeforeOff,
    lastReconnectionReport: config.lastReconnectionReport,
    files,
  };
}
