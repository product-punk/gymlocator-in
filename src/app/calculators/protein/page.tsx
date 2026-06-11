import ProteinCalculator from './ProteinCalculator'

export const metadata = {
  title: 'Protein Intake Calculator for Gym - Daily Protein Requirements | Gymlocator.in',
  description: 'Calculate your daily protein intake for muscle gain, fat loss or maintenance. Get personalized recommendations based on your diet, workout level and fitness goals. Free protein calculator for gym-goers in India.',
  alternates: { canonical: 'https://gymlocator.in/calculators/protein' },
  robots: { index: true, follow: true },
}

// `bar` widths are static Tailwind classes scaled against the densest
// source (soya chunks, 52g/100g) so the grid doubles as a comparison chart.
const PROTEIN_FOODS = [
  { food: 'Dal (lentils)',     amount: '9g per 100g cooked', bar: 'w-[17%]' },
  { food: 'Paneer',             amount: '18g per 100g',       bar: 'w-[35%]' },
  { food: 'Chicken breast',     amount: '31g per 100g',       bar: 'w-[60%]' },
  { food: 'Eggs',               amount: '13g per 100g',       bar: 'w-[25%]' },
  { food: 'Curd (Greek-style)', amount: '10g per 100g',       bar: 'w-[19%]' },
  { food: 'Soya chunks',        amount: '52g per 100g dry',   bar: 'w-full'  },
  { food: 'Moong sprouts',      amount: '3g per 100g',        bar: 'w-[6%]'  },
  { food: 'Tofu',               amount: '8g per 100g',        bar: 'w-[15%]' },
]

const FAQS = [
  {
    q: 'How much protein per kg of body weight for muscle gain?',
    a: 'Research consensus puts the range at 1.6 to 2.2 grams per kilogram of bodyweight for active lifters chasing muscle gain. Untrained beginners can grow at the lower end. Intermediate and advanced lifters benefit from the upper end. Going beyond 2.2g per kg rarely produces additional gains and can stress the kidneys long-term if hydration is poor.',
  },
  {
    q: 'Is 100g of protein a day enough for gym?',
    a: 'It depends on your bodyweight. For a 50kg adult on a maintenance plan, yes. For an 80kg adult building muscle, no - that person needs 130 to 175g per day. The 100g number is a rough rule of thumb that under-serves anyone above 60kg with a serious training program. Use the calculator above to get a target tied to your actual weight and goal.',
  },
  {
    q: 'What is the best protein source for vegetarians in India?',
    a: 'Soya chunks lead the chart - 52g of protein per 100g dry weight, available at any grocery shop. Paneer (18g per 100g) and Greek-style curd (10g per 100g) deliver slow-digesting casein protein useful at night. Dal, tofu, sprouts and a daily whey supplement together cover most vegetarians comfortably. The combination matters more than any single source.',
  },
  {
    q: 'Should I take a protein supplement if I go to the gym?',
    a: 'Only if you cannot hit your daily target through whole food. Whey is convenient, well-absorbed and cheap per gram of protein, but it is not magic. Most Indian lifters under-eat protein because vegetarian meals fall short, and a daily shake closes the gap fast. If you already eat eggs, chicken, paneer and dal across your day, supplements may not be needed.',
  },
]

const TRUST_POINTS = [
  { icon: 'ti-bolt',          text: 'Personalised in seconds' },
  { icon: 'ti-salad',         text: 'Tuned for Indian meals' },
  { icon: 'ti-lock-open',     text: 'Free, no signup needed' },
  { icon: 'ti-microscope',    text: 'Based on research-backed ranges' },
]

