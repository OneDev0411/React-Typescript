/**
 * Regexp for extracting template expressions.
 */
export const expressionRegExp =
  /{{\s*((recipient|user|sender|email)+)\.([.\w]+)\s*(or\s*"([^"}]*)?")*\s*}}/gi
