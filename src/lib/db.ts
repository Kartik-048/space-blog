import fs from 'fs';
import path from 'path';
import { Article, NewsItem } from './types';

const DB_DIR = path.join(process.cwd(), 'database');
const CONFIG_FILE = path.join(DB_DIR, 'config.json');
const ARTICLES_FILE = path.join(DB_DIR, 'articles.json');
const NEWS_FILE = path.join(DB_DIR, 'news_archive.json');

export interface DbConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  adminPassword?: string;
  autoSync: boolean;
  lastSync: string;
}

export function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

export function getDbConfig(): DbConfig {
  try {
    ensureDbDir();
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB config:', err);
  }
  return {
    maintenanceMode: false,
    maintenanceMessage: "Astronomia is currently under maintenance. We'll be back soon with your daily dose of space blogs!! ",
    adminPassword: 'Kartik040708@@',
    autoSync: true,
    lastSync: new Date().toISOString(),
  };
}

export function saveDbConfig(config: Partial<DbConfig>): DbConfig {
  ensureDbDir();
  const current = getDbConfig();
  const updated: DbConfig = { ...current, ...config };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

export function getDbArticles(): Article[] {
  try {
    ensureDbDir();
    if (fs.existsSync(ARTICLES_FILE)) {
      const data = fs.readFileSync(ARTICLES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB articles:', err);
  }
  return [];
}

export function saveDbArticles(articles: Article[]): void {
  ensureDbDir();
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf-8');
}

export function getDbNews(): NewsItem[] {
  try {
    ensureDbDir();
    if (fs.existsSync(NEWS_FILE)) {
      const data = fs.readFileSync(NEWS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB news archive:', err);
  }
  return [];
}

export function saveDbNews(news: NewsItem[]): void {
  ensureDbDir();
  fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2), 'utf-8');
}

export function getDatabaseDiagnostics() {
  ensureDbDir();
  let totalSizeBytes = 0;
  let fileCount = 0;
  const files: { name: string; size: number }[] = [];

  try {
    const dirEntries = fs.readdirSync(DB_DIR);
    for (const entry of dirEntries) {
      const fullPath = path.join(DB_DIR, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isFile()) {
        fileCount++;
        totalSizeBytes += stat.size;
        files.push({ name: entry, size: stat.size });
      }
    }
  } catch (err) {
    console.error('Diagnostics error:', err);
  }

  const articles = getDbArticles();
  const news = getDbNews();
  const config = getDbConfig();

  return {
    dbPath: DB_DIR,
    fileCount,
    totalSizeBytes,
    totalSizeKb: (totalSizeBytes / 1024).toFixed(2),
    articlesCount: articles.length,
    newsCount: news.length,
    maintenanceMode: config.maintenanceMode,
    lastSync: config.lastSync,
    files,
  };
}
