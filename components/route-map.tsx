"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { NycPlace } from "@/lib/nyc-types";

export function RouteMap({ places }: { places: NycPlace[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const initialCenter: [number, number] = [40.758, -73.9855];
    const map = L.map(containerRef.current, { zoomControl: false, scrollWheelZoom: false }).setView(initialCenter, 11);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const points = places.map((place) => [place.latitude, place.longitude] as [number, number]);
    if (points.length) {
      L.polyline(points, { color: "#0f766e", weight: 4, opacity: 0.82 }).addTo(map);
      places.forEach((place, index) => {
        L.circleMarker([place.latitude, place.longitude], {
          radius: 9,
          color: "#f7f7f2",
          weight: 3,
          fillColor: "#0f766e",
          fillOpacity: 1,
        })
          .bindPopup(`<strong>${index + 1}. ${place.name}</strong><br/><span>${place.interests.join(", ")}</span>`)
          .addTo(map);
      });
      if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [30, 30], maxZoom: 14 });
      else map.setView(points[0], 14);
    }
    return () => {
      map.remove();
    };
  }, [places]);

  return <div ref={containerRef} className="h-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100" aria-label="NYC itinerary map" />;
}
