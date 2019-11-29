import { ContentBlock } from 'draft-js'
import findWithRegex from 'find-with-regex'

import { expressionRegExp } from './expression-regexp'

export const templateExpressionStrategy = (
  contentBlock: ContentBlock,
  callback: Function
) => {
  findWithRegex(expressionRegExp, contentBlock, callback)
}
