import React, { useRef } from 'react'
import { Popper } from '@material-ui/core'

import { Suggestions } from '../Suggestions'

interface Props {
  isOpen: boolean
  address: string | object
  places: any
  style: React.CSSProperties
  onClickDefaultItem(): void
  onClickSuggestionItem(item: any): void
  onMouseOverSuggestion(isBlurDisabled: boolean): void
}

export function SuggestionsPopover({
  isOpen,
  style,
  places,
  address,
  onClickDefaultItem,
  onClickSuggestionItem,
  onMouseOverSuggestion
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div ref={containerRef}>
      <Popper
        id={isOpen ? 'address-suggestion-popper' : undefined}
        open={isOpen}
        anchorEl={isOpen ? containerRef && containerRef.current : null}
        placement="bottom-start"
        style={{ zIndex: 1004 }}
      >
        <Suggestions
          items={places}
          searchText={address}
          style={style}
          onClickDefaultItem={onClickDefaultItem}
          onClickSuggestionItem={onClickSuggestionItem}
          handleMouseOver={onMouseOverSuggestion}
        />
      </Popper>
    </div>
  )
}
