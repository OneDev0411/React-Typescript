import React from 'react'
import Downshift from 'downshift'
import _ from 'underscore'

import { ListFilter } from '../Types/List'

import {
  Container,
  Menu,
  Content,
  ItemTitle,
  TitleContainer,
  Button,
  IconContainer,
  RemoveIcon
} from './styled'

const getComponent = (filterConfig, props) => {
  const { onFilterChange, currentFilters, currentOperator } = props

  const data = {
    ...filterConfig,
    currentFilters,
    currentOperator,
    onFilterChange
  }

  switch (filterConfig.type) {
    case 'List':
      return <ListFilter {...data} />
  }
}

const getCurrentFiltersNames = currentFilters =>
  _.pluck(currentFilters, 'name').join(' OR ')

export const FilterItem = props => {
  const {
    filterConfig,
    isActive,
    currentFilters,
    currentOperator,
    onToggleFilterActive,
    onRemove
  } = props

  return (
    <Container isActive={isActive}>
      <Downshift isOpen={isActive} onOuterClick={onToggleFilterActive}>
        {({ isOpen }) => (
          <div>
            <TitleContainer>
              <ItemTitle onClick={onToggleFilterActive}>
                <b>{filterConfig.label} </b>
                {currentOperator && currentOperator.name}&nbsp;
                {getCurrentFiltersNames(currentFilters)}
              </ItemTitle>
              <IconContainer>
                <RemoveIcon className="fa fa-times" onClick={onRemove} />
              </IconContainer>
            </TitleContainer>

            {isOpen && (
              <Menu>
                <Content>{getComponent(filterConfig, props)}</Content>
                <Button onClick={onToggleFilterActive}>Done</Button>
              </Menu>
            )}
          </div>
        )}
      </Downshift>
    </Container>
  )
}
