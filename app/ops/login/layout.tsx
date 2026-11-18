import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Wayly NYC Ops | Preview access',
  description: 'Wayly NYC operations-console preview access.',
};

export default function OpsLoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
