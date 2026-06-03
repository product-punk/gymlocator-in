'use client'

import Link from 'next/link'
import { useState } from 'react'

type FormState = {
  weight: string
  height: string
  age: string
  gender: string
  breakfast: string
  lunch: string
  dinner: string
  experience: string
  condition: string
  goal: string
}

type MealSuggestion = {
  meal: string
  suggestion: string
  protein_grams: number
}

type Result = {
  daily_protein_grams: number
  per_kg_ratio: number
  current_estimate_grams: number
  protein_gap_grams: number
  verdict: string
  summary: string
  meal_suggestions: MealSuggestion[]
  top_tips: string[]
  warning: string
}

const BREAKFAST_OPTIONS = [
  'Roti and sabzi',
  'Poha or upma',
  'Idli or dosa',
  'Paratha with curd',
  'Eggs and toast',
  'Oats or muesli',
  'Protein shake',
  'Nothing (skip breakfast)',
]

const LUNCH_OPTIONS = [
  'Dal rice',
  'Roti dal sabzi',
  'Chicken or fish with rice',
  'Paneer or tofu curry',
  'Curd rice',
  'Salad only',
  'Outside food (restaurant or canteen)',
]

const DINNER_OPTIONS = [
  'Dal roti sabzi',
  'Chicken or mutton curry with roti',
  'Fish curry with rice',
  'Paneer or tofu dish',
  'Light salad or soup',
  'Same as lunch',
  'Outside food',
]

const EXPERIENCE_OPTIONS = [
  'Just starting out (0-6 months)',
  'Beginner (6 months to 1 year)',
  'Intermediate (1 to 3 years)',
  'Advanced (3 to 5 years)',
  'Experienced (5+ years)',
]

const CONDITION_OPTIONS = [
  'Not working out right now',
  'Light workouts 1-2 days a week',
  'Moderate workouts 3-4 days a week',
  'Heavy training 5-6 days a week',
  'Athlete level daily training',
]

const GOAL_OPTIONS = [
  'Build muscle and gain mass',
  'Lose fat and get lean',
  'Maintain current physique',
  'Improve overall fitness and health',
  'Athletic performance',
]

const INPUT_CLASS = 'w-full bg-raised b-hair rounded-sm px-3 py-2.5 text-[14px] text-text placeholder:text-accent outline-none focus:border-border-hi transition-colors'

const verdictStyle = (verdict: string) => {
  const v = verdict.toLowerCase()
  if (v.includes('on track'))      return 'bg-green-900 text-green-300'
  if (v.includes('slightly'))      return 'bg-yellow-900 text-yellow-300'
  if (v.includes('significantly')) return 'bg-orange-900 text-orange-300'
  if (v.includes('too low'))       return 'bg-red-900 text-red-300'
  return 'bg-surface text-accent'
}

