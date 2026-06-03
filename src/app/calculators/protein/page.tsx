import ProteinCalculator from './ProteinCalculator'

export const metadata = {
  title: 'Protein Intake Calculator for Gym - Daily Protein Requirements | Gymlocator.in',
  description: 'Calculate your daily protein intake for muscle gain, fat loss or maintenance. Get personalized recommendations based on your diet, workout level and fitness goals. Free protein calculator for gym-goers in India.',
  alternates: { canonical: 'https://gymlocator.in/calculators/protein' },
  robots: { index: true, follow: true },
}

export default function ProteinCalculatorPage() {
  return <ProteinCalculator />
}
