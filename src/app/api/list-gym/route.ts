import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      gym_name, owner_name, phone,
      email, city, locality,
      address, website, message
    } = body

    if (!gym_name || !owner_name || !phone || !city) {
      return NextResponse.json(
        { error: 'Gym name, owner name, phone and city are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase
      .from('gym_submissions')
      .insert({
        gym_name, owner_name, phone,
        email: email || null,
        city, locality: locality || null,
        address: address || null,
        website: website || null,
        message: message || null,
      })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('List gym error:', err)
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}
