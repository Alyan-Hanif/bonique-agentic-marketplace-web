"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import {
  authHeaders,
  clearAuth,
  getAccessToken,
  isSeller,
  saveAuth,
  type AuthUser,
} from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ConfirmModal from "@/components/ConfirmModal";
import { showToast } from "@/lib/toast";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());
  const [loading, setLoading] = useState(() => !getAuthUser());
  const [error, setError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSize, setSavingSize] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const [displayName, setDisplayName] = useState(() => getAuthUser()?.displayName ?? "");
  const [username, setUsername] = useState(() => getAuthUser()?.username ?? "");
  const [bio, setBio] = useState(() => getAuthUser()?.bio ?? "");
  const [heightCm, setHeightCm] = useState(() => getAuthUser()?.sizeProfile?.heightCm?.toString() ?? "");
  const [weightKg, setWeightKg] = useState(() => getAuthUser()?.sizeProfile?.weightKg?.toString() ?? "");
  const [chestCm, setChestCm] = useState(() => getAuthUser()?.sizeProfile?.chestCm?.toString() ?? "");
  const [waistCm, setWaistCm] = useState(() => getAuthUser()?.sizeProfile?.waistCm?.toString() ?? "");
  const [hipCm, setHipCm] = useState(() => getAuthUser()?.sizeProfile?.hipCm?.toString() ?? "");
  const [shoeSize, setShoeSize] = useState(() => getAuthUser()?.sizeProfile?.shoeSize ?? "");
  const [preferredFit, setPreferredFit] = useState(() => getAuthUser()?.sizeProfile?.preferredFit ?? "");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    apiFetch<AuthUser>("/auth/me", { headers: authHeaders() })
      .then((me) => {
        if (cancelled) return;
        const tokenNow = getAccessToken();
        if (tokenNow) saveAuth(tokenNow, me);
        setUser(me);
        setDisplayName(me.displayName ?? "");
        setUsername(me.username ?? "");
        setBio(me.bio ?? "");
        setHeightCm(me.sizeProfile?.heightCm?.toString() ?? "");
        setWeightKg(me.sizeProfile?.weightKg?.toString() ?? "");
        setChestCm(me.sizeProfile?.chestCm?.toString() ?? "");
        setWaistCm(me.sizeProfile?.waistCm?.toString() ?? "");
        setHipCm(me.sizeProfile?.hipCm?.toString() ?? "");
        setShoeSize(me.sizeProfile?.shoeSize ?? "");
        setPreferredFit(me.sizeProfile?.preferredFit ?? "");
      })
      .catch((err: Error) => {
        if (cancelled) return;
        if (err.message.toLowerCase().includes("unauthorized") || err.message.includes("401")) {
          clearAuth();
          router.replace("/login");
          return;
        }
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const applyUser = (me: AuthUser) => {
    const token = getAccessToken();
    if (token) saveAuth(token, me);
    setUser(me);
  };

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const me = await apiFetch<AuthUser>("/auth/me", {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({
          username: username.trim(),
          displayName: displayName.trim(),
          bio: bio.trim(),
        }),
      });
      applyUser(me);
      showToast("Profile saved", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not save profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const saveSize = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSize(true);
    try {
      const body: Record<string, string | number> = {};
      if (heightCm) body.heightCm = Number(heightCm);
      if (weightKg) body.weightKg = Number(weightKg);
      if (chestCm) body.chestCm = Number(chestCm);
      if (waistCm) body.waistCm = Number(waistCm);
      if (hipCm) body.hipCm = Number(hipCm);
      if (shoeSize.trim()) body.shoeSize = shoeSize.trim();
      if (preferredFit) body.preferredFit = preferredFit;

      const me = await apiFetch<AuthUser>("/auth/me/size-profile", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      applyUser(me);
      showToast("Size profile saved", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not save size profile", "error");
    } finally {
      setSavingSize(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading account..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!user) return null;

  const seller = isSeller(user);
  const fieldClass =
    "mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none";

  return (
    <div className={seller ? "mx-auto max-w-3xl" : "page-shell-narrow"}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            {seller ? "Brand account" : "Your account"}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {user.displayName || user.username || user.email}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {user.email}
            {user.username ? ` · @${user.username}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {seller ? (
            <>
              <Link href="/dashboard" className="rounded-full border border-neutral-300 px-4 py-2 hover:border-black">
                Dashboard
              </Link>
              <Link href="/dashboard/orders" className="rounded-full border border-neutral-300 px-4 py-2 hover:border-black">
                Orders
              </Link>
              <Link href="/connect" className="rounded-full border border-neutral-300 px-4 py-2 hover:border-black">
                Connect store
              </Link>
            </>
          ) : (
            <>
              {user.username && (
                <Link href={`/u/${user.username}`} className="rounded-full border border-neutral-300 px-4 py-2 hover:border-black">
                  Public profile
                </Link>
              )}
              <Link href="/wardrobe" className="rounded-full border border-neutral-300 px-4 py-2 hover:border-black">
                Wardrobe
              </Link>
              <Link href="/orders" className="rounded-full border border-neutral-300 px-4 py-2 hover:border-black">
                Orders
              </Link>
              <button
                type="button"
                onClick={() => setConfirmSignOut(true)}
                className="rounded-full border border-neutral-300 px-4 py-2 hover:border-black"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>

      <form onSubmit={saveProfile} className="mt-10 space-y-4 border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="displayName" className="text-sm font-medium">
              Display name
            </label>
            <input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={fieldClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="bio" className="text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={280}
            className={fieldClass}
          />
        </div>
        <button
          type="submit"
          disabled={savingProfile}
          className="rounded-full bg-black px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-white disabled:opacity-70"
        >
          {savingProfile ? "Saving..." : "Save profile"}
        </button>
      </form>

      {!seller && (
      <form onSubmit={saveSize} className="mt-10 space-y-4 border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-semibold">Size profile</h2>
        <p className="text-sm text-neutral-500">
          Used later for wardrobe fit and the AI stylist.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="heightCm" className="text-sm font-medium">
              Height (cm)
            </label>
            <input
              id="heightCm"
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="weightKg" className="text-sm font-medium">
              Weight (kg)
            </label>
            <input
              id="weightKg"
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="chestCm" className="text-sm font-medium">
              Chest (cm)
            </label>
            <input
              id="chestCm"
              type="number"
              value={chestCm}
              onChange={(e) => setChestCm(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="waistCm" className="text-sm font-medium">
              Waist (cm)
            </label>
            <input
              id="waistCm"
              type="number"
              value={waistCm}
              onChange={(e) => setWaistCm(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="hipCm" className="text-sm font-medium">
              Hip (cm)
            </label>
            <input
              id="hipCm"
              type="number"
              value={hipCm}
              onChange={(e) => setHipCm(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="shoeSize" className="text-sm font-medium">
              Shoe size
            </label>
            <input
              id="shoeSize"
              value={shoeSize}
              onChange={(e) => setShoeSize(e.target.value)}
              className={fieldClass}
              placeholder="e.g. 42 EU"
            />
          </div>
        </div>
        <div>
          <label htmlFor="preferredFit" className="text-sm font-medium">
            Preferred fit
          </label>
          <select
            id="preferredFit"
            value={preferredFit}
            onChange={(e) => setPreferredFit(e.target.value)}
            className={fieldClass}
          >
            <option value="">Not set</option>
            <option value="slim">Slim</option>
            <option value="regular">Regular</option>
            <option value="oversized">Oversized</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={savingSize}
          className="rounded-full bg-black px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-white disabled:opacity-70"
        >
          {savingSize ? "Saving..." : "Save size profile"}
        </button>
      </form>
      )}
      {confirmSignOut && (
        <ConfirmModal
          title="Sign out?"
          description="You’ll need to sign in again to access your account."
          confirmLabel="Sign out"
          onCancel={() => setConfirmSignOut(false)}
          onConfirm={() => {
            clearAuth();
            showToast("Signed out", "info");
            setConfirmSignOut(false);
            router.push("/");
          }}
        />
      )}
    </div>
  );
}
