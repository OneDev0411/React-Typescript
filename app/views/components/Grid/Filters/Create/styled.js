import styled from 'styled-components'

import Card from 'components/Card'
import { blue } from 'views/utils/colors'

export const Container = styled.div`
  position: relative;
`

export const List = Card.extend`
  position: absolute;
  top: 40px;
  left: 0;
  width: 170px;
  max-height: 240px;
  overflow: auto;
  z-index: 1000;
`

export const ListItem = styled.div`
  padding: 0 1em;
  line-height: 2.25; /* 36px */
  color: #000;
  cursor: pointer;

  :hover {
    background-color: ${blue.A100};
    color: #fff;
  }
`
