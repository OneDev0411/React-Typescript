import { useState } from 'react'

import { CircularProgress, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useDebounce, useEffectOnce } from 'react-use'

import { SCHOOL_TYPES } from '@app/components/Pages/Dashboard/MLS/constants'
import api from '@app/models/listings/search'
import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

import { SchoolSelector } from './schoolSelector'

const SEARCH_DEBONCE_MS = 500
export const SchoolsDistrictsGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()

  const [schoolsDistricts, setSchoolsDistricts] = useState<ISchoolsDistrict[]>(
    []
  )
  const [schools, setSchools] = useState<ISchool[]>([])

  const [schoolsDistrictInputValue, setSchoolsDistrictInputValue] =
    useState<string>('')
  const [loadingSchoolsDistricts, setLoadingSchoolsDistricts] =
    useState<boolean>(false)
  const [loadingSchools, setLoadingSchools] = useState<boolean>(false)

  const onSchoolsDistrictInputChange = (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    if (event && event.isTrusted) {
      if (newInputValue) {
        setLoadingSchoolsDistricts(true)
      }

      setSchoolsDistrictInputValue(newInputValue)
    }
  }

  useDebounce(
    () => {
      if (schoolsDistrictInputValue) {
        api
          .getSchoolsDistricts(schoolsDistrictInputValue)
          .then(items => {
            setSchoolsDistricts(items.options)
          })
          .finally(() => setLoadingSchoolsDistricts(false))
      } else {
        setLoadingSchoolsDistricts(false)
        setSchoolsDistricts([])
      }
    },
    SEARCH_DEBONCE_MS,
    [schoolsDistrictInputValue]
  )

  const onSchoolsChange = (newValue: string[], school_type: SchoolType) => {
    const schoolsFilterKey = `${school_type}s` // e.g. 'elementary_school' => 'elementary_schools'

    updateFilters({
      [schoolsFilterKey]: newValue && newValue.length ? newValue : null
    })
  }

  const onSchoolsDistrictChange = (_: unknown, values: string[]) => {
    const selectedValues = values || []

    if (selectedValues.length === 0) {
      updateFilters({
        school_districts: null,
        junior_high_schools: null,
        elementary_schools: null,
        high_schools: null,
        middle_schools: null
      })
      setSchools([])
    } else {
      updateFilters({
        school_districts: selectedValues
      })
      searchSchools(selectedValues)
    }

    setSchoolsDistrictInputValue('')
  }

  const searchSchools = (districts: string[]) => {
    setLoadingSchools(true)
    api
      .getSchools(districts)
      .then(items => {
        setSchools(items)
      })
      .finally(() => setLoadingSchools(false))
  }

  useEffectOnce(() => {
    if (filters.school_districts) {
      searchSchools(filters.school_districts)
    }
  })

  return (
    <EditorGroup title="School District">
      <Autocomplete
        className={classes.select}
        classes={{ popper: 'u-scrollbar--thinner' }}
        id="districts-select"
        options={schoolsDistricts.map(item => item.label)}
        size="small"
        autoHighlight
        multiple
        limitTags={1}
        value={filters.school_districts || []}
        onChange={onSchoolsDistrictChange}
        onInputChange={onSchoolsDistrictInputChange}
        inputValue={schoolsDistrictInputValue}
        loading={loadingSchoolsDistricts}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
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

      {Object.keys(SCHOOL_TYPES).map((schoolType: SchoolType) => {
        const innerSchools = schools.filter(item => item.type === schoolType)

        if (innerSchools.length > 0) {
          return (
            <SchoolSelector
              key={schoolType}
              value={filters[`${schoolType}s`]}
              type={schoolType}
              schools={innerSchools}
              onChange={onSchoolsChange}
              label={SCHOOL_TYPES[schoolType]}
              placeholder={`Type in a ${SCHOOL_TYPES[schoolType]} name...`}
              loading={loadingSchools}
            />
          )
        }
      })}
    </EditorGroup>
  )
}
