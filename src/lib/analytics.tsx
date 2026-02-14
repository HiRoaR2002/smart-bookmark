'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// Google Analytics tracking ID - replace with your own
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Track page views
export function usePageViews() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (GA_TRACKING_ID) {
      const url = pathname + searchParams.toString()
      // @ts-ignore
      window.gtag?.('config', GA_TRACKING_ID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (GA_TRACKING_ID) {
    // @ts-ignore
    window.gtag?.('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Analytics Provider Component
export function Analytics() {
  if (!GA_TRACKING_ID) return null

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
