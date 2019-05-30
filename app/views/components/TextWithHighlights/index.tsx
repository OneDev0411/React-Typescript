import * as React from 'react'
import { ReactType, useMemo } from 'react'

import { splitByMatches } from 'components/TextWithHighlights/helpers/split-by-matches'

interface Props {
  /**
   * The whole text to be displayed
   */
  children: string
  /**
   * Matches to be highlighted
   */
  search: string
  /**
   * Treat matches case insensitive or not. defaults to true
   */
  caseInsensitive?: boolean

  /**
   * component or tag to use for rendering matches. defaults to 'mark'
   */
  HighlightComponent?: React.ElementType<{ children: string }>

  /**
   * props to be passed to highlights
   */
  highlightProps?: { [prop: string]: any }
}

export function TextWithHighlights({
  HighlightComponent = 'mark',
  caseInsensitive = true,
  highlightProps = {},
  search,
  children
}: Props) {
  const regExp = useMemo(
    () => new RegExp(search, `g${caseInsensitive ? 'i' : ''}`),
    [caseInsensitive, search]
  )

  return (
    <>
      {splitByMatches(regExp, children).map(({ match, text }) =>
        match ? (
          <HighlightComponent {...highlightProps}>{text}</HighlightComponent>
        ) : (
          <span>{text}</span>
        )
      )}
    </>
  )
}
