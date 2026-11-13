import { GalleryCategory, GalleryItem } from './types';

const CATEGORY_SEARCH_TERMS: Record<Exclude<GalleryCategory, 'All'>, string> = {
  Galaxies: 'spiral galaxy hubble webb',
  Nebulas: 'nebula carina orion tarantula',
  Planets: 'jupiter saturn mars jpl',
  Moons: 'europa titan enceladus callisto',
  'Black Holes': 'black hole event horizon accretion disk',
  'Solar System': 'sun solar flare coronal mass ejection comet',
  'Deep Space': 'deep field smacs cosmic web hubble',
  Spacecraft: 'james webb space telescope voyager rover artemis',
};

const CURATED_GALLERY_ITEMS: GalleryItem[] = [
  {
    nasa_id: 'PIA25328',
    title: "Webb's First Deep Field (SMACS 0723)",
    description: "NASA's James Webb Space Telescope has produced the deepest and sharpest infrared image of the distant universe to date. Known as Webb's First Deep Field, this image of galaxy cluster SMACS 0723 is overflowing with detail.",
    date_created: '2022-07-12',
    center: 'GSFC',
    photographer: 'NASA, ESA, CSA, STScI',
    keywords: ['JWST', 'Deep Field', 'Gravitational Lensing', 'Galaxies'],
    thumbUrl: 'https://images-assets.nasa.gov/image/PIA25328/PIA25328~thumb.jpg',
    highResUrl: 'https://images-assets.nasa.gov/image/PIA25328/PIA25328~orig.jpg',
    category: 'Galaxies',
  },
  {
    nasa_id: 'PIA23122',
    title: 'First Image of Supermassive Black Hole M87*',
    description: 'The Event Horizon Telescope (EHT) captured the first direct visual evidence of a supermassive black hole and its shadow at the center of the giant elliptical galaxy Messier 87.',
    date_created: '2019-04-10',
    center: 'JPL',
    photographer: 'Event Horizon Telescope Collaboration',
    keywords: ['Black Hole', 'M87', 'Event Horizon', 'Relativity'],
    thumbUrl: 'https://images-assets.nasa.gov/image/PIA23122/PIA23122~thumb.jpg',
    highResUrl: 'https://images-assets.nasa.gov/image/PIA23122/PIA23122~orig.jpg',
    category: 'Black Holes',
  },
  {
    nasa_id: 'PIA25442',
    title: "Carina Nebula: 'Cosmic Cliffs' by Webb",
    description: 'This landscape of "mountains" and "valleys" speckled with glittering stars is actually the edge of a nearby, young, star-forming region called NGC 3324 in the Carina Nebula.',
    date_created: '2022-07-12',
    center: 'GSFC',
    photographer: 'NASA, ESA, CSA, STScI',
    keywords: ['Nebula', 'Carina', 'Star Formation', 'Infrared'],
    thumbUrl: 'https://images-assets.nasa.gov/image/PIA25442/PIA25442~thumb.jpg',
    highResUrl: 'https://images-assets.nasa.gov/image/PIA25442/PIA25442~orig.jpg',
    category: 'Nebulas',
  },
  {
    nasa_id: 'PIA21978',
    title: "Jupiter's Colorful Swirling Clouds Captured by Juno",
    description: "Dramatic atmospheric storm systems and swirling belts in Jupiter's northern hemisphere as captured by the JunoCam imager on NASA's Juno spacecraft.",
    date_created: '2018-05-24',
    center: 'JPL',
    photographer: 'NASA / JPL-Caltech / SwRI / MSSS / Gerald Eichstädt / Seán Doran',
    keywords: ['Jupiter', 'Juno', 'Planets', 'Atmosphere'],
    thumbUrl: 'https://images-assets.nasa.gov/image/PIA21978/PIA21978~thumb.jpg',
    highResUrl: 'https://images-assets.nasa.gov/image/PIA21978/PIA21978~orig.jpg',
    category: 'Planets',
  },
  {
    nasa_id: 'PIA19048',
    title: "Europa's Complex Linear Fractures and Chaos Terrain",
    description: "High-resolution color mosaic of Jupiter's ocean moon Europa, highlighting reddish non-ice mineral deposits along tectonic fractures and icy chaos plates.",
    date_created: '2014-11-21',
    center: 'JPL',
    photographer: 'NASA / JPL-Caltech / SETI Institute',
    keywords: ['Europa', 'Moons', 'Ice', 'Astrobiology'],
    thumbUrl: 'https://images-assets.nasa.gov/image/PIA19048/PIA19048~thumb.jpg',
    highResUrl: 'https://images-assets.nasa.gov/image/PIA19048/PIA19048~orig.jpg',
    category: 'Moons',
  },
  {
    nasa_id: 'PIA03654',
    title: "Saturn and Its Majestic Rings in True Color",
    description: "The Cassini spacecraft captured this sweeping natural-color panorama of the ringed planet Saturn during its orbital insertion mission.",
    date_created: '2004-10-06',
    center: 'JPL',
    photographer: 'NASA / JPL / Space Science Institute',
    keywords: ['Saturn', 'Rings', 'Solar System', 'Cassini'],
    thumbUrl: 'https://images-assets.nasa.gov/image/PIA03654/PIA03654~thumb.jpg',
    highResUrl: 'https://images-assets.nasa.gov/image/PIA03654/PIA03654~orig.jpg',
    category: 'Solar System',
  },
  {
    nasa_id: 'PIA22088',
    title: 'Interstellar Asteroid 1I/’Oumuamua Artist Concept',
    description: 'Artist rendering of interstellar asteroid 1I/2017 U1 (’Oumuamua) racing out of the Solar System after its perihelion passage.',
    date_created: '2017-11-20',
    center: 'JPL',
    photographer: 'European Southern Observatory / M. Kornmesser',
    keywords: ['Oumuamua', 'Interstellar', 'Deep Space'],
    thumbUrl: 'https://images-assets.nasa.gov/image/PIA22088/PIA22088~thumb.jpg',
    highResUrl: 'https://images-assets.nasa.gov/image/PIA22088/PIA22088~orig.jpg',
    category: 'Deep Space',
  },
  {
    nasa_id: 'PIA25501',
    title: 'DART Spacecraft Prior to Asteroid Impact',
    description: "NASA's Double Asteroid Redirection Test spacecraft captured this final stream of telemetry moments before impacting asteroid moonlet Dimorphos.",
    date_created: '2022-09-26',
    center: 'JPL',
    photographer: 'NASA / Johns Hopkins APL',
    keywords: ['DART', 'Spacecraft', 'Planetary Defense'],
    thumbUrl: 'https://images-assets.nasa.gov/image/PIA25501/PIA25501~thumb.jpg',
    highResUrl: 'https://images-assets.nasa.gov/image/PIA25501/PIA25501~orig.jpg',
    category: 'Spacecraft',
  },
];

