import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey } from '../../../utils/colors'

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 2px;
  cursor: pointer;
  background-color: ${props =>
    props.isHighlighted ? grey.A100 : 'transparent'};

  .delete-icon {
    color: rgba(0, 0, 0, 0.2);
    margin-left: 0.5rem;

    :hover {
      color: #e60000;
    }
  }

  button.add-item {
    opacity: 0;
  }

  :hover button.add-item {
    opacity: 1;
  }

  :hover {
    background-color: ${grey.A000};
  }
`

export const ListItemImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%;
`

export const ListItemAddress = styled.div`
  padding-left: 1rem;
`

export const MlsDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const DetailsContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: right;
`

export const Status = styled.span`
  color: #fff;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 3px;
  font-weight: 500;
  width: fit-content;
  margin-bottom: 0.25rem;
`

export const AddressContainer = styled.div`
  display: flex;
  align-items: center;
`

export const Address = styled.div`
  margin-top: 0.25rem;
  font-size: 0.75rem;
`

export const IconContainer = styled(Flex)`
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${props => props.theme.palette.grey['200']};
  border-radius: 50%;
  > svg {
    color: ${props => props.theme.palette.grey['500']};
  }
`
