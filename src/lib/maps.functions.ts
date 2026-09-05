import { createServerFn } from "@tanstack/react-start";

/**
 * Google Maps integration. The API key is read server-side only
 * (GOOGLE_MAPS_API_KEY) and never shipped to the browser. When it is not
 * configured every function returns `configured: false` so the UI can show a
 * clear explanation instead of failing.
 */

export type GeoResult = {
  configured: boolean;
  address: string | null;
  message?: string;
};

export type RouteResult = {
  configured: boolean;
  distanceKm: number | null;
  durationMin: number | null;
  message?: string;
};

export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((input: { lat: number; lng: number }) => {
    if (typeof input?.lat !== "number" || typeof input?.lng !== "number") {
      throw new Error("Invalid coordinates");
    }
    return { lat: input.lat, lng: input.lng };
  })
  .handler(async ({ data }): Promise<GeoResult> => {
    const key = process.env["GOOGLE_MAPS_API_KEY"];
    if (!key) {
      return {
        configured: false,
        address: null,
        message:
          "Google Maps is not configured yet, so the address could not be looked up automatically. Your exact coordinates were saved — please type the address to help the worker find you.",
      };
    }
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.lat},${data.lng}&key=${key}`,
      );
      const json = (await res.json()) as {
        status?: string;
        results?: { formatted_address?: string }[];
      };
      const address = json.results?.[0]?.formatted_address ?? null;
      if (!address) {
        return { configured: true, address: null, message: "No readable address found for this location." };
      }
      return { configured: true, address };
    } catch {
      return { configured: true, address: null, message: "Address lookup failed. Please try again or type the address." };
    }
  });

export const routeToWorker = createServerFn({ method: "POST" })
  .inputValidator((input: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }) => input)
  .handler(async ({ data }): Promise<RouteResult> => {
    const key = process.env["GOOGLE_MAPS_API_KEY"];
    if (!key) {
      return {
        configured: false,
        distanceKm: null,
        durationMin: null,
        message: "Live route and travel time need a Google Maps key. Showing the cooperative's registered service area instead.",
      };
    }
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${data.from.lat},${data.from.lng}&destination=${data.to.lat},${data.to.lng}&key=${key}`,
      );
      const json = (await res.json()) as {
        routes?: { legs?: { distance?: { value: number }; duration?: { value: number } }[] }[];
      };
      const leg = json.routes?.[0]?.legs?.[0];
      if (!leg?.distance || !leg.duration) {
        return { configured: true, distanceKm: null, durationMin: null, message: "No route found." };
      }
      return {
        configured: true,
        distanceKm: Math.round((leg.distance.value / 1000) * 10) / 10,
        durationMin: Math.round(leg.duration.value / 60),
      };
    } catch {
      return { configured: true, distanceKm: null, durationMin: null, message: "Route lookup failed." };
    }
  });
