import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import GlobalHeader from 'components/GlobalHeader'

import FilterButton from '../../../../../../views/components/Button/DropButton'

import Filters from '../components/Filters'
import Autocomplete from '../components/Autocomplete'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(5, 3)
    }
  })
)

export function Header(props) {
  const classes = useStyles(props)
  const {
    isFetching,
    filtersIsOpen,
    onClickFilter,
    isSideMenuOpen,
    activeView
  } = props

  return (
    <GlobalHeader>
      <Box display="flex" alignItems="center">
        <Autocomplete activeView={activeView} />
        <FilterButton
          style={{ marginLeft: '0.5em', borderColor: '#BAC2CE' }}
          onClick={onClickFilter}
          isOpen={filtersIsOpen}
          disabled={isFetching}
          text="Filter Search"
          size="medium"
          appearance="outline"
        />
        <Filters
          isOpen={filtersIsOpen}
          isSubmitting={isFetching}
          isSideMenuOpen={isSideMenuOpen}
          handleClose={onClickFilter}
        />
      </Box>
    </GlobalHeader>
  )
}
