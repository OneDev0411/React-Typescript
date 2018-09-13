import styled from 'styled-components'
import Icon from '../../../../../../../views/components/SvgIcons/Alert/AlertIcon'

export const InfoContainer = styled.div`
  display: flex;
  border-radius: 3px;
  background-color: #d4dfe6;
  padding: 1em;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5em;
`

export const InfoLeftSide = styled.div`
  display: flex;
  align-items: center;
`

export const InfoText = styled.div`
  margin-left: 1em;
`

export const AlertIcon = Icon.extend`
  > g {
    > path {
      fill: #000;
    }
  }
`
