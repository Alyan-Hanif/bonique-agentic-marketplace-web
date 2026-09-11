"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth";
import { showToast } from "@/lib/toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function MerchantSignOut() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setConfirmOpen(true)} className="hover:text-stone-900">
        Sign out
      </button>
      {confirmOpen && (
        <ConfirmModal
          title="Sign out?"
          description="You’ll need to sign in again to open the merchant portal."
          confirmLabel="Sign out"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            clearAuth();
            showToast("Signed out", "info");
            setConfirmOpen(false);
            router.push("/login");
          }}
        />
      )}
    </>
  );
}
