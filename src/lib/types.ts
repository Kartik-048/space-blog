export interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video' | string;
  copyright?: string;
  service_version?: string;
}

export type NewsCategory =
  | 'All'
  | 'Astronomy'
  | 'Space Exploration'
  | 'NASA'
  | 'SpaceX'
  | 'Missions'
  | 'Galaxies'
  | 'Discoveries';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  author?: string;
  summary: string;
  thumbnail: string;
  category: NewsCategory;
  tags?: string[];
}

export type GalleryCategory =
  | 'All'
  | 'Galaxies'
  | 'Nebulas'
  | 'Planets'
  | 'Moons'
  | 'Black Holes'
  | 'Solar System'
  | 'Deep Space'
  | 'Spacecraft';

export interface GalleryItem {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  center?: string;
  photographer?: string;
  keywords?: string[];
  thumbUrl: string;
  highResUrl: string;
  category: GalleryCategory;
}

export interface Fact {
  id: string;
  topic: string;
  title: string;
  fact: string;
  category: string;
  source: string;
  tags: string[];
}

export interface Discovery {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  facility: string;
  imageUrl: string;
  significance: string;
  keyTakeaways: string[];
}

export interface ArticleAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: ArticleAuthor;
  publishedAt: string;
  readingTime: string;
  coverImage: string;
  coverCaption?: string;
  featured: boolean;
  tags: string[];
}
