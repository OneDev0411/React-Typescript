import React, { useState } from 'react'
import { Box, Button, Radio, TextField } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    radiusInput: {
      width: 75,
      margin: 0
    },
    searchButton: {
      marginLeft: theme.spacing(2)
    }
  })
)

interface Filter {
  type: string
  radius?: number
}

interface Props {
  disabled: boolean
  handleSearch: (filter: Filter) => void
}

export default function SearchAreaFilter(props: Props) {
  const classes = useStyles()
  const { disabled } = props
  const [radius, setRadius] = useState<number>(3)
  const [filterType, setFilterType] = useState<string>('radius')

  const isFilterTypeRadius = filterType === 'radius'
  const isFilterTypeCustom = filterType === 'custom'

  const handleChangeType = event => {
    setFilterType(event.target.value)
  }

  const onChangeRadius = ({ target }) => {
    const { value } = target

    if (value && !/^\d+$/.test(value)) {
      return false
    }

    setRadius(Number(value))
  }

  const onSearch = () => {
    props.handleSearch({
      type: filterType,
      radius
    })
  }

  return (
    <Box px={3}>
      <Box mb={1}>Select a search area:</Box>
      <Box display="flex" alignItems="center">
        <Radio
          color="primary"
          checked={isFilterTypeRadius}
          disabled={disabled}
          onChange={handleChangeType}
          value="radius"
          name="search-area-type"
          inputProps={{ 'aria-label': 'search-by-radius' }}
        />
        <Box mr={2}>Radius</Box>
        {isFilterTypeRadius && (
          <Box display="flex" alignItems="center">
            <TextField
              className={classes.radiusInput}
              disabled={disabled}
              hiddenLabel
              id="radius-input"
              margin="dense"
              onChange={onChangeRadius}
              value={radius}
              variant="filled"
            />
            <Box ml={2}>Miles</Box>
            <Button
              disabled={disabled}
              color="primary"
              className={classes.searchButton}
              onClick={onSearch}
              size="small"
              variant="contained"
            >
              Search
            </Button>
          </Box>
        )}
      </Box>
      <Box display="flex" alignItems="center">
        <Radio
          color="primary"
          checked={isFilterTypeCustom}
          disabled={disabled}
          onChange={handleChangeType}
          value="custom"
          name="search-area-type"
          inputProps={{ 'aria-label': 'search-by-area' }}
        />
        <Box>Custom</Box>
        {isFilterTypeCustom && <Box display="flex" alignItems="center" />}
      </Box>
    </Box>
  )
}
