'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type FormState = {
  weight: string
  height: string
  age: string
  gender: string
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

const BREAKFAST_CHIPS = [
  'Roti and sabzi', 'Poha', 'Upma', 'Idli', 'Dosa',
  'Paratha with curd', 'Eggs', 'Toast', 'Oats',
  'Protein shake', 'Fruits', 'Curd', 'Milk', 'Nothing',
]

const LUNCH_CHIPS = [
  'Dal rice', 'Roti dal sabzi', 'Chicken with rice',
  'Fish with rice', 'Paneer curry', 'Tofu curry',
  'Curd rice', 'Salad', 'Rajma chawal',
  'Chhole with roti', 'Outside food', 'Skipped',
]

const DINNER_CHIPS = [
  'Dal roti sabzi', 'Chicken curry', 'Mutton curry',
  'Fish curry', 'Paneer dish', 'Tofu dish',
  'Khichdi', 'Light salad', 'Soup', 'Same as lunch',
  'Outside food', 'Skipped',
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

const LOADING_MESSAGES = [
  'Analysing your diet...',
  'Calculating protein gaps...',
  'Checking your workout intensity...',
  'Preparing Indian food suggestions...',
  'Almost ready...',
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

const combineMeal = (chips: string[], custom: string) => {
  const parts = [...chips, custom.trim()].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Not specified'
}

export default function ProteinCalculator() {
  const [form, setForm] = useState<FormState>({
    weight: '',
    height: '',
    age: '',
    gender: 'Male',
    experience: EXPERIENCE_OPTIONS[0],
    condition: CONDITION_OPTIONS[0],
    goal: GOAL_OPTIONS[0],
  })

  const [breakfastChips, setBreakfastChips] = useState<string[]>([])
  const [breakfastCustom, setBreakfastCustom] = useState('')
  const [lunchChips, setLunchChips] = useState<string[]>([])
  const [lunchCustom, setLunchCustom] = useState('')
  const [dinnerChips, setDinnerChips] = useState<string[]>([])
  const [dinnerCustom, setDinnerCustom] = useState('')

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string>('')
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    if (!loading) {
      setMessageIndex(0)
      return
    }
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 2000)
    return () => clearInterval(id)
  }, [loading])

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleChip = (
    chips: string[],
    setChips: (v: string[]) => void,
    value: string,
  ) => {
    setChips(chips.includes(value) ? chips.filter((c) => c !== value) : [...chips, value])
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        breakfast: combineMeal(breakfastChips, breakfastCustom),
        lunch:     combineMeal(lunchChips, lunchCustom),
        dinner:    combineMeal(dinnerChips, dinnerCustom),
      }
      console.log('Sending payload:', payload)
      const res = await fetch('/api/protein-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      console.log('Client received:', data)
      if (!res.ok || data.error) {
        setError(data.error || 'API call failed: ' + res.status)
        return
      }
      setResult(data as Result)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
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
      <section className="max-w-[1280px] mx-auto px-5 md:px-10 py-12">
        <div className="grid md:grid-cols-3 gap-8">

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
        <div className="mt-12 bg-surface b-hair rounded-md p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
      </section>
    )
  }

  return (
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
        <h2 className="h2 text-text mb-2">Your typical day of eating</h2>
        <p className="text-[13px] text-accent mb-6">
          Tap everything you commonly eat. Add anything missing in the text box below each meal.
        </p>

        <div className="space-y-7">
          <MealBlock
            label="Breakfast"
            options={BREAKFAST_CHIPS}
            selected={breakfastChips}
            onToggle={(v) => toggleChip(breakfastChips, setBreakfastChips, v)}
            custom={breakfastCustom}
            onCustom={setBreakfastCustom}
          />

          <MealBlock
            label="Lunch"
            options={LUNCH_CHIPS}
            selected={lunchChips}
            onToggle={(v) => toggleChip(lunchChips, setLunchChips, v)}
            custom={lunchCustom}
            onCustom={setLunchCustom}
          />

          <MealBlock
            label="Dinner"
            options={DINNER_CHIPS}
            selected={dinnerChips}
            onToggle={(v) => toggleChip(dinnerChips, setDinnerChips, v)}
            custom={dinnerCustom}
            onCustom={setDinnerCustom}
          />
        </div>
      </div>

      {/* CTA / LOADING */}
      <div className="md:col-span-2">
        {error && (
          <div className="bg-red-950 border border-red-900 rounded-md p-4 mb-4 text-[13px] text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                <i className="ti ti-barbell text-[32px] text-accent" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-accent/40 animate-ping" />
            </div>

            <p className="text-[14px] text-accent transition-opacity duration-300">
              {LOADING_MESSAGES[messageIndex]}
            </p>

            <p className="text-[12px] text-accent opacity-60">
              GPT-4o-mini is reviewing your profile
            </p>
          </div>
        ) : (
          <>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-accent text-[#0C0C0C] font-bold text-[15px] py-4 rounded-sm hover:bg-text transition-colors"
            >
              <i className="ti ti-calculator text-[16px]" />
              Calculate my protein needs
            </button>
            <p className="text-[12px] text-accent text-center mt-3">
              Powered by AI nutrition analysis. Results are estimates, not medical advice.
            </p>
          </>
        )}
      </div>

    </form>
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

function MealBlock({
  label, options, selected, onToggle, custom, onCustom,
}: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
  custom: string
  onCustom: (v: string) => void
}) {
  return (
    <div>
      <div className="text-[14px] font-bold text-text mb-3">{label}</div>
      <div className="flex flex-wrap gap-2 mb-3">
        {options.map((o) => {
          const active = selected.includes(o)
          return (
            <button
              key={o}
              type="button"
              onClick={() => onToggle(o)}
              className={`text-[12px] px-3 py-1.5 rounded-full transition-colors ${
                active
                  ? 'bg-accent text-[#0C0C0C] font-bold'
                  : 'bg-surface b-hair text-accent hover:border-border-hi'
              }`}
            >
              {o}
            </button>
          )
        })}
      </div>
      <input
        type="text"
        value={custom}
        onChange={(e) => onCustom(e.target.value)}
        placeholder="Add something else (e.g. whey shake, sprouts chaat)"
        className={INPUT_CLASS}
      />
    </div>
  )
}
