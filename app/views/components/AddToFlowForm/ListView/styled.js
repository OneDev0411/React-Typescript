import styled from 'styled-components'

import { Link } from 'react-router'

import { CONTAINER_HEIGHT, SETTING_HEIGHT } from '../constants'

export const SettingLink = styled(Link)`
  display: flex;
  align-items: center;
  height: ${SETTING_HEIGHT};
  &:hover {
    text-decoration: none;
  }
  & > svg {
    fill: ${props => props.theme.palette.secondary.main};
    width: 1em;
    height: 1em;
    margin-right: 0.5em;
  }
`

export const List = styled.div`
  height: calc(${CONTAINER_HEIGHT} - ${SETTING_HEIGHT});
`

export const Container = styled.div`
  width: 40%;
  background: #f7f7f7;
`

export const EmptyContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`
