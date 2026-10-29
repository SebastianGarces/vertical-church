/**
 * Google Analytics 4 configuration and a tiny typed event helper.
 *
 * The GA tag is rendered only for production deployments (see `isGoogleAnalyticsEnabled`),
 * so previews and local dev never send data. `trackEvent` is a no-op whenever `gtag`
 * isn't on the page (non-production, blocked by an extension, not yet loaded, SSR).
 *
 * Never pass personal information (names, emails, phone numbers, messages) to GA.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-J2YHF4YXQN';

/** Only load GA on the production deployment. Evaluated on the server at build/render time. */
export const isGoogleAnalyticsEnabled = process.env.VERCEL_ENV === 'production';

/** Conversion events, keyed by event name -> allowed params. Keep params free of PII. */
export type AnalyticsEvents = {
  plan_visit: { form_name: 'plan_visit' };
  contact: { form_name: 'contact' };
  small_group_interest: { form_name: 'small_group_interest' };
  want_to_serve: { form_name: 'want_to_serve' };
};

export type AnalyticsEventName = keyof AnalyticsEvents;

type Gtag = (command: 'event', eventName: string, params?: Record<string, unknown>) => void;

export function trackEvent<E extends AnalyticsEventName>(eventName: E, params: AnalyticsEvents[E]): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== 'function') return;
  try {
    gtag('event', eventName, params);
  } catch {
    // Analytics must never break a form submission.
  }
}
