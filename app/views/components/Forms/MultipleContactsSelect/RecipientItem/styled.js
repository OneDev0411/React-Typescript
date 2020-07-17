import styled from 'styled-components'

import Flex from 'styled-flex-component'

import IconButton from '../../../Button/IconButton'
import { grey } from '../../../../utils/colors'

export const DeleteButton = styled(IconButton)`
  margin-left: 6px;
  opacity: 0;
`

export const Recipient = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  min-width: 90px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin: 0 8px 8px 0;
  padding: 5px 6px;
  font-size: 14px;
  background-color: #f2f2f2;

  :hover {
    cursor: ${props => (props.hasMultipleEmails ? 'pointer' : 'auto')};
    background-color: #fff;
    border: solid 1px #000;
  }

  :hover ${DeleteButton} {
    opacity: 1;
  }
`

export const Title = styled.div`
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.2;
`

export const Subtitle = styled.div`
  font-size: 0.7rem;
  color: ${grey.A900};
  line-height: 1;
`

export const EmailItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;

  :hover {
    background-color: #f5f5f5;
  }
`

export const EmailsList = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  min-width: 100%;
  max-height: 150px;
  overflow: auto;
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
`

export const IconContainer = styled(Flex)`
  width: 25px;
  height: 25px;
  background-color: #000;
  border-radius: 50%;
  margin-right: 10px;
  > svg {
    height: 1rem;
    width: 1rem;
    fill: #ffffff;
  }
`
