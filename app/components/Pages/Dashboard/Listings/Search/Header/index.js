import React from 'react'
import Flex from 'styled-flex-component'

import Button from '../../../../../../views/components/Button/ActionButton'
import FilterButton from '../../../../../../views/components/Button/DropButton'
import { Trigger as MenuTrigger } from '../../../../../../views/components/SlideMenu'

import { ViewSwitcher } from '../../components/ViewSwitcher'
import { PageHeaderContainer } from '../../components/PageHeaderContainer'
import Filters from '../components/Filters'
import SearchField from '../components/SearchToolbar'

export function Header(props) {
  const {
    isFetching,
    filtersIsOpen,
    onClickFilter,
    isSideMenuOpen,
    activeView
  } = props

  return (
    <PageHeaderContainer>
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
    </PageHeaderContainer>
  )
}
