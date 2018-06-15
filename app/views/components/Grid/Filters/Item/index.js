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
  const { onFilterChange, values, operator } = props

  const data = {
    ...filterConfig,
    values,
    operator,
    onFilterChange
  }

  switch (filterConfig.type) {
    case 'Set':
      return <ListFilter {...data} />
  }
}

const getCurrentValues = (isActive, values) => {
  if (!isActive && values && values.length === 0) {
    return 'Missing value'
  }

  return _.isArray(values) && values.join(' OR ')
}

export const FilterItem = props => {
  const {
    filterConfig,
    isActive,
    isIncomplete,
    values,
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
                {getCurrentValues(isActive, values)}
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
