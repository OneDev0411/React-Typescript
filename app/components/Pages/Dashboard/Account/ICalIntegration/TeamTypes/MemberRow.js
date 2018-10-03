import React from 'react'
import Flex from 'styled-flex-component'

import { CheckBoxButton } from '../../../../../../views/components/Button/CheckboxButton'

const MemberRow = ({ title, selected, onClick, style }) => (
  <Flex alignCenter style={{ marginTop: '1rem', ...style }}>
    <CheckBoxButton
      square
      isSelected={selected}
      onClick={onClick}
      style={{ marginRight: '0.5rem' }}
    />
    {title}
  </Flex>
)

export default MemberRow
