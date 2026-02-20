import { supabase } from "../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const { error } = await supabase.from("survey_responses").insert({
      whop_user_id: body.whop_user_id,
      whop_username: body.whop_username,
      whop_email: body.whop_email,
      sports: body.sports,
      frequency: body.frequency,
      experience: body.experience,
      avg_bet_size: body.avg_bet_size,
      bet_types: body.bet_types,
      priority: body.priority,
      state: body.state,
      recommended_tier: body.recommended_tier,
      chalkboard_eligible: body.chalkboard_eligible,
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
