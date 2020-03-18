import React, { useState, useEffect, useRef } from 'react'
import { throttle } from 'lodash'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import GlobalHeader, { GlobalHeaderProps } from 'components/GlobalHeader'

import { SearchInput } from './SearchInput'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
)

export interface GlobalHeaderWithSearchProps extends GlobalHeaderProps {
  placeholder: string
  onSearch: (query: string) => void
}

export * from './SearchInput'

export default function GlobalHeaderWithSearch({
  placeholder,
  onSearch,
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

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryValue(event.target.value)
  }

  return (
    <GlobalHeader {...globalHeaderProps}>
      <div className={classes.wrapper}>
        {children}
        <div className={classes.searchContainer}>
          <SearchInput
            value={searchQueryValue}
            placeholder={placeholder}
            onChange={handleQueryChange}
          />
        </div>
      </div>
    </GlobalHeader>
  )
}
