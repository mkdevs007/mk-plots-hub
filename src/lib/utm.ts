const UTM_KEY = "mk_utm";

const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
type UtmParam = (typeof UTM_PARAMS)[number];
export type UtmData = Partial<Record<UtmParam, string>>;

/** Read UTM params from the current URL and persist them to sessionStorage. */
export function captureUtm(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const data: UtmData = {};
  let found = false;
  for (const key of UTM_PARAMS) {
    const val = params.get(key);
    if (val) {
      data[key] = val;
      found = true;
    }
  }
  if (found) {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(data));
  }
}

/** Retrieve previously captured UTM data from sessionStorage. */
export function getStoredUtm(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    return raw ? (JSON.parse(raw) as UtmData) : {};
  } catch {
    return {};
  }
}

/**
 * Format UTM data as a short note to append to WhatsApp messages.
 * Returns an empty string when no UTM data is present.
 */
export function formatUtmNote(utm: UtmData): string {
  const parts: string[] = [];
  if (utm.utm_source) parts.push(`src:${utm.utm_source}`);
  if (utm.utm_medium) parts.push(`med:${utm.utm_medium}`);
  if (utm.utm_campaign) parts.push(`cmp:${utm.utm_campaign}`);
  if (utm.utm_content) parts.push(`cnt:${utm.utm_content}`);
  if (utm.utm_term) parts.push(`trm:${utm.utm_term}`);
  return parts.length ? ` [${parts.join(" | ")}]` : "";
}

/** Fire a Meta Pixel event (no-op if pixel is not loaded). */
export function fbqTrack(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    fbq("track", event, params ?? {});
  }
}

/** Fire a Google Analytics 4 event (no-op if gtag is not loaded). */
export function gtagEvent(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", event, params ?? {});
  }
}
