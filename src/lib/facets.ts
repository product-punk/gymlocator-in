/**
 * Facet page config shared by the facet route (/gyms/[city]/[slug]),
 * navbar mega menu and footer. Full SEO copy lives with the route;
 * this holds the slug → label map and city availability.
 */
export const FACET_LABELS: Record<string, string> = {
  'women': 'Women-Only Gyms',
  'budget': 'Budget Gyms',
  'premium': 'Premium Gyms',
  'cardio': 'Cardio Gyms',
  'with-personal-trainer': 'Gyms with Personal Trainer',
  'with-swimming-pool': 'Gyms with Swimming Pool',
  'with-steam-sauna': 'Gyms with Steam & Sauna',
}

export const FACET_SLUGS = Object.keys(FACET_LABELS)
