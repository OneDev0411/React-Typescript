import { useState } from 'react'

import { CircularProgress, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useDebounce } from 'react-use'

import api from 'models/listings/search'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

const SEARCH_DEBONCE_MS = 500
export const SubdivisionGroup = () => {
  const classes = useStyles()

  const [subdivisions, setSubdivisions] = useState<ISubdivision[]>([])
  const [countyInputValue, setSubdivisionInputValue] = useState<string>('')
  const [selectedSubdivisions, setSelectedSubdivisions] = useState<
    ISubdivision[]
  >([])
  const [loadingSubdivisions, setLoadingSubdivisions] = useState<boolean>(false)

  const onSubdivisionInputChange = (event: any, newInputValue: string) => {
    if (newInputValue) {
      setLoadingSubdivisions(true)
      setSubdivisionInputValue(newInputValue)
    }
  }

  useDebounce(
    () => {
      api
        .getSubdivisions(countyInputValue)
        .then(subdivisions => {
          setSubdivisions(subdivisions.options)
        })
        .finally(() => setLoadingSubdivisions(false))
    },
    SEARCH_DEBONCE_MS,
    [countyInputValue]
  )

  const onSubdivisionChange = (event: any, values: ISubdivision[]) => {
    const selectedValues = values || []

    setSelectedSubdivisions(selectedValues)
  }

  return (
    <EditorGroup title="Subdivisions">
      <Autocomplete
        className={classes.select}
        id="subdivisions-select"
        options={subdivisions}
        size="small"
        autoHighlight
        multiple
        limitTags={1}
        value={selectedSubdivisions}
        onInputChange={onSubdivisionInputChange}
        onChange={onSubdivisionChange}
        loading={loadingSubdivisions}
        getOptionSelected={(option, value) =>
          option.value === value.value && option.label === value.label
        }
        getOptionLabel={option => option.label}
        renderOption={option => option.label}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Name"
            placeholder="Type in subdivision name..."
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
