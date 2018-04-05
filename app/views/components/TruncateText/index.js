import styled from 'styled-components'
import { string } from 'prop-types'

TruncateText.propTypes = {
  tagName: string.isRequired
}

export function TruncateText(tagName) {
  return styled[tagName]`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `
}
