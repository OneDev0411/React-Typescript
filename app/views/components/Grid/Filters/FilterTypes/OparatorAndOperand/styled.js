import styled from 'styled-components'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

export const Container = styled.div`
  padding: 1em;
  width: 100%;
`

export const Operator = styled.div`
  cursor: pointer;
  margin-bottom: 1em;
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
