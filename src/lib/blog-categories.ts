export interface BlogCategory {
  label: string
  slug: string
  description: string
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    label: 'Supplements & Nutrition',
    slug: 'supplements-nutrition',
    description: 'Protein, creatine, mass gainers, pre/post-workout nutrition, gym diet plans.',
  },
  {
    label: 'Gym Equipment & Home Gym',
    slug: 'gym-equipment',
    description: 'Equipment guides, treadmills, dumbbells, home-gym setup & buying advice.',
  },
  {
    label: 'Bodybuilding & Muscle Building',
    slug: 'bodybuilding',
    description: 'Bulking, cutting, physique goals, muscle-group-specific training, bodybuilding nutrition.',
  },
  {
    label: 'Workouts & Training Plans',
    slug: 'workouts',
    description: 'Exercise routines, training splits, HIIT, calisthenics, full-body & muscle-group workout plans.',
  },
  {
    label: 'Weight Loss & Fat Loss',
    slug: 'weight-loss',
    description: 'Fat-loss workouts, cardio, calorie deficit guidance, weight-loss diet content.',
  },
  {
    label: 'Gym Membership & Pricing',
    slug: 'gym-membership',
    description: 'Membership costs, fee comparisons, what to expect when joining a gym.',
  },
  {
    label: 'Yoga, Pilates & Alternative Fitness',
    slug: 'yoga-pilates-alternatives',
    description: 'Yoga, Pilates, CrossFit, Zumba and gym-alternative workout content.',
  },
  {
    label: 'Personal Training & Trainer Careers',
    slug: 'personal-training',
    description: 'Hiring a trainer, certification paths, trainer costs, becoming a fitness coach.',
  },
  {
    label: 'Beginner Guides & Gym Basics',
    slug: 'gym-basics',
    description: 'First-day tips, gym etiquette, how to start, beginner-friendly explainers.',
  },
  {
    label: "Women's Fitness & Health",
    slug: 'womens-fitness',
    description: "Women-specific training, PCOS/hormonal fitness content, women-only gym content.",
  },
  {
    label: 'General Fitness / Other',
    slug: 'general-fitness',
    description: 'General fitness content covering a wide range of topics.',
  },
  {
    label: 'Injury, Recovery & Health',
    slug: 'injury-recovery',
    description: 'Injury prevention, recovery, soreness, stretching, gym-related health conditions.',
  },
]

export const CATEGORY_SLUGS = BLOG_CATEGORIES.map(c => c.slug)

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find(c => c.slug === slug)
}

export function getLabelFromSlug(slug: string): string {
  return BLOG_CATEGORIES.find(c => c.slug === slug)?.label ?? slug
}
