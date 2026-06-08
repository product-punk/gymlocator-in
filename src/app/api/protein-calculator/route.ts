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

    const prompt = `You are a certified sports nutritionist specializing in Indian fitness and diet. Analyze this person's profile and give personalized protein recommendations.

Profile:
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
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.3,
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
