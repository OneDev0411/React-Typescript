import * as React from 'react'
import { createContext, ReactType, useContext, useMemo } from 'react'

import styled from 'styled-components'

import { splitByMatches } from 'components/TextWithHighlights/helpers/split-by-matches'

import { primary } from 'views/utils/colors'

const DefaultHighlightComponent = styled.span`
  color: ${primary};
`

export const SearchContext = createContext<string | null>(null)

interface Props {
  /**
   * The whole text to be displayed
   */
  children: string
  /**
   * Matches to be highlighted
   */
  search?: string
  /**
   * Treat matches case insensitive or not. Defaults to true
   */
  caseInsensitive?: boolean

  /**
   * component or tag to use for rendering matches. Defaults to
   * {@link DefaultHighlightComponent}
   */
  // refine type to only accept strings or a component which accepts string as children
  HighlightComponent?: ReactType

  /**
   * props to be passed to HighlightComponent
   */
  highlightProps?: { [prop: string]: any }
}

/**
 * @usage
 *
 * ```
 * <TextWithHighlights search={matchesToHighlight}>
 *   The text to highlight matches in it
 * </TextWithHighlights>
 * ```
 *
 * If the you need to highlight matches somewhere deep in component tree
 * or in several places, you can avoid drilling down the search text with props
 * by using {@link SearchContext}:
 *
 * ```
 * <SearchContext.Provider value={searchTerm}>
 *   <SomeComponentNLevelDeeper>
 *     <TextWithHighlights>The text to highlight matches in it</TextWithHighlights>
 *   </SomeComponentNLevelDeeper>
 * </SearchContext>
 * ```
 *
 * `search` always overrides the value provided by SearchContext
 */
export function TextWithHighlights({
  HighlightComponent = DefaultHighlightComponent,
  caseInsensitive = true,
  highlightProps = {},
  search,
  children
}: Props) {
  const searchContext = useContext(SearchContext)

  const searchTerm = search || searchContext

  const regExp = useMemo(
    () =>
      searchTerm
        ? new RegExp(searchTerm, `g${caseInsensitive ? 'i' : ''}`)
        : null,
    [caseInsensitive, searchTerm]
  )

  if (!searchTerm) {
    // why wrapping in fragment? see this:
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544#issuecomment-459665668
    return <>{children}</>
  }

  return (
    <>
      {splitByMatches(regExp!, children).map(({ match, text }) =>
        match ? (
          <HighlightComponent {...highlightProps}>
            {encodeEdgeSpaces(text)}
          </HighlightComponent>
        ) : (
          <span>{encodeEdgeSpaces(text)}</span>
        )
      )}
    </>
  )
}

function encodeEdgeSpaces(text: string) {
  const startsWithSpace = text.charAt(0) === ' '
  const endsWithSpace = text.charAt(text.length - 1) === ' '

  return (
    <>
      {startsWithSpace && <>&nbsp;</>}
      {text.slice(startsWithSpace ? 1 : 0, endsWithSpace ? -1 : text.length)}
      {endsWithSpace && <>&nbsp;</>}
    </>
  )
}
