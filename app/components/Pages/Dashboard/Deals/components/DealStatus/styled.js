import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'
import { Item } from 'components/Dropdown/Item'

export const DropDownButton = styled(ActionButton)`
  .sk-circle {
    margin: 0 0.875rem 0 0 !important;
    width: 0.75rem !important;
    height: 0.75rem !important;
  }
`

export const StatusBullet = styled.div`
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 100%;
  margin-right: 0.875rem;
`

export const StatusOption = styled(Item)`
  ${props =>
    props.isSelected &&
    `
    font-weight: bold;
  `};

  ${props =>
    props.isDisabled &&
    `
    cursor: not-allowed;
    :hover {
      color: #000;
      background-color: transparent;
    }

  `};
`
