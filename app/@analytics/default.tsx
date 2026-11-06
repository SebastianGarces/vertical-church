import { GoogleAnalytics } from '@/app/components/GoogleAnalytics';
import { GA_MEASUREMENT_ID, isGoogleAnalyticsEnabled } from '@/lib/analytics';

/** Public routes: the slot has no match, so this default renders the GA4 tag on production. */
export default function AnalyticsDefault() {
  return isGoogleAnalyticsEnabled ? <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} /> : null;
}
