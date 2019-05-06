import React, { useMemo } from 'react'
import usePromise from 'react-use-promise'

/**
 * NOTE: we don't use react-sanitized-html because:
 * - It doesn't memoize sanitized html
 * - sanitize-html is not lazy loaded.
 */

/*
 sanitize-html is a large library (~217kb), so we lazy load it while nothing
 is blocked.
*/

const sanitizeHtmlPromise = import('sanitize-html' /* webpackChunkName: "sanitize-html" */)

export default function SanitizedHtml({ html }) {
  const [sanitizeHtmlModule] = usePromise(sanitizeHtmlPromise, [])

  const { default: sanitizeHtml } = sanitizeHtmlModule || {}

  // We can optionally show something like "loading ..." if sanitize-html
  // is not yet loaded. the "loading ..." text can also be a prop.
  const sanitizedHtml = useMemo(
    () => (sanitizeHtml && html ? sanitizeHtml(html) : ''),
    [sanitizeHtml, html]
  )

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}