export async function fetchGalleryItems(category: GalleryCategory = 'All', search?: string): Promise<GalleryItem[]> {
  const searchTerm = search
    ? search
    : category !== 'All'
    ? CATEGORY_SEARCH_TERMS[category] || category
    : 'space telescope hubble webb';

  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm)}&media_type=image&page_size=20`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const items = data?.collection?.items || [];

      if (Array.isArray(items) && items.length > 0) {
        const mappedItems: GalleryItem[] = [];

        for (const item of items) {
          const itemData = item.data?.[0];
          const links = item.links || [];
          if (!itemData) continue;

          // Find thumbnail link
          const thumbLink = links.find((l: any) => l.rel === 'preview' || l.render === 'image')?.href;
          if (!thumbLink) continue;

          // High res replacement if possible
          const highResUrl = thumbLink.replace('~thumb.', '~orig.').replace('~small.', '~orig.').replace('~medium.', '~orig.');

          mappedItems.push({
            nasa_id: itemData.nasa_id || 'nasa-' + Math.random().toString(36).substring(2, 8),
            title: itemData.title || 'Cosmic Observation',
            description: itemData.description || 'Scientific observation recorded by NASA space telescopes and planetary exploration probes.',
            date_created: itemData.date_created ? itemData.date_created.split('T')[0] : 'Recent',
            center: itemData.center || 'NASA',
            photographer: itemData.photographer || itemData.secondary_creator || 'NASA Science Mission',
            keywords: itemData.keywords || ['Space', 'Astronomy'],
            thumbUrl: thumbLink,
            highResUrl: highResUrl,
            category: category === 'All' ? 'Deep Space' : category,
          });
        }

        if (mappedItems.length > 0) {
          return mappedItems;
        }
      }
    }
  } catch (err) {
    console.warn('NASA Images API fetch failed, falling back to curated collection:', err);
  }

  // Fallback to curated collection
  if (category === 'All') {
    return CURATED_GALLERY_ITEMS;
  }
  return CURATED_GALLERY_ITEMS.filter(item => item.category === category);
}

export function getCuratedGallery(): GalleryItem[] {
  return CURATED_GALLERY_ITEMS;
}
