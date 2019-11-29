const identifier = '[a-zA-Z_][a-zA-Z0-9]*'
const fallback = '\\s?or\\s?"(.*?)"'

/**
 * Regexp for extracting template expressions.
 * NOTE: identifier part doesn't support ALL valid identifiers but it's
 * absolutely sufficient for our use case
 * NOTE: It only matches if fallback is with double quote. It's not so hard
 * to add single quote support too, but it seems unnecessary for our usage.
 */
export const expressionRegExp = new RegExp(
  `{{\\s?(${identifier}(\.${identifier})*?)(${fallback})?\\s?}}`,
  'g'
)
