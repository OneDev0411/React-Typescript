import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;

  svg {
    color: ${props => props.theme.palette.common.black};
    &:hover {
      color: ${primary};
    }
  }
`
