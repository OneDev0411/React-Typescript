import styled from 'styled-components'

import ActionButton from '../../../../../../../views/components/Button/ActionButton'

import { grey, primary } from '../../../../../../../views/utils/colors'

export const TeamName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 1em;
  max-width: 136px;
`

export const Container = styled.div`
  background: ${grey.A000};
`

export const Button = styled(ActionButton)`
  width: 100%;
  height: 48px;
  justify-content: space-between;
  color: ${props => (props.isSelected ? primary : '#000')};
  font-weight: ${props => (props.isSelected ? 600 : 400)};
  border-radius: 0;
  pointer-events: ${props => (props.isSelected ? 'none' : 'initial')};

  &:not([disabled]):hover {
    color: #fff;
    background-color: ${primary};

    svg {
      fill: #fff !important;
    }
  }
`
