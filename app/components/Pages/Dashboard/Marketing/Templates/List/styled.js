import styled, { css } from 'styled-components'

import Button from 'components/Button/ActionButton'
import { primary } from 'views/utils/colors'

import { getMQWidth } from '../../components/Template/styled'

export const ListContainer = styled.div`
  @media (min-width: ${props => getMQWidth(40, props)}em) {
    margin: 0 -1.5rem;
  }

  @media (min-width: ${props => getMQWidth(64, props)}em) {
    margin: 0 -2rem;
  }

  @media (min-width: ${props => getMQWidth(90, props)}em) {
    margin: 0 -2.5rem;
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
