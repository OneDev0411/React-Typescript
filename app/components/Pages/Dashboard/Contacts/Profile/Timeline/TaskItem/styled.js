import styled from 'styled-components'

import {
  borderColor,
  grey,
  primary
} from '../../../../../../../views/utils/colors'

export const Container = styled.div`
  padding: 1.5em;
  border-bottom: 1px solid ${borderColor};

  &:hover {
    background-color: ${grey.A000};
  }

  .u-cursor--pointer:hover {
    cursor: pointer;
  }
`

export const Title = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1;

  &:hover {
    color: ${primary};
  }
`

export const Description = styled.p`
  color: ${grey.A900};
  margin: 0;
`
