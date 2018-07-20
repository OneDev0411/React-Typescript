import styled from 'styled-components'

export const Recipient = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  min-width: 90px;
  border: 1px solid #ccc;
  border-radius: 2px;
  margin: 0 8px 8px 0;
  padding: 5px 6px;
  font-size: 14px;

  ${props =>
    props.hasMultipleEmails &&
    `
    :hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
  `};
`

export const Title = styled.span`
  font-weight: 500;
`

export const EmailAddress = styled.span`
  margin-left: 2px;
  font-size: 12px;
  color: #263445;
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
  top: 30px;
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
