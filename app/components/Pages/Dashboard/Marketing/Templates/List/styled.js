import styled, { css } from 'styled-components'

import Button from 'components/Button/LinkButton'
import { primary } from 'views/utils/colors'

import { getMQWidth } from '../../components/Template/styled'

export const ListContainer = styled.div`
  @media (min-width: ${props => getMQWidth(30, props)}em) {
    margin: 0 -2rem;
  }
`

export const Tab = styled(Button)`
  margin-right: 3rem;
  font-weight: 600;
  padding: 0;

  ${props =>
    props.selected
      ? css`
          color: ${primary};

          &:after {
            content: '';
            height: 2px;
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: ${primary};
          }
        `
      : ''};
`
