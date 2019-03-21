import styled from 'styled-components'
import React from 'react'
import Flex from 'styled-flex-component'

import { borderColor } from '../../../../../../views/utils/colors'
import Button from '../../../../../../views/components/Button/ActionButton'
import FilterButton from '../../../../../../views/components/Button/DropButton'
import { Trigger as MenuTrigger } from '../../../../../../views/components/SlideMenu'

import Filters from '../components/Filters'
import SearchField from '../components/SearchToolbar/mls-autocomplete'
import { ViewSwitcher } from '../../components/ViewSwitcher'

const Container = styled(Flex)`
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 1.5em;
  border-bottom: 1px solid ${borderColor};
`

export function Header(props) {
  const {
    isFetching,
    filtersIsOpen,
    onClickFilter,
    isSideMenuOpen,
    activeView,
    isWidget
  } = props

  return (
    <Container>
      <Flex alignCenter>
        {!isWidget && props.user && (
          <MenuTrigger
            onClick={props.toggleSideMenu}
            isExpended={isSideMenuOpen}
          />
        )}
        <SearchField activeView={activeView} />
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
        {!isWidget && props.user && (
          <Button
            size="large"
            disabled={isFetching}
            onClick={props.saveSearchHandler}
            style={{ marginLeft: '0.5em' }}
          >
            Save Search
          </Button>
        )}
      </Flex>

      {!isWidget && (
        <ViewSwitcher activeView={activeView} onChange={props.onChangeView} />
      )}
    </Container>
  )
}
