import Script from 'next/script';

/**
 * GA4 tag. Rendered from the root layout only on production deployments.
 *
 * Deliberately not using `@next/third-parties/google`: its `afterInteractive` script emits a
 * `<link rel="preload">` for gtag.js in the document head, which competes with the hero LCP.
 * Here the tiny inline bootstrap (no `src`, so nothing is preloaded) defines `gtag` and queues
 * the config after hydration, and gtag.js itself is fetched with `lazyOnload` (browser idle time
 * after the page's load event). Anything queued before gtag.js arrives is sent once it loads.
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script id='ga4-init' strategy='afterInteractive'>
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(measurementId)});`}
      </Script>
      <Script
        id='ga4-gtag'
        strategy='lazyOnload'
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
      />
    </>
  );
}
