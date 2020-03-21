import React from 'react'
import { Box } from '@material-ui/core'

import GlobalHeader from 'components/GlobalHeader'

import FilterButton from '../../../../../../views/components/Button/DropButton'

import Filters from '../components/Filters'
import Autocomplete from '../components/Autocomplete'

export function Header(props) {
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
          text="Filters"
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