export default function ProteinCalculator() {
  const [form, setForm] = useState<FormState>({
    weight: '',
    height: '',
    age: '',
    gender: 'Male',
    breakfast: BREAKFAST_OPTIONS[0],
    lunch: LUNCH_OPTIONS[0],
    dinner: DINNER_OPTIONS[0],
    experience: EXPERIENCE_OPTIONS[0],
    condition: CONDITION_OPTIONS[0],
    goal: GOAL_OPTIONS[0],
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string>('')

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/protein-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Calculation failed')
      const data: Result = await res.json()
      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError('')
  }

  if (result) {
    return (
      <main className="min-h-screen bg-base">

        {/* HEADER */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-16 pb-10 bb-hair">
          <div className="label !text-accent mb-4">Your protein plan</div>
          <h1 className="h1 text-text max-w-[640px]">
            Here is what your body actually needs.
          </h1>
        </div>

        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-12 grid md:grid-cols-3 gap-8">

          {/* LEFT - HEADLINE NUMBER */}
          <div className="md:col-span-1">
            <div className="bg-surface b-hair rounded-md p-8 text-center">
              <div className="label !text-accent mb-3">Daily target</div>
              <div className="text-[64px] font-black tracking-tight text-text leading-none">
                {result.daily_protein_grams}
                <span className="text-[20px] font-bold text-accent ml-1">g/day</span>
              </div>
              <div className="text-[13px] text-accent mt-3">
                {result.per_kg_ratio}g per kg of body weight
              </div>
              <div className={`inline-block mt-5 px-3 py-1.5 rounded-sm text-[12px] font-bold uppercase tracking-[0.08em] ${verdictStyle(result.verdict)}`}>
                {result.verdict}
              </div>
            </div>

            <div className="bg-surface b-hair rounded-md p-5 mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-accent">Current estimate</span>
                <span className="text-[14px] font-bold text-text">
                  {result.current_estimate_grams}g
                </span>
              </div>
              <div className="bt-hair pt-3 flex items-center justify-between">
                <span className="text-[13px] text-accent">Protein gap</span>
                <span className="text-[14px] font-bold text-text">
                  {result.protein_gap_grams}g
                </span>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 mt-4 bg-surface b-hair text-text font-bold text-[13px] py-3 rounded-sm hover:border-border-hi transition-colors"
            >
              <i className="ti ti-refresh text-[14px]" />
              Recalculate
            </button>
          </div>

          {/* RIGHT - DETAILS */}
          <div className="md:col-span-2 space-y-6">

            <div className="bg-surface b-hair rounded-md p-6">
              <h2 className="text-[16px] font-bold text-text mb-3">Summary</h2>
              <p className="text-[14px] text-accent leading-relaxed">{result.summary}</p>
            </div>

            {result.warning && (
              <div className="bg-red-950 border border-red-900 rounded-md p-5 flex items-start gap-3">
                <i className="ti ti-alert-triangle text-[20px] text-red-300 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[13px] font-bold text-red-300 mb-1">Important</div>
                  <p className="text-[13px] text-red-200 leading-relaxed">{result.warning}</p>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-[16px] font-bold text-text mb-3">Meal suggestions</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.meal_suggestions.map((m, i) => (
                  <div key={i} className="bg-surface b-hair rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="label !text-accent">{m.meal}</span>
                      <span className="text-[12px] font-bold bg-accent-dim text-accent px-2 py-0.5 rounded-sm">
                        +{m.protein_grams}g
                      </span>
                    </div>
                    <p className="text-[13px] text-text leading-relaxed">{m.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface b-hair rounded-md p-6">
              <h2 className="text-[16px] font-bold text-text mb-3">Top tips for you</h2>
              <ul className="space-y-3">
                {result.top_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-accent leading-relaxed">
                    <i className="ti ti-check text-[16px] text-text flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16">
          <div className="bg-surface b-hair rounded-md p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="h2 text-text mb-2">Ready to find a gym that fits your goals?</h2>
              <p className="text-[15px] text-accent">
                Browse top-rated gyms across India with real pricing and Google ratings.
              </p>
            </div>
            <Link
              href="/cities"
              className="inline-flex items-center gap-2 bg-accent text-[#0C0C0C] font-bold text-[14px] px-6 py-3 rounded-sm hover:bg-text transition-colors flex-shrink-0"
            >
              Browse gyms by city
              <i className="ti ti-arrow-right text-[14px]" />
            </Link>
          </div>
        </div>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-base">

      {/* HERO */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-16 pb-12 bb-hair">
        <div className="label !text-accent mb-4">Free calculator</div>
        <h1 className="h1 text-text max-w-[700px]">
          Protein intake calculator for gym-goers in India.
        </h1>
        <p className="text-[17px] text-accent mt-5 max-w-[620px] leading-relaxed">
          Get a personalized daily protein target based on your weight, training, diet and goals.
          Tuned for Indian meals - dal, paneer, eggs, roti and the rest.
        </p>
      </div>

      <form onSubmit={submit} className="max-w-[1280px] mx-auto px-5 md:px-10 py-12 grid md:grid-cols-2 gap-6">

        {/* PERSONAL */}
        <div className="bg-surface b-hair rounded-md p-6">
          <h2 className="h2 text-text mb-5">About you</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Weight (kg)">
                <input
                  type="number"
                  min="20"
                  max="250"
                  required
                  value={form.weight}
                  onChange={(e) => update('weight', e.target.value)}
                  placeholder="e.g. 72"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Height (cm)">
                <input
                  type="number"
                  min="100"
                  max="230"
                  required
                  value={form.height}
                  onChange={(e) => update('height', e.target.value)}
                  placeholder="e.g. 175"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Age">
                <input
                  type="number"
                  min="13"
                  max="100"
                  required
                  value={form.age}
                  onChange={(e) => update('age', e.target.value)}
                  placeholder="e.g. 28"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Gender">
                <select
                  value={form.gender}
                  onChange={(e) => update('gender', e.target.value)}
                  className={INPUT_CLASS}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </Field>
            </div>
          </div>
        </div>

        {/* FITNESS */}
        <div className="bg-surface b-hair rounded-md p-6">
          <h2 className="h2 text-text mb-5">Your training</h2>
          <div className="space-y-4">
            <Field label="Years of experience working out">
              <select
                value={form.experience}
                onChange={(e) => update('experience', e.target.value)}
                className={INPUT_CLASS}
              >
                {EXPERIENCE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Current workout condition">
              <select
                value={form.condition}
                onChange={(e) => update('condition', e.target.value)}
                className={INPUT_CLASS}
              >
                {CONDITION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Primary fitness goal">
              <select
                value={form.goal}
                onChange={(e) => update('goal', e.target.value)}
                className={INPUT_CLASS}
              >
                {GOAL_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* DIET */}
        <div className="bg-surface b-hair rounded-md p-6 md:col-span-2">
          <h2 className="h2 text-text mb-5">Your typical day of eating</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Breakfast">
              <select
                value={form.breakfast}
                onChange={(e) => update('breakfast', e.target.value)}
                className={INPUT_CLASS}
              >
                {BREAKFAST_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Lunch">
              <select
                value={form.lunch}
                onChange={(e) => update('lunch', e.target.value)}
                className={INPUT_CLASS}
              >
                {LUNCH_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Dinner">
              <select
                value={form.dinner}
                onChange={(e) => update('dinner', e.target.value)}
                className={INPUT_CLASS}
              >
                {DINNER_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* CTA */}
        <div className="md:col-span-2">
          {error && (
            <div className="bg-red-950 border border-red-900 rounded-md p-4 mb-4 text-[13px] text-red-200">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-accent text-[#0C0C0C] font-bold text-[15px] py-4 rounded-sm hover:bg-text transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-[#0C0C0C] border-t-transparent rounded-full animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <i className="ti ti-calculator text-[16px]" />
                Calculate my protein needs
              </>
            )}
          </button>
          <p className="text-[12px] text-accent text-center mt-3">
            Powered by AI nutrition analysis. Results are estimates, not medical advice.
          </p>
        </div>

      </form>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-accent mb-1.5">{label}</label>
      {children}
    </div>
  )
}
