import styled, { css } from 'styled-components'

import { grey } from '../../utils/colors'
import Button from '../Button/IconButton'
import { LatoFamilyStyle } from '../Typography/styles'

export const RemoveButton = styled(Button)`
  visibility: hidden;
  margin-left: 0.75em;
`

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 0.5em 0.5em 0;
  padding: 0.5em;
  border-radius: 3px;
  background-color: ${grey.A100};
  opacity: ${props => (props.isReadOnly ? 0.5 : 1)};

  ${props =>
    !props.isReadOnly &&
    css`
      &:hover {
        cursor: pointer;
        background-color: ${grey.A250};

        ${RemoveButton} {
          visibility: visible;
        }
      }
    `}
`

export const Title = styled.div`
  ${LatoFamilyStyle};
  font-size: 0.875rem;
`

export const Details = styled.div`
  font-size: 0.875rem;
  color: ${grey.A900};
  line-height: 1.1428571428571428;
`
