import styled from 'styled-components'
import IconButton from '../../../Button/IconButton'

export const DeleteButton = IconButton.extend`
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

export const Title = styled.span`
  font-size: 16px;
  font-weight: 400;
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
  width: 100%;
  max-height: 150px;
  overflow: auto;
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
`

export const ArrowIcon = styled.i`
  margin-left: 10px;
  font-weight: bold;
`
