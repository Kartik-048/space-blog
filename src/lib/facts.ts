import { Fact } from './types';
import factsData from '@/data/facts.json';

const FACTS: Fact[] = factsData as Fact[];

export function getAllFacts(): Fact[] {
  return FACTS;
}

export function getFactById(id: string): Fact | undefined {
  return FACTS.find(f => f.id === id);
}

export function getDailyFact(date: Date = new Date()): Fact {
  // Deterministic daily rotation using calendar day of the year
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime() + (startOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const index = Math.abs(dayOfYear) % FACTS.length;
  return FACTS[index];
}

export function getRandomFact(): Fact {
  const index = Math.floor(Math.random() * FACTS.length);
  return FACTS[index];
}
