import React, { useMemo } from 'react'
import sanitizeHtml from 'sanitize-html'
/**
 * NOTE: we don't use react-sanitized-html because:
 * - It doesn't memoize sanitized html
 * - sanitize-html is not lazy loaded.
 *
 * IMPORTANT: we used to load dynamic import for loading sanitize-html
 * but it had weird problems on production build, so we statically
 * import it for now. TODO: see if we can find out and solve the production
 * build problem and switch back to dynamic import.
 */

export default function SanitizedHtml({ html, ...props }) {
  // We can optionally show something like "loading ..." if sanitize-html
  // is not yet loaded. the "loading ..." text can also be a prop.
  const sanitizedHtml = useMemo(() => (html ? sanitizeHtml(html) : ''), [html])

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} {...props} />
}
