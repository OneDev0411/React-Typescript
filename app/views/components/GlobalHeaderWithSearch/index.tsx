import React, { useState, useEffect, useRef } from 'react'
import { throttle } from 'lodash'
import { TextField, makeStyles, Theme } from '@material-ui/core'

import GlobalHeader from 'components/GlobalHeader'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}))

interface Props {
  placeholder: string
  onSearch: (query: string) => void
}

export default function GlobalHeaderWithSearch({
  placeholder,
  onSearch,
  children,
  ...globalHeaderProps
}: Props & React.ComponentProps<typeof GlobalHeader>) {
  const classes = useStyles()
  const [searchQueryValue, setSearchQueryValue] = useState('')
  const throttledSearchHandler = useRef(
    throttle((value: string) => onSearch(value), 1000)
  )

  useEffect(() => {
    throttledSearchHandler.current(searchQueryValue)
  }, [searchQueryValue])

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryValue(event.currentTarget.value)
  }

  return (
    <GlobalHeader {...globalHeaderProps}>
      <div className={classes.wrapper}>
        {children}
        <TextField
          value={searchQueryValue}
          size="small"
          variant="outlined"
          placeholder={placeholder}
          onChange={handleQueryChange}
        />
      </div>
    </GlobalHeader>
  )
}
