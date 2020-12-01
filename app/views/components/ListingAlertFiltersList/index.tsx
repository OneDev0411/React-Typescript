import React, { ReactNode, MouseEvent, useState, useEffect } from 'react'
import pluralize from 'pluralize'
import { Button, Grid } from '@material-ui/core'
import noop from 'lodash/noop'

interface AlertFilterData<T> {
  label: string
  toString: (value: T) => string
}

const ALERT_FILTER_KEY_TO_DATA_MAP: {
  [key in keyof AlertFiltersWithRadiusAndCenter]?: AlertFilterData<
    AlertFiltersWithRadiusAndCenter[key]
  >
} = {
  radius: {
    label: 'Radius',
    toString: radius => pluralize('mile', radius, true)
  }
}

const VISIBLE_ALERT_FILTER_KEYS = Object.keys(ALERT_FILTER_KEY_TO_DATA_MAP)

interface Props {
  filters: AlertFiltersWithRadiusAndCenter
  limit?: number
  children?: ReactNode
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function ListingAlertFiltersList({
  filters,
  limit = Infinity,
  children,
  onClick = noop
}: Props) {
  const [filtersKeyValueMap, setFiltersKeyValueMap] = useState<
    StringMap<string>
  >({})

  useEffect(() => {
    const keysWithValues = Object.keys(filters).filter(key => !!filters[key])
    const keysToShow = VISIBLE_ALERT_FILTER_KEYS.filter(item =>
      keysWithValues.includes(item)
    )
    const newFiltersKeyValueMap: StringMap<string> = {}

    keysToShow.forEach(key => {
      const currentKeyData = ALERT_FILTER_KEY_TO_DATA_MAP[key]

      newFiltersKeyValueMap[currentKeyData.label] = currentKeyData.toString(
        filters[key]
      )
    })

    setFiltersKeyValueMap(newFiltersKeyValueMap)
  }, [filters])

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      alignItems="center"
      justify="flex-end"
    >
      {Object.entries(filtersKeyValueMap)
        .slice(0, limit)
        .map(([key, value]) => (
          <Grid item key={key}>
            <Button variant="outlined" onClick={onClick}>
              {key}: {value}
            </Button>
          </Grid>
        ))}
      {children}
    </Grid>
  )
}
