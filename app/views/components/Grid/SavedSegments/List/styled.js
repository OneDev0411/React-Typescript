import styled from 'styled-components'

import { blue } from '../../../../utils/colors'
import IconButton from '../../../../../views/components/Button/IconButton'

export const Container = styled.div`
  padding: 12px 16px;
`

export const ListTitle = styled.div`
  font-size: 21px;
  line-height: 24px;
  margin-bottom: 24px;
  font-weight: 500;
`

export const ListItemName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 0.5em;
`

export const DeleteButton = IconButton.extend`
  opacity: 0;
  visibility: hidden;
  transition: all 0.3 linear;
`

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 16px;
  line-height: 24px;

  color: ${props => (props.isSelected ? blue.A100 : '#000')};
  font-weight: ${props => (props.isSelected ? 500 : 400)};
  cursor: ${props => (props.isSelected ? 'initial' : 'pointer')};

  &:hover {
    color: ${blue.A100};

    ${DeleteButton} {
      opacity: 1;
      visibility: visible;
    }
  }
`
