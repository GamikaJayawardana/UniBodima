"use client";

import { Suspense, useEffect } from "react";
import CreatePostForm from "@/components/CreatePostForm";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?auth=login&callbackUrl=/create");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-25 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
            </div>
          }
        >
          <CreatePostForm />
        </Suspense>
      </div>
    </div>
  );
}
