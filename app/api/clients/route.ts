import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("company_name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { company_name, country, entity_type } = body as Record<string, unknown>;

  if (!company_name || typeof company_name !== "string" || !company_name.trim()) {
    return NextResponse.json({ error: "company_name is required" }, { status: 400 });
  }
  if (!country || typeof country !== "string" || !country.trim()) {
    return NextResponse.json({ error: "country is required" }, { status: 400 });
  }
  if (!entity_type || typeof entity_type !== "string" || !entity_type.trim()) {
    return NextResponse.json({ error: "entity_type is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({ company_name, country, entity_type })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
