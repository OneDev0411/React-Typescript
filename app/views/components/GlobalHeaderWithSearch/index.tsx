import React, { useState, useEffect, useRef } from 'react'
import { throttle } from 'lodash'
import { makeStyles, Theme } from '@material-ui/core'

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
  /** @deprecated use `SearchInputProps` instead. */ placeholder?: string
  onSearch: (query: string) => void
  SearchInputProps?: SearchInputProps
}

export * from './SearchInput'

export default function GlobalHeaderWithSearch({
  placeholder,
  onSearch,
  SearchInputProps,
  children,
  ...globalHeaderProps
}: GlobalHeaderWithSearchProps) {
  const classes = useStyles()

  const [searchQueryValue, setSearchQueryValue] = useState('')

  const throttledSearchHandler = useRef(
    throttle((value: string) => onSearch(value), 1000)
  )

  useEffect(() => {
    throttledSearchHandler.current(searchQueryValue)
  }, [searchQueryValue])

  return (
    <GlobalHeader {...globalHeaderProps}>
      <div className={classes.wrapper}>
        {children}
        <div className={classes.searchContainer}>
          <SearchInput
            value={searchQueryValue}
            placeholder={placeholder}
            onChange={({ target: { value: searchQueryValue } }) =>
              setSearchQueryValue(searchQueryValue)
            }
            {...SearchInputProps}
          />
        </div>
      </div>
    </GlobalHeader>
  )
}
