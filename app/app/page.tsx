import type { Metadata } from "next";
import { AppDemo } from "@/components/app/AppDemo";

export const metadata: Metadata = {
  title: "FullSquad App Demo",
  description: "Try FullSquad: post a game, fill it by position, run the waitlist, and backfill a dropout with one tap. Simulated players, runs in your browser.",
  alternates: { canonical: "/app/" },
};

export default function AppPage() {
  return <AppDemo />;
}
