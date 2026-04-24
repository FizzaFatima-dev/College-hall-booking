import { NextResponse } from "next/server";

const fallbackHalls = [
  { id: 1, name: "Seminar Hall 1", capacity: 80, available: true, updated_at: new Date().toISOString() },
  { id: 2, name: "Seminar Hall 2", capacity: 80, available: true, updated_at: new Date().toISOString() },
  { id: 3, name: "Main Auditorium", capacity: 300, available: false, updated_at: new Date().toISOString() },
];

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  // If Supabase is not configured, return fallback data
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ 
      data: fallbackHalls, 
      source: "fallback", 
      message: "Supabase env variables are not configured." 
    });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from("halls")
      .select("id,name,capacity,available,updated_at")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ 
        data: fallbackHalls, 
        source: "fallback", 
        error: error.message 
      }, { status: 200 });
    }

    return NextResponse.json({ 
      data: data ?? fallbackHalls, 
      source: "supabase" 
    });
  } catch {
    return NextResponse.json({ 
      data: fallbackHalls, 
      source: "fallback", 
      error: "Failed to connect to Supabase" 
    }, { status: 200 });
  }
}

