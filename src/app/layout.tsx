import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nazanin — AI Consultant | AI-konsult",
  description: "Smarter business through AI — one step at a time. AI Strategy & Automation in Sweden.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
