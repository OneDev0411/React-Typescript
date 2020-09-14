import React from 'react'
import Downshift from 'downshift'
import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import {
  Container,
  Content,
  ItemTitle,
  Menu,
  RemoveButton,
  TitleContainer
} from './styled'

const getCurrentValues = (isActive, values) => {
  if (!isActive && (!values || values.length === 0)) {
    return 'Missing value'
  }

  return Array.isArray(values) && values.map(item => item.label).join(' OR ')
}

export const FilterItem = props => {
  const {
    filterConfig,
    isActive,
    isIncomplete,
    values,
    operator,
    onToggleFilterActive,
    onRemove,
    onFilterChange
  } = props

  return (
    <Container isActive={isActive} isIncomplete={isIncomplete}>
      <Downshift isOpen={isActive} onOuterClick={onToggleFilterActive}>
        {({ isOpen }) => (
          <div>
            <TitleContainer data-test="filter-item">
              <ItemTitle onClick={onToggleFilterActive}>
                <span style={{ fontWeight: 600 }}>{filterConfig.label} </span>
                {operator && operator.name}&nbsp;
                {getCurrentValues(isActive, values)}
              </ItemTitle>
              <RemoveButton inverse onClick={onRemove}>
                <SvgIcon path={mdiClose} />
              </RemoveButton>
            </TitleContainer>

            {isOpen && (
              <Menu depth={3}>
                <Content>
                  {filterConfig.renderer({
                    onFilterChange,
                    onToggleFilterActive,
                    values,
                    operator
                  })}
                </Content>
              </Menu>
            )}
          </div>
        )}
      </Downshift>
    </Container>
  )
}
