import styled, { css } from 'styled-components'

import Button from 'components/Button/LinkButton'
import { primary } from 'views/utils/colors'

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

export const ListView = styled.div`
  & .tabs {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
  }
`
