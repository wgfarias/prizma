import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const url = request.headers.get("referer") || request.url;
  const origin = new URL(url).origin;
  return NextResponse.redirect(origin, 302);
}
