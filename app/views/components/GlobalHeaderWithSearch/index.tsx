import React, { useState, useRef } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import { debounce } from 'lodash'

import GlobalHeader, { GlobalHeaderProps } from 'components/GlobalHeader'

import { SearchInput, SearchInputProps } from './SearchInput'

const useStyles = makeStyles(
  (theme: Theme) => ({
    wrapper: {
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      flexGrow: 1
    }
  }),
  { name: 'GlobalHeaderWithSearch' }
)

export interface GlobalHeaderWithSearchProps extends GlobalHeaderProps {
  onSearch: (query: string) => void
  searchDebounceTime?: number
  SearchInputProps?: SearchInputProps
}

export * from './SearchInput'

export default function GlobalHeaderWithSearch({
  onSearch,
  searchDebounceTime = 500,
  SearchInputProps,
  children,
  ...globalHeaderProps
}: GlobalHeaderWithSearchProps) {
  const classes = useStyles()

  const [searchQueryValue, setSearchQueryValue] = useState(
    SearchInputProps?.defaultValue || ''
  )

  const throttledSearchHandler = useRef(
    debounce((value: string) => onSearch(value), searchDebounceTime)
  )

  return (
    <GlobalHeader {...globalHeaderProps}>
      <div className={classes.wrapper}>
        {children}
        <div className={classes.searchContainer}>
          <SearchInput
            value={searchQueryValue}
            onChange={({ target: { value } }) => {
              setSearchQueryValue(value)
              throttledSearchHandler.current(value)
            }}
            {...SearchInputProps}
          />
        </div>
      </div>
    </GlobalHeader>
  )
}
