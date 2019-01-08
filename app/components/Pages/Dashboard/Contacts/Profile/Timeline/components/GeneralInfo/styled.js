import styled, { css } from 'styled-components'

import { grey, primary } from '../../../../../../../../views/utils/colors'

export const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 500;
  word-break: break-word;

  ${props =>
    props.truncate &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `};

  &:hover {
    color: ${primary};
    text-decoration: underline;
  }
`

export const Description = styled.p`
  color: ${grey.A900};
  margin: 0;
`
