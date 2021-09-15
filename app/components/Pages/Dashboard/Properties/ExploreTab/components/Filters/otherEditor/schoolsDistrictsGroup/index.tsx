import { useState } from 'react'

import { CircularProgress, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useDebounce } from 'react-use'

import api from 'models/listings/search'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

const SEARCH_DEBONCE_MS = 500
export const SchoolsDistrictsGroup = () => {
  const classes = useStyles()

  const [schoolsDistricts, setSchoolsDistricts] = useState<ISchoolsDistrict[]>(
    []
  )
  const [countyInputValue, setSchoolsDistrictInputValue] = useState<string>('')
  const [selectedSchoolsDistricts, setSelectedSchoolsDistricts] = useState<
    ISchoolsDistrict[]
  >([])
  const [loadingSchoolsDistricts, setLoadingSchoolsDistricts] =
    useState<boolean>(false)

  const onSchoolsDistrictInputChange = (event: any, newInputValue: string) => {
    setLoadingSchoolsDistricts(true)
    setSchoolsDistrictInputValue(newInputValue)
  }

  useDebounce(
    () => {
      api
        .getSchoolsDistricts(countyInputValue)
        .then(schoolsDistricts => {
          setSchoolsDistricts(schoolsDistricts.options)
        })
        .finally(() => setLoadingSchoolsDistricts(false))
    },
    SEARCH_DEBONCE_MS,
    [countyInputValue]
  )

  const onSchoolsDistrictChange = (event: any, values: ISchoolsDistrict[]) => {
    const selectedValues = values || []

    setSelectedSchoolsDistricts(selectedValues)
  }

  return (
    <EditorGroup title="School District">
      <Autocomplete
        className={classes.select}
        id="schoolsDistricts-select"
        options={schoolsDistricts}
        size="small"
        autoHighlight
        multiple
        limitTags={1}
        value={selectedSchoolsDistricts}
        onInputChange={onSchoolsDistrictInputChange}
        onChange={onSchoolsDistrictChange}
        loading={loadingSchoolsDistricts}
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
            placeholder="Type in school district name..."
            InputProps={{
              ...params.InputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
              endAdornment: (
                <>
                  {loadingSchoolsDistricts ? (
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
