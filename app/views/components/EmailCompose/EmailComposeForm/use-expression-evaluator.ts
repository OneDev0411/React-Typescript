import { useMemo } from 'react'

import { EmailFormValues } from '../types'

export function useExpressionEvaluator() {
  /**
   * This is the most optimized approach for loading nunjucks for the purpose
   * of client-side evaluation of template expressions.
   * The other approaches are:
   * - To import nunjucks statically, which results in bundle overhead where ever
   *   Compose component is used
   * - To import nunjucks with a dynamic import in the root. This resolves bundle
   *  overhead, but it's always loads anyways whenever Compose component is
   *  loaded. Even if the Compose component is never rendered (user don't uses it)
   * - To import nunjucks dynamically when actually rendering something (when
   *   the email is being sent/saved). This is the most efficient approach
   *   in terms of bandwidth, because it's loaded only when it's required,
   *   but it has this drawback that it delays submission for the first time.
   * By lazy loading it  within  the render, we ensure nunjucks is only loaded
   * if compose is actually being used and we start to load nunjucks as soon as
   * Compose is rendered.
   * */
  const nunjucksPromise = useMemo(
    () => import('nunjucks').then(result => result.default),
    []
  )

  async function evaluate(
    template: string,
    formValues: EmailFormValues
  ): Promise<string> {
    const firstRecipient = (formValues.to || [])[0]
    const recipient =
      firstRecipient.recipient_type === 'Email' ? firstRecipient.contact : null
    const nunjucks = await nunjucksPromise

    const sender = null // FIXME

    return nunjucks.renderString(template, { recipient, sender })
  }

  return {
    evaluate
  }
}
