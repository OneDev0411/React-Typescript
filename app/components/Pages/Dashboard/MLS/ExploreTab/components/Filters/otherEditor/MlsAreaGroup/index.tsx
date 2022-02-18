import { useState } from 'react'

import { CircularProgress, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useEffectOnce } from 'react-use'

import api from '@app/models/listings/search'
import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

import { CountiesSelector } from './countiesSelector'
import { createPairedMlsAreas } from './helpers'

export const MlsAreaGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()

  const [mlsAreas, setMlsAreas] = useState<IMLSArea[]>([])
  const [selectedMlsAreas, setSelectedMlsAreas] = useState<IMLSArea[]>([])
  const [loadingMlsAreas, setLoadingMlsAreas] = useState<boolean>(false)
  const [mlsSubAreas, setMlsSubAreas] = useState<IMLSArea[]>([])
  const [selectedMlsSubAreas, setSelectedMlsSubAreas] = useState<IMLSArea[]>([])
  const [loadingMlsSubAreas, setLoadingMlsSubAreas] = useState<boolean>(false)

  const getMlsAreaList = () => {
    setLoadingMlsAreas(true)
    api
      .getMlsAreas()
      .then(areas => {
        setMlsAreas(areas)

        if (filters.mls_areas && filters.mls_areas.length > 0) {
          const prevSelectedMLSAreasNumber = filters.mls_areas.map(
            (item: [number, number]) => item[0]
          )
          const prevSelectedMLSAreas = areas.filter(item =>
            prevSelectedMLSAreasNumber.includes(item.number)
          )

          setSelectedMlsAreas(prevSelectedMLSAreas)
        }
      })
      .finally(() => setLoadingMlsAreas(false))
  }

  const getMlsSubAreaList = (areasNumber: number[]) => {
    setLoadingMlsSubAreas(true)
    api
      .getMlsSubAreas(areasNumber)
      .then(subareas => {
        setMlsSubAreas(subareas)

        if (filters.mls_areas && filters.mls_areas.length > 0) {
          const prevSelectedMlsSubAreasNumber = filters.mls_areas.map(
            (item: [number, number]) => item[1]
          )
          const prevSelectedMlsSubAreas = subareas.filter(item =>
            prevSelectedMlsSubAreasNumber.includes(item.number)
          )

          setSelectedMlsSubAreas(prevSelectedMlsSubAreas)
        }
      })
      .finally(() => setLoadingMlsSubAreas(false))
  }

  const onMlsAreaChange = (_: unknown, values: IMLSArea[]) => {
    const selectedValues = values || []

    setSelectedMlsAreas(selectedValues)

    if (values && values.length > 0) {
      getMlsSubAreaList(selectedValues.map(({ number }) => number))
      updateFilters({
        mls_areas: createPairedMlsAreas(selectedValues, selectedMlsSubAreas)
      })
    } else {
      setSelectedMlsSubAreas([])
      updateFilters({
        mls_areas: createPairedMlsAreas(selectedValues, [])
      })
    }
  }

  const onMlsAreaSubChange = (_: unknown, values: IMLSArea[]) => {
    const selectedValues = values || []

    setSelectedMlsSubAreas(selectedValues)
    updateFilters({
      mls_areas: createPairedMlsAreas(selectedMlsAreas, selectedValues)
    })
  }

  useEffectOnce(() => {
    getMlsAreaList()

    if (filters.mls_areas && filters.mls_areas.length > 0) {
      getMlsSubAreaList(
        filters.mls_areas.map((item: [number, number]) => item[0])
      )
    }
  })

  return (
    <EditorGroup title="MLS Areas">
      <Autocomplete
        className={classes.select}
        classes={{ popper: 'u-scrollbar--thinner' }}
        id="area-select"
        options={mlsAreas}
        size="small"
        autoHighlight
        multiple
        limitTags={1}
        value={selectedMlsAreas}
        onChange={onMlsAreaChange}
        loading={loadingMlsAreas}
        getOptionSelected={(option, value) =>
          option.number === value.number && option.title === value.title
        }
        getOptionLabel={option => option.title}
        renderOption={option => option.title}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Area"
            placeholder="Type in your MLS area..."
            InputProps={{
              ...params.InputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
              endAdornment: (
                <>
                  {loadingMlsAreas ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
      />
      {selectedMlsAreas.length > 0 && (
        <Autocomplete
          className={classes.select}
          classes={{ popper: 'u-scrollbar--thinner' }}
          id="sub-area-select"
          options={mlsSubAreas}
          size="small"
          autoHighlight
          multiple
          limitTags={1}
          value={selectedMlsSubAreas}
          onChange={onMlsAreaSubChange}
          loading={loadingMlsSubAreas}
          getOptionSelected={(option, value) =>
            option.number === value.number && option.title === value.title
          }
          getOptionLabel={option => `${option.title}#${option.number}`}
          renderOption={option => `${option.title}: #${option.number}`}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Sub Area"
              placeholder="Type in your MLS sub area..."
              InputProps={{
                ...params.InputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
                endAdornment: (
                  <>
                    {loadingMlsSubAreas ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
      )}
      <CountiesSelector
        value={filters.counties}
        updateFilters={updateFilters}
      />
    </EditorGroup>
  )
}
