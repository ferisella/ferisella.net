// JSON-LD structured data shared across pages

export const SITE = 'https://ferisella.net';

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Fer Isella',
  url: SITE,
  jobTitle: 'Pianist, Music Producer, Entrepreneur',
  description:
    'Pianist, music producer, and co-founder of limbo/ — independent music distribution infrastructure. Latin Grammy-nominated. EarthPercent founding committee member with Brian Eno.',
  birthPlace: 'Buenos Aires, Argentina',
  nationality: 'Argentine',
  worksFor: {
    '@type': 'Organization',
    name: 'limbo/',
    url: 'https://limbomusic.com',
  },
  alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'Berklee College of Music' }],
  parent: {
    '@type': 'Person',
    name: 'César Isella',
    sameAs: [
      'https://es.wikipedia.org/wiki/C%C3%A9sar_Isella',
      'https://en.wikipedia.org/wiki/C%C3%A9sar_Isella',
    ],
  },
  award: [
    'Latin Grammy Nomination',
    'British Council Young Creative Entrepreneur of the Year (×2)',
    'Cannes Lions Grand Prix 2025 — Sounds Right',
  ],
  sameAs: [
    'https://www.linkedin.com/in/ferisella/',
    'https://www.instagram.com/ferisella/',
    'https://x.com/FerIsella',
    'https://open.spotify.com/artist/6JW8jw6N04Tdi0YTpGWcfx',
    'https://ferisella.bandcamp.com/',
    'https://www.youtube.com/@ferisella',
    'https://music.apple.com/es/artist/fer-isella/279282617',
  ],
};

interface ReleaseData {
  title: string;
  year: number;
  tag_es?: string;
  tag_en?: string;
  bandcamp_url?: string;
}

function releaseType(data: ReleaseData): string | undefined {
  const tag = (data.tag_en || data.tag_es || '').toLowerCase();
  if (tag.includes('album') || tag.includes('álbum')) return 'AlbumRelease';
  if (tag.includes('ep')) return 'EPRelease';
  if (tag.includes('single')) return 'SingleRelease';
  return undefined;
}

export function albumSchema(data: ReleaseData, pageUrl: string) {
  const type = releaseType(data);
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: data.title,
    datePublished: String(data.year),
    byArtist: { '@type': 'Person', name: 'Fer Isella', url: SITE },
    url: pageUrl,
    ...(type ? { albumReleaseType: `https://schema.org/${type}` } : {}),
    ...(data.bandcamp_url ? { sameAs: [data.bandcamp_url] } : {}),
  };
}
