// Edit this file to re-label the entire site. Header, Footer, the homepage
// and SEO defaults all read from here instead of hardcoding copy.
export const SITE = {
  name: 'Guillermo Fuentes Quijada',
  role: 'Head of Engineering',
  email: 'guillermofuentesquijada@gmail.com',
  tagline: 'I build engineering organizations that ship platforms at scale.',
  description:
    'Head of Engineering with 10+ years across platform modernization, AI-enabled development and product transformation — leading 60+ engineers across 9 teams at Buk.',
  status: 'Head of Engineering at Buk · remote from Spain',
  social: [
    { label: 'GitHub', href: 'https://github.com/guillermofuentesgfq' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/guillermofuentesquijada' },
    { label: 'Scholar', href: 'https://scholar.google.com/citations?user=KdKFukoAAAAJ' },
  ],
  locale: 'en',
} as const;

// Las URL llevan barra final a propósito. Astro emite `about/index.html`, el
// sitemap y los `rel="canonical"` usan `/about/`, y `html_handling:
// "auto-trailing-slash"` en wrangler.jsonc sirve esa forma y redirige la otra.
// Escribir `/about` en los enlaces internos convertiría cada clic del sitio en
// un 301 de más.
export const NAV_LINKS = [
  { label: 'Work', href: '/work/' },
  { label: 'Publications', href: '/publications/' },
  { label: 'About', href: '/about/' },
] as const;