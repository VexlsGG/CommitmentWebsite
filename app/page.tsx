"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

function isValidEmail(email: string) {
  // Simple RFC-5322-ish check, good enough for UI validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => isValidEmail(email), [email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setStatus("error");
      setError("Please enter a valid email.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = (await res.json().catch(() => null)) as { message?: string; error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <main className="min-h-dvh bg-[#ECECEC]">
      {/* Hidden reference asset (requested) */}
      <img src="/assets/FinalImage.svg" alt="" className="sr-only" />

      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 lg:h-[1024px] lg:px-0 lg:py-0">
        <div className="relative flex flex-col items-center gap-10 lg:block lg:h-full">
          {/* Left content */}
          <div className="w-full max-w-[640px] lg:absolute lg:left-[168px] lg:top-[178px] lg:max-w-[620px]">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/CommitLogo.png"
                alt="Commitment"
                width={67}
                height={67}
                priority
                className="h-[67px] w-[67px]"
              />
              <p className="text-[40px] font-semibold tracking-[-0.02em] text-black">Commitment</p>
            </div>

            <h1 className="mt-16 text-balance text-[56px] font-extrabold leading-[1.04] tracking-[-0.02em] text-black sm:text-[64px] lg:mt-[92px]">
              Not your average habit <br className="hidden lg:block" />
              tracker app.
            </h1>

            <p className="mt-6 max-w-[560px] text-pretty text-[20px] leading-[1.35] tracking-[-0.01em] text-black/85 sm:text-[22px]">
              Commitment logs your habits like commits, so staying consistent is effortless.
            </p>

            <form onSubmit={onSubmit} className="mt-10 max-w-[560px]">
              <div className="flex h-16 w-full overflow-hidden rounded-[18px] border border-black/60 bg-white">
                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "submitting" || status === "success"}
                  className="h-full flex-1 bg-transparent px-6 text-[22px] text-black placeholder:text-[#C9C9C9] outline-none"
                />

                <button
                  type="submit"
                  disabled={!canSubmit || status === "submitting" || status === "success"}
                  className="h-full w-[210px] border-l border-black/60 bg-[#0A66D7] text-[22px] font-medium text-white disabled:opacity-70"
                >
                  Join waitlist
                </button>
              </div>

              <div className="mt-4 min-h-[28px] text-[18px]">
                {status === "success" ? (
                  <p className="text-black/60">You’re on the waitlist.</p>
                ) : error ? (
                  <p className="text-red-600">{error}</p>
                ) : (
                  <span className="sr-only">Submit your email to join the waitlist.</span>
                )}
              </div>
            </form>

            <div className="mt-2">
              <a
                href="https://x.com/vexlsgg"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[22px] font-medium text-[#B8B8B8]"
              >
                Follow @vexlsgg for updates!
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-70"
                >
                  <path
                    d="M14 3h7v7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 14L21 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Right phone hero */}
          <div className="w-full max-w-[420px] lg:absolute lg:left-[850px] lg:top-[52px] lg:w-[450px] lg:max-w-none">
            <img
              src="/assets/Phone.svg"
              alt="Commitment app preview on a phone"
              className="w-full select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

