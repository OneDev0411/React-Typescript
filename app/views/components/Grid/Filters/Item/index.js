import React from 'react'
import Downshift from 'downshift'
import _ from 'underscore'

import { ListFilter } from '../Types/List'

import IconRemove from 'components/SvgIcons/Close/CloseIcon'

import {
  Container,
  Menu,
  Content,
  ItemTitle,
  TitleContainer,
  RemoveButton,
  DoneButton
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
                <span style={{ fontWeight: 600 }}>
                  {filterConfig.serverLabel || filterConfig.label}{' '}
                </span>
                {operator && operator.name}&nbsp;
                {getCurrentValues(isActive, values)}
              </ItemTitle>
              <RemoveButton iconSize="large" inverse onClick={onRemove}>
                <IconRemove />
              </RemoveButton>
            </TitleContainer>

            {isOpen && (
              <Menu depth={3}>
                <Content>{getComponent(filterConfig, props)}</Content>
                <DoneButton appearance="link" onClick={onToggleFilterActive}>
                  Done
                </DoneButton>
              </Menu>
            )}
          </div>
        )}
      </Downshift>
    </Container>
  )
}
