"use client";

import { Suspense } from "react";
import CreatePostForm from "@/components/CreatePostForm";

export default function CreatePostPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8 mt-20 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CreatePostForm />
    </Suspense>
  );
}
