import { NextResponse } from "next/server";

function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = body?.email;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  // Optional: forward to your backend / CRM / email provider.
  // Set these in Vercel Environment Variables (never hardcode secrets).
  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
  const webhookSecret = process.env.WAITLIST_WEBHOOK_SECRET;

  try {
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookSecret ? { Authorization: `Bearer ${webhookSecret}` } : {})
        },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return NextResponse.json(
          { error: "Failed to save email.", details: text || undefined },
          { status: 502 }
        );
      }
    } else {
      // No persistence configured: still respond success so the UI flow works.
      console.log("[waitlist] email captured:", email);
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Unexpected server error.", details: e instanceof Error ? e.message : undefined },
      { status: 500 }
    );
  }
}

