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
  const { onFilterChange, conditions, operator } = props

  const data = {
    ...filterConfig,
    conditions,
    operator,
    onFilterChange
  }

  switch (filterConfig.type) {
    case 'List':
      return <ListFilter {...data} />
  }
}

const getCurrentConditionsString = (isActive, conditions) => {
  if (!isActive && conditions && conditions.length === 0) {
    return 'Missing value'
  }

  return _.pluck(conditions, 'name').join(' OR ')
}

export const FilterItem = props => {
  const {
    filterConfig,
    isActive,
    isIncomplete,
    conditions,
    operator,
    onToggleFilterActive,
    onRemove
  } = props

  return (
    <Container isActive={isActive} isIncomplete={isIncomplete}>
      <Downshift isOpen={isActive} onOuterClick={onToggleFilterActive}>
        {({ isOpen }) => (
          <div>
            <TitleContainer>
              <ItemTitle onClick={onToggleFilterActive}>
                <b>{filterConfig.label} </b>
                {operator && operator.name}&nbsp;
                {getCurrentConditionsString(isActive, conditions)}
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
