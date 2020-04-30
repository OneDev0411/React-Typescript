import styled, { css } from 'styled-components'
import { Avatar } from '@material-ui/core'

import { grey } from '../../utils/colors'
import Button from '../Button/IconButton'
import { LatoFamilyStyle } from '../Typography/styles'

export const ProfilePhoto = styled(Avatar)`
  width: 2em;
  height: 2em;
  background-color: ${props => props.theme.palette.grey['400']};
  color: ${props => props.theme.palette.grey['500']};
`

export const RemoveButton = styled(Button)`
  visibility: hidden;
  margin-left: 0.75em;
  padding: 0;
`

export const DetailsContainer = styled.div`
  width: calc(100% - 1.5rem);
  display: flex;
  flex-grow: 1;
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
