import * as React from 'react'
import { createContext, ReactNode, ReactType, useContext, useMemo } from 'react'

import styled from 'styled-components'

import { ReactElement } from 'react'

import { splitByMatches } from 'components/TextWithHighlights/helpers/split-by-matches'

import { primary } from '../../utils/colors'

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
   * Treat matches case insensitive or not. defaults to true
   */
  caseInsensitive?: boolean

  /**
   * component or tag to use for rendering matches. defaults to
   * {@link DefaultHighlightComponent}
   */
  // refine type to only accept strings or a component which accepts string as children
  HighlightComponent?: ReactType

  /**
   * props to be passed to highlights
   */
  highlightProps?: { [prop: string]: any }
}

export function TextWithHighlights({
  HighlightComponent = DefaultHighlightComponent,
  caseInsensitive = true,
  highlightProps = {},
  search,
  children
}: Props): ReactElement {
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
    return children
  }

  return (
    <>
      {splitByMatches(regExp!, children).map(({ match, text }) =>
        match ? (
          <HighlightComponent {...highlightProps}>{text}</HighlightComponent>
        ) : (
          <span>{text}</span>
        )
      )}
    </>
  )
}
