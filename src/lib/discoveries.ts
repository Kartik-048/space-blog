import { Discovery } from './types';
import discoveriesData from '@/data/discoveries.json';

const DISCOVERIES: Discovery[] = discoveriesData as Discovery[];

export function getAllDiscoveries(): Discovery[] {
  return DISCOVERIES;
}

export function getDiscoveryBySlug(slug: string): Discovery | undefined {
  return DISCOVERIES.find(d => d.slug === slug);
}
