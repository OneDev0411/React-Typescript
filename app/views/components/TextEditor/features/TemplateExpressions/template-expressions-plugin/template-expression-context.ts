import { createContext } from 'react'

/**
 * A context for providing a contextual object for template expression
 * evaluation.
 * Normally templates are used as a purpose to define variable text while
 * the value of the variable is not determined at the time of editing the
 * template. But that's not always the case and there are usages in which
 * you the values of the template variables are determined based on the
 * current context.
 * For example when sending a single email and the recipient(s) of the email
 * are determined, we already know the result of the template expressions
 * like `recipient.display_name`.
 */
export const TemplateExpressionContext = createContext<object | null>(null)
