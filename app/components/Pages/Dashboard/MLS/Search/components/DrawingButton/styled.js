import styled from 'styled-components'

import { buttonBaseStyle } from '../../../../../../../views/components/Button/styles/ButtonAppearances'
import { grey, primary } from '../../../../../../../views/utils/colors'

const isNotDisableState = '&:not([disabled]):'

export const Button = styled.button`
  ${buttonBaseStyle};
  position: absolute;
  top: 1.5em;
  right: 1.5em;
  padding: 0.5em 1em;
  background-color: #fff;
  font-weight: 500;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16);

  &[disabled] {
    background-color: ${grey.A550};
  }

  ${isNotDisableState}hover, ${isNotDisableState}focus {
    color: #fff;
    text-decoration: none;
    background-color: ${primary};

    > svg {
      fill: #fff;
    }
  }
`
