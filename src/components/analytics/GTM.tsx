import Script from 'next/script'

// Server component: injects the Google Tag Manager container. GTM is the ONLY
// vendor-tag entrypoint — never add gtag.js / Meta Pixel to code (CLAUDE.md,
// docs/tracking/04-gtm-blueprint.md). Renders nothing when the container id is
// absent, so non-production builds (id scoped to Netlify Production) emit zero
// references to googletagmanager.com.

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/** GTM loader — place inside <head>. Includes a commented Consent Mode v2 stub. */
export function GTMScript() {
  if (!GTM_ID) return null
  return (
    <Script
      id="gtm-loader"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
/*
  // CONSENT MODE V2 — uncomment when cookie banner ships
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    wait_for_update: 500
  });
*/
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
      }}
    />
  )
}

/** GTM <noscript> fallback — place as the FIRST child inside <body>. */
export function GTMNoScript() {
  if (!GTM_ID) return null
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        className="hidden"
        title="Google Tag Manager"
      />
    </noscript>
  )
}
