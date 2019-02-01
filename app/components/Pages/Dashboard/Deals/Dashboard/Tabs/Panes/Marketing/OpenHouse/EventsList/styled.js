import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const Container = styled.div`
  display: block;
  margin: 1.5rem;
`

export const EventInfoTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #000;
`

export const EventInfoDescription = styled.div`
  font-size: 1rem;
  line-height: 1.5;
  color: #7f7f7f;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const EventMenu = styled.div``

export const RegistrationLink = styled.div`
  display: none;
  align-items: center;
`

export const LinkText = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  border-radius: 3px;
  background-color: #fff;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  color: ${primary};

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
  height: 4rem;
  padding: 0 0.25rem;
  box-shadow: 0 1px 0 0 #d4d4d4;

  :hover {
    background-color: #f7f7f7;
    cursor: pointer;
  }

  :hover ${EventInfoTitle} {
    color: ${primary};
    text-decoration: underline;
  }

  :hover ${RegistrationLink} {
    display: flex;
  }
`
