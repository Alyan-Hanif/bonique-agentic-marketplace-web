"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { postLoginPath, saveAuth, type AuthUser } from "@/lib/auth";
import { showToast } from "@/lib/toast";
import PasswordField from "@/components/PasswordField";

interface RegisterResponse {
  accessToken: string;
  user: AuthUser;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const asParam = searchParams.get("as") ?? "shop";
  const isSeller = asParam === "sell" || asParam === "seller";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  const title = isSeller ? "Open a brand account" : "Join Bonique";
  const subtitle = isSeller
    ? "Create your store to list products and connect Shopify."
    : "Save your size profile and start building a wardrobe.";

  const accountType = useMemo(
    () => (isSeller ? "seller" : "buyer"),
    [isSeller],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body: Record<string, string> = {
        accountType,
        email,
        password,
      };
      if (username.trim()) body.username = username.trim();
      if (displayName.trim()) body.displayName = displayName.trim();
      if (isSeller) body.businessName = businessName.trim();

      const data = await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
      saveAuth(data.accessToken, data.user);
      showToast(isSeller ? "Brand account created" : "Account created", "success");
      router.push(postLoginPath(data.user));
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="flex rounded-full border border-neutral-200 bg-neutral-50 p-1 text-sm">
        <Link
          href="/register?as=shop"
          className={`flex-1 rounded-full py-2 text-center font-medium ${
            !isSeller ? "bg-black text-white" : "text-neutral-600"
          }`}
        >
          Shop
        </Link>
        <Link
          href="/register?as=sell"
          className={`flex-1 rounded-full py-2 text-center font-medium ${
            isSeller ? "bg-black text-white" : "text-neutral-600"
          }`}
        >
          Sell
        </Link>
      </div>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-black">
        {title}
      </h1>
      <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {isSeller && (
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium">
              Brand name
            </label>
            <input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none"
              placeholder="Your brand"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <PasswordField
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="border-neutral-200 focus:border-neutral-400 focus:outline-none"
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username <span className="text-neutral-400">(optional)</span>
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none"
            placeholder="your_name"
          />
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium">
            Display name <span className="text-neutral-400">(optional)</span>
          </label>
          <input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none"
            placeholder={isSeller ? "Brand contact name" : "How you appear"}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-black py-3 text-sm font-medium uppercase tracking-wider text-white hover:bg-neutral-800 disabled:opacity-70"
        >
          {loading ? "Creating account..." : isSeller ? "Create store" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="underline hover:text-black">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-sm text-neutral-500">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
