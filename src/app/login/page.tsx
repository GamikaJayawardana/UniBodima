"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl");
    const url = callbackUrl
      ? `/?auth=login&callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/?auth=login";
    router.replace(url);
  }, [router, searchParams]);

  return (
    <div className="min-h-[100vh] bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100vh] bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
        </div>
      }
    >
      <LoginRedirect />
    </Suspense>
  );
}
