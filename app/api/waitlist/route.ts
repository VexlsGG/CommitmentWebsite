import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
    const rawEmail = body?.email;

    if (typeof rawEmail !== "string" || rawEmail.trim().length === 0) {
      return NextResponse.json({ error: "Missing email." }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      // Postgres unique constraint violation
      if (error.code === "23505") {
        return NextResponse.json(
          { success: true, duplicate: true, message: "You're already on the waitlist." },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "Failed to save email.", details: error.message, code: error.code || undefined },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Success" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Unexpected server error.",
        details: e instanceof Error ? e.message : undefined
      },
      { status: 500 }
    );
  }
}

