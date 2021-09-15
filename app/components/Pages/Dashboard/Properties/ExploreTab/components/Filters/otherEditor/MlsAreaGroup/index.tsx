import { useState } from 'react'

import { CircularProgress, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useEffectOnce } from 'react-use'

import api from 'models/listings/search'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const MlsAreaGroup = () => {
  const classes = useStyles()

  const [mlsAreas, setMlsAreas] = useState<IMLSArea[]>([])
  const [selectedMlsAreas, setSelectedMlsAreas] = useState<IMLSArea[]>([])
  const [loadingMlsAreas, setLoadingMlsAreas] = useState<boolean>(false)
  const [mlsSubAreas, setSubMlsAreas] = useState<IMLSArea[]>([])
  const [selectedMlsSubAreas, setSelectedMlsSubAreas] = useState<IMLSArea[]>([])
  const [loadingMlsSubAreas, setLoadingMlsSubAreas] = useState<boolean>(false)
  const [counties, setCounties] = useState<ICounty[]>([])
  const [selectedCounties, setSelectedCounties] = useState<ICounty[]>([])
  const [loadingCounties, setLoadingCounties] = useState<boolean>(false)

  const getMLSAreaList = () => {
    setLoadingMlsAreas(true)
    api
      .getMlsAreas()
      .then(areas => {
        setMlsAreas(areas)
      })
      .finally(() => setLoadingMlsAreas(false))
  }

  const getSubMLSAreaList = (areas: IMLSArea[]) => {
    setLoadingMlsSubAreas(true)
    api
      .getMlsSubAreas(areas.map(({ number }) => number))
      .then(subareas => {
        setSubMlsAreas(subareas)
      })
      .finally(() => setLoadingMlsSubAreas(false))
  }

  const onCountyInputChange = (event: any, newInputValue: string) => {
    setLoadingCounties(true)
    api
      .getCounties(newInputValue)
      .then(counties => {
        setCounties(counties.options)
      })
      .finally(() => setLoadingCounties(false))
  }

  const onMLSAreaChange = (event: any, values: IMLSArea[]) => {
    const selectedValues = values || []

    setSelectedMlsAreas(selectedValues)

    if (values && values.length > 0) {
      setSelectedMlsSubAreas([])
      getSubMLSAreaList(selectedValues)
    }
  }

  const onMLSAreaSubChange = (event: any, values: IMLSArea[]) => {
    const selectedValues = values || []

    setSelectedMlsSubAreas(selectedValues)
  }

  const onCountyChange = (event: any, values: ICounty[]) => {
    const selectedValues = values || []

    setSelectedCounties(selectedValues)
  }

  useEffectOnce(() => {
    getMLSAreaList()
  })

  return (
    <EditorGroup title="MLS Areas">
      <Autocomplete
        className={classes.select}
        id="area-select"
        options={mlsAreas}
        size="small"
        autoHighlight
        multiple
        limitTags={1}
        value={selectedMlsAreas}
        onChange={onMLSAreaChange}
        loading={loadingMlsAreas}
        getOptionSelected={(option, value) => option.number === value.number}
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
          id="sub-area-select"
          options={mlsSubAreas}
          size="small"
          autoHighlight
          multiple
          limitTags={1}
          value={selectedMlsSubAreas}
          onChange={onMLSAreaSubChange}
          loading={loadingMlsSubAreas}
          getOptionSelected={(option, value) => option.number === value.number}
          getOptionLabel={option => option.title}
          renderOption={option => option.title}
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
      <Autocomplete
        className={classes.select}
        id="counties-select"
        options={counties}
        size="small"
        autoHighlight
        multiple
        limitTags={1}
        value={selectedCounties}
        onInputChange={onCountyInputChange}
        onChange={onCountyChange}
        loading={loadingCounties}
        getOptionSelected={(option, value) => option.value === value.value}
        getOptionLabel={option => option.label}
        renderOption={option => option.value}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Counties"
            placeholder="Type in county name..."
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
    </EditorGroup>
  )
}
