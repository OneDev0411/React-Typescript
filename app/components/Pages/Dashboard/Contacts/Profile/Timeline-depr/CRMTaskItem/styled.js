import styled from 'styled-components'

import { borderColor, grey } from '../../../../../../../views/utils/colors'

export const Container = styled.div`
  position: relative;
  padding: 1.5em;
  border-bottom: 1px solid ${borderColor};

  &:hover {
    background-color: ${grey.A000};
  }

  .u-cursor--pointer:hover {
    cursor: pointer;
  }
`
