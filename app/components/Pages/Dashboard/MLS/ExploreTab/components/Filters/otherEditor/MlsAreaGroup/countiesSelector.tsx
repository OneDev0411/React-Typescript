import { useState } from 'react'

import { CircularProgress, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useDebounce } from 'react-use'

import api from '@app/models/listings/search'

import { useStyles } from '../../styles'

const SEARCH_DEBONCE_MS = 500

interface Props {
  value: Nullable<string[]> | undefined
  updateFilters: (newFilters: Partial<AlertFilters>) => void
}

export const CountiesSelector = ({ value, updateFilters }: Props) => {
  const classes = useStyles()

  const [counties, setCounties] = useState<ICounty[]>([])
  const [countyInputValue, setCountyInputValue] = useState<string>('')
  const [loadingCounties, setLoadingCounties] = useState<boolean>(false)

  const onCountyInputChange = (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    if (event && event.isTrusted) {
      if (newInputValue) {
        setLoadingCounties(true)
      }

      setCountyInputValue(newInputValue)
    }
  }

  useDebounce(
    () => {
      if (countyInputValue) {
        api
          .getCounties(countyInputValue)
          .then(counties => {
            setCounties(counties.options)
          })
          .finally(() => setLoadingCounties(false))
      } else {
        setLoadingCounties(false)
        setCounties([])
      }
    },
    SEARCH_DEBONCE_MS,
    [countyInputValue]
  )

  const onCountyChange = (_: unknown, values: string[]) => {
    const selectedValues = values && values.length ? values : null

    updateFilters({
      counties: selectedValues
    })
    setCountyInputValue('')
  }

  return (
    <Autocomplete
      className={classes.select}
      classes={{ popper: 'u-scrollbar--thinner' }}
      id="counties-select"
      options={counties.map(item => item.label)}
      size="small"
      autoHighlight
      multiple
      limitTags={1}
      value={value || []}
      inputValue={countyInputValue}
      onInputChange={onCountyInputChange}
      onChange={onCountyChange}
      loading={loadingCounties}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="Counties"
          placeholder="Type in a county name..."
          InputProps={{
            ...params.InputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
            endAdornment: (
              <>
                {loadingCounties ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}
