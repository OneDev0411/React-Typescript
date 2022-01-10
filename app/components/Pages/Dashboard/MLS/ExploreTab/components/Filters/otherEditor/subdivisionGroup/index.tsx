import { useState } from 'react'

import { CircularProgress, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useDebounce } from 'react-use'

import api from '@app/models/listings/search'
import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

const SEARCH_DEBONCE_MS = 500
export const SubdivisionGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()

  const [subdivisions, setSubdivisions] = useState<ISubdivision[]>([])
  const [subdivisionInputValue, setSubdivisionInputValue] = useState<string>('')
  const [loadingSubdivisions, setLoadingSubdivisions] = useState<boolean>(false)

  const onSubdivisionInputChange = (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    if (event && event.isTrusted) {
      if (newInputValue) {
        setLoadingSubdivisions(true)
      }

      setSubdivisionInputValue(newInputValue)
    }
  }

  useDebounce(
    () => {
      if (subdivisionInputValue) {
        api
          .getSubdivisions(subdivisionInputValue)
          .then(subdivisions => {
            setSubdivisions(subdivisions.options)
          })
          .finally(() => setLoadingSubdivisions(false))
      } else {
        setLoadingSubdivisions(false)
        setSubdivisions([])
      }
    },
    SEARCH_DEBONCE_MS,
    [subdivisionInputValue]
  )

  const onSubdivisionChange = (_: unknown, values: string[]) => {
    const selectedValues = values && values.length ? values : null

    updateFilters({
      subdivisions: selectedValues
    })
    setSubdivisionInputValue('')
  }

  return (
    <EditorGroup title="Subdivisions">
      <Autocomplete
        className={classes.select}
        classes={{ popper: 'u-scrollbar--thinner' }}
        id="subdivisions-select"
        options={subdivisions.map(item => item.label)}
        size="small"
        autoHighlight
        multiple
        limitTags={1}
        value={filters.subdivisions || []}
        inputValue={subdivisionInputValue}
        onInputChange={onSubdivisionInputChange}
        onChange={onSubdivisionChange}
        loading={loadingSubdivisions}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label=""
            placeholder="Type in a subdivision name..."
            InputProps={{
              ...params.InputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
              endAdornment: (
                <>
                  {loadingSubdivisions ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
      />
    </EditorGroup>
  )
}
