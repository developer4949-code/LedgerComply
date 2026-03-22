import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const VALID_STATUSES = ["Pending", "In Progress", "Completed"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("client_id");

  if (!clientId) {
    return NextResponse.json({ error: "client_id query param is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("client_id", clientId)
    .order("due_date", { ascending: true });

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

  const { client_id, title, description, category, due_date, status, priority } =
    body as Record<string, unknown>;

  if (!client_id || typeof client_id !== "string") {
    return NextResponse.json({ error: "client_id is required" }, { status: 400 });
  }
  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!category || typeof category !== "string" || !category.trim()) {
    return NextResponse.json({ error: "category is required" }, { status: 400 });
  }
  if (!due_date || typeof due_date !== "string") {
    return NextResponse.json({ error: "due_date is required" }, { status: 400 });
  }
  if (status && !VALID_STATUSES.includes(status as string)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }
  if (priority && !VALID_PRIORITIES.includes(priority as string)) {
    return NextResponse.json(
      { error: `priority must be one of: ${VALID_PRIORITIES.join(", ")}` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      client_id,
      title: (title as string).trim(),
      description: typeof description === "string" ? description.trim() : "",
      category: (category as string).trim(),
      due_date,
      status: (status as string) || "Pending",
      priority: (priority as string) || "Medium",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
