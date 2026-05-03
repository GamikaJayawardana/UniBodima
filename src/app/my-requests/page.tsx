import { redirect } from "next/navigation";

export default function MyRequestsPage() {
  redirect("/dashboard?tab=request");
}
