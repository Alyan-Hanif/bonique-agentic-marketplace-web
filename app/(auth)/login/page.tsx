"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getAccessToken, getAuthUser, postLoginPath, saveAuth, type AuthUser } from "@/lib/auth";
import { showToast } from "@/lib/toast";
import PasswordField from "@/components/PasswordField";

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    const user = getAuthUser();
    if (token && user) {
      router.replace(postLoginPath(user));
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      saveAuth(data.accessToken, data.user);
      showToast("Signed in", "success");
      router.push(postLoginPath(data.user));
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-stone-900">Sign in</h1>
          <p className="mt-2 text-sm text-stone-500">
            Shoppers go to their account. Brands go to the dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-lg border border-stone-200 bg-white p-8"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-stone-700"
            >
              Password
            </label>
            <PasswordField
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="border-stone-200 text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-stone-900 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          New here?{" "}
          <Link href="/register?as=shop" className="underline hover:text-stone-900">
            Join as shopper
          </Link>
          {" · "}
          <Link href="/register?as=sell" className="underline hover:text-stone-900">
            Sell as a brand
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-stone-400">
          Demo: shopper@bonique.test or admin@bonique.test / password123.{" "}
          <Link href="/discover" className="underline hover:text-stone-600">
            Back to shop
          </Link>
        </p>
      </div>
    </div>
  );
}
