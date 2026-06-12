// OPENAI_API_KEY setup:
// Local: add to .env.local -> OPENAI_API_KEY=sk-...
// Production: Netlify -> Site settings ->
//   Environment variables -> OPENAI_API_KEY=sk-...
// Get key from: https://platform.openai.com/api-keys
// Model: gpt-4o-mini (cost-efficient, fast)
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('API hit — body received:', JSON.stringify(body).slice(0, 200))

    console.log('API key present:', !!process.env.OPENAI_API_KEY)
    console.log('API key prefix:', process.env.OPENAI_API_KEY?.slice(0, 7))

    const {
      weight, height, age, gender,
      breakfast, lunch, dinner,
      experience, condition, goal,
    } = body

    const payload = { weight, height, age, gender, breakfast, lunch, dinner, experience, condition, goal }
    console.log('Sending payload to OpenAI:', JSON.stringify(payload).slice(0, 300))

    const systemPrompt = `You are a certified sports nutritionist specializing in Indian fitness and diet. You produce personalized daily protein recommendations as strict JSON.

CALCULATION RULES
- Pick per_kg_ratio from these research-backed ranges based on training load:
  - Not working out: 0.8-1.0 g/kg
  - Light workouts 1-2 days/week: 1.2-1.4 g/kg
  - Moderate workouts 3-4 days/week: 1.4-1.8 g/kg
  - Heavy training 5-6 days/week or athlete-level: 1.6-2.2 g/kg
- Adjust within the range for the goal: muscle gain and fat loss sit at the upper end (fat loss for heavy trainers may reach 2.4 g/kg); maintenance and general fitness sit mid-range. Never exceed 2.5 g/kg.
- daily_protein_grams = per_kg_ratio x weight in kg, rounded to the nearest 5g.
- protein_gap_grams = daily_protein_grams - current_estimate_grams, rounded to the nearest 5g (negative means surplus).

DIET ESTIMATION RULES
Estimate current_estimate_grams only from the meals listed, assuming one standard portion per item unless a quantity is given. Reference values per portion:
- Dal rice / rajma chawal / chhole with roti plate: 12-16g; roti dal sabzi plate: 10-14g
- Paneer curry or dish (100g paneer): 16-18g; tofu dish (100g): 8-10g
- Chicken with rice or chicken curry (150g): 30-35g; fish (150g): 25-30g; mutton (150g): 25-28g
- 2 eggs: 12g; poha / upma / idli / dosa serving: 4-6g; paratha with curd: 8-10g; toast or fruits: 2-4g; oats bowl: 6-8g
- Curd bowl: 5-8g; curd rice: 7-9g; glass of milk: 8g; whey or protein shake (1 scoop): 24g
- Khichdi: 8-10g; soup or light salad: 3-6g; moong sprouts bowl: 6-8g
- "Outside food": assume 12-15g per meal. "Skipped" or "Nothing": 0g.
Sum across breakfast, lunch and dinner. Do not credit foods that are not listed.

CONSISTENCY RULES
- verdict must match the gap as a share of the target: "on track" if gap <= 10%, "slightly low" if 10-25%, "significantly low" if 25-50%, "too low" if above 50%.
- Return exactly 3-4 meal_suggestions covering different meals or snacks. Their protein_grams should together roughly close the gap (within ~20%). If the gap is zero or negative, suggest quality swaps with small protein_grams values.
- Respect the eating pattern shown: if every listed food is vegetarian, suggest only vegetarian foods (include eggs only if eggs appear in their meals). Suggestions must be common Indian foods with realistic portions.
- Each top_tip must be actionable and name a specific food, quantity or habit: tip 1 tailored to their situation, tip 2 to their goal, tip 3 to their diet gaps.
- summary is 2-3 sentences, specific to their numbers; mention portion assumptions if their meal descriptions were vague.

SAFETY RULES
- If age is under 16, weight is under 35kg, or inputs look implausible, keep recommendations conservative and explain why in "warning".
- Use "warning" only for genuinely important flags (very low current intake, aggressive deficit, hydration/kidney caution above 2.2 g/kg, or implausible inputs); otherwise return an empty string.

Respond with JSON only, exactly matching the schema in the user message. No extra text.`

    const prompt = `Profile:
- Weight: ${weight}kg, Height: ${height}cm, Age: ${age}, Gender: ${gender}
- Breakfast: ${breakfast}
- Lunch: ${lunch}
- Dinner: ${dinner}
- Workout experience: ${experience}
- Current training: ${condition}
- Goal: ${goal}

Respond in this exact JSON format only, no extra text:
{
  "daily_protein_grams": number,
  "per_kg_ratio": number,
  "current_estimate_grams": number,
  "protein_gap_grams": number,
  "verdict": "one of: on track / slightly low / significantly low / too low",
  "summary": "2-3 sentences explaining their current situation and what they need",
  "meal_suggestions": [
    {
      "meal": "breakfast/lunch/dinner/snack",
      "suggestion": "specific Indian food suggestion to boost protein",
      "protein_grams": number
    }
  ],
  "top_tips": [
    "tip 1 specific to their situation",
    "tip 2 specific to their goal",
    "tip 3 about their diet gaps"
  ],
  "warning": "optional - only include if there is something important to flag, otherwise empty string"
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 900,
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    })

    console.log('OpenAI status:', response.status)

    if (!response.ok) {
      const errText = await response.text()
      console.error('OpenAI error body:', errText)
      return NextResponse.json({ error: errText }, { status: response.status })
    }

    const data = await response.json()
    console.log('OpenAI response received')

    const content = data.choices?.[0]?.message?.content
    console.log('Content preview:', content?.slice(0, 200))

    const result = JSON.parse(content)
    return NextResponse.json(result)

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Route error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
