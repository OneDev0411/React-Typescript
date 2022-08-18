import styled from 'styled-components'

import Button from 'components/Button/ActionButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

export const Container = styled.div`
  padding: 1em;
  width: 17.5rem;
`

export const Operator = styled.div`
  cursor: pointer;
`

export const Title = styled.span`
  font-size: 16px;
  margin-left: 0.5em;
`

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
`
export const MarkedIcon = styled(SvgIcon)`
  color: ${({ theme }) => theme.palette.primary.main};
`

export const DoneButton = styled(Button)`
  display: block;
  width: 100%;
  text-align: center;
  border-top: 1px solid ${props => props.theme.palette.grey['300']};
`
