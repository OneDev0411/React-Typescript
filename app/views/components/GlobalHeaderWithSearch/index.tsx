import { makeStyles, Theme } from '@material-ui/core'

import {
  SearchInput,
  SearchInputProps
} from '@app/views/components/SearchInput'
import GlobalHeader, { GlobalHeaderProps } from 'components/GlobalHeader'

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
  searchInputProps?: SearchInputProps
}

export default function GlobalHeaderWithSearch({
  onSearch,
  searchDebounceTime = 300,
  searchInputProps,
  children,
  ...globalHeaderProps
}: GlobalHeaderWithSearchProps) {
  const classes = useStyles()

  return (
    <GlobalHeader {...globalHeaderProps}>
      <div className={classes.wrapper}>
        {children}
        <div className={classes.searchContainer}>
          <SearchInput
            debounceTime={searchDebounceTime}
            onChangeHandler={(e, value) =>
              value ? onSearch(value) : onSearch('')
            }
            {...searchInputProps}
          />
        </div>
      </div>
    </GlobalHeader>
  )
}
