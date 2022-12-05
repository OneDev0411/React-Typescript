import React, { ReactNode, MouseEvent, useState, useEffect } from 'react'

import { Button, Grid, Box } from '@material-ui/core'
import noop from 'lodash/noop'
import pluralize from 'pluralize'

interface AlertFilterData<T> {
  label: string
  toString: (value: T) => string | Nullable<string[]> | undefined
}

const ALERT_FILTER_KEY_TO_DATA_MAP: {
  [key in keyof AlertFiltersWithRadiusAndCenter]?: AlertFilterData<
    AlertFiltersWithRadiusAndCenter[key]
  >
} = {
  radius: {
    label: 'Radius: ',
    toString: radius => pluralize('mile', radius, true)
  },
  postal_codes: {
    label: 'Zipcode: ',
    toString: postal_codes => postal_codes
  }
}

const VISIBLE_ALERT_FILTER_KEYS = Object.keys(ALERT_FILTER_KEY_TO_DATA_MAP)

interface Props {
  filters: AlertFiltersWithRadiusAndCenter
  limit?: number
  children?: ReactNode
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  isStatic: boolean
}

export default function ListingAlertFiltersList({
  filters,
  limit = Infinity,
  children,
  onClick = noop,
  isStatic
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
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
    >
      <Grid item>
        <Box pr={1}>
          <Button variant="text" onClick={onClick}>
            {isStatic === false
              ? Object.entries(filtersKeyValueMap)[0]
              : Object.entries(filtersKeyValueMap)[1]}
          </Button>
        </Box>
      </Grid>

      {children}
    </Grid>
  )
}
