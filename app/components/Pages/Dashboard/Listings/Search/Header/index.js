import React from 'react'
import Flex from 'styled-flex-component'

import Button from '../../../../../../views/components/Button/ActionButton'
import FilterButton from '../../../../../../views/components/Button/DropButton'
import { Trigger as MenuTrigger } from '../../../../../../views/components/SlideMenu'

import PanelsSwitch from '../../components/PanelsSwitch'
import Filters from '../components/Filters'
import SearchField from '../components/SearchToolbar'

export function Header(props) {
  const { isFetching, filtersIsOpen, onClickFilter, isSideMenuOpen } = props

  return (
    <Flex
      alignCenter
      justifyBetween
      style={{ padding: '1.5em', borderBottom: '1px solid #d4d4d4' }}
    >
      <Flex alignCenter>
        {props.user && (
          <MenuTrigger
            onClick={props.toggleSideMenu}
            isExpended={isSideMenuOpen}
          />
        )}
        <SearchField />
        <FilterButton
          style={{ marginLeft: '0.5em' }}
          onClick={onClickFilter}
          isOpen={filtersIsOpen}
          disabled={isFetching}
          text="Filter"
          size="large"
          appearance="outline"
        />
        <Filters
          isOpen={filtersIsOpen}
          isSubmitting={isFetching}
          isSideMenuOpen={isSideMenuOpen}
          handleClose={onClickFilter}
        />
        <Button
          size="large"
          disabled={isFetching}
          onClick={props.saveSearchHandler}
          style={{ marginLeft: '0.5em' }}
        >
          Save Search
        </Button>
      </Flex>

      <PanelsSwitch activePanel={props.activePanel} tabName="search" />
    </Flex>
  )
}
