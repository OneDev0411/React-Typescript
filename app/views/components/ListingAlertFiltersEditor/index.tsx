import React, { useState } from 'react'
import isEqual from 'lodash/isEqual'
import {
  Button,
  Grid,
  Box,
  Paper,
  Typography,
  makeStyles,
  Divider,
  Slider
} from '@material-ui/core'

import { getMapBoundsInCircle } from 'utils/get-coordinates-points'

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
}

export default function ListingAlertFiltersEditor({
  title = 'Filters',
  filters: originalFilters,
  onApply
}: Props) {
  const classes = useStyles()
  const [filters, setFilters] = useState<AlertFiltersWithRadiusAndCenter>(
    originalFilters
  )

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
            justify="space-between"
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
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
