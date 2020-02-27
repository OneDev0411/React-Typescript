import styled from 'styled-components'
import { Link } from '@material-ui/core'

import IconCircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

export const Container = styled.div`
  padding: 0 1.5em;
`

export const CalloutSpinner = styled(IconCircleSpinner).attrs({
  noStyles: true
})`
  margin-right: 0.5rem;
  width: 24px;
  height: 24px;
  vertical-align: middle;
`

export const NavigateDuplicate = styled(Link)`
  color: ${props => props.theme.palette.info.dark};
  &:hover {
    color: ${props => props.theme.palette.info.dark};
  }
`
