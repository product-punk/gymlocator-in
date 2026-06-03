// Requires OPENAI_API_KEY in .env.local (local) and Netlify environment variables (prod).
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    weight, height, age, gender,
    breakfast, lunch, dinner,
    experience, condition, goal,
  } = body

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

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to get recommendation' }, { status: 500 })
  }

  const data = await response.json()
  const result = JSON.parse(data.choices[0].message.content)

  return NextResponse.json(result)
}