export default function ProteinCalculatorPage() {
  return (
    <main className="min-h-screen bg-base">

      {/* HERO */}
      <div className="relative overflow-hidden bb-hair">
        <div
          aria-hidden
          className="hero-breathe absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_80%_at_50%_-10%,rgba(255,166,72,0.07),transparent_70%)]"
        />
        <div className="relative max-w-[1280px] mx-auto px-5 md:px-10 pt-16 md:pt-20 pb-12">
          <div className="label flex items-center gap-2 mb-4">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            Free AI-powered calculator
          </div>
          <h1 className="h1 max-w-[760px] bg-clip-text text-transparent bg-[linear-gradient(180deg,#FFFFFF_30%,#ABABAB)]">
            Protein intake calculator for gym-goers in India.
          </h1>
          <p className="text-[17px] text-accent mt-5 max-w-[640px] leading-relaxed">
            Get a personalized daily protein target based on your weight, training, diet and goals.
            Tuned for Indian meals - dal, paneer, eggs, roti and the rest.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {TRUST_POINTS.map((point) => (
              <span key={point.text} className="inline-flex items-center gap-2 text-[13px] text-accent">
                <i className={`ti ${point.icon} text-[15px]`} />
                {point.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CALCULATOR */}
      <ProteinCalculator />

      {/* SEO CONTENT */}
      <section className="bt-hair">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 space-y-14">

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface b-hair rounded-md p-6 md:p-8 hover:border-border-hi transition-colors">
              <span className="w-10 h-10 rounded-md bg-raised b-hair flex items-center justify-center mb-5">
                <i className="ti ti-target-arrow text-[18px] text-accent" />
              </span>
              <h2 className="text-[20px] font-bold text-text mb-3">
                What is the right protein intake for gym-goers?
              </h2>
              <p className="text-[15px] text-accent leading-relaxed">
                For most gym-goers in India, daily protein should sit at 1.6 to 2.2 grams per
                kilogram of bodyweight. This range covers both muscle gain and fat loss - more
                protein protects lean mass during a calorie deficit and supplies the building blocks
                required for hypertrophy in a surplus. A 70kg lifter targeting muscle growth should
                aim for 130 to 150g per day, split across three to four meals. The Indian diet can
                hit these numbers, but it requires conscious planning.
              </p>
            </div>

            <div className="bg-surface b-hair rounded-md p-6 md:p-8 hover:border-border-hi transition-colors">
              <span className="w-10 h-10 rounded-md bg-raised b-hair flex items-center justify-center mb-5">
                <i className="ti ti-chart-bar text-[18px] text-accent" />
              </span>
              <h2 className="text-[20px] font-bold text-text mb-3">
                How much protein do Indians typically get?
              </h2>
              <p className="text-[15px] text-accent leading-relaxed">
                Average protein intake across urban India is roughly 50g per day - well below what
                active gym-goers need. Vegetarians often fall further behind because dal-rice meals,
                while staple, only provide 10 to 15g of protein per serving. Closing the gap means
                adding paneer, curd, soya chunks, eggs (for ovo-vegetarians) or a whey supplement
                to most meals. The deficiency is structural, not unavoidable.
              </p>
            </div>
          </div>

          <div>
            <h2 className="h2 text-text mb-2">Protein-rich Indian foods</h2>
            <p className="text-[14px] text-accent mb-6">
              Protein density per 100g, compared against soya chunks - the densest everyday source.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PROTEIN_FOODS.map((item) => (
                <div
                  key={item.food}
                  className="bg-surface b-hair rounded-md p-4 hover:border-border-hi transition-colors"
                >
                  <div className="text-[14px] font-bold text-text mb-1">{item.food}</div>
                  <div className="text-[12px] text-accent">{item.amount}</div>
                  <div className="mt-3 h-1 rounded-full bg-raised overflow-hidden">
                    <div className={`h-full rounded-full bg-[linear-gradient(90deg,#8A8A8A,#F0F0F0)] ${item.bar}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="h2 text-text mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group bg-surface b-hair rounded-md overflow-hidden hover:border-border-hi transition-colors"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 text-[15px] font-bold text-text">
                    <span>{f.q}</span>
                    <i className="ti ti-plus text-[18px] text-accent flex-shrink-0 group-open:rotate-45 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 -mt-1 text-[14px] text-accent leading-relaxed">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}
