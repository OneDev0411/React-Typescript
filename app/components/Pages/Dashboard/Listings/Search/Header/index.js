import React from 'react'
import Flex from 'styled-flex-component'

import { borderColor } from '../../../../../../views/utils/colors'
import Button from '../../../../../../views/components/Button/ActionButton'
import FilterButton from '../../../../../../views/components/Button/DropButton'
import { Trigger as MenuTrigger } from '../../../../../../views/components/SlideMenu'

import Filters from '../components/Filters'
import SearchField from '../components/SearchToolbar'
import { ViewSwitcher } from '../../components/ViewSwitcher'

const Container = Flex.extend`
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5em;
  border-bottom: 1px solid ${borderColor};
`

export function Header(props) {
  const {
    isFetching,
    filtersIsOpen,
    onClickFilter,
    isSideMenuOpen,
    activeView
  } = props

  return (
    <Container>
      <Flex alignCenter>
        {props.user ? (
          <MenuTrigger
            onClick={props.toggleSideMenu}
            isExpended={isSideMenuOpen}
          />
        ) : (
          <img
            src="/static/images/logo.svg"
            alt="Rechat"
            width="98"
            height="24"
            style={{ marginRight: '1em' }}
          />
        )}
        <SearchField activeView={activeView} />
        <FilterButton
          style={{ marginLeft: '0.5em' }}
          onClick={onClickFilter}
          isOpen={filtersIsOpen}
          disabled={isFetching || !props.hasData}
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
        {props.user && (
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

      <ViewSwitcher activeView={activeView} onChange={props.onChangeView} />
    </Container>
  )
}
