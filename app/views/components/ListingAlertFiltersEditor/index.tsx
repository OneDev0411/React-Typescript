import React, { useState } from 'react'

import {
  Button,
  Grid,
  Box,
  Paper,
  Typography,
  makeStyles,
  Divider,
  Slider,
  TextField
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import isEqual from 'lodash/isEqual'

import { getMapBoundsInCircle } from 'utils/get-coordinates-points'

import { mapPostcodesToOptions } from '../../../components/Pages/Dashboard/MLS/ExploreTab/components/Filters/otherEditor/helpers'

export interface ZipcodeOption {
  id: string
  title: string
}

const useStyles = makeStyles(
  () => ({
    paper: {
      minWidth: '300px'
    },
    title: {
      flexGrow: 1
    }
  }),
  {
    name: 'ListingAlertFiltersEditor'
  }
)

interface Props {
  title?: string
  filters: AlertFiltersWithRadiusAndCenter
  onApply: (filters: AlertFiltersWithRadiusAndCenter) => void
  isStatic: boolean
}

export default function ListingAlertFiltersEditor({
  title = 'Filters',
  filters: originalFilters,
  onApply,
  isStatic
}: Props) {
  const classes = useStyles()
  const [filters, setFilters] =
    useState<AlertFiltersWithRadiusAndCenter>(originalFilters)

  function handleRadiusChange(newValue: number) {
    const newPoints = getMapBoundsInCircle(
      { lat: filters.center.latitude, lng: filters.center.longitude },
      newValue
    )

    setFilters({
      ...filters,
      radius: newValue,
      points: newPoints
    })
  }

  function handleZipcodeChange(_: unknown, values: ZipcodeOption[]) {
    const selectedValues = values.reduce((acc, item) => {
      if (item.id) {
        return [...acc, item.id.trim()]
      }

      return acc
    }, [])

    setFilters({
      ...filters,
      postal_codes: selectedValues
    })
  }

  function handleReset() {
    setFilters(originalFilters)
  }

  function handleApply() {
    onApply(filters)
  }

  const isFiltersChanged = !isEqual(originalFilters, filters)

  return (
    <Paper elevation={0} className={classes.paper}>
      <Box my={2} mx={3}>
        <Grid container direction="column">
          <Grid
            container
            spacing={1}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item className={classes.title}>
              <Typography variant="subtitle1">{title}</Typography>
            </Grid>
            <Grid item>
              <Button
                disabled={!isFiltersChanged}
                variant="text"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={!isFiltersChanged}
                variant="contained"
                color="secondary"
                onClick={handleApply}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <Box py={1}>
              <Divider />
            </Box>
          </Grid>
          <Grid container item direction="column">
            <Grid item>
              {isStatic === false && (
                <>
                  <Typography variant="caption">Radius</Typography>
                  <Slider
                    valueLabelDisplay="auto"
                    value={filters.radius}
                    step={1}
                    min={0}
                    max={20}
                    onChange={(event: unknown, newValue: number) => {
                      handleRadiusChange(newValue)
                    }}
                  />
                </>
              )}
              {isStatic && (
                <Autocomplete
                  classes={{ popper: 'u-scrollbar--thinner' }}
                  id="zip-codes-select"
                  options={mapPostcodesToOptions(filters?.postal_codes)}
                  size="small"
                  multiple
                  limitTags={2}
                  clearOnBlur
                  selectOnFocus
                  handleHomeEndKeys
                  value={mapPostcodesToOptions(filters?.postal_codes)}
                  filterOptions={(options, params) => {
                    if (params.inputValue?.trim()) {
                      return [
                        {
                          id: params.inputValue,
                          title: `Add "${params.inputValue}"`
                        }
                      ]
                    }

                    return []
                  }}
                  getOptionLabel={option => option.title}
                  onChange={handleZipcodeChange}
                  noOptionsText="Type in a ZIP code"
                  freeSolo
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label=""
                      placeholder="Type in a ZIP code ..."
                      InputProps={{
                        ...params.InputProps,
                        autoComplete: 'new-password'
                      }}
                    />
                  )}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
