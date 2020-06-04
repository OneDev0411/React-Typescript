import styled from 'styled-components'

import { Button } from '@material-ui/core'

export const Container = styled.div`
  display: block;
  margin: 1.5rem;
`

export const EventInfoTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #000;
`

export const EventInfoTime = styled.div`
  font-size: 1rem;
  line-height: 1.5;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const EventInfoDescription = styled(EventInfoTime)`
  color: #7f7f7f;
`

export const EventMenu = styled.div``

export const RegistrationLink = styled.div`
  display: none;
  align-items: center;
`

export const AppendButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin-left: 0.5rem;
`

export const LinkText = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  border-radius: 3px;
  background-color: #fff;
  font-size: 1rem;
  font-weight: 500;
  padding: 0 0 0 1rem;
  color: ${({ theme }) => theme.palette.secondary.main};

  a {
    display: block;
    max-width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }
`

export const EventItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 5.5rem;
  padding: 0 0.25rem;
  box-shadow: 0 1px 0 0 #d4d4d4;

  :hover {
    background-color: #f7f7f7;
    cursor: pointer;
  }

  :hover ${EventInfoTitle} {
    color: ${({ theme }) => theme.palette.secondary.main};
    text-decoration: underline;
  }

  :hover ${RegistrationLink} {
    display: flex;
  }
`
