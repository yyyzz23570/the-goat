"use client";

import dynamic from "next/dynamic";
import type { NycPlace } from "@/lib/nyc-types";

const RouteMap = dynamic(() => import("@/components/route-map").then((module) => module.RouteMap), {
  ssr: false,
  loading: () => <div className="flex h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500">Loading map…</div>,
});

export function RouteMapClient({ places }: { places: NycPlace[] }) {
  return <RouteMap places={places} />;
}
