import { ContentBlock } from 'draft-js'
import findWithRegex from 'find-with-regex'

import { expressionRegExp } from '../expression-regexp'

/**
 * if there is an expression which includes the passed `offset`, it returns that
 * expression
 *
 * for example if this is the content of the block:
 * This is {{ some.expression }}.
 *
 * ```
 * getExpressionInOffset(3) === undefined
 * getExpressionInOffset(7) === undefined
 * getExpressionInOffset(8) === [8, 27, '{{ some.expression }}']
 * getExpressionInOffset(17) === [8, 27, '{{ some.expression }}']
 * getExpressionInOffset(28) === undefined
 * ```
 */
export function getExpressionInOffset(
  block: ContentBlock,
  offset: number
): { from: number; to: number; expression: string } | undefined {
  const occurrences: { from: number; to: number; expression: string }[] = []

  findWithRegex(expressionRegExp, block, (from, to) => {
    occurrences.push({
      from,
      to,
      expression: block.getText().substring(from, to)
    })
  })

  return occurrences.find(({ from, to }) => offset > from && offset <= to)
}
